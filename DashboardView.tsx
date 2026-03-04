import React, { useMemo } from 'react';
import { BarChart3, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';
import type { ProductionOrder, OrderStatus } from '../types';

interface DashboardViewProps {
  orders: ProductionOrder[];
  sectors: any[];
  subSectors: any[];
  users: any[];
}

const DashboardView: React.FC<DashboardViewProps> = ({ orders, sectors, subSectors, users }) => {
  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter(o => o.status === 'pendente').length;
    const inProgress = orders.filter(o => o.status === 'em-producao').length;
    const completed = orders.filter(o => o.status === 'concluido').length;
    const delivered = orders.filter(o => o.status === 'entregue').length;

    return { total, pending, inProgress, completed, delivered };
  }, [orders]);

  const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <p className="text-slate-600 text-sm font-bold uppercase tracking-widest mb-2">{label}</p>
      <p className="text-4xl font-black text-[#002855]">{value}</p>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Grid de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          icon={BarChart3}
          label="Total de Ordens"
          value={stats.total}
          color="bg-blue-500"
        />
        <StatCard
          icon={Clock}
          label="Pendentes"
          value={stats.pending}
          color="bg-yellow-500"
        />
        <StatCard
          icon={TrendingUp}
          label="Em Produção"
          value={stats.inProgress}
          color="bg-orange-500"
        />
        <StatCard
          icon={CheckCircle2}
          label="Concluídas"
          value={stats.completed}
          color="bg-green-500"
        />
        <StatCard
          icon={CheckCircle2}
          label="Entregues"
          value={stats.delivered}
          color="bg-emerald-600"
        />
      </div>

      {/* Seção de Ordens Recentes */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-xl font-black text-[#002855] mb-6 italic uppercase">Ordens Recentes</h2>
        
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 text-sm font-bold">Nenhuma ordem registrada ainda</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 5).map(order => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-[#FFB800] transition-all">
                <div className="flex-1">
                  <p className="font-black text-[#002855] text-sm uppercase">
                    {order.clientName} - {order.productName}
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">
                    ID: {order.id}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase text-slate-600 mb-1">
                    {order.quantity} {order.unit}
                  </p>
                  <span className={`inline-block px-3 py-1 rounded-full text-[8px] font-black uppercase ${
                    order.status === 'entregue' ? 'bg-green-100 text-green-700' :
                    order.status === 'concluido' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'em-producao' ? 'bg-orange-100 text-orange-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Seção de Informações do Sistema */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest mb-3">
            Setores Configurados
          </p>
          <p className="text-3xl font-black text-[#002855]">{sectors.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest mb-3">
            Usuários Ativos
          </p>
          <p className="text-3xl font-black text-[#002855]">{users.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest mb-3">
            Taxa de Conclusão
          </p>
          <p className="text-3xl font-black text-[#002855]">
            {stats.total > 0 ? Math.round((stats.delivered / stats.total) * 100) : 0}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
