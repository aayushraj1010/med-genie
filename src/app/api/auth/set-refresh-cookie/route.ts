import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { refreshToken } = await req.json();

        if (!refreshToken) {
            return NextResponse.json(
                { success: false, message: 'Refresh token is required' },
                { status: 400 }
            );
        }

        // Create response with success message
        const response = NextResponse.json({
            success: true,
            message: 'Refresh token cookie set successfully'
        });

        // Set HttpOnly cookie with refresh token
        response.cookies.set('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // HTTPS only in production
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: '/',
        });

        return response;

    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Failed to set refresh token cookie' },
            { status: 500 }
        );
    }
}
