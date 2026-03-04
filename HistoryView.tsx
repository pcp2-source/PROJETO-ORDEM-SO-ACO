import React, { useState } from 'react';
import { Plus, Trash2, Download } from 'lucide-react';
import type { SystemUser } from '../types';

interface HistoryViewProps {
  loadHistory: any[];
  setLoadHistory: (history: any[]) => void;
  activeUser: SystemUser | null;
  users: SystemUser[];
}

const HistoryView: React.FC<HistoryViewProps> = ({
  loadHistory,
  setLoadHistory,
  activeUser,
  users
}) => {
  const [newLoad, setNewLoad] = useState({
    material: '',
    materialType: 'sheet',
    quantity: 0,
    weight: 0,
    notes: ''
  });

  const addLoad = () => {
    if (!newLoad.material || newLoad.quantity === 0 || newLoad.weight === 0) return;

    const load = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      material: newLoad.material.toUpperCase(),
      materialType: newLoad.materialType,
      quantity: newLoad.quantity,
      weight: newLoad.weight,
      notes: newLoad.notes,
      registeredBy: activeUser?.name || 'Sistema'
    };

    setLoadHistory([load, ...loadHistory]);
    setNewLoad({
      material: '',
      materialType: 'sheet',
      quantity: 0,
      weight: 0,
      notes: ''
    });
  };

  const deleteLoad = (id: string) => {
    setLoadHistory(loadHistory.filter(l => l.id !== id));
  };

  const exportData = () => {
    const csv = [
      ['Data', 'Material', 'Tipo', 'Quantidade', 'Peso (kg)', 'Registrado Por', 'Notas'].join(','),
      ...loadHistory.map(l =>
        [
          new Date(l.date).toLocaleString('pt-BR'),
          l.material,
          l.materialType,
          l.quantity,
          l.weight,
          l.registeredBy,
          `"${l.notes || ''}"`,
        ].join(',')
      )
    ].join('\n');

    const element = document.createElement('a');
    element.setAttribute('href', `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`);
    element.setAttribute('download', `historico_carga_${new Date().toISOString().split('T')[0]}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      {/* Novo Registro */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
        <h2 className="text-2xl font-black text-[#002855] italic uppercase mb-6">Registrar Nova Carga</h2>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 block">
                Material
              </label>
              <input
                type="text"
                value={newLoad.material}
                onChange={e => setNewLoad({ ...newLoad, material: e.target.value })}
                placeholder="Nome do material"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 font-bold text-[#002855] outline-none focus:border-[#FFB800] uppercase"
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 block">
                Tipo de Material
              </label>
              <select
                value={newLoad.materialType}
                onChange={e => setNewLoad({ ...newLoad, materialType: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 font-bold text-[#002855] outline-none focus:border-[#FFB800] uppercase"
              >
                <option value="sheet">Chapa</option>
                <option value="tube_round">Tubo Redondo</option>
                <option value="metalon_square">Metalon Quadrado</option>
                <option value="metalon_rect">Metalon Retangular</option>
                <option value="other">Outro</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 block">
                Quantidade
              </label>
              <input
                type="number"
                value={newLoad.quantity}
                onChange={e => setNewLoad({ ...newLoad, quantity: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                min="0"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 font-bold text-[#002855] outline-none focus:border-[#FFB800]"
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 block">
                Peso (kg)
              </label>
              <input
                type="number"
                value={newLoad.weight}
                onChange={e => setNewLoad({ ...newLoad, weight: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                step="0.1"
                min="0"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 font-bold text-[#002855] outline-none focus:border-[#FFB800]"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 block">
              Observações
            </label>
            <textarea
              value={newLoad.notes}
              onChange={e => setNewLoad({ ...newLoad, notes: e.target.value })}
              placeholder="Detalhes da movimentação..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 font-bold text-[#002855] outline-none focus:border-[#FFB800] resize-none"
            />
          </div>

          <button
            onClick={addLoad}
            disabled={!newLoad.material || newLoad.quantity === 0 || newLoad.weight === 0}
            className="w-full py-4 bg-[#002855] text-[#FFB800] font-black uppercase text-sm rounded-xl hover:bg-[#001328] transition-all disabled:opacity-50 disabled:cursor-not-allowed border-b-4 border-[#FFB800] flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" /> Registrar Carga
          </button>
        </div>
      </div>

      {/* Histórico */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-[#002855] italic uppercase">
            Histórico de Cargas ({loadHistory.length})
          </h2>
          {loadHistory.length > 0 && (
            <button
              onClick={exportData}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-black rounded-lg text-sm hover:bg-blue-700 transition-all"
            >
              <Download className="w-4 h-4" /> Exportar
            </button>
          )}
        </div>

        {loadHistory.length === 0 ? (
          <p className="text-center text-slate-500 py-8">Nenhuma carga registrada</p>
        ) : (
          <div className="space-y-3">
            {loadHistory.map(load => (
              <div key={load.id} className="flex items-start justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-[#FFB800] transition-all">
                <div className="flex-1">
                  <p className="font-black text-[#002855] uppercase">{load.material}</p>
                  <div className="flex gap-4 mt-2 text-[10px] text-slate-600 uppercase tracking-widest">
                    <span>📦 {load.quantity} unidades</span>
                    <span>⚖️ {load.weight} kg</span>
                    <span>👤 {load.registeredBy}</span>
                  </div>
                  {load.notes && <p className="text-sm text-slate-600 mt-2">📝 {load.notes}</p>}
                  <p className="text-[9px] text-slate-500 mt-1 font-mono">
                    {new Date(load.date).toLocaleString('pt-BR')}
                  </p>
                </div>
                <button
                  onClick={() => deleteLoad(load.id)}
                  className="text-red-600 hover:bg-red-100 p-2 rounded transition-all ml-4"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Estatísticas */}
      {loadHistory.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg">
            <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest mb-2">
              Total de Cargas
            </p>
            <p className="text-3xl font-black text-[#002855]">{loadHistory.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg">
            <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest mb-2">
              Peso Total
            </p>
            <p className="text-3xl font-black text-[#002855]">
              {loadHistory.reduce((sum, l) => sum + l.weight, 0).toFixed(2)} kg
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg">
            <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest mb-2">
              Média por Carga
            </p>
            <p className="text-3xl font-black text-[#002855]">
              {(loadHistory.reduce((sum, l) => sum + l.weight, 0) / loadHistory.length).toFixed(2)} kg
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryView;
