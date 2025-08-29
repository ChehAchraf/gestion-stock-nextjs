"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSales } from '@/lib/hooks/useSales';

export function SalesChart() {
  const { sales } = useSales();

  // تحويل البيانات إلى تنسيق مناسب للرسم البياني
  const processChartData = () => {
    const monthlyData = new Map();
    
    // تهيئة الأشهر الـ 12
    const months = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    
    months.forEach(month => {
      monthlyData.set(month, { month, sales: 0, count: 0 });
    });

    // تجميع المبيعات حسب الشهر
    sales.forEach(sale => {
      const date = new Date(sale.saleDate);
      const monthIndex = date.getMonth();
      const monthName = months[monthIndex];
      
      if (monthlyData.has(monthName)) {
        const current = monthlyData.get(monthName);
        current.sales += sale.totalAmount;
        current.count += sale.quantity;
        monthlyData.set(monthName, current);
      }
    });

    return Array.from(monthlyData.values());
  };

  const chartData = processChartData();

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 font-cairo mb-6">المبيعات حسب الأشهر</h3>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value} درهم`}
            />
            <Tooltip 
              formatter={(value: number, name: string) => [
                `${value.toFixed(2)} درهم`, 
                name === 'sales' ? 'المبيعات' : 'الكمية'
              ]}
              labelStyle={{ fontFamily: 'Cairo' }}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontFamily: 'Cairo'
              }}
            />
            <Bar 
              dataKey="sales" 
              fill="#3b82f6" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
