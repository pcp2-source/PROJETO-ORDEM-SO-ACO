import React, { useMemo } from 'react';
import { Edit2, Trash2, Send, Copy, Printer } from 'lucide-react';
import type { ProductionOrder, SystemUser } from '../types';

interface OrderListViewProps {
  orders: ProductionOrder[];
  sectors: any[];
  subSectors: any[];
  onUpdateStatus: (id: string, status: any) => void;
  onDelete: (id: string) => void;
  onNotify: (order: ProductionOrder) => void;
  onReplicate: (order: ProductionOrder) => void;
  searchQuery: string;
  activeUser: SystemUser | null;
  users: SystemUser[];
}

const OrderListView: React.FC<OrderListViewProps> = ({
  orders,
  searchQuery,
  onUpdateStatus,
  onDelete,
  onNotify,
  onReplicate
}) => {
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const query = searchQuery.toLowerCase();
      return (
        order.id.toLowerCase().includes(query) ||
        order.clientName.toLowerCase().includes(query) ||
        order.productName.toLowerCase().includes(query) ||
        (order.notes && order.notes.toLowerCase().includes(query))
      );
    });
  }, [orders, searchQuery]);

  const statusColors: Record<string, string> = {
    'pendente': 'bg-yellow-100 text-yellow-700 border-yellow-300',
    'em-producao': 'bg-orange-100 text-orange-700 border-orange-300',
    'concluido': 'bg-blue-100 text-blue-700 border-blue-300',
    'entregue': 'bg-green-100 text-green-700 border-green-300',
    'cancelado': 'bg-red-100 text-red-700 border-red-300'
  };

  const priorityColors: Record<string, string> = {
    'baixa': 'text-blue-600',
    'media': 'text-yellow-600',
    'alta': 'text-orange-600',
    'urgente': 'text-red-600'
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-200 bg-slate-50">
        <h1 className="text-2xl font-black text-[#002855] italic uppercase">
          Ordens de Serviço ({filteredOrders.length})
        </h1>
        <p className="text-slate-500 text-sm mt-1">Gerenciamento completo de ordens de produção</p>
      </div>

      {/* Tabela */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 px-8">
          <p className="text-slate-500 font-bold text-sm">
            {searchQuery ? 'Nenhuma ordem encontrada com essa busca' : 'Nenhuma ordem registrada'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-6 py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">ID</th>
                <th className="text-left px-6 py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">Cliente</th>
                <th className="text-left px-6 py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">Produto</th>
                <th className="text-center px-6 py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">Qtd</th>
                <th className="text-left px-6 py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">Status</th>
                <th className="text-left px-6 py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">Prioridade</th>
                <th className="text-center px-6 py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, idx) => (
                <tr
                  key={order.id}
                  className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
                >
                  <td className="px-6 py-4 text-[11px] font-black text-[#002855] uppercase">{order.id}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-[#002855]">{order.clientName}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">{order.sector}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-[#002855]">{order.productName}</td>
                  <td className="px-6 py-4 text-center font-black text-[#002855]">
                    {order.quantity} {order.unit}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={e => onUpdateStatus(order.id, e.target.value)}
                      className={`text-[11px] font-black uppercase rounded-lg px-3 py-1.5 border-2 cursor-pointer transition-all ${statusColors[order.status]}`}
                    >
                      <option value="pendente">PENDENTE</option>
                      <option value="em-producao">EM PRODUÇÃO</option>
                      <option value="concluido">CONCLUÍDO</option>
                      <option value="entregue">ENTREGUE</option>
                      <option value="cancelado">CANCELADO</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-black uppercase ${priorityColors[order.priority]}`}>
                      {order.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => onNotify(order)}
                        title="Notificar WhatsApp"
                        className="p-2 hover:bg-green-100 text-green-600 rounded-lg transition-all"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onReplicate(order)}
                        title="Replicar Ordem"
                        className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-all"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(order.id)}
                        title="Deletar Ordem"
                        className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderListView;
