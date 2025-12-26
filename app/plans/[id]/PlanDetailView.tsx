'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { getMenuById } from '@/lib/api/plans';
import { MenuDetail, STATUS_LABELS, STATUS_BADGE_STYLES } from '@/lib/types/plans';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Flame, Loader2 } from 'lucide-react';
import DayCard from '@/components/plans/DayCard';

interface PlanDetailViewProps {
  planId: string;
}

export default function PlanDetailView({ planId }: PlanDetailViewProps) {
  const router = useRouter();
  const [plan, setPlan] = useState<MenuDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPlan();
  }, [planId]);

  const loadPlan = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMenuById(planId);
      setPlan(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar plan');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando plan...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !plan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'No se encontró el plan'}</p>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={() => router.push('/plans')}
              variant="outline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a planes
            </Button>
            <Button onClick={loadPlan} className="bg-green-600 hover:bg-green-700 text-white">
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button
            onClick={() => router.push('/plans')}
            variant="outline"
            className="shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a planes
          </Button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-xl rounded-3xl border-2 border-gray-200/50 p-8 mb-8 shadow-lg"
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/20">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Semana del {formatDate(plan.week_start_date)}
                </h1>
                <p className="text-gray-600 mt-1">
                  Creado el {formatDate(plan.created_at)}
                </p>
              </div>
            </div>
            <Badge className={STATUS_BADGE_STYLES[plan.status]}>
              {STATUS_LABELS[plan.status]}
            </Badge>
          </div>

          {/* Total Calories */}
          <div className="mt-6 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-700">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="font-semibold">Total Semanal:</span>
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {plan.calories_total.toLocaleString()} kcal
              </div>
            </div>
          </div>
        </motion.div>

        {/* Days List */}
        {plan.status === 'completed' && plan.days && plan.days.length > 0 ? (
          <div className="flex flex-col gap-6">
            {plan.days.map((day, index) => (
              <DayCard key={index} day={day} index={index} />
            ))}
          </div>
        ) : plan.status === 'processing' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Generando tu plan de comidas...
            </h3>
            <p className="text-gray-600">Esto puede tomar unos minutos</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-gray-600">No hay detalles disponibles para este plan</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
