import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  FileText, 
  BarChart3, 
  Settings,
  Heart
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/appointments', icon: Calendar, label: 'Appointments' },
    { path: '/patients', icon: Users, label: 'Patients' },
    { path: '/prescriptions', icon: FileText, label: 'Prescriptions' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-gray-200 z-30">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Heart className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">DocSona</h1>
            <p className="text-sm text-gray-500">Doctor Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;