import { NextRequest, NextResponse } from "next/server";
import { withAuth, AuthenticatedRequest } from "@/lib/auth-middleware";
import { SecurePrisma } from "@/lib/secure-prisma";
import { DatabaseSecurity } from "@/lib/database-security";

async function handler(req: AuthenticatedRequest) {
  const ipAddress = req.headers.get('x-forwarded-for') ||
    req.headers.get('x-real-ip') ||
    'unknown';
  const user = req.user!;

  try {
    if (req.method === 'GET') {
      const { searchParams } = new URL(req.url);
      const query = searchParams.get('query') || '';
      
      let sanitizedQuery = '';
      if (query) {
        if (!DatabaseSecurity.validateQueryParams({ query })) {
          DatabaseSecurity.logDatabaseAccess({
            userId: user.userId,
            action: 'LIST_CHAT_SESSIONS_INVALID_QUERY',
            table: 'chat_sessions',
            details: `SQL injection pattern detected in search query: ${query}`,
            ipAddress,
            success: false,
            error: 'Invalid search query'
          });
          return NextResponse.json({
            success: false,
            message: "Invalid search query detected"
          }, { status: 400 });
        }
        sanitizedQuery = DatabaseSecurity.sanitizeInput(query, 100);
      }

      // Query database for active sessions and their full message history
      const sessions = await SecurePrisma.chatSession.findMany({
        where: {
          userId: user.userId,
          isActive: true,
          ...(sanitizedQuery ? {
            OR: [
              { title: { contains: sanitizedQuery, mode: 'insensitive' } },
              { messages: { some: { content: { contains: sanitizedQuery, mode: 'insensitive' } } } }
            ]
          } : {})
        },
        select: {
          sessionId: true,
          title: true,
          updatedAt: true,
          messages: {
            orderBy: { timestamp: 'asc' }, // Order messages chronologically for the frontend
            select: {
              id: true,
              content: true,
              sender: true,
              timestamp: true,
              isFollowUp: true,
              metadata: true
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'
        }
      });

      // Map database records to exact frontend ChatSession and ChatMessage structures
      const formattedSessions = sessions.map(session => {
        const mappedMessages = session.messages.map(msg => {
          let parsedMetadata: any = {};
          if (msg.metadata) {
            try {
              parsedMetadata = JSON.parse(msg.metadata);
            } catch (e) {
              console.error("Failed to parse message metadata:", e);
            }
          }

          return {
            id: msg.id.toString(),
            text: msg.content,
            sender: msg.sender as 'user' | 'ai',
            timestamp: msg.timestamp.getTime(),
            isFollowUpPrompt: msg.isFollowUp,
            feedback: parsedMetadata.feedback || undefined,
            imageUrl: parsedMetadata.imageUrl || undefined,
            originalQuestion: parsedMetadata.originalQuestion || undefined,
            isLoading: false
          };
        });

        // Generate preview string from the last message in history
        const lastMsg = mappedMessages[mappedMessages.length - 1];
        let preview = 'Empty conversation';
        if (lastMsg) {
          preview = `${lastMsg.sender === 'user' ? 'You: ' : 'Med Genie: '}${lastMsg.text.substring(0, 40)}${lastMsg.text.length > 40 ? '...' : ''}`;
        }

        return {
          id: session.sessionId,
          name: session.title || 'New Conversation',
          updatedAt: session.updatedAt.toISOString(),
          preview,
          messages: mappedMessages
        };
      });

      DatabaseSecurity.logDatabaseAccess({
        userId: user.userId,
        action: 'LIST_CHAT_SESSIONS_SUCCESS',
        table: 'chat_sessions',
        details: `Listed ${formattedSessions.length} chat sessions with message details`,
        ipAddress,
        success: true
      });

      return NextResponse.json({
        success: true,
        sessions: formattedSessions
      });
    }

    if (req.method === 'POST') {
      const body = await req.json();
      const { sessionId, title } = body;

      if (!sessionId || typeof sessionId !== 'string') {
        DatabaseSecurity.logDatabaseAccess({
          userId: user.userId,
          action: 'CREATE_CHAT_SESSION_VALIDATION_FAILED',
          table: 'chat_sessions',
          details: 'Missing or invalid sessionId',
          ipAddress,
          success: false,
          error: 'Missing or invalid sessionId'
        });
        return NextResponse.json({
          success: false,
          message: "Session ID is required"
        }, { status: 400 });
      }

      if (!/^[a-zA-Z0-9_\-]+$/.test(sessionId) || sessionId.length > 100) {
        DatabaseSecurity.logDatabaseAccess({
          userId: user.userId,
          action: 'CREATE_CHAT_SESSION_VALIDATION_FAILED',
          table: 'chat_sessions',
          details: `Invalid format or length for sessionId: ${sessionId}`,
          ipAddress,
          success: false,
          error: 'Invalid sessionId format'
        });
        return NextResponse.json({
          success: false,
          message: "Invalid Session ID format"
        }, { status: 400 });
      }

      let sanitizedTitle = 'New Conversation';
      if (title && typeof title === 'string') {
        sanitizedTitle = DatabaseSecurity.sanitizeInput(title, 200);
      }

      // Check if session ID already exists in db
      const existingSession = await SecurePrisma.chatSession.findUnique({
        where: { sessionId }
      });

      if (existingSession) {
        DatabaseSecurity.logDatabaseAccess({
          userId: user.userId,
          action: 'CREATE_CHAT_SESSION_CONFLICT',
          table: 'chat_sessions',
          details: `Session ID ${sessionId} already exists`,
          ipAddress,
          success: false,
          error: 'Session ID already exists'
        });
        return NextResponse.json({
          success: false,
          message: "Session ID already exists"
        }, { status: 409 });
      }

      // Create new session in db
      const newSession = await SecurePrisma.chatSession.create({
        data: {
          userId: user.userId,
          sessionId,
          title: sanitizedTitle,
          isActive: true
        }
      });

      DatabaseSecurity.logDatabaseAccess({
        userId: user.userId,
        action: 'CREATE_CHAT_SESSION_SUCCESS',
        table: 'chat_sessions',
        details: `Created session: ${newSession.sessionId}`,
        ipAddress,
        success: true
      });

      return NextResponse.json({
        success: true,
        session: {
          id: newSession.sessionId,
          name: newSession.title || 'New Conversation',
          updatedAt: newSession.updatedAt.toISOString(),
          preview: 'Empty conversation',
          messages: []
        }
      }, { status: 201 });
    }

    if (req.method === 'DELETE') {
      // Soft-delete all active sessions of this user
      const updateResult = await SecurePrisma.chatSession.updateMany({
        where: {
          userId: user.userId,
          isActive: true
        },
        data: {
          isActive: false
        }
      });

      DatabaseSecurity.logDatabaseAccess({
        userId: user.userId,
        action: 'CLEAR_CHAT_SESSIONS_SUCCESS',
        table: 'chat_sessions',
        details: `Soft-deleted ${updateResult.count} chat sessions`,
        ipAddress,
        success: true
      });

      return NextResponse.json({
        success: true,
        message: "All active chat sessions cleared successfully",
        count: updateResult.count
      });
    }

    // Method not allowed fallback
    DatabaseSecurity.logDatabaseAccess({
      userId: user.userId,
      action: 'CHAT_SESSIONS_METHOD_NOT_ALLOWED',
      table: 'chat_sessions',
      details: `Method not allowed: ${req.method}`,
      ipAddress,
      success: false,
      error: 'Method not allowed'
    });

    return NextResponse.json(
      { success: false, message: "Method not allowed" },
      { status: 405 }
    );

  } catch (error: any) {
    console.error('Chat sessions operation error:', error);

    DatabaseSecurity.logDatabaseAccess({
      userId: user?.userId,
      action: 'CHAT_SESSIONS_OPERATION_ERROR',
      table: 'chat_sessions',
      details: `Operation error: ${error.message}`,
      ipAddress,
      success: false,
      error: error.message
    });

    return NextResponse.json({
      success: false,
      message: error.message || "Internal server error"
    }, { status: 500 });
  }
}

export const GET = withAuth(handler);
export const POST = withAuth(handler);
export const DELETE = withAuth(handler);
