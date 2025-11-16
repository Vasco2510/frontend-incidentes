import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AlertCircle, Calendar, MapPin, User } from 'lucide-react';
import type { Incident } from '../App';

interface MyTasksProps {
  incidents: Incident[];
  onUpdateStatus: (incidentId: string, status: 'Pendiente' | 'En atención' | 'Terminado') => void;
}

export default function MyTasks({ incidents, onUpdateStatus }: MyTasksProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'débil':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'moderado':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'fuerte':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendiente':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'En atención':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Terminado':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-PE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const pendingCount = incidents.filter(i => i.status === 'Pendiente').length;
  const inProgressCount = incidents.filter(i => i.status === 'En atención').length;
  const completedCount = incidents.filter(i => i.status === 'Terminado').length;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-blue-900 mb-2">Mis Tareas</h1>
        <p className="text-gray-600">
          Gestiona los incidentes asignados a tu equipo
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">Pendientes</p>
              <p className="text-gray-900">{pendingCount}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">En Atención</p>
              <p className="text-gray-900">{inProgressCount}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">Completadas</p>
              <p className="text-gray-900">{completedCount}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      {incidents.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-900 mb-2">No hay incidentes asignados</p>
          <p className="text-gray-600">
            Los incidentes reportados en tu área aparecerán aquí
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {incidents.map((incident) => (
            <Card key={incident.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getSeverityColor(incident.severity)}>
                        {incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)}
                      </Badge>
                      <Badge className={getStatusColor(incident.status)}>
                        {incident.status}
                      </Badge>
                    </div>
                    <CardTitle className="mb-1">{incident.category}</CardTitle>
                    <CardDescription>{incident.description}</CardDescription>
                  </div>
                  
                  <Select
                    value={incident.status}
                    onValueChange={(value) => onUpdateStatus(incident.id, value as 'Pendiente' | 'En atención' | 'Terminado')}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pendiente">Pendiente</SelectItem>
                      <SelectItem value="En atención">En atención</SelectItem>
                      <SelectItem value="Terminado">Terminado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{incident.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span>Reportado por: {incident.userName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{formatDate(incident.createdAt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
