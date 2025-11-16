import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Clock, MapPin } from 'lucide-react';
import type { Incident, WorkArea } from '../App';

interface AdminAnalyticsProps {
  incidents: Incident[];
}

export default function AdminAnalytics({ incidents }: AdminAnalyticsProps) {
  // Calculate stats by area
  const areaStats = incidents.reduce((acc, incident) => {
    const area = incident.assignedArea;
    if (!acc[area]) {
      acc[area] = {
        total: 0,
        pending: 0,
        inProgress: 0,
        resolved: 0,
        critical: 0,
        avgResolutionTime: 0,
      };
    }
    acc[area].total++;
    if (incident.status === 'Pendiente') acc[area].pending++;
    if (incident.status === 'En Proceso') acc[area].inProgress++;
    if (incident.status === 'Finalizado') acc[area].resolved++;
    if (incident.severity === 'Crítica' || incident.severity === 'Alta') acc[area].critical++;
    
    return acc;
  }, {} as Record<WorkArea, any>);

  // Calculate location hotspots
  const locationStats = incidents.reduce((acc, incident) => {
    const location = incident.location.split(',')[0].trim(); // Get first part of location
    acc[location] = (acc[location] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topLocations = Object.entries(locationStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([location, count]) => ({ location, count }));

  // Prepare data for charts
  const areaChartData = Object.entries(areaStats).map(([area, stats]) => ({
    area: area.length > 20 ? area.substring(0, 20) + '...' : area,
    fullArea: area,
    Pendientes: stats.pending,
    'En Proceso': stats.inProgress,
    Resueltos: stats.resolved,
    Total: stats.total,
  }));

  const severityData = [
    { name: 'Baja', value: incidents.filter(i => i.severity === 'Baja').length, color: '#22c55e' },
    { name: 'Media', value: incidents.filter(i => i.severity === 'Media').length, color: '#eab308' },
    { name: 'Alta', value: incidents.filter(i => i.severity === 'Alta').length, color: '#f97316' },
    { name: 'Crítica', value: incidents.filter(i => i.severity === 'Crítica').length, color: '#ef4444' },
  ];

  const statusData = [
    { name: 'Pendiente', value: incidents.filter(i => i.status === 'Pendiente').length, color: '#9ca3af' },
    { name: 'En Proceso', value: incidents.filter(i => i.status === 'En Proceso').length, color: '#3b82f6' },
    { name: 'Finalizado', value: incidents.filter(i => i.status === 'Finalizado').length, color: '#22c55e' },
  ];

  // Calculate overall stats
  const totalIncidents = incidents.length;
  const resolvedIncidents = incidents.filter(i => i.status === 'Finalizado').length;
  const pendingIncidents = incidents.filter(i => i.status === 'Pendiente').length;
  const criticalIncidents = incidents.filter(i => i.severity === 'Crítica').length;
  const resolutionRate = totalIncidents > 0 ? ((resolvedIncidents / totalIncidents) * 100).toFixed(1) : 0;

  // Calculate avg resolution time
  const resolvedWithTime = incidents.filter(i => i.status === 'Finalizado' && i.resolvedAt);
  const avgResolutionTime = resolvedWithTime.length > 0
    ? resolvedWithTime.reduce((acc, inc) => {
        if (inc.resolvedAt) {
          return acc + (inc.resolvedAt.getTime() - inc.createdAt.getTime());
        }
        return acc;
      }, 0) / resolvedWithTime.length
    : 0;
  const avgHours = Math.floor(avgResolutionTime / (1000 * 60 * 60));

  // Find most problematic areas
  const problematicAreas = Object.entries(areaStats)
    .map(([area, stats]) => ({
      area,
      criticalRate: stats.total > 0 ? (stats.critical / stats.total) * 100 : 0,
      pendingRate: stats.total > 0 ? (stats.pending / stats.total) * 100 : 0,
      total: stats.total,
    }))
    .sort((a, b) => b.criticalRate - a.criticalRate)
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-gray-900 mb-2">Panel de Análisis Administrativo</h2>
        <p className="text-gray-600">
          Vista completa del sistema de incidentes y análisis de puntos críticos
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-3">
            <CardDescription className="text-blue-700">Total de Incidentes</CardDescription>
            <CardTitle className="text-blue-900">{totalIncidents}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-blue-700">
              <TrendingUp className="h-4 w-4" />
              <span>Sistema activo</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-3">
            <CardDescription className="text-green-700">Tasa de Resolución</CardDescription>
            <CardTitle className="text-green-900">{resolutionRate}%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle2 className="h-4 w-4" />
              <span>{resolvedIncidents} resueltos</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-3">
            <CardDescription className="text-orange-700">Tiempo Promedio</CardDescription>
            <CardTitle className="text-orange-900">{avgHours}h</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-orange-700">
              <Clock className="h-4 w-4" />
              <span>de resolución</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="pb-3">
            <CardDescription className="text-red-700">Incidentes Críticos</CardDescription>
            <CardTitle className="text-red-900">{criticalIncidents}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-4 w-4" />
              <span>requieren atención</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="areas" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-100">
          <TabsTrigger value="areas">Por Área</TabsTrigger>
          <TabsTrigger value="severity">Por Gravedad</TabsTrigger>
          <TabsTrigger value="locations">Puntos Críticos</TabsTrigger>
          <TabsTrigger value="insights">Análisis</TabsTrigger>
        </TabsList>

        {/* By Area */}
        <TabsContent value="areas">
          <Card>
            <CardHeader>
              <CardTitle>Distribución de Incidentes por Área</CardTitle>
              <CardDescription>
                Comparación de incidentes pendientes, en proceso y resueltos por cada área
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={areaChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="area" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-4 rounded-lg shadow-lg border">
                              <p className="font-semibold mb-2">{data.fullArea}</p>
                              {payload.map((entry: any) => (
                                <p key={entry.name} style={{ color: entry.color }}>
                                  {entry.name}: {entry.value}
                                </p>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Bar dataKey="Pendientes" stackId="a" fill="#9ca3af" />
                    <Bar dataKey="En Proceso" stackId="a" fill="#3b82f6" />
                    <Bar dataKey="Resueltos" stackId="a" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* By Severity */}
        <TabsContent value="severity">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribución por Gravedad</CardTitle>
                <CardDescription>
                  Clasificación de incidentes según su nivel de severidad
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={severityData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {severityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribución por Estado</CardTitle>
                <CardDescription>
                  Estado actual de todos los incidentes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Critical Locations */}
        <TabsContent value="locations">
          <Card>
            <CardHeader>
              <CardTitle>Puntos Críticos en el Campus</CardTitle>
              <CardDescription>
                Ubicaciones con mayor cantidad de incidentes reportados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topLocations.map((loc, index) => (
                  <div key={loc.location} className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${
                      index === 0 ? 'bg-red-500' :
                      index === 1 ? 'bg-orange-500' :
                      index === 2 ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">{loc.location}</span>
                        </div>
                        <Badge variant="outline">{loc.count} incidentes</Badge>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(loc.count / topLocations[0].count) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights */}
        <TabsContent value="insights">
          <div className="space-y-6">
            {/* Problematic Areas */}
            <Card>
              <CardHeader>
                <CardTitle>Áreas con Mayor Criticidad</CardTitle>
                <CardDescription>
                  Áreas que requieren mayor atención basado en el porcentaje de incidentes críticos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {problematicAreas.map((area, index) => (
                    <div key={area.area} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                          </div>
                          <div>
                            <h4 className="text-gray-900">{area.area}</h4>
                            <p className="text-gray-500">Total: {area.total} incidentes</p>
                          </div>
                        </div>
                        <Badge className={`
                          ${area.criticalRate > 50 ? 'bg-red-100 text-red-800 border-red-200' :
                            area.criticalRate > 30 ? 'bg-orange-100 text-orange-800 border-orange-200' :
                            'bg-yellow-100 text-yellow-800 border-yellow-200'}
                        `}>
                          {area.criticalRate.toFixed(0)}% críticos
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-500 mb-1">Incidentes críticos/altos</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-red-500 h-2 rounded-full"
                                style={{ width: `${area.criticalRate}%` }}
                              />
                            </div>
                            <span className="text-gray-700">{area.criticalRate.toFixed(0)}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-1">Pendientes</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-orange-500 h-2 rounded-full"
                                style={{ width: `${area.pendingRate}%` }}
                              />
                            </div>
                            <span className="text-gray-700">{area.pendingRate.toFixed(0)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900">Recomendaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-blue-900">
                  {pendingIncidents > 10 && (
                    <li className="flex items-start gap-2">
                      <span className="text-xl">⚠️</span>
                      <span>Hay {pendingIncidents} incidentes pendientes. Considera asignar más recursos a las áreas con mayor carga.</span>
                    </li>
                  )}
                  {avgHours > 48 && (
                    <li className="flex items-start gap-2">
                      <span className="text-xl">⏰</span>
                      <span>El tiempo promedio de resolución es de {avgHours} horas. Implementa procesos de priorización más efectivos.</span>
                    </li>
                  )}
                  {topLocations.length > 0 && topLocations[0].count > 5 && (
                    <li className="flex items-start gap-2">
                      <span className="text-xl">📍</span>
                      <span>La ubicación "{topLocations[0].location}" tiene {topLocations[0].count} incidentes. Considera una inspección preventiva.</span>
                    </li>
                  )}
                  {criticalIncidents > 5 && (
                    <li className="flex items-start gap-2">
                      <span className="text-xl">🚨</span>
                      <span>Hay {criticalIncidents} incidentes críticos. Prioriza su atención inmediata para garantizar la seguridad del campus.</span>
                    </li>
                  )}
                  <li className="flex items-start gap-2">
                    <span className="text-xl">✅</span>
                    <span>Mantén comunicación constante con las áreas. La transparencia mejora la eficiencia del sistema.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
