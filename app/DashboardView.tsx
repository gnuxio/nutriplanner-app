'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { getMenuHistory, getMenuById } from '@/lib/api/plans';
import { MenuHistoryItem, MenuDetail, Day } from '@/lib/types/plans';
import { User } from '@/lib/auth/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  ChevronRight,
  CheckCircle2,
  Circle,
  Clock,
  Flame,
  UtensilsCrossed
} from 'lucide-react';

interface DashboardViewProps {
  user: User;
}

export default function DashboardView({ user }: DashboardViewProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activePlan, setActivePlan] = useState<MenuDetail | null>(null);
  const [todayData, setTodayData] = useState<Day | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadActivePlan();
  }, []);

  const loadActivePlan = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener historial de planes
      const history = await getMenuHistory();

      // Encontrar el plan más reciente completado
      const completedPlans = history.filter(p => p.status === 'completed');
      if (completedPlans.length === 0) {
        setActivePlan(null);
        setTodayData(null);
        return;
      }

      // Ordenar por fecha de creación (más reciente primero)
      completedPlans.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      const latestPlan = completedPlans[0];

      // Obtener detalles completos del plan
      const planDetails = await getMenuById(latestPlan.id);
      setActivePlan(planDetails);

      // Determinar qué día de la semana es hoy (0 = Domingo, 1 = Lunes, etc.)
      const today = new Date().getDay();

      // Encontrar el día correspondiente en el plan
      // Asumiendo que planDetails.days[0] = Lunes, days[1] = Martes, etc.
      // Ajustamos el índice: Domingo (0) -> 6, Lunes (1) -> 0, etc.
      const dayIndex = today === 0 ? 6 : today - 1;

      if (planDetails.days && planDetails.days[dayIndex]) {
        setTodayData(planDetails.days[dayIndex]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar plan activo');
    } finally {
      setLoading(false);
    }
  };

  const formatTodayDate = () => {
    const today = new Date();
    const dayName = today.toLocaleDateString('es-ES', { weekday: 'long' });
    const dayNumber = today.getDate();
    return `${dayName.charAt(0).toUpperCase() + dayName.slice(1)} ${dayNumber}`;
  };

  const formatWeekDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    });
  };

  const getMealIcon = (index: number, totalMeals: number) => {
    // Simulación simple de estado de comidas basado en la hora del día
    const now = new Date().getHours();

    if (index === 0 && now >= 9) return 'completed'; // Desayuno después de las 9am
    if (index === 1 && now >= 14) return 'completed'; // Almuerzo después de las 2pm
    if (index === 2 && now >= 20) return 'completed'; // Cena después de las 8pm
    if (index === totalMeals - 1 && now >= 22) return 'completed'; // Última comida después de las 10pm

    // Si es la siguiente comida pendiente
    if ((index === 0 && now < 9) ||
        (index === 1 && now >= 9 && now < 14) ||
        (index === 2 && now >= 14 && now < 20) ||
        (index === totalMeals - 1 && now >= 20 && now < 22)) {
      return 'current';
    }

    return 'pending';
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Bienvenido, {user?.name || user?.email}</p>
        </motion.div>

        {/* No Active Plan State */}
        {!activePlan || !todayData ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/70 backdrop-blur-xl rounded-3xl border-2 border-gray-200/50 p-12 text-center shadow-lg"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
              <UtensilsCrossed className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              No tienes un plan activo
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Genera tu primer plan de comidas personalizado para comenzar a seguir tu menú diario
            </p>
            <Button
              onClick={() => router.push('/plans')}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-500/20 hover:shadow-green-500/40 hover:scale-[1.02] transition-all"
            >
              Ir a Planes
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        ) : (
          <>
            {/* HOY - Main Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-white/70 backdrop-blur-xl border-2 border-gray-200/50 shadow-xl mb-6 overflow-hidden">
                <CardContent className="p-0">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 md:p-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="text-white/80 text-sm font-medium">HOY</div>
                          <div className="text-white text-xl md:text-2xl font-bold">
                            {formatTodayDate()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-white/90 text-sm">
                      Plan activo: Semana {formatWeekDate(activePlan.week_start_date)}
                    </div>
                  </div>

                  {/* Today's Meals */}
                  <div className="p-6 md:p-8">
                    <div className="space-y-3 mb-6">
                      {todayData.meals.map((meal, index) => {
                        const status = getMealIcon(index, todayData.meals.length);

                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-green-200 transition-all"
                          >
                            <div className="flex items-center gap-3">
                              {status === 'completed' ? (
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                              ) : status === 'current' ? (
                                <Clock className="w-5 h-5 text-orange-500" />
                              ) : (
                                <Circle className="w-5 h-5 text-gray-300" />
                              )}
                              <div>
                                <div className="font-semibold text-gray-800">{meal.type}</div>
                                <div className="text-sm text-gray-500">{meal.name}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-green-600">{meal.calories}</div>
                              <div className="text-xs text-gray-500">kcal</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Daily Calories Progress */}
                    <div className="p-5 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border-2 border-orange-100 mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Flame className="w-5 h-5 text-orange-500" />
                          <span className="font-semibold">Calorías del día</span>
                        </div>
                      </div>
                      <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold text-gray-800">
                          {todayData.meals.reduce((sum, meal) => sum + meal.calories, 0).toLocaleString()}
                        </span>
                        <span className="text-xl text-gray-500 mb-1">kcal</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <Button
                      onClick={() => router.push(`/plans/${activePlan.id}`)}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-500/20 hover:shadow-green-500/40 hover:scale-[1.02] transition-all text-lg py-6"
                    >
                      Ver menú de hoy
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Stats - Simplified */}
            <div className="grid grid-cols-2 gap-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-white/40 backdrop-blur-sm border border-gray-200/40 hover:bg-white/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="text-xs text-gray-500 mb-1">Comidas hoy</div>
                    <div className="text-2xl font-semibold text-gray-700">
                      {todayData.meals.length}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <Card className="bg-white/40 backdrop-blur-sm border border-gray-200/40 hover:bg-white/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="text-xs text-gray-500 mb-1">Plan semanal</div>
                    <div className="text-2xl font-semibold text-gray-700">
                      {activePlan.calories_total.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">kcal totales</div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
