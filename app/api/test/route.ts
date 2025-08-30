import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Test API route called');
    return NextResponse.json({
      success: true,
      message: 'API route يعمل بشكل صحيح',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Test API error:', error);
    return NextResponse.json({
      success: false,
      error: error?.message || 'خطأ في الخادم'
    }, { status: 500 });
  }
}
