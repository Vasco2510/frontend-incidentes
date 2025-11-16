import { useState } from 'react';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { CheckCircle2, Calendar, MapPin, User, Search, Award } from 'lucide-react';
import type { Incident, WorkArea } from '../App';

interface ResolvedIncidentsProps {
  workArea: WorkArea;
  incidents: Incident[];
}

export default function ResolvedIncidents({ workArea, incidents }: ResolvedIncidentsProps) {
  const [searchTerm, setSearchTerm] = useState('');

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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-PE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const calculateResolutionTime = (created: Date, resolved: Date) => {
    const diffInMs = resolved.getTime() - created.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `${diffInMinutes} minutos`;
    }
    if (diffInHours < 24) {
      return `${diffInHours} horas`;
    }
    if (diffInDays === 1) {
      return '1 día';
    }
    return `${diffInDays} días`;
  };

  const filteredIncidents = incidents.filter(incident => 
    incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    incident.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    incident.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedIncidents = [...filteredIncidents].sort((a, b) => {
    if (!a.resolvedAt || !b.resolvedAt) return 0;
    return b.resolvedAt.getTime() - a.resolvedAt.getTime();
  });

  // Calculate stats
  const totalResolved = incidents.length;
  const avgResolutionTime = incidents.reduce((acc, inc) => {
    if (inc.resolvedAt) {
      const diff = inc.resolvedAt.getTime() - inc.createdAt.getTime();
      return acc + diff;
    }
    return acc;
  }, 0) / (incidents.length || 1);
  const avgHours = Math.floor(avgResolutionTime / (1000 * 60 * 60));

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-gray-900 mb-2">Reportes Atendidos - {workArea}</h2>
        <p className="text-gray-600">
          Historial de incidentes resueltos por tu equipo
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg border border-green-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-700">Total Resueltos</span>
            <CheckCircle2 className="h-6 w-6 text-green-500" />
          </div>
          <p className="text-green-900">{totalResolved}</p>
          <p className="text-green-600">incidentes completados</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-700">Tiempo Promedio</span>
            <Calendar className="h-6 w-6 text-blue-500" />
          </div>
          <p className="text-blue-900">{avgHours}h</p>
          <p className="text-blue-600">de resolución</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-purple-700">Rendimiento</span>
            <Award className="h-6 w-6 text-purple-500" />
          </div>
          <p className="text-purple-900">
            {avgHours < 24 ? 'Excelente' : avgHours < 48 ? 'Muy Bueno' : 'Bueno'}
          </p>
          <p className="text-purple-600">nivel de respuesta</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Buscar por descripción, ubicación o categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Incidents List */}
      {sortedIncidents.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-900 mb-2">
            {searchTerm ? 'No se encontraron resultados' : 'No hay incidentes resueltos aún'}
          </p>
          <p className="text-gray-600">
            {searchTerm 
              ? 'Intenta con otros términos de búsqueda'
              : 'Los incidentes marcados como finalizados aparecerán aquí'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedIncidents.map((incident) => (
            <Card key={incident.id} className="overflow-hidden bg-gradient-to-r from-white to-green-50 border-l-4 border-l-green-500">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge className="bg-green-100 text-green-800 border-green-300">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Finalizado
                      </Badge>
                      <Badge className={getSeverityColor(incident.severity)}>
                        {incident.severity}
                      </Badge>
                      {incident.resolvedAt && (
                        <Badge variant="outline" className="bg-white">
                          ⏱️ Resuelto en {calculateResolutionTime(incident.createdAt, incident.resolvedAt)}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="mb-1">{incident.category}</CardTitle>
                    <CardDescription className="text-base">{incident.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-gray-700">
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
                </div>

                {/* Resolution Details */}
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                    <div>
                      <p className="text-gray-500 mb-1">📅 Fecha de reporte</p>
                      <p>{formatDate(incident.createdAt)}</p>
                    </div>
                    {incident.resolvedAt && (
                      <div>
                        <p className="text-gray-500 mb-1">✅ Fecha de resolución</p>
                        <p>{formatDate(incident.resolvedAt)}</p>
                      </div>
                    )}
                  </div>
                  {incident.resolvedBy && (
                    <div className="mt-3 pt-3 border-t border-green-200">
                      <p className="text-green-700">
                        Resuelto por: <span className="text-green-900">{incident.resolvedBy}</span>
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination info */}
      {sortedIncidents.length > 0 && (
        <div className="mt-6 text-center text-gray-600">
          Mostrando {sortedIncidents.length} de {incidents.length} incidentes resueltos
        </div>
      )}
    </div>
  );
}
