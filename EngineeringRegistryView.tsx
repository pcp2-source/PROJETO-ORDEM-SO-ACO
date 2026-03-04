import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { SystemUser } from '../types';

interface EngineeringRegistryViewProps {
  sheets: any[];
  tubesRound: any[];
  tubesSquare: any[];
  tubesRect: any[];
  loadHistory: any[];
  setLoadHistory: (history: any[]) => void;
  library: any[];
  setLibrary: (library: any[]) => void;
  activeUser: SystemUser | null;
}

const EngineeringRegistryView: React.FC<EngineeringRegistryViewProps> = ({
  sheets,
  tubesRound,
  tubesSquare,
  tubesRect,
  loadHistory,
  setLoadHistory,
  library,
  setLibrary,
  activeUser
}) => {
  const [activeTab, setActiveTab] = useState<'library' | 'materials'>('library');
  const [newPart, setNewPart] = useState({ name: '', partNumber: '', description: '' });
  const [newMaterial, setNewMaterial] = useState({
    type: 'chapa',
    name: '',
    thickness: 0,
    diameter: 0,
    size: 0,
    width: 0,
    height: 0,
    weight: 0
  });

  const addPart = () => {
    if (!newPart.name || !newPart.partNumber) return;
    const part = {
      id: Math.random().toString(36).substr(2, 9),
      name: newPart.name.toUpperCase(),
      partNumber: newPart.partNumber.toUpperCase(),
      description: newPart.description,
      createdDate: new Date().toISOString()
    };
    setLibrary([...library, part]);
    setNewPart({ name: '', partNumber: '', description: '' });
  };

  const deletePart = (id: string) => {
    setLibrary(library.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {[
          { key: 'library', label: '📚 Biblioteca de Peças' },
          { key: 'materials', label: '📦 Materiais Cadastrados' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-6 py-3 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? 'bg-[#FFB800] text-[#002855]'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Biblioteca de Peças */}
      {activeTab === 'library' && (
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
          <h2 className="text-2xl font-black text-[#002855] italic uppercase mb-6">Biblioteca de Peças de Engenharia</h2>

          {/* Novo Parte */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8 space-y-4">
            <h3 className="font-bold text-[#002855] uppercase">Adicionar Nova Peça</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                value={newPart.name}
                onChange={e => setNewPart({ ...newPart, name: e.target.value })}
                placeholder="Nome da peça"
                className="px-4 py-3 rounded-lg bg-white border-2 border-slate-300 font-bold focus:border-[#FFB800] outline-none uppercase"
              />
              <input
                type="text"
                value={newPart.partNumber}
                onChange={e => setNewPart({ ...newPart, partNumber: e.target.value })}
                placeholder="Número da peça"
                className="px-4 py-3 rounded-lg bg-white border-2 border-slate-300 font-bold focus:border-[#FFB800] outline-none uppercase"
              />
              <input
                type="text"
                value={newPart.description}
                onChange={e => setNewPart({ ...newPart, description: e.target.value })}
                placeholder="Descrição (opcional)"
                className="px-4 py-3 rounded-lg bg-white border-2 border-slate-300 font-bold focus:border-[#FFB800] outline-none"
              />
            </div>
            <button
              onClick={addPart}
              className="w-full py-3 bg-[#002855] text-[#FFB800] font-black rounded-lg hover:bg-[#001328] transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" /> Adicionar Peça à Biblioteca
            </button>
          </div>

          {/* Lista de Peças */}
          <div className="space-y-3">
            {library.length === 0 ? (
              <p className="text-center text-slate-500 py-8">Nenhuma peça cadastrada</p>
            ) : (
              library.map(part => (
                <div key={part.id} className="flex items-start justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-[#FFB800] transition-all">
                  <div className="flex-1">
                    <p className="font-black text-[#002855] uppercase">{part.name}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Número: {part.partNumber}</p>
                    {part.description && <p className="text-sm text-slate-600">{part.description}</p>}
                  </div>
                  <button
                    onClick={() => deletePart(part.id)}
                    className="text-red-600 hover:bg-red-100 p-2 rounded transition-all ml-4"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Materiais Cadastrados */}
      {activeTab === 'materials' && (
        <div className="space-y-6">
          {/* Chapas */}
          {sheets.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
              <h3 className="text-xl font-black text-[#002855] italic uppercase mb-4">Chapas de Aço ({sheets.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sheets.map(sheet => (
                  <div key={sheet.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="font-black text-[#002855]">{sheet.type}</p>
                    <p className="text-[10px] text-slate-600 uppercase tracking-widest mt-1">
                      Espessura: {sheet.thickness}mm | Peso: {sheet.weight}kg
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tubos Redondos */}
          {tubesRound.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
              <h3 className="text-xl font-black text-[#002855] italic uppercase mb-4">Tubos Redondos ({tubesRound.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tubesRound.map(tube => (
                  <div key={tube.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="font-black text-[#002855]">ø {tube.diameter}mm</p>
                    <p className="text-[10px] text-slate-600 uppercase tracking-widest mt-1">
                      Espessura: {tube.thickness}mm | Peso: {tube.weight}kg
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metalon Quadrado */}
          {tubesSquare.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
              <h3 className="text-xl font-black text-[#002855] italic uppercase mb-4">Metalon Quadrado ({tubesSquare.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tubesSquare.map(tube => (
                  <div key={tube.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="font-black text-[#002855]">{tube.size}x{tube.size}mm</p>
                    <p className="text-[10px] text-slate-600 uppercase tracking-widest mt-1">
                      Espessura: {tube.thickness}mm | Peso: {tube.weight}kg
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metalon Retangular */}
          {tubesRect.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
              <h3 className="text-xl font-black text-[#002855] italic uppercase mb-4">Metalon Retangular ({tubesRect.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tubesRect.map(tube => (
                  <div key={tube.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="font-black text-[#002855]">{tube.width}x{tube.height}mm</p>
                    <p className="text-[10px] text-slate-600 uppercase tracking-widest mt-1">
                      Espessura: {tube.thickness}mm | Peso: {tube.weight}kg
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sheets.length + tubesRound.length + tubesSquare.length + tubesRect.length === 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200 text-center">
              <p className="text-slate-600 font-bold">Nenhum material cadastrado</p>
              <p className="text-slate-500 text-sm mt-2">Adicione materiais na calculadora de peso</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EngineeringRegistryView;
