import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        // Create response with success message
        const response = NextResponse.json({
            success: true,
            message: 'Refresh token cookie cleared successfully'
        });

        // Clear the refresh token cookie
        response.cookies.set('refresh_token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 0, // Expire immediately
            path: '/',
        });

        return response;

    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Failed to clear refresh token cookie' },
            { status: 500 }
        );
    }
}
