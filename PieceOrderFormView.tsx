import React, { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import type { ProductionOrder, OrderItem } from '../types';

interface PieceOrderFormViewProps {
  initialData?: ProductionOrder | null;
  sectors: any[];
  subSectors: any[];
  onSubmit: (order: ProductionOrder, notify: boolean) => void;
  onCancel: () => void;
}

const PieceOrderFormView: React.FC<PieceOrderFormViewProps> = ({
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
    deadline: initialData?.deadline || '',
    priority: initialData?.priority || 'media',
    notes: initialData?.notes || ''
  });

  const [items, setItems] = useState<OrderItem[]>(initialData?.items || []);
  const [notifyWhatsapp, setNotifyWhatsapp] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addItem = () => {
    setItems(prev => [
      ...prev,
      {
        id: Math.random().toString(36).substr(2, 9),
        description: '',
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0
      }
    ]);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: string, value: any) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          const qty = field === 'quantity' ? value : item.quantity;
          const price = field === 'unitPrice' ? value : item.unitPrice;
          updated.totalPrice = qty * price;
        }
        return updated;
      }
      return item;
    }));
  };

  const totalValue = items.reduce((sum, item) => sum + item.totalPrice, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newOrder: ProductionOrder = {
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      createdAt: initialData?.createdAt || new Date().toISOString(),
      deadline: formData.deadline,
      clientName: formData.clientName,
      productName: formData.productName,
      quantity: items.length,
      unit: 'itens',
      sector: formData.sector,
      subSector: formData.subSector,
      notes: formData.notes,
      priority: formData.priority as any,
      status: initialData?.status || 'pendente',
      items: items,
      estimatedCost: totalValue
    };

    onSubmit(newOrder, notifyWhatsapp);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-[#002855] italic uppercase">
          Detalhamento da Ordem
        </h1>
        <button onClick={onCancel} className="text-slate-400 hover:text-red-500">
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Básicas */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
          <h2 className="text-lg font-black text-[#002855] uppercase italic">Informações Gerais</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 block">
                Cliente
              </label>
              <input
                required
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                placeholder="CLIENTE LTDA"
                className="w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-300 font-bold text-[#002855] outline-none focus:border-[#FFB800] uppercase"
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 block">
                Produto
              </label>
              <input
                required
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                placeholder="PRODUTO"
                className="w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-300 font-bold text-[#002855] outline-none focus:border-[#FFB800] uppercase"
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 block">
                Setor
              </label>
              <select
                required
                name="sector"
                value={formData.sector}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-300 font-bold text-[#002855] outline-none focus:border-[#FFB800] uppercase"
              >
                <option value="">-- SELECIONE --</option>
                {sectors.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 block">
                Prazo
              </label>
              <input
                required
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-300 font-bold text-[#002855] outline-none focus:border-[#FFB800]"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 block">
              Observações
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Detalhes adicionais..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-300 font-bold text-[#002855] outline-none focus:border-[#FFB800] resize-none"
            />
          </div>
        </div>

        {/* Itens */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-[#002855] uppercase italic">Itens da Ordem</h2>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-2 px-4 py-2 bg-[#FFB800] text-[#002855] font-black rounded-lg text-xs hover:bg-yellow-500 transition-all"
            >
              <Plus className="w-4 h-4" /> Adicionar Item
            </button>
          </div>

          {items.length === 0 ? (
            <p className="text-center text-slate-500 py-4">Nenhum item adicionado</p>
          ) : (
            <div className="space-y-3">
              {items.map((item, idx) => (
                <div key={item.id} className="bg-white p-4 rounded-lg border border-slate-300 flex gap-3">
                  <div className="flex-1">
                    <label className="text-[8px] font-black text-slate-600 uppercase block mb-1">Descrição</label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={e => updateItem(item.id, 'description', e.target.value)}
                      placeholder="Descrição do item"
                      className="w-full px-3 py-2 rounded border border-slate-300 text-sm font-bold focus:border-[#FFB800] outline-none"
                    />
                  </div>

                  <div className="w-20">
                    <label className="text-[8px] font-black text-slate-600 uppercase block mb-1">Qtd</label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={e => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                      min="1"
                      className="w-full px-3 py-2 rounded border border-slate-300 text-sm font-bold focus:border-[#FFB800] outline-none"
                    />
                  </div>

                  <div className="w-24">
                    <label className="text-[8px] font-black text-slate-600 uppercase block mb-1">Preço Unit.</label>
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={e => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                      step="0.01"
                      className="w-full px-3 py-2 rounded border border-slate-300 text-sm font-bold focus:border-[#FFB800] outline-none"
                    />
                  </div>

                  <div className="w-24 pt-5">
                    <p className="text-sm font-black text-[#002855]">R$ {item.totalPrice.toFixed(2)}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="pt-5 text-red-600 hover:bg-red-100 p-2 rounded transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Total */}
          <div className="bg-[#002855] text-white p-4 rounded-lg flex justify-between items-center font-black uppercase">
            <span>Valor Total</span>
            <span className="text-[#FFB800]">R$ {totalValue.toFixed(2)}</span>
          </div>
        </div>

        {/* Notificação */}
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
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-4 bg-slate-200 text-slate-700 font-black uppercase text-xs rounded-xl hover:bg-slate-300 transition-all"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={items.length === 0}
            className="flex-1 py-4 bg-[#002855] text-[#FFB800] font-black uppercase text-xs rounded-xl shadow-lg hover:bg-[#001328] transition-all border-b-4 border-[#FFB800] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Criar Ordem Detalhada
          </button>
        </div>
      </form>
    </div>
  );
};

export default PieceOrderFormView;
