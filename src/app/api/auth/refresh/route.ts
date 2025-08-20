import { NextRequest, NextResponse } from 'next/server';
import { verifyRefreshToken, signAccessToken, blacklistToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
    try {
        const cookieStore = cookies();
        const refreshToken = cookieStore.get('refresh_token')?.value;

        if (!refreshToken) {
            return NextResponse.json(
                { success: false, message: 'Refresh token not found' },
                { status: 401 }
            );
        }

        const decoded = await verifyRefreshToken(refreshToken);
        if (!decoded) {
            return NextResponse.json(
                { success: false, message: 'Invalid refresh token' },
                { status: 401 }
            );
        }

        // Generate new access token
        const newAccessToken = signAccessToken({
            userId: decoded.userId,
            email: '', // Will be filled by the sign function
            name: '',  // Will be filled by the sign function
            tokenId: decoded.tokenId,
        });

        // Blacklist old refresh token (optional - implement rotation)
        // await blacklistToken(decoded.tokenId);

        return NextResponse.json({
            success: true,
            accessToken: newAccessToken,
        });

    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Token refresh failed' },
            { status: 500 }
        );
    }
}
