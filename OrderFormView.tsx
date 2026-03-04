import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import type { ProductionOrder, ProductionSector } from '../types';

interface OrderFormViewProps {
  initialData?: ProductionOrder | null;
  sectors: ProductionSector[];
  subSectors: any[];
  onSubmit: (order: ProductionOrder, notify: boolean) => void;
  onCancel: () => void;
}

const OrderFormView: React.FC<OrderFormViewProps> = ({
  initialData,
  sectors,
  subSectors,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    clientName: initialData?.clientName || '',
    productName: initialData?.productName || '',
    sector: initialData?.sector || '',
    subSector: initialData?.subSector || '',
    quantity: initialData?.quantity || 1,
    unit: initialData?.unit || 'un',
    deadline: initialData?.deadline || '',
    priority: initialData?.priority || 'media',
    notes: initialData?.notes || ''
  });

  const [notifyWhatsapp, setNotifyWhatsapp] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newOrder: ProductionOrder = {
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      createdAt: initialData?.createdAt || new Date().toISOString(),
      deadline: formData.deadline,
      clientName: formData.clientName,
      productName: formData.productName,
      quantity: formData.quantity,
      unit: formData.unit,
      sector: formData.sector,
      subSector: formData.subSector,
      notes: formData.notes,
      priority: formData.priority as any,
      status: initialData?.status || 'pendente'
    };

    onSubmit(newOrder, notifyWhatsapp);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-[#002855] italic uppercase">
          {initialData ? 'Editar Ordem' : 'Nova Ordem de Produção'}
        </h1>
        <button onClick={onCancel} className="text-slate-400 hover:text-red-500">
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cliente */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 block ml-2">
              Nome do Cliente
            </label>
            <input
              required
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              placeholder="EX: CLIENTE LTDA"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 font-bold text-[#002855] outline-none focus:border-[#FFB800] uppercase"
            />
          </div>

          {/* Produto */}
          <div>
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 block ml-2">
              Produto
            </label>
            <input
              required
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              placeholder="EX: ESTRUTURA METÁLICA"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 font-bold text-[#002855] outline-none focus:border-[#FFB800] uppercase"
            />
          </div>
        </div>

        {/* Setor e Sub-setor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 block ml-2">
              Setor
            </label>
            <select
              required
              name="sector"
              value={formData.sector}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 font-bold text-[#002855] outline-none focus:border-[#FFB800] uppercase"
            >
              <option value="">-- SELECIONE --</option>
              {sectors.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 block ml-2">
              Sub-setor
            </label>
            <select
              name="subSector"
              value={formData.subSector}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 font-bold text-[#002855] outline-none focus:border-[#FFB800] uppercase"
            >
              <option value="">-- OPCIONAL --</option>
              {subSectors.filter(ss => ss.sectorId === formData.sector).map(ss => 
                <option key={ss.id} value={ss.name}>{ss.name}</option>
              )}
            </select>
          </div>
        </div>

        {/* Quantidade */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 block ml-2">
              Quantidade
            </label>
            <input
              required
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 font-bold text-[#002855] outline-none focus:border-[#FFB800]"
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 block ml-2">
              Unidade
            </label>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 font-bold text-[#002855] outline-none focus:border-[#FFB800] uppercase"
            >
              <option value="un">UN</option>
              <option value="kg">KG</option>
              <option value="m">M</option>
              <option value="m2">M²</option>
              <option value="caixa">CAIXA</option>
            </select>
          </div>
        </div>

        {/* Prazo e Prioridade */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 block ml-2">
              Prazo de Entrega
            </label>
            <input
              required
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 font-bold text-[#002855] outline-none focus:border-[#FFB800]"
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 block ml-2">
              Prioridade
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 font-bold text-[#002855] outline-none focus:border-[#FFB800] uppercase"
            >
              <option value="baixa">BAIXA</option>
              <option value="media">MÉDIA</option>
              <option value="alta">ALTA</option>
              <option value="urgente">URGENTE</option>
            </select>
          </div>
        </div>

        {/* Notas */}
        <div>
          <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 block ml-2">
            Observações Técnicas
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Detalhes técnicos, materiais especiais, etc..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 font-bold text-[#002855] outline-none focus:border-[#FFB800] resize-none"
          />
        </div>

        {/* Notificação WhatsApp */}
        <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <input
            type="checkbox"
            id="notifyWhatsapp"
            checked={notifyWhatsapp}
            onChange={e => setNotifyWhatsapp(e.target.checked)}
            className="w-5 h-5 cursor-pointer accent-[#FFB800]"
          />
          <label htmlFor="notifyWhatsapp" className="text-sm font-bold text-[#002855] cursor-pointer flex-1">
            Notificar clientes via WhatsApp
          </label>
        </div>

        {/* Botões */}
        <div className="flex gap-3 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-4 bg-slate-200 text-slate-700 font-black uppercase text-xs rounded-xl hover:bg-slate-300 transition-all"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 py-4 bg-[#002855] text-[#FFB800] font-black uppercase text-xs rounded-xl shadow-lg hover:bg-[#001328] transition-all border-b-4 border-[#FFB800]"
          >
            {initialData ? 'Atualizar Ordem' : 'Criar Ordem'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderFormView;
