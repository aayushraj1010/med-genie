import { NextRequest, NextResponse } from 'next/server';
import { verifyRefreshToken, signAccessToken } from '@/lib/jwt';
import { SecurePrisma } from '@/lib/secure-prisma';
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

        const user = await SecurePrisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });

        // Generate new access token
        const newAccessToken = signAccessToken({
            userId: decoded.userId,
            email: user?.email || '',
            name: user?.name || '',
            tokenId: decoded.tokenId,
        });

        return NextResponse.json({
            success: true,
            accessToken: newAccessToken,
            user: user ? { id: user.id, name: user.name, email: user.email } : undefined,
        });

    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Token refresh failed' },
            { status: 500 }
        );
    }
}
