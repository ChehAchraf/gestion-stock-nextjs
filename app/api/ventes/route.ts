import { NextRequest, NextResponse } from 'next/server';
import { VentesService } from '@/lib/services/ventesService';
import { VenteInput } from '@/lib/types/database';

// GET - جلب جميع المبيعات
export async function GET() {
  try {
    const result = await VentesService.getVentes();
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('API Error - GET ventes:', error);
    return NextResponse.json(
      { error: 'خطأ في الخادم' },
      { status: 500 }
    );
  }
}

// POST - إنشاء عملية بيع جديدة
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const venteData: VenteInput = {
      articleId: body.articleId,
      articleTitle: body.articleTitle,
      quantiteVendue: parseInt(body.quantiteVendue),
      prixTotal: parseFloat(body.prixTotal),
      dateVente: new Date(body.dateVente),
    };

    const result = await VentesService.createVente(venteData);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('API Error - POST vente:', error);
    return NextResponse.json(
      { error: 'خطأ في الخادم' },
      { status: 500 }
    );
  }
}
