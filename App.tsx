import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { Account, Domain, ViewState, UserProfile } from './types';
import { Sidebar } from './components/Sidebar';
import { AccountView } from './components/AccountView';
import { DomainView } from './components/DomainView';
import { SettingsView } from './components/SettingsView';

const App: React.FC = () => {
  // --- State for Accounts ---
  const [accounts, setAccounts] = useState<Account[]>(() => {
    try {
      const saved = localStorage.getItem('my_accounts_data');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Error loading accounts", e);
      return [];
    }
  });

  // --- State for Domains ---
  const [domains, setDomains] = useState<Domain[]>(() => {
    try {
      const saved = localStorage.getItem('my_domains_data');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Error loading domains", e);
      return [];
    }
  });

  // --- State for User Profile ---
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('my_accounts_profile');
      return saved ? JSON.parse(saved) : {
        name: '',
        phoneNumber: '',
        email: '',
        address: '',
        type: 'personal'
      };
    } catch (e) {
      console.error("Error loading profile", e);
      return { name: '', phoneNumber: '', email: '', address: '', type: 'personal' };
    }
  });

  // --- Persistence Effects ---
  
  // Save Accounts
  useEffect(() => {
    localStorage.setItem('my_accounts_data', JSON.stringify(accounts));
  }, [accounts]);

  // Save Domains
  useEffect(() => {
    localStorage.setItem('my_domains_data', JSON.stringify(domains));
  }, [domains]);

  // Save User Profile
  useEffect(() => {
    localStorage.setItem('my_accounts_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  // --- UI State ---
  const [currentView, setCurrentView] = useState<ViewState>('accounts');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (currentView) {
      case 'accounts':
        return <AccountView accounts={accounts} setAccounts={setAccounts} />;
      case 'domains':
        return <DomainView domains={domains} setDomains={setDomains} />;
      case 'settings':
        return (
          <SettingsView 
            accounts={accounts} 
            setAccounts={setAccounts} 
            domains={domains} 
            setDomains={setDomains}
            userProfile={userProfile}
            setUserProfile={setUserProfile}
          />
        );
      default:
        return <AccountView accounts={accounts} setAccounts={setAccounts} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Sidebar */}
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-50">
                <img src="https://f.top4top.io/p_3625mmnq81.png" alt="Logo" className="w-full h-full object-cover"/>
             </div>
             <span className="font-bold text-gray-800">My Accounts</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* Content Scrollable Area */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;