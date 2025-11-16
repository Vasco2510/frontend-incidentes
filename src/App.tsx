import { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

export type UserRole = 'Estudiante' | 'Colaborador' | 'Administrativo';

export type WorkArea = 
  | 'Bienestar Estudiantil'
  | 'Counter Alumnos'
  | 'Limpieza'
  | 'Seguridad'
  | 'Servicios Financieros'
  | 'Defensoría Universitaria'
  | 'Mantenimiento e Infraestructura'
  | 'Tecnologías de la Información'
  | 'Servicios Generales'
  | 'Biblioteca'
  | 'Laboratorios';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  workArea?: WorkArea;
  avatar?: string;
}

export interface Incident {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  description: string;
  category: string;
  severity: 'Baja' | 'Media' | 'Alta' | 'Crítica';
  location: string;
  floor?: string;
  assignedArea: WorkArea;
  status: 'Pendiente' | 'En Proceso' | 'Finalizado';
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  resolvedBy?: string;
  imageUrl?: string;
  priority: number; // Auto-calculated based on severity and time
}

// Mock data with more realistic incidents
const mockIncidents: Incident[] = [
  {
    id: '1',
    userId: '101',
    userName: 'María García Pérez',
    userEmail: 'maria.garcia@utec.edu.pe',
    description: 'El baño del piso 7 presenta falta de papel higiénico y los lavamanos están obstruidos',
    category: 'Limpieza y Mantenimiento',
    severity: 'Media',
    location: 'Edificio A - Piso 7',
    floor: '7',
    assignedArea: 'Limpieza',
    status: 'Pendiente',
    createdAt: new Date('2025-11-16T08:30:00'),
    updatedAt: new Date('2025-11-16T08:30:00'),
    priority: 2,
  },
  {
    id: '2',
    userId: '102',
    userName: 'Carlos Mendoza Silva',
    userEmail: 'carlos.mendoza@utec.edu.pe',
    description: 'Fuga de agua considerable en el laboratorio de química. El agua está llegando al pasillo',
    category: 'Infraestructura',
    severity: 'Crítica',
    location: 'Edificio B - Piso 3, Lab. Química',
    floor: '3',
    assignedArea: 'Mantenimiento e Infraestructura',
    status: 'En Proceso',
    createdAt: new Date('2025-11-16T07:15:00'),
    updatedAt: new Date('2025-11-16T07:45:00'),
    priority: 4,
  },
  {
    id: '3',
    userId: '103',
    userName: 'Ana Torres Ramos',
    userEmail: 'ana.torres@utec.edu.pe',
    description: 'La silla 15 del aula 401 tiene una pata rota y es peligrosa para sentarse',
    category: 'Mobiliario',
    severity: 'Media',
    location: 'Edificio A - Piso 4, Aula 401',
    floor: '4',
    assignedArea: 'Servicios Generales',
    status: 'Pendiente',
    createdAt: new Date('2025-11-16T09:00:00'),
    updatedAt: new Date('2025-11-16T09:00:00'),
    priority: 2,
  },
  {
    id: '4',
    userId: '104',
    userName: 'Luis Fernández Ccama',
    userEmail: 'luis.fernandez@utec.edu.pe',
    description: 'El internet en la biblioteca está extremadamente lento y se desconecta constantemente',
    category: 'Tecnología',
    severity: 'Alta',
    location: 'Biblioteca - Piso 2',
    floor: '2',
    assignedArea: 'Tecnologías de la Información',
    status: 'Pendiente',
    createdAt: new Date('2025-11-16T10:20:00'),
    updatedAt: new Date('2025-11-16T10:20:00'),
    priority: 3,
  },
  {
    id: '5',
    userId: '101',
    userName: 'María García Pérez',
    userEmail: 'maria.garcia@utec.edu.pe',
    description: 'Encontré una laptop olvidada en el aula 305 después de clase',
    category: 'Seguridad',
    severity: 'Media',
    location: 'Edificio A - Piso 3, Aula 305',
    floor: '3',
    assignedArea: 'Seguridad',
    status: 'Finalizado',
    createdAt: new Date('2025-11-15T14:30:00'),
    updatedAt: new Date('2025-11-15T16:00:00'),
    resolvedAt: new Date('2025-11-15T16:00:00'),
    resolvedBy: 'Pedro Sánchez',
    priority: 2,
  },
  {
    id: '6',
    userId: '105',
    userName: 'Roberto Díaz Flores',
    userEmail: 'roberto.diaz@utec.edu.pe',
    description: 'El aire acondicionado del laboratorio de electrónica no funciona y hace mucho calor',
    category: 'Infraestructura',
    severity: 'Alta',
    location: 'Edificio C - Piso 2, Lab. Electrónica',
    floor: '2',
    assignedArea: 'Mantenimiento e Infraestructura',
    status: 'En Proceso',
    createdAt: new Date('2025-11-16T11:00:00'),
    updatedAt: new Date('2025-11-16T11:30:00'),
    priority: 3,
  },
];

export default function App() {
  const [currentView, setCurrentView] = useState<'login' | 'register' | 'dashboard'>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);

  const handleLogin = (email: string, password: string) => {
    // Mock login - In production, validate against backend
    const mockUser: User = {
      id: '1',
      name: 'Juan Pérez Rojas',
      email: email,
      role: 'Colaborador',
      workArea: 'Limpieza',
    };
    setCurrentUser(mockUser);
    setCurrentView('dashboard');
  };

  const handleRegister = (name: string, email: string, password: string, role: UserRole, workArea?: WorkArea) => {
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role,
      workArea,
    };
    setCurrentUser(newUser);
    setCurrentView('dashboard');
  };

  const handleReportIncident = (incident: Omit<Incident, 'id' | 'userId' | 'userName' | 'userEmail' | 'status' | 'createdAt' | 'updatedAt' | 'priority'>) => {
    if (!currentUser) return;

    // Calculate priority based on severity
    const priorityMap = { 'Baja': 1, 'Media': 2, 'Alta': 3, 'Crítica': 4 };

    const newIncident: Incident = {
      ...incident,
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      status: 'Pendiente',
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: priorityMap[incident.severity],
    };

    setIncidents([newIncident, ...incidents]);
  };

  const handleUpdateStatus = (incidentId: string, newStatus: 'Pendiente' | 'En Proceso' | 'Finalizado') => {
    setIncidents(incidents.map(inc => {
      if (inc.id === incidentId) {
        const updated: Incident = {
          ...inc,
          status: newStatus,
          updatedAt: new Date(),
        };
        
        if (newStatus === 'Finalizado' && currentUser) {
          updated.resolvedAt = new Date();
          updated.resolvedBy = currentUser.name;
        }
        
        return updated;
      }
      return inc;
    }));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('login');
  };

  if (currentView === 'login') {
    return (
      <Login 
        onLogin={handleLogin}
        onSwitchToRegister={() => setCurrentView('register')}
      />
    );
  }

  if (currentView === 'register') {
    return (
      <Register
        onRegister={handleRegister}
        onSwitchToLogin={() => setCurrentView('login')}
      />
    );
  }

  if (currentView === 'dashboard' && currentUser) {
    return (
      <Dashboard
        user={currentUser}
        incidents={incidents}
        onReportIncident={handleReportIncident}
        onUpdateStatus={handleUpdateStatus}
        onLogout={handleLogout}
      />
    );
  }

  return null;
}
