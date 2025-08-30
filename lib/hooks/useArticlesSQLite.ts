import { useState, useEffect } from 'react';
import { Article, ArticleInput, ArticleUpdateInput } from '../types/database';

// Hook لجلب جميع المنتجات
export const useArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching articles...');
      
      const response = await fetch('/api/articles');
      console.log('Articles response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Articles fetch error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Articles data:', data);
      
      if (data.success) {
        setArticles(data.articles || []);
      } else {
        setError(data.message || 'خطأ في جلب المنتجات');
      }
    } catch (err: any) {
      console.error('Error fetching articles:', err);
      setError(err.message || 'خطأ في جلب المنتجات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return { articles, loading, error, refetch: fetchArticles };
};

// Hook لجلب منتج واحد
export const useArticle = (id: string | null) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArticle = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching article with ID:', id);
      
      const response = await fetch(`/api/articles/${id}`);
      console.log('Article response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Article fetch error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Article data:', data);
      
      if (data.success) {
        setArticle(data.article);
      } else {
        setError(data.message || 'خطأ في جلب المنتج');
      }
    } catch (err: any) {
      console.error('Error fetching article:', err);
      setError(err.message || 'خطأ في جلب المنتج');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticle();
  }, [id]);

  return { article, loading, error, refetch: fetchArticle };
};

// Hook لإضافة منتج جديد
export const useAddArticle = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addArticle = async (articleData: ArticleInput) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Adding article:', articleData);
      
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articleData),
      });
      
      console.log('Add article response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Add article error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Add article data:', data);
      
      if (!data.success) {
        throw new Error(data.message || 'خطأ في إضافة المنتج');
      }
      
      return data;
    } catch (err: any) {
      console.error('Error adding article:', err);
      setError(err.message || 'خطأ في إضافة المنتج');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addArticle, loading, error };
};

// Hook لتحديث منتج
export const useUpdateArticle = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateArticle = async (id: string, updateData: ArticleUpdateInput) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Updating article:', id, updateData);
      
      const response = await fetch(`/api/articles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      console.log('Update article response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Update article error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Update article data:', data);
      
      if (!data.success) {
        throw new Error(data.message || 'خطأ في تحديث المنتج');
      }
      
      return data;
    } catch (err: any) {
      console.error('Error updating article:', err);
      setError(err.message || 'خطأ في تحديث المنتج');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateArticle, loading, error };
};

// Hook لحذف منتج
export const useDeleteArticle = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteArticle = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Deleting article:', id);
      
      const response = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
      });
      
      console.log('Delete article response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Delete article error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Delete article data:', data);
      
      if (!data.success) {
        throw new Error(data.message || 'خطأ في حذف المنتج');
      }
      
      return data;
    } catch (err: any) {
      console.error('Error deleting article:', err);
      setError(err.message || 'خطأ في حذف المنتج');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteArticle, loading, error };
};

// Hook شامل لإدارة المنتجات
export const useArticlesManager = () => {
  const { articles, loading: fetchLoading, error: fetchError, refetch } = useArticles();
  const { addArticle, loading: addLoading, error: addError } = useAddArticle();
  const { updateArticle, loading: updateLoading, error: updateError } = useUpdateArticle();
  const { deleteArticle, loading: deleteLoading, error: deleteError } = useDeleteArticle();

  const handleAddArticle = async (articleData: ArticleInput) => {
    try {
      await addArticle(articleData);
      await refetch(); // إعادة جلب المنتجات بعد الإضافة
    } catch (error) {
      console.error('Error in handleAddArticle:', error);
    }
  };

  const handleUpdateArticle = async (id: string, updateData: ArticleUpdateInput) => {
    try {
      await updateArticle(id, updateData);
      await refetch(); // إعادة جلب المنتجات بعد التحديث
    } catch (error) {
      console.error('Error in handleUpdateArticle:', error);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    try {
      await deleteArticle(id);
      await refetch(); // إعادة جلب المنتجات بعد الحذف
    } catch (error) {
      console.error('Error in handleDeleteArticle:', error);
    }
  };

  return {
    articles,
    loading: fetchLoading || addLoading || updateLoading || deleteLoading,
    error: fetchError || addError || updateError || deleteError,
    addArticle: handleAddArticle,
    updateArticle: handleUpdateArticle,
    deleteArticle: handleDeleteArticle,
    refetch,
  };
};
