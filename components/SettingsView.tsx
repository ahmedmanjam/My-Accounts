import React from 'react';
import { Download, Upload, Trash2, UserCircle, Save, Briefcase, User } from 'lucide-react';
import { Account, Domain, UserProfile } from '../types';

interface SettingsViewProps {
  accounts: Account[];
  setAccounts: (acc: Account[]) => void;
  domains: Domain[];
  setDomains: (dom: Domain[]) => void;
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ 
  accounts, 
  setAccounts, 
  domains, 
  setDomains,
  userProfile,
  setUserProfile
}) => {

  const handleExport = () => {
    const data = {
      accounts,
      domains,
      userProfile,
      timestamp: new Date().toISOString(),
      app: "My Accounts",
      version: "1.0"
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my_accounts_backup_${new Date().toLocaleDateString('en-GB').replace(/\//g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.app === "My Accounts") {
          if (window.confirm('سيتم استبدال البيانات الحالية بالبيانات المستوردة. هل أنت متأكد؟')) {
            if (Array.isArray(json.accounts)) setAccounts(json.accounts);
            if (Array.isArray(json.domains)) setDomains(json.domains);
            if (json.userProfile) setUserProfile(json.userProfile);
            alert('تم استيراد البيانات بنجاح');
          }
        } else {
          alert('ملف غير صالح، تأكد من أنه ملف نسخ احتياطي خاص بـ My Accounts');
        }
      } catch (error) {
        alert('حدث خطأ أثناء قراءة الملف');
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  const handleClearAll = () => {
    if (window.confirm('تحذير خطير: سيتم حذف جميع الحسابات والدومينات والبيانات الشخصية نهائياً. هل أنت متأكد تماماً؟')) {
      if(window.confirm('تأكيد نهائي للحذف؟')) {
        setAccounts([]);
        setDomains([]);
        setUserProfile({ name: '', phoneNumber: '', email: '', address: '', type: 'personal' });
        localStorage.clear();
        alert('تم تصفير التطبيق بنجاح');
      }
    }
  };

  const handleProfileChange = (key: keyof UserProfile, value: string) => {
    setUserProfile({ ...userProfile, [key]: value });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-10">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">الإعدادات والبيانات</h2>
        <p className="text-gray-500">إدارة الملف الشخصي والنسخ الاحتياطي</p>
      </div>

      {/* User Profile Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <UserCircle className="text-blue-600" size={24} />
          <h3 className="text-lg font-bold text-gray-800">بيانات المالك / الجهة</h3>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Profile Type Selection */}
          <div className="flex gap-6">
            <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all flex-1 ${userProfile.type === 'personal' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:bg-gray-50'}`}>
              <input 
                type="radio" 
                name="profileType" 
                value="personal" 
                checked={userProfile.type === 'personal'}
                onChange={(e) => handleProfileChange('type', 'personal')}
                className="w-4 h-4 text-blue-600"
              />
              <User size={20} />
              <span className="font-medium">حساب شخصي</span>
            </label>

            <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all flex-1 ${userProfile.type === 'business' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:bg-gray-50'}`}>
              <input 
                type="radio" 
                name="profileType" 
                value="business" 
                checked={userProfile.type === 'business'}
                onChange={(e) => handleProfileChange('type', 'business')}
                className="w-4 h-4 text-blue-600"
              />
              <Briefcase size={20} />
              <span className="font-medium">نشاط تجاري / شركة</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {userProfile.type === 'personal' ? 'الاسم بالكامل' : 'اسم النشاط / الشركة'}
              </label>
              <input 
                type="text" 
                value={userProfile.name}
                onChange={(e) => handleProfileChange('name', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
                placeholder={userProfile.type === 'personal' ? 'فلان الفلاني' : 'شركة كذا للبرمجيات'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
              <input 
                type="tel" 
                value={userProfile.phoneNumber}
                onChange={(e) => handleProfileChange('phoneNumber', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
                dir="ltr"
                placeholder="+20 123 456 7890"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
              <input 
                type="email" 
                value={userProfile.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">العنوان</label>
              <input 
                type="text" 
                value={userProfile.address}
                onChange={(e) => handleProfileChange('address', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
                placeholder="المدينة، الدولة، الشارع"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded-lg w-fit">
            <Save size={16} />
            <span>يتم حفظ التعديلات تلقائياً</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Backup Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-blue-600">
            <Download size={24} />
            <h3 className="text-lg font-bold">نسخ احتياطي (تصدير)</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            قم بتحميل ملف يحتوي على جميع حساباتك ودوميناتك وبيانات الملف الشخصي.
          </p>
          <button 
            onClick={handleExport}
            className="w-full py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 font-medium transition-colors"
          >
            تصدير البيانات
          </button>
        </div>

        {/* Restore Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-green-600">
            <Upload size={24} />
            <h3 className="text-lg font-bold">استعادة (استيراد)</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            استرجع بياناتك من ملف نسخ احتياطي سابق. سيتم استبدال البيانات الحالية.
          </p>
          <label className="block w-full text-center py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 font-medium transition-colors cursor-pointer">
            <span>اختيار ملف</span>
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </div>

        {/* Clear Data Card */}
        <div className="bg-white p-6 rounded-xl border border-red-100 shadow-sm md:col-span-2">
          <div className="flex items-center gap-3 mb-4 text-red-600">
            <Trash2 size={24} />
            <h3 className="text-lg font-bold">منطقة الخطر</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
             حذف جميع البيانات من التطبيق (الحسابات، الدومينات، والبيانات الشخصية). لا يمكن التراجع عن هذا الإجراء.
          </p>
          <button 
            onClick={handleClearAll}
            className="w-full sm:w-auto px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
          >
            حذف كل البيانات
          </button>
        </div>
      </div>

      <div className="text-center text-sm text-gray-400 mt-10">
        <p>الإصدار 1.0.1</p>
      </div>
    </div>
  );
};