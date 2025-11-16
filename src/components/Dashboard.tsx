import { useState } from 'react';
import { Bell, LogOut, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import ReportIncident from './ReportIncident';
import MyReports from './MyReports';
import AreaIncidents from './AreaIncidents';
import ResolvedIncidents from './ResolvedIncidents';
import AdminAnalytics from './AdminAnalytics';
import type { User, Incident } from '../App';

interface DashboardProps {
  user: User;
  incidents: Incident[];
  onReportIncident: (incident: Omit<Incident, 'id' | 'userId' | 'userName' | 'userEmail' | 'status' | 'createdAt' | 'updatedAt' | 'priority'>) => void;
  onUpdateStatus: (incidentId: string, status: 'Pendiente' | 'En Proceso' | 'Finalizado') => void;
  onLogout: () => void;
}

type ViewType = 'report' | 'my-reports' | 'area-incidents' | 'resolved' | 'analytics';

export default function Dashboard({ user, incidents, onReportIncident, onUpdateStatus, onLogout }: DashboardProps) {
  const [currentView, setCurrentView] = useState<ViewType>('report');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Calculate notifications
  const myPendingReports = incidents.filter(i => i.userId === user.id && i.status !== 'Finalizado').length;
  const areaPendingIncidents = user.workArea 
    ? incidents.filter(i => i.assignedArea === user.workArea && i.status === 'Pendiente').length 
    : 0;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Estudiante':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Colaborador':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Administrativo':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const navigationItems = [
    { id: 'report', label: 'Reportar Incidente', icon: '📝', roles: ['Estudiante', 'Colaborador', 'Administrativo'] },
    { id: 'my-reports', label: 'Mis Reportes', icon: '📋', roles: ['Estudiante', 'Colaborador', 'Administrativo'], badge: myPendingReports },
    { id: 'area-incidents', label: `Incidentes ${user.workArea || ''}`, icon: '🎯', roles: ['Colaborador'], badge: areaPendingIncidents },
    { id: 'resolved', label: 'Reportes Atendidos', icon: '✅', roles: ['Colaborador'] },
    { id: 'analytics', label: 'Panel de Análisis', icon: '📊', roles: ['Administrativo'] },
  ];

  const visibleNavItems = navigationItems.filter(item => item.roles.includes(user.role));

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl">🚨</span>
              </div>
              <div>
                <h1 className="text-blue-900">AlertaUTEC</h1>
                <p className="text-gray-500">Sistema de Gestión</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {visibleNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id as ViewType);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all
                  ${currentView === item.id
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && item.badge > 0 && (
                  <Badge className="bg-red-500 text-white border-red-600">
                    {item.badge}
                  </Badge>
                )}
              </button>
            ))}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white">
                {getInitials(user.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 truncate">{user.name}</p>
                <p className="text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
            <Badge className={`w-full justify-center mb-3 ${getRoleBadgeColor(user.role)}`}>
              {user.role}
              {user.workArea && ` - ${user.workArea}`}
            </Badge>
            <Button
              onClick={onLogout}
              variant="outline"
              className="w-full text-red-600 border-red-200 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b px-6 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <div>
                <h2 className="text-gray-900">
                  {visibleNavItems.find(item => item.id === currentView)?.label}
                </h2>
                <p className="text-gray-500">
                  {new Date().toLocaleDateString('es-PE', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="h-5 w-5 text-gray-600" />
              {(myPendingReports + areaPendingIncidents) > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          {currentView === 'report' && (
            <ReportIncident onSubmit={onReportIncident} />
          )}
          {currentView === 'my-reports' && (
            <MyReports incidents={incidents.filter(i => i.userId === user.id)} />
          )}
          {currentView === 'area-incidents' && user.workArea && (
            <AreaIncidents
              workArea={user.workArea}
              incidents={incidents.filter(i => i.assignedArea === user.workArea && i.status !== 'Finalizado')}
              onUpdateStatus={onUpdateStatus}
            />
          )}
          {currentView === 'resolved' && user.workArea && (
            <ResolvedIncidents
              workArea={user.workArea}
              incidents={incidents.filter(i => i.assignedArea === user.workArea && i.status === 'Finalizado')}
            />
          )}
          {currentView === 'analytics' && user.role === 'Administrativo' && (
            <AdminAnalytics incidents={incidents} />
          )}
        </main>
      </div>
    </div>
  );
}
