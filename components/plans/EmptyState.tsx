'use client';

import { motion } from 'framer-motion';
import { UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onCreatePlan: () => void;
  isGenerating: boolean;
}

export default function EmptyState({ onCreatePlan, isGenerating }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center mb-6">
        <UtensilsCrossed className="w-12 h-12 text-green-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-2">No hay planes todavía</h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">
        Comienza generando tu primer plan de comidas personalizado basado en tus objetivos
      </p>
      <Button
        onClick={onCreatePlan}
        disabled={isGenerating}
        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-500/20 hover:shadow-green-500/40 hover:scale-[1.02] transition-all"
      >
        {isGenerating ? 'Generando plan...' : 'Generar mi primer plan'}
      </Button>
    </motion.div>
  );
}
