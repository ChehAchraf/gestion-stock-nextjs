import { useState, useEffect } from 'react';
import { Vente, VenteInput, VenteUpdateInput, SalesStats } from '../types/database';

// Hook لجلب جميع المبيعات
export const useVentes = () => {
  const [ventes, setVentes] = useState<Vente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(0);

  const fetchVentes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/ventes');
      const result = await response.json();
      
      if (result.success) {
        setVentes(result.ventes || []);
        setCount(result.count || 0);
      } else {
        setError(result.message || 'خطأ في جلب المبيعات');
      }
    } catch (err) {
      setError('خطأ في الاتصال بالخادم');
      console.error('Error fetching ventes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVentes();
  }, []);

  return {
    ventes,
    count,
    isLoading,
    error,
    refetch: fetchVentes
  };
};

// Hook لجلب إحصائيات المبيعات
export const useSalesStats = () => {
  const [stats, setStats] = useState<SalesStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/ventes/stats');
      const result = await response.json();
      
      if (result.success) {
        setStats(result.stats);
      } else {
        setError(result.message || 'خطأ في جلب الإحصائيات');
      }
    } catch (err) {
      setError('خطأ في الاتصال بالخادم');
      console.error('Error fetching sales stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats
  };
};

// Hook لإضافة عملية بيع
export const useAddVente = () => {
  const [isLoading, setIsLoading] = useState(false);

  const addVente = async (venteData: VenteInput) => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/ventes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(venteData),
      });
      
      const result = await response.json();
      
      return result;
    } catch (error) {
      console.error('Error adding vente:', error);
      return {
        success: false,
        message: `خطأ في إضافة عملية البيع: ${error}`
      };
    } finally {
      setIsLoading(false);
    }
  };

  return { addVente, isLoading };
};

// Hook لتحديث عملية بيع
export const useUpdateVente = () => {
  const [isLoading, setIsLoading] = useState(false);

  const updateVente = async (id: string, updateData: VenteUpdateInput) => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/ventes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      const result = await response.json();
      
      return result;
    } catch (error) {
      console.error('Error updating vente:', error);
      return {
        success: false,
        message: `خطأ في تحديث عملية البيع: ${error}`
      };
    } finally {
      setIsLoading(false);
    }
  };

  return { updateVente, isLoading };
};

// Hook لحذف عملية بيع
export const useDeleteVente = () => {
  const [isLoading, setIsLoading] = useState(false);

  const deleteVente = async (id: string) => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/ventes/${id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      return result;
    } catch (error) {
      console.error('Error deleting vente:', error);
      return {
        success: false,
        message: `خطأ في حذف عملية البيع: ${error}`
      };
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteVente, isLoading };
};

// Hook شامل لإدارة المبيعات
export const useVentesManager = () => {
  const { ventes, count, isLoading, error, refetch } = useVentes();
  const { stats } = useSalesStats();
  const { addVente } = useAddVente();
  const { updateVente } = useUpdateVente();
  const { deleteVente } = useDeleteVente();
  
  const handleAddVente = async (venteData: VenteInput) => {
    const result = await addVente(venteData);
    if (result.success) {
      refetch(); // إعادة تحميل القائمة
    }
    return result;
  };

  const handleUpdateVente = async (id: string, updateData: VenteUpdateInput) => {
    const result = await updateVente(id, updateData);
    if (result.success) {
      refetch(); // إعادة تحميل القائمة
    }
    return result;
  };

  const handleDeleteVente = async (id: string) => {
    const result = await deleteVente(id);
    if (result.success) {
      refetch(); // إعادة تحميل القائمة
    }
    return result;
  };

  return {
    // البيانات
    ventes,
    stats,
    count,
    isLoading,
    error,
    
    // العمليات
    addVente: handleAddVente,
    updateVente: handleUpdateVente,
    deleteVente: handleDeleteVente,
    
    // دوال مساعدة
    getVenteById: (id: string) => ventes.find(vente => vente.id === id),
    getVentesByArticle: (articleId: string) => ventes.filter(vente => vente.articleId === articleId),
    refetch
  };
};
