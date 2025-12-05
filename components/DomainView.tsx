import React, { useState } from 'react';
import { Plus, Search, Trash2, Edit2, Globe, Calendar, AlertTriangle, AlertOctagon } from 'lucide-react';
import { Domain } from '../types';
import { Modal } from './Modal';

interface DomainViewProps {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
}

export const DomainView: React.FC<DomainViewProps> = ({ domains, setDomains }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Partial<Domain>>({});

  // Delete Confirmation State
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleOpenModal = (domain?: Domain) => {
    if (domain) {
      setEditingId(domain.id);
      setFormData(domain);
    } else {
      setEditingId(null);
      setFormData({});
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.domainName) return;

    if (editingId) {
      setDomains(prev => prev.map(d => d.id === editingId ? { ...d, ...formData } as Domain : d));
    } else {
      const newDomain: Domain = {
        id: crypto.randomUUID(),
        domainName: formData.domainName || '',
        registrar: formData.registrar || '',
        purchaseDate: formData.purchaseDate || '',
        renewalDate: formData.renewalDate || '',
        purchasePrice: Number(formData.purchasePrice) || 0,
        renewalPrice: Number(formData.renewalPrice) || 0,
        purchaseEmail: formData.purchaseEmail || '',
        beneficiary: formData.beneficiary || '',
      };
      setDomains(prev => [...prev, newDomain]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteRequest = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      setDomains(prev => prev.filter(d => d.id !== deleteId));
      setDeleteId(null);
    }
  };

  const getDomainStatus = (domain: Domain) => {
    if (!domain.purchaseDate || !domain.renewalDate) return null;

    const purchase = new Date(domain.purchaseDate);
    const renewal = new Date(domain.renewalDate);
    const now = new Date();

    if (isNaN(purchase.getTime()) || isNaN(renewal.getTime())) return null;

    const totalDuration = renewal.getTime() - purchase.getTime();
    const timeUntilRenewal = renewal.getTime() - now.getTime();

    // If expired
    if (timeUntilRenewal < 0) {
      return { type: 'expired', label: 'منتهي الصلاحية', color: 'bg-red-50 border-red-200' };
    }

    // Alert Threshold: 33.33% of total duration
    // Example: For 1 year (12 months), threshold is 4 months.
    const alertThreshold = totalDuration * (1 / 3);

    if (timeUntilRenewal <= alertThreshold) {
      return { type: 'warning', label: 'تنبيه: موعد التجديد قريب', color: 'bg-amber-50 border-amber-200' };
    }

    return null;
  };

  const filteredDomains = domains.filter(d => 
    d.domainName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.beneficiary?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">إدارة الدومينات</h2>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          <Plus size={20} />
          <span>إضافة دومين جديد</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text"
          placeholder="بحث في الدومينات..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-white text-black"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-sm text-right">
          <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 font-semibold">اسم الدومين</th>
              <th className="px-6 py-3 font-semibold">موقع الشراء</th>
              <th className="px-6 py-3 font-semibold">تواريخ</th>
              <th className="px-6 py-3 font-semibold">الأسعار</th>
              <th className="px-6 py-3 font-semibold">المستفيد</th>
              <th className="px-6 py-3 font-semibold">اجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredDomains.map(domain => {
              const status = getDomainStatus(domain);
              const rowClass = status ? status.color : 'hover:bg-gray-50';

              return (
                <tr key={domain.id} className={`${rowClass} transition-colors border-l-4 ${status?.type === 'warning' ? 'border-l-amber-400' : status?.type === 'expired' ? 'border-l-red-500' : 'border-l-transparent'}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${status?.type === 'expired' ? 'bg-red-100 text-red-600' : status?.type === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-50 text-indigo-600'}`}>
                          <Globe size={20} />
                      </div>
                      <div>
                          <p className="font-bold text-gray-900 ltr:text-left" dir="ltr">{domain.domainName}</p>
                          <p className="text-xs text-gray-500">{domain.purchaseEmail}</p>
                          {status && (
                            <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs mt-1 font-bold w-fit ${status.type === 'expired' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                                {status.type === 'expired' ? <AlertOctagon size={12} /> : <AlertTriangle size={12} />}
                                <span>{status.label}</span>
                            </div>
                          )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block bg-white/50 border border-gray-200 px-2 py-1 rounded text-gray-700 text-xs font-semibold">
                      {domain.registrar || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 text-xs">
                      <div className="flex items-center gap-1 text-green-700">
                          <Calendar size={12} />
                          <span>شراء: {domain.purchaseDate || '-'}</span>
                      </div>
                      <div className={`flex items-center gap-1 font-medium ${status?.type === 'expired' ? 'text-red-700 font-bold' : status?.type === 'warning' ? 'text-amber-700 font-bold' : 'text-gray-600'}`}>
                          <Calendar size={12} />
                          <span>تجديد: {domain.renewalDate || '-'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex flex-col gap-1 text-xs">
                      <div>شراء: <span className="font-semibold">{domain.purchasePrice}</span></div>
                      <div>تجديد: <span className="font-semibold">{domain.renewalPrice}</span></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-700">
                    {domain.beneficiary || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button onClick={() => handleOpenModal(domain)} className="text-blue-600 hover:text-blue-800"><Edit2 size={18} /></button>
                      <button onClick={() => handleDeleteRequest(domain.id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredDomains.length === 0 && (
            <div className="p-10 text-center text-gray-400">لا توجد دومينات مضافة</div>
        )}
      </div>

      {/* Edit/Add Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "تعديل الدومين" : "إضافة دومين جديد"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">اسم الدومين <span className="text-red-500">*</span></label>
              <input 
                required
                dir="ltr"
                type="text" 
                value={formData.domainName || ''} 
                onChange={e => setFormData({...formData, domainName: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none text-left bg-white text-black"
                placeholder="example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الموقع (Registrar)</label>
              <input 
                type="text" 
                value={formData.registrar || ''} 
                onChange={e => setFormData({...formData, registrar: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-black"
                placeholder="GoDaddy, Namecheap..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الإيميل المستخدم</label>
              <input 
                type="email" 
                value={formData.purchaseEmail || ''} 
                onChange={e => setFormData({...formData, purchaseEmail: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الشراء</label>
              <input 
                type="date" 
                value={formData.purchaseDate || ''} 
                onChange={e => setFormData({...formData, purchaseDate: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ التجديد</label>
              <input 
                type="date" 
                value={formData.renewalDate || ''} 
                onChange={e => setFormData({...formData, renewalDate: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">سعر الشراء</label>
              <input 
                type="number" 
                step="0.01"
                value={formData.purchasePrice || ''} 
                onChange={e => setFormData({...formData, purchasePrice: parseFloat(e.target.value)})}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">سعر التجديد</label>
              <input 
                type="number" 
                step="0.01"
                value={formData.renewalPrice || ''} 
                onChange={e => setFormData({...formData, renewalPrice: parseFloat(e.target.value)})}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-black"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">المستفيد</label>
              <input 
                type="text" 
                value={formData.beneficiary || ''} 
                onChange={e => setFormData({...formData, beneficiary: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-black"
                placeholder="اسم العميل أو الشخص"
              />
            </div>
          </div>
          <div className="flex justify-end pt-4 gap-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">إلغاء</button>
            <button type="submit" className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">حفظ</button>
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
          <p className="text-lg text-gray-800 font-medium mb-2">هل أنت متأكد من حذف هذا الدومين؟</p>
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