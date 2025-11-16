import { useState } from 'react';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Calendar, Clock, MapPin, TrendingUp, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import type { Incident } from '../App';

interface MyReportsProps {
  incidents: Incident[];
}

export default function MyReports({ incidents }: MyReportsProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'progress' | 'resolved'>('all');

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

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Pendiente':
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-300',
          icon: <AlertCircle className="h-4 w-4" />,
          text: 'Pendiente de asignación'
        };
      case 'En Proceso':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-300',
          icon: <Loader2 className="h-4 w-4 animate-spin" />,
          text: 'En proceso de atención'
        };
      case 'Finalizado':
        return {
          color: 'bg-green-100 text-green-800 border-green-300',
          icon: <CheckCircle2 className="h-4 w-4" />,
          text: 'Incidente resuelto'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-300',
          icon: <AlertCircle className="h-4 w-4" />,
          text: status
        };
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
      return `Hace ${diffInMinutes} minutos`;
    }
    if (diffInHours < 24) {
      return `Hace ${diffInHours} horas`;
    }
    if (diffInDays === 1) {
      return 'Hace 1 día';
    }
    return `Hace ${diffInDays} días`;
  };

  const filterIncidents = (status?: string) => {
    if (!status) return incidents;
    return incidents.filter(i => i.status === status);
  };

  const pendingCount = incidents.filter(i => i.status === 'Pendiente').length;
  const progressCount = incidents.filter(i => i.status === 'En Proceso').length;
  const resolvedCount = incidents.filter(i => i.status === 'Finalizado').length;

  const getDisplayedIncidents = () => {
    switch (activeTab) {
      case 'pending':
        return filterIncidents('Pendiente');
      case 'progress':
        return filterIncidents('En Proceso');
      case 'resolved':
        return filterIncidents('Finalizado');
      default:
        return incidents;
    }
  };

  const displayedIncidents = getDisplayedIncidents();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-gray-900 mb-2">Mis Reportes</h2>
        <p className="text-gray-600">
          Visualiza el estado de todos tus reportes en tiempo real
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Total</span>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-gray-900">{incidents.length}</p>
          <p className="text-gray-500">reportes</p>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Pendientes</span>
            <AlertCircle className="h-5 w-5 text-gray-500" />
          </div>
          <p className="text-gray-900">{pendingCount}</p>
          <p className="text-gray-500">esperando</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-700">En Proceso</span>
            <Loader2 className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-blue-900">{progressCount}</p>
          <p className="text-blue-600">en atención</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-700">Resueltos</span>
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-green-900">{resolvedCount}</p>
          <p className="text-green-600">finalizados</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-100">
          <TabsTrigger value="all">Todos ({incidents.length})</TabsTrigger>
          <TabsTrigger value="pending">Pendientes ({pendingCount})</TabsTrigger>
          <TabsTrigger value="progress">En Proceso ({progressCount})</TabsTrigger>
          <TabsTrigger value="resolved">Resueltos ({resolvedCount})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {displayedIncidents.length === 0 ? (
            <div className="bg-white rounded-xl border p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-900 mb-2">No hay reportes en esta categoría</p>
              <p className="text-gray-600">
                Tus reportes aparecerán aquí una vez que los envíes
              </p>
            </div>
          ) : (
            displayedIncidents
              .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
              .map((incident) => {
                const statusConfig = getStatusConfig(incident.status);
                return (
                  <Card key={incident.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3 bg-gradient-to-r from-gray-50 to-white">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <Badge className={getSeverityColor(incident.severity)}>
                              {incident.severity}
                            </Badge>
                            <Badge className={statusConfig.color}>
                              <span className="flex items-center gap-1">
                                {statusConfig.icon}
                                {incident.status}
                              </span>
                            </Badge>
                            <Badge variant="outline" className="bg-white">
                              {incident.assignedArea}
                            </Badge>
                          </div>
                          <CardTitle className="mb-1">{incident.category}</CardTitle>
                          <CardDescription>{incident.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-gray-700">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span>{incident.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span>{formatDate(incident.createdAt)}</span>
                        </div>
                      </div>

                      {/* Status Timeline */}
                      <div className="bg-gray-50 rounded-lg p-4 border">
                        <div className="flex items-center gap-2 text-gray-600 mb-3">
                          <Clock className="h-4 w-4" />
                          <span>Estado actual</span>
                        </div>
                        <div className="flex items-center gap-3">
                          {statusConfig.icon}
                          <div className="flex-1">
                            <p className="text-gray-900">{statusConfig.text}</p>
                            <p className="text-gray-500">{formatTimeAgo(incident.updatedAt)}</p>
                          </div>
                        </div>
                        {incident.status === 'Finalizado' && incident.resolvedAt && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-green-700">
                              ✅ Resuelto por {incident.resolvedBy} el {formatDate(incident.resolvedAt)}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
