import { NextResponse } from 'next/server';
import { VentesService } from '@/lib/services/ventesService';

// GET - جلب إحصائيات المبيعات
export async function GET() {
  try {
    console.log('GET ventes stats request');
    const result = await VentesService.getSalesStats();
    
    if (!result.success) {
      console.log('GET ventes stats failed:', result.message);
      return NextResponse.json(
        { error: result.message },
        { status: 500 }
      );
    }

    console.log('GET ventes stats success');
    return NextResponse.json({
      success: true,
      stats: result.stats
    });
  } catch (error: any) {
    console.error('API Error - GET ventes stats:', error);
    return NextResponse.json(
      { error: `خطأ في الخادم: ${error?.message || error}` },
      { status: 500 }
    );
  }
}
