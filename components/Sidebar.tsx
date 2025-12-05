import React from 'react';
import { Users, Globe, Settings, LogOut } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, isOpen, toggleSidebar }) => {
  const menuItems = [
    { id: 'accounts', label: 'الحسابات', icon: Users },
    { id: 'domains', label: 'الدومينات', icon: Globe },
    { id: 'settings', label: 'الإعدادات', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:shadow-none border-l border-gray-200
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="p-6 flex flex-col items-center justify-center border-b border-gray-100">
            <div className="w-24 h-24 mb-3 rounded-full overflow-hidden border-4 border-blue-50 shadow-sm">
                <img 
                  src="https://f.top4top.io/p_3625mmnq81.png" 
                  alt="My Accounts Logo" 
                  className="w-full h-full object-cover"
                />
            </div>
            <h1 className="text-xl font-bold text-gray-800">My Accounts</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id as ViewState);
                    if (window.innerWidth < 1024) toggleSidebar();
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Footer Info */}
          <div className="p-4 border-t border-gray-100 text-center text-xs text-gray-500">
            <p className="mb-1 font-semibold">DeepLook 2025 ©</p>
            <p>تطوير: <a href="https://hamzahilal.art" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline font-bold">HAMZA Hilal</a></p>
          </div>
        </div>
      </aside>
    </>
  );
};