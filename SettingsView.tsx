import React, { useState } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import type { SystemUser, SystemConfig, ProductionSector, ProductionSubSector, SheetMaterial, TubeRoundMaterial, MetalonSquareMaterial, MetalonRectMaterial } from '../types';

interface SettingsViewProps {
  config: SystemConfig;
  setConfig: (config: SystemConfig) => void;
  users: SystemUser[];
  setUsers: (users: SystemUser[]) => void;
  sectors: ProductionSector[];
  setSectors: (sectors: ProductionSector[]) => void;
  subSectors: ProductionSubSector[];
  setSubSectors: (subSectors: ProductionSubSector[]) => void;
  sheets: SheetMaterial[];
  setSheets: (sheets: SheetMaterial[]) => void;
  tubesRound: TubeRoundMaterial[];
  setTubesRound: (tubes: TubeRoundMaterial[]) => void;
  tubesSquare: MetalonSquareMaterial[];
  setTubesSquare: (tubes: MetalonSquareMaterial[]) => void;
  tubesRect: MetalonRectMaterial[];
  setTubesRect: (tubes: MetalonRectMaterial[]) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({
  config,
  setConfig,
  users,
  setUsers,
  sectors,
  setSectors,
  subSectors,
  setSubSectors,
  sheets,
  setSheets
}) => {
  const [activeTab, setActiveTab] = useState<'usuarios' | 'setores' | 'contatos' | 'materiais'>('usuarios');
  const [newUser, setNewUser] = useState({ name: '', password: '', role: 'Operador' });
  const [newSector, setNewSector] = useState('');
  const [newContact, setNewContact] = useState({ label: '', number: '' });

  // USUÁRIOS
  const addUser = () => {
    if (!newUser.name || !newUser.password) return;
    const user: SystemUser = {
      id: Math.random().toString(36).substr(2, 9),
      name: newUser.name.toUpperCase(),
      role: newUser.role as any,
      password: newUser.password
    };
    setUsers([...users, user]);
    setNewUser({ name: '', password: '', role: 'Operador' });
  };

  const deleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  // SETORES
  const addSector = () => {
    if (!newSector) return;
    const sector: ProductionSector = {
      id: Math.random().toString(36).substr(2, 9),
      name: newSector.toUpperCase()
    };
    setSectors([...sectors, sector]);
    setNewSector('');
  };

  const deleteSector = (id: string) => {
    setSectors(sectors.filter(s => s.id !== id));
  };

  // CONTATOS
  const addContact = () => {
    if (!newContact.label || !newContact.number) return;
    const contact = {
      id: Math.random().toString(36).substr(2, 9),
      label: newContact.label,
      number: newContact.number.replace(/\D/g, '')
    };
    setConfig({
      ...config,
      contacts: [...config.contacts, contact]
    });
    setNewContact({ label: '', number: '' });
  };

  const deleteContact = (id: string) => {
    setConfig({
      ...config,
      contacts: config.contacts.filter(c => c.id !== id)
    });
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 bg-white p-4 rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        {[
          { key: 'usuarios', label: '👥 Usuários' },
          { key: 'setores', label: '🏭 Setores' },
          { key: 'contatos', label: '💬 WhatsApp' },
          { key: 'materiais', label: '📦 Materiais' }
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

      {/* Usuários */}
      {activeTab === 'usuarios' && (
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
          <h2 className="text-2xl font-black text-[#002855] italic uppercase mb-6">Gerenciar Usuários</h2>

          {/* Novo Usuário */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8 space-y-4">
            <h3 className="font-bold text-[#002855] uppercase">Adicionar Novo Usuário</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                value={newUser.name}
                onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="Nome completo"
                className="px-4 py-3 rounded-lg bg-white border-2 border-slate-300 font-bold focus:border-[#FFB800] outline-none"
              />
              <input
                type="password"
                value={newUser.password}
                onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                placeholder="Senha"
                className="px-4 py-3 rounded-lg bg-white border-2 border-slate-300 font-bold focus:border-[#FFB800] outline-none"
              />
              <select
                value={newUser.role}
                onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                className="px-4 py-3 rounded-lg bg-white border-2 border-slate-300 font-bold focus:border-[#FFB800] outline-none"
              >
                <option value="Administrador">Administrador</option>
                <option value="Operador">Operador</option>
                <option value="Gerente">Gerente</option>
              </select>
            </div>
            <button
              onClick={addUser}
              className="w-full py-3 bg-[#002855] text-[#FFB800] font-black rounded-lg hover:bg-[#001328] transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" /> Adicionar Usuário
            </button>
          </div>

          {/* Lista */}
          <div className="space-y-3">
            {users.map(user => (
              <div key={user.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex-1">
                  <p className="font-black text-[#002855]">{user.name}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">{user.role}</p>
                </div>
                <button
                  onClick={() => deleteUser(user.id)}
                  className="text-red-600 hover:bg-red-100 p-2 rounded transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Setores */}
      {activeTab === 'setores' && (
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
          <h2 className="text-2xl font-black text-[#002855] italic uppercase mb-6">Gerenciar Setores</h2>

          {/* Novo Setor */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8 space-y-4">
            <h3 className="font-bold text-[#002855] uppercase">Adicionar Novo Setor</h3>
            <div className="flex gap-4">
              <input
                type="text"
                value={newSector}
                onChange={e => setNewSector(e.target.value)}
                placeholder="Nome do setor"
                className="flex-1 px-4 py-3 rounded-lg bg-white border-2 border-slate-300 font-bold focus:border-[#FFB800] outline-none uppercase"
              />
              <button
                onClick={addSector}
                className="px-6 py-3 bg-[#002855] text-[#FFB800] font-black rounded-lg hover:bg-[#001328] transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" /> Adicionar
              </button>
            </div>
          </div>

          {/* Lista */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sectors.map(sector => (
              <div key={sector.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="font-black text-[#002855]">{sector.name}</p>
                <button
                  onClick={() => deleteSector(sector.id)}
                  className="text-red-600 hover:bg-red-100 p-2 rounded transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contatos WhatsApp */}
      {activeTab === 'contatos' && (
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
          <h2 className="text-2xl font-black text-[#002855] italic uppercase mb-6">Contatos WhatsApp</h2>

          {/* Novo Contato */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8 space-y-4">
            <h3 className="font-bold text-[#002855] uppercase">Adicionar Novo Contato</h3>
            <div className="flex gap-4">
              <input
                type="text"
                value={newContact.label}
                onChange={e => setNewContact({ ...newContact, label: e.target.value })}
                placeholder="Rótulo (ex: Gerenciador)"
                className="flex-1 px-4 py-3 rounded-lg bg-white border-2 border-slate-300 font-bold focus:border-[#FFB800] outline-none"
              />
              <input
                type="tel"
                value={newContact.number}
                onChange={e => setNewContact({ ...newContact, number: e.target.value })}
                placeholder="Número com código país (5586994703472)"
                className="flex-1 px-4 py-3 rounded-lg bg-white border-2 border-slate-300 font-bold focus:border-[#FFB800] outline-none"
              />
              <button
                onClick={addContact}
                className="px-6 py-3 bg-green-600 text-white font-black rounded-lg hover:bg-green-700 transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" /> Adicionar
              </button>
            </div>
          </div>

          {/* Lista */}
          <div className="space-y-3">
            {config.contacts.map(contact => (
              <div key={contact.id} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex-1">
                  <p className="font-black text-[#002855]">{contact.label}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{contact.number}</p>
                </div>
                <button
                  onClick={() => deleteContact(contact.id)}
                  className="text-red-600 hover:bg-red-100 p-2 rounded transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Materiais */}
      {activeTab === 'materiais' && (
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
          <h2 className="text-2xl font-black text-[#002855] italic uppercase mb-6">Materiais Disponíveis</h2>
          <p className="text-slate-600 text-sm mb-4">
            Você tem {sheets.length} tipos de chapas cadastradas. 
            Adicione materiais na calculadora de peso para configurar tipos de materiais.
          </p>
        </div>
      )}
    </div>
  );
};

export default SettingsView;
