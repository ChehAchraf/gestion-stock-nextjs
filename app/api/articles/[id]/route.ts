import { NextRequest, NextResponse } from 'next/server';
import { ArticlesService } from '@/lib/services/articlesService';
import { ArticleUpdateInput } from '@/lib/types/database';

// GET - جلب منتج واحد
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('GET article request for ID:', params.id);
    const result = await ArticlesService.getArticleById(params.id);
    
    if (!result.success) {
      console.log('GET article failed:', result.message);
      return NextResponse.json(
        { error: result.message },
        { status: 404 }
      );
    }

    console.log('GET article success:', result.article?.id);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API Error - GET article:', error);
    return NextResponse.json(
      { error: `خطأ في الخادم: ${error?.message || error}` },
      { status: 500 }
    );
  }
}

// PUT - تحديث منتج
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('PUT article request for ID:', params.id);
    const body = await request.json();
    console.log('PUT article body:', body);
    
    const updateData: ArticleUpdateInput = {
      titre: body.titre,
      description: body.description,
      photo: body.photo,
      prix_achat: body.prix_achat ? parseFloat(body.prix_achat) : undefined,
      quantite: body.quantite ? parseInt(body.quantite) : undefined,
      reference: body.reference,
    };

    const result = await ArticlesService.updateArticle(params.id, updateData);
    
    if (!result.success) {
      console.log('PUT article failed:', result.message);
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    console.log('PUT article success:', result.article?.id);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API Error - PUT article:', error);
    return NextResponse.json(
      { error: `خطأ في الخادم: ${error?.message || error}` },
      { status: 500 }
    );
  }
}

// DELETE - حذف منتج
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('DELETE article request for ID:', params.id);
    const result = await ArticlesService.deleteArticle(params.id);
    
    if (!result.success) {
      console.log('DELETE article failed:', result.message);
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    console.log('DELETE article success for ID:', params.id);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API Error - DELETE article:', error);
    return NextResponse.json(
      { error: `خطأ في الخادم: ${error?.message || error}` },
      { status: 500 }
    );
  }
}
