'use client';

import { motion } from 'framer-motion';
import { MenuHistoryItem, STATUS_LABELS, STATUS_BADGE_STYLES } from '@/lib/types/plans';
import { Calendar, Flame, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

interface PlanCardProps {
  plan: MenuHistoryItem;
  index: number;
}

export default function PlanCard({ plan, index }: PlanCardProps) {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Loader2 className="w-3 h-3 animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const handleClick = () => {
    if (plan.status === 'completed') {
      router.push(`/plans/${plan.id}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={handleClick}
      className={plan.status === 'completed' ? 'cursor-pointer' : ''}
    >
      <Card className="bg-white/70 backdrop-blur-xl border-2 border-gray-200/50 hover:shadow-xl hover:border-green-300/50 transition-all">
        <CardHeader>
          <CardTitle className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/20">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Semana del {formatDate(plan.week_start_date)}
                </div>
                <div className="text-xs text-gray-500 mt-1 font-normal">
                  Creado el {formatDate(plan.created_at)}
                </div>
              </div>
            </div>
            <Badge className={STATUS_BADGE_STYLES[plan.status]}>
              <div className="flex items-center gap-1">
                {getStatusIcon(plan.status)}
                <span>{STATUS_LABELS[plan.status]}</span>
              </div>
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm">Total semanal:</span>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {plan.calories_total.toLocaleString()} kcal
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
