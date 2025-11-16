import { useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AlertTriangle, Calendar, Clock, MapPin, User, ArrowUpCircle } from 'lucide-react';
import type { Incident, WorkArea } from '../App';

interface AreaIncidentsProps {
  workArea: WorkArea;
  incidents: Incident[];
  onUpdateStatus: (incidentId: string, status: 'Pendiente' | 'En Proceso' | 'Finalizado') => void;
}

export default function AreaIncidents({ workArea, incidents, onUpdateStatus }: AreaIncidentsProps) {
  const [sortBy, setSortBy] = useState<'date' | 'priority'>('priority');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Baja':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Media':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Alta':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Crítica':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendiente':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'En Proceso':
        return 'bg-blue-100 text-blue-800 border-blue-300';
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

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `Hace ${diffInMinutes}m`;
    }
    if (diffInHours < 24) {
      return `Hace ${diffInHours}h`;
    }
    return `Hace ${diffInDays}d`;
  };

  const sortedIncidents = [...incidents].sort((a, b) => {
    if (sortBy === 'priority') {
      // Sort by priority (higher first), then by date (newer first)
      if (b.priority !== a.priority) {
        return b.priority - a.priority;
      }
      return b.createdAt.getTime() - a.createdAt.getTime();
    }
    // Sort by date only (newer first)
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  const pendingCount = incidents.filter(i => i.status === 'Pendiente').length;
  const progressCount = incidents.filter(i => i.status === 'En Proceso').length;
  const criticalCount = incidents.filter(i => i.severity === 'Crítica' || i.severity === 'Alta').length;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-gray-900">Incidentes de {workArea}</h2>
          {criticalCount > 0 && (
            <Badge className="bg-red-500 text-white border-red-600 animate-pulse">
              {criticalCount} urgentes
            </Badge>
          )}
        </div>
        <p className="text-gray-600">
          Gestiona los incidentes asignados a tu área. Los reportes marcados como "Finalizado" se moverán a Reportes Atendidos.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-orange-700">Pendientes</span>
            <AlertTriangle className="h-6 w-6 text-orange-500" />
          </div>
          <p className="text-orange-900">{pendingCount}</p>
          <p className="text-orange-600">requieren asignación</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-700">En Proceso</span>
            <Clock className="h-6 w-6 text-blue-500" />
          </div>
          <p className="text-blue-900">{progressCount}</p>
          <p className="text-blue-600">en atención</p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-red-700">Críticos/Altos</span>
            <ArrowUpCircle className="h-6 w-6 text-red-500" />
          </div>
          <p className="text-red-900">{criticalCount}</p>
          <p className="text-red-600">prioridad alta</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-gray-700">Ordenar por:</span>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'date' | 'priority')}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="priority">Prioridad</SelectItem>
              <SelectItem value="date">Fecha</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-gray-600">
          {incidents.length} incidentes activos
        </div>
      </div>

      {/* Incidents List */}
      {incidents.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✅</span>
          </div>
          <p className="text-gray-900 mb-2">¡Excelente trabajo!</p>
          <p className="text-gray-600">
            No hay incidentes pendientes en este momento. Todos los reportes han sido atendidos.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedIncidents.map((incident) => (
            <Card key={incident.id} className="overflow-hidden hover:shadow-lg transition-all border-l-4" style={{
              borderLeftColor: incident.severity === 'Crítica' ? '#ef4444' : 
                               incident.severity === 'Alta' ? '#f97316' :
                               incident.severity === 'Media' ? '#eab308' : '#22c55e'
            }}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge className={getSeverityColor(incident.severity)}>
                        {incident.severity}
                      </Badge>
                      <Badge className={getStatusColor(incident.status)}>
                        {incident.status}
                      </Badge>
                      <span className="text-gray-500">
                        {formatTimeAgo(incident.createdAt)}
                      </span>
                    </div>
                    <CardTitle className="mb-1">{incident.category}</CardTitle>
                    <CardDescription className="text-base">{incident.description}</CardDescription>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Select
                      value={incident.status}
                      onValueChange={(value) => onUpdateStatus(incident.id, value as 'Pendiente' | 'En Proceso' | 'Finalizado')}
                    >
                      <SelectTrigger className="w-[160px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pendiente">Pendiente</SelectItem>
                        <SelectItem value="En Proceso">En Proceso</SelectItem>
                        <SelectItem value="Finalizado">Finalizado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-gray-500">Ubicación</p>
                      <p>{incident.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-gray-500">Reportado por</p>
                      <p>{incident.userName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-gray-500">Fecha</p>
                      <p>{formatDate(incident.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons based on status */}
                {incident.status === 'Pendiente' && (
                  <div className="mt-4 pt-4 border-t">
                    <Button
                      onClick={() => onUpdateStatus(incident.id, 'En Proceso')}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Comenzar Atención
                    </Button>
                  </div>
                )}
                {incident.status === 'En Proceso' && (
                  <div className="mt-4 pt-4 border-t">
                    <Button
                      onClick={() => onUpdateStatus(incident.id, 'Finalizado')}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      Marcar como Finalizado
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
