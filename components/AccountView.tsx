import React, { useState } from 'react';
import { 
  Plus, Search, Trash2, Edit2, Eye, EyeOff, AlertTriangle,
  Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, 
  Globe, Ghost, Music, MessageCircle, Github, Video, KeyRound 
} from 'lucide-react';
import { Account } from '../types';
import { Modal } from './Modal';

interface AccountViewProps {
  accounts: Account[];
  setAccounts: React.Dispatch<React.SetStateAction<Account[]>>;
}

export const AccountView: React.FC<AccountViewProps> = ({ accounts, setAccounts }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  // Delete Confirmation State
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Account>>({});

  const handleOpenModal = (account?: Account) => {
    if (account) {
      setEditingId(account.id);
      setFormData(account);
    } else {
      setEditingId(null);
      setFormData({});
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.username) return;

    if (editingId) {
      setAccounts(prev => prev.map(acc => acc.id === editingId ? { ...acc, ...formData } as Account : acc));
    } else {
      const newAccount: Account = {
        id: crypto.randomUUID(),
        name: formData.name || '',
        username: formData.username || '',
        password: formData.password || '',
        email: formData.email || '',
        expiryDate: formData.expiryDate || '',
        phoneNumber: formData.phoneNumber || '',
        notes: formData.notes || ''
      };
      setAccounts(prev => [...prev, newAccount]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteRequest = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      setAccounts(prev => prev.filter(acc => acc.id !== deleteId));
      setDeleteId(null);
    }
  };

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getBrandStyles = (name: string) => {
    const n = name.toLowerCase();
    
    if (n.includes('face')) return { border: 'border-t-blue-600', text: 'text-blue-700', bg: 'bg-blue-50' };
    if (n.includes('gmail') || n.includes('google') || n.includes('you') || n.includes('tube')) return { border: 'border-t-red-600', text: 'text-red-700', bg: 'bg-red-50' };
    if (n.includes('inst')) return { border: 'border-t-pink-600', text: 'text-pink-700', bg: 'bg-pink-50' };
    if (n.includes('twi') || n.includes(' x') || n.includes('tik')) return { border: 'border-t-gray-900', text: 'text-gray-900', bg: 'bg-gray-100' };
    if (n.includes('link')) return { border: 'border-t-sky-600', text: 'text-sky-700', bg: 'bg-sky-50' };
    if (n.includes('snap')) return { border: 'border-t-yellow-400', text: 'text-yellow-700', bg: 'bg-yellow-50' };
    if (n.includes('what')) return { border: 'border-t-green-500', text: 'text-green-700', bg: 'bg-green-50' };
    
    return { border: 'border-t-gray-300', text: 'text-blue-900', bg: 'bg-gray-50' };
  };

  const getBrandIcon = (name: string) => {
    const n = name.toLowerCase();
    const size = 24;
    
    if (n.includes('face')) return <Facebook size={size} />;
    if (n.includes('twi') || n.includes(' x')) return <Twitter size={size} />;
    if (n.includes('inst')) return <Instagram size={size} />;
    if (n.includes('link')) return <Linkedin size={size} />;
    if (n.includes('you') || n.includes('tube')) return <Youtube size={size} />;
    if (n.includes('gmail') || n.includes('google') || n.includes('mail')) return <Mail size={size} />;
    if (n.includes('snap')) return <Ghost size={size} />;
    if (n.includes('what')) return <MessageCircle size={size} />;
    if (n.includes('tik')) return <Music size={size} />;
    if (n.includes('git')) return <Github size={size} />;
    if (n.includes('zoom') || n.includes('meet')) return <Video size={size} />;
    
    return <KeyRound size={size} />;
  };

  const filteredAccounts = accounts.filter(acc => 
    acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acc.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acc.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">إدارة الحسابات</h2>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          <Plus size={20} />
          <span>إضافة حساب جديد</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text"
          placeholder="بحث في الحسابات..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white text-black"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredAccounts.map(account => {
          const styles = getBrandStyles(account.name);
          
          return (
            <div key={account.id} className={`bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow border-t-4 ${styles.border}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`p-2 rounded-lg ${styles.bg} ${styles.text}`}>
                        {getBrandIcon(account.name)}
                    </div>
                    <h3 className={`font-bold text-lg truncate ${styles.text}`}>{account.name}</h3>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => handleOpenModal(account)} className="text-gray-400 hover:text-blue-600 transition-colors"><Edit2 size={18} /></button>
                  <button onClick={() => handleDeleteRequest(account.id)} className="text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className={`flex justify-between items-center ${styles.bg} p-2 rounded`}>
                  <span className="text-xs font-semibold text-gray-500">المستخدم</span>
                  <span className="font-medium select-all text-gray-900">{account.username}</span>
                </div>
                
                <div className="flex justify-between items-center bg-gray-50 p-2 rounded relative group">
                  <span className="text-xs font-semibold text-gray-400">كلمة المرور</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-gray-900">
                      {visiblePasswords[account.id] ? account.password : '••••••••'}
                    </span>
                    <button 
                      onClick={() => togglePasswordVisibility(account.id)}
                      className="text-gray-400 hover:text-blue-500"
                    >
                      {visiblePasswords[account.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {account.email && (
                  <div className="flex justify-between items-center p-1">
                    <span className="text-xs text-gray-400">الإيميل</span>
                    <span className="text-gray-800">{account.email}</span>
                  </div>
                )}
                
                {account.phoneNumber && (
                  <div className="flex justify-between items-center p-1">
                    <span className="text-xs text-gray-400">الهاتف</span>
                    <span dir="ltr" className="text-gray-800">{account.phoneNumber}</span>
                  </div>
                )}

                {account.expiryDate && (
                  <div className="flex justify-between items-center p-1">
                    <span className="text-xs text-gray-400">ينتهي في</span>
                    <span className="text-orange-600 font-medium">{account.expiryDate}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredAccounts.length === 0 && (
        <div className="text-center py-10 text-gray-400">
          لا توجد حسابات مضافة حالياً
        </div>
      )}

      {/* Edit/Add Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "تعديل الحساب" : "إضافة حساب جديد"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">إسم الحساب <span className="text-red-500">*</span></label>
              <input 
                required
                type="text" 
                value={formData.name || ''} 
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-black"
                placeholder="مثال: فيسبوك، جيميل"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">اسم المستخدم <span className="text-red-500">*</span></label>
              <input 
                required
                type="text" 
                value={formData.username || ''} 
                onChange={e => setFormData({...formData, username: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
              <input 
                type="text" 
                value={formData.password || ''} 
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الإيميل المرتبط</label>
              <input 
                type="email" 
                value={formData.email || ''} 
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
              <input 
                type="text" 
                value={formData.phoneNumber || ''} 
                onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الانتهاء</label>
              <input 
                type="date" 
                value={formData.expiryDate || ''} 
                onChange={e => setFormData({...formData, expiryDate: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-black"
              />
            </div>
          </div>
          <div className="flex justify-end pt-4 gap-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">إلغاء</button>
            <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">حفظ</button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="تأكيد الحذف"
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
            <AlertTriangle size={32} />
          </div>
          <p className="text-lg text-gray-800 font-medium mb-2">هل أنت متأكد من حذف هذا الحساب؟</p>
          <p className="text-gray-500 text-sm mb-6">لا يمكن التراجع عن هذه العملية بعد إتمامها.</p>
          
          <div className="flex gap-3 justify-center">
            <button 
              onClick={() => setDeleteId(null)}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              إلغاء
            </button>
            <button 
              onClick={confirmDelete}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors shadow-sm"
            >
              نعم، احذف
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};