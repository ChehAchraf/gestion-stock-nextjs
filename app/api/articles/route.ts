import { NextRequest, NextResponse } from 'next/server';
import { ArticlesService } from '@/lib/services/articlesService';
import { ArticleInput } from '@/lib/types/database';

// GET - جلب جميع المنتجات
export async function GET() {
  try {
    console.log('GET articles request started');
    
    // اختبار الاتصال بقاعدة البيانات
    console.log('Testing database connection...');
    
    const result = await ArticlesService.getArticles();
    console.log('ArticlesService.getArticles result:', result);
    
    if (!result.success) {
      console.log('GET articles failed:', result.message);
      return NextResponse.json(
        { 
          success: false,
          error: result.message,
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }

    console.log('GET articles success, count:', result.count);
    return NextResponse.json({
      ...result,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('API Error - GET articles:', error);
    console.error('Error stack:', error?.stack);
    
    return NextResponse.json(
      { 
        success: false,
        error: `خطأ في الخادم: ${error?.message || error}`,
        timestamp: new Date().toISOString(),
        details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      },
      { status: 500 }
    );
  }
}

// POST - إنشاء منتج جديد
export async function POST(request: NextRequest) {
  try {
    console.log('POST article request started');
    
    const body = await request.json();
    console.log('POST article body:', body);
    
    // التحقق من البيانات المطلوبة
    if (!body.titre || !body.reference || !body.prix_achat || !body.quantite) {
      return NextResponse.json(
        { 
          success: false,
          error: 'البيانات المطلوبة غير مكتملة',
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      );
    }
    
    const articleData: ArticleInput = {
      titre: body.titre,
      description: body.description || '',
      photo: body.photo || '',
      prix_achat: parseFloat(body.prix_achat),
      quantite: parseInt(body.quantite),
      reference: body.reference,
    };

    console.log('Processed article data:', articleData);
    const result = await ArticlesService.createArticle(articleData);
    console.log('ArticlesService.createArticle result:', result);
    
    if (!result.success) {
      console.log('POST article failed:', result.message);
      return NextResponse.json(
        { 
          success: false,
          error: result.message,
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      );
    }

    console.log('POST article success:', result.article?.id);
    return NextResponse.json({
      ...result,
      timestamp: new Date().toISOString()
    }, { status: 201 });
  } catch (error: any) {
    console.error('API Error - POST article:', error);
    console.error('Error stack:', error?.stack);
    
    return NextResponse.json(
      { 
        success: false,
        error: `خطأ في الخادم: ${error?.message || error}`,
        timestamp: new Date().toISOString(),
        details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      },
      { status: 500 }
    );
  }
}
