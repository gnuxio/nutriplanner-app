'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getMenuHistory, createMenu } from '@/lib/api/plans';
import { MenuHistoryItem } from '@/lib/types/plans';
import { User } from '@/lib/auth/client';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import PlanCard from '@/components/plans/PlanCard';
import SearchAndFilters from '@/components/plans/SearchAndFilters';
import EmptyState from '@/components/plans/EmptyState';

interface PlansViewProps {
  user: User;
}

export default function PlansView({ user }: PlansViewProps) {
  const [plans, setPlans] = useState<MenuHistoryItem[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<MenuHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  // Polling para planes en processing
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadPlans();

    // Cleanup polling on unmount
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, []);

  // Aplicar filtros cuando cambien planes, searchTerm o selectedStatus
  useEffect(() => {
    filterPlans();
  }, [plans, searchTerm, selectedStatus]);

  // Setup polling si hay planes en processing
  useEffect(() => {
    const hasProcessing = plans.some(p => p.status === 'processing');

    if (hasProcessing && !pollingInterval) {
      // Poll cada 5 segundos
      const interval = setInterval(() => {
        loadPlansQuietly();
      }, 5000);
      setPollingInterval(interval);
    } else if (!hasProcessing && pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
  }, [plans]);

  const loadPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMenuHistory();
      setPlans(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar planes');
    } finally {
      setLoading(false);
    }
  };

  // Reload sin mostrar loading (para polling)
  const loadPlansQuietly = async () => {
    try {
      const data = await getMenuHistory();
      setPlans(data);
    } catch (err) {
      console.error('Error polling plans:', err);
    }
  };

  const filterPlans = () => {
    let filtered = [...plans];

    // Filtrar por status
    if (selectedStatus) {
      filtered = filtered.filter(p => p.status === selectedStatus);
    }

    // Filtrar por búsqueda de texto
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p => {
        const dateMatch = p.week_start_date.toLowerCase().includes(term);
        const createdMatch = p.created_at.toLowerCase().includes(term);
        return dateMatch || createdMatch;
      });
    }

    // Ordenar por fecha de creación (más recientes primero)
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    setFilteredPlans(filtered);
  };

  const handleCreatePlan = async () => {
    try {
      setIsGenerating(true);
      await createMenu();
      // Recargar inmediatamente para mostrar el plan "processing"
      await loadPlans();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar plan');
    } finally {
      setIsGenerating(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando planes...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && plans.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button
            onClick={loadPlans}
            variant="outline"
            className="shadow-lg"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Mis Planes de Comida
            </h1>
            <p className="text-gray-600 mt-2">
              Historial de tus planes generados
            </p>
          </div>
          {plans.length > 0 && (
            <Button
              onClick={handleCreatePlan}
              disabled={isGenerating}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-500/20 hover:shadow-green-500/40 hover:scale-[1.02] transition-all"
            >
              <Plus className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generando...' : 'Nuevo Plan'}
            </Button>
          )}
        </motion.div>

        {/* Empty State */}
        {plans.length === 0 ? (
          <EmptyState onCreatePlan={handleCreatePlan} isGenerating={isGenerating} />
        ) : (
          <>
            {/* Search and Filters */}
            <SearchAndFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
            />

            {/* Error banner (si hay error pero también datos) */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
              >
                {error}
              </motion.div>
            )}

            {/* Plans Grid */}
            {filteredPlans.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-gray-500">No se encontraron planes con los filtros aplicados</p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlans.map((plan, index) => (
                  <PlanCard key={plan.id} plan={plan} index={index} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
