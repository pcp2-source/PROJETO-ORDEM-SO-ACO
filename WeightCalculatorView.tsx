import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { SystemUser } from '../types';

interface WeightCalculatorViewProps {
  sheets: any[];
  tubesRound: any[];
  tubesSquare: any[];
  tubesRect: any[];
  activeUser: SystemUser | null;
}

const WeightCalculatorView: React.FC<WeightCalculatorViewProps> = ({
  sheets,
  tubesRound,
  tubesSquare,
  tubesRect,
  activeUser
}) => {
  const [materialType, setMaterialType] = useState<'chapa' | 'tubo_redondo' | 'metalon_quadrado' | 'metalon_retangular'>('chapa');
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [results, setResults] = useState<any[]>([]);

  const calculate = () => {
    if (!selectedMaterial) return;

    let weight = 0;
    let description = '';

    if (materialType === 'chapa' && sheets.length > 0) {
      const material = sheets.find(m => m.id === selectedMaterial);
      if (material) {
        weight = material.weight * quantity;
        description = `Chapa ${material.type}`;
      }
    } else if (materialType === 'tubo_redondo' && tubesRound.length > 0) {
      const material = tubesRound.find(m => m.id === selectedMaterial);
      if (material) {
        weight = material.weight * quantity;
        description = `Tubo Redondo ø${material.diameter}mm`;
      }
    } else if (materialType === 'metalon_quadrado' && tubesSquare.length > 0) {
      const material = tubesSquare.find(m => m.id === selectedMaterial);
      if (material) {
        weight = material.weight * quantity;
        description = `Metalon Quadrado ${material.size}x${material.size}mm`;
      }
    } else if (materialType === 'metalon_retangular' && tubesRect.length > 0) {
      const material = tubesRect.find(m => m.id === selectedMaterial);
      if (material) {
        weight = material.weight * quantity;
        description = `Metalon Retangular ${material.width}x${material.height}mm`;
      }
    }

    if (weight > 0) {
      setResults(prev => [
        ...prev,
        {
          id: Math.random().toString(36).substr(2, 9),
          description,
          quantity,
          weight: weight.toFixed(2),
          timestamp: new Date().toLocaleString('pt-BR')
        }
      ]);
      setSelectedMaterial('');
      setQuantity(1);
    }
  };

  const clearResults = () => setResults([]);

  const materials: Record<string, any[]> = {
    chapa: sheets,
    tubo_redondo: tubesRound,
    metalon_quadrado: tubesSquare,
    metalon_retangular: tubesRect
  };

  const getMaterialLabel = () => {
    const labels: Record<string, string> = {
      chapa: 'Chapas de Aço',
      tubo_redondo: 'Tubos Redondos',
      metalon_quadrado: 'Metalon Quadrado',
      metalon_retangular: 'Metalon Retangular'
    };
    return labels[materialType];
  };

  const currentMaterials = materials[materialType] || [];
  const totalWeight = results.reduce((sum, r) => sum + parseFloat(r.weight), 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Calculadora */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
        <h1 className="text-2xl font-black text-[#002855] italic uppercase mb-6">Calculadora de Peso</h1>

        <div className="space-y-6">
          {/* Tipo de Material */}
          <div>
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3 block">
              Tipo de Material
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { key: 'chapa', label: 'Chapa' },
                { key: 'tubo_redondo', label: 'Tubo Redondo' },
                { key: 'metalon_quadrado', label: 'Metalon Quadrado' },
                { key: 'metalon_retangular', label: 'Metalon Retangular' }
              ].map(type => (
                <button
                  key={type.key}
                  onClick={() => {
                    setMaterialType(type.key as any);
                    setSelectedMaterial('');
                  }}
                  className={`py-3 px-4 rounded-lg font-black text-sm transition-all ${
                    materialType === type.key
                      ? 'bg-[#FFB800] text-[#002855]'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Material Específico */}
          <div>
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 block">
              {getMaterialLabel()}
            </label>
            <select
              value={selectedMaterial}
              onChange={e => setSelectedMaterial(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 font-bold text-[#002855] outline-none focus:border-[#FFB800]"
            >
              <option value="">-- SELECIONE UMA OPÇÃO --</option>
              {currentMaterials.map(m => (
                <option key={m.id} value={m.id}>
                  {materialType === 'chapa' && `${m.type} (${m.thickness}mm) - ${m.weight}kg`}
                  {materialType === 'tubo_redondo' && `ø${m.diameter}mm - ${m.weight}kg`}
                  {materialType === 'metalon_quadrado' && `${m.size}x${m.size}mm - ${m.weight}kg`}
                  {materialType === 'metalon_retangular' && `${m.width}x${m.height}mm - ${m.weight}kg`}
                </option>
              ))}
            </select>
          </div>

          {/* Quantidade */}
          <div>
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 block">
              Quantidade
            </label>
            <input
              type="number"
              value={quantity}
              onChange={e => setQuantity(parseInt(e.target.value) || 1)}
              min="1"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 font-bold text-[#002855] outline-none focus:border-[#FFB800]"
            />
          </div>

          {/* Botão Calcular */}
          <button
            onClick={calculate}
            disabled={!selectedMaterial}
            className="w-full py-4 bg-[#002855] text-[#FFB800] font-black uppercase text-sm rounded-xl hover:bg-[#001328] transition-all disabled:opacity-50 disabled:cursor-not-allowed border-b-4 border-[#FFB800]"
          >
            Calcular Peso
          </button>
        </div>
      </div>

      {/* Resultados */}
      {results.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-[#002855] italic uppercase">Cálculos Realizados</h2>
            <button
              onClick={clearResults}
              className="px-4 py-2 bg-red-100 text-red-600 font-black rounded-lg text-sm hover:bg-red-200 transition-all"
            >
              Limpar
            </button>
          </div>

          <div className="space-y-3 mb-6">
            {results.map(result => (
              <div key={result.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex-1">
                  <p className="font-black text-[#002855]">{result.description}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">{result.timestamp}</p>
                </div>
                <div className="text-right mr-4">
                  <p className="text-[10px] text-slate-600 uppercase font-bold">Qtd: {result.quantity}</p>
                  <p className="text-xl font-black text-[#002855]">{result.weight} kg</p>
                </div>
                <button
                  onClick={() => setResults(prev => prev.filter(r => r.id !== result.id))}
                  className="text-red-600 hover:bg-red-100 p-2 rounded transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="bg-[#002855] text-white p-4 rounded-lg flex justify-between items-center font-black uppercase text-lg">
            <span>Peso Total</span>
            <span className="text-[#FFB800]">{totalWeight.toFixed(2)} kg</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeightCalculatorView;
