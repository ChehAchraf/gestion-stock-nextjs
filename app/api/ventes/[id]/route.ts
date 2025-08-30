import { NextRequest, NextResponse } from 'next/server';
import { VentesService } from '@/lib/services/ventesService';
import { VenteUpdateInput } from '@/lib/types/database';

// PUT - تحديث عملية بيع
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('PUT vente request for ID:', id);
    const body = await request.json();
    console.log('PUT vente body:', body);
    
    const updateData: VenteUpdateInput = {
      articleId: body.articleId,
      articleTitle: body.articleTitle,
      quantiteVendue: parseInt(body.quantiteVendue),
      prixTotal: parseFloat(body.prixTotal),
      dateVente: new Date(body.dateVente),
    };

    const result = await VentesService.updateVente(id, updateData);
    
    if (!result.success) {
      console.log('PUT vente failed:', result.message);
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    console.log('PUT vente success:', result.vente?.id);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API Error - PUT vente:', error);
    return NextResponse.json(
      { error: `خطأ في الخادم: ${error?.message || error}` },
      { status: 500 }
    );
  }
}

// DELETE - حذف عملية بيع
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('DELETE vente request for ID:', id);
    const result = await VentesService.deleteVente(id);
    
    if (!result.success) {
      console.log('DELETE vente failed:', result.message);
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    console.log('DELETE vente success for ID:', id);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API Error - DELETE vente:', error);
    return NextResponse.json(
      { error: `خطأ في الخادم: ${error?.message || error}` },
      { status: 500 }
    );
  }
}
