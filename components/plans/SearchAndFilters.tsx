'use client';

import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MENU_STATUS, STATUS_LABELS } from '@/lib/types/plans';

interface SearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedStatus: string | null;
  onStatusChange: (status: string | null) => void;
}

export default function SearchAndFilters({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange
}: SearchAndFiltersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white/70 backdrop-blur-xl rounded-3xl border-2 border-gray-200/50 p-6 mb-6"
    >
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Buscar por nombre de platillo..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2">
          <Filter className="text-gray-500 w-5 h-5" />
          <div className="flex gap-2">
            <Badge
              onClick={() => onStatusChange(null)}
              className={`cursor-pointer transition-all ${
                selectedStatus === null
                  ? 'bg-green-500 text-white border-green-500'
                  : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
              }`}
            >
              Todos
            </Badge>
            {Object.values(MENU_STATUS).map((status) => (
              <Badge
                key={status}
                onClick={() => onStatusChange(status === selectedStatus ? null : status)}
                className={`cursor-pointer transition-all ${
                  selectedStatus === status
                    ? 'bg-green-500 text-white border-green-500'
                    : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                }`}
              >
                {STATUS_LABELS[status]}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
