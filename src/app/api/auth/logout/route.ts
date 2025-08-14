import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Since we're using JWT tokens stored client-side,
    // logout is primarily handled on the frontend.
    // This endpoint is for any server-side cleanup if needed.
    
    return NextResponse.json({
      success: true,
      message: "Logged out successfully"
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || "Internal server error"
    }, { status: 500 });
  }
}
