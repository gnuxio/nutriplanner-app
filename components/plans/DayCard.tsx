'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Day, MEAL_TYPE_STYLES } from '@/lib/types/plans';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, ChevronDown, ChevronUp } from 'lucide-react';

interface DayCardProps {
  day: Day;
  index: number;
}

export default function DayCard({ day, index }: DayCardProps) {
  const totalCalories = day.meals.reduce((sum, meal) => sum + meal.calories, 0);
  const [expandedMeals, setExpandedMeals] = useState<Set<number>>(new Set());

  const toggleMeal = (mealIndex: number) => {
    setExpandedMeals(prev => {
      const newSet = new Set(prev);
      if (newSet.has(mealIndex)) {
        newSet.delete(mealIndex);
      } else {
        newSet.add(mealIndex);
      }
      return newSet;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <Card className="bg-white/70 backdrop-blur-xl border-2 border-gray-200/50 hover:shadow-xl hover:border-green-300/50 transition-all">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {day.name}
            </span>
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-100">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="font-bold text-lg">{totalCalories}</span>
              <span className="text-gray-600">kcal</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {day.meals.map((meal, mealIndex) => {
              const isExpanded = expandedMeals.has(mealIndex);

              return (
                <div
                  key={mealIndex}
                  className="rounded-2xl bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 hover:border-green-200 transition-all overflow-hidden"
                >
                  {/* Clickeable header */}
                  <button
                    onClick={() => toggleMeal(mealIndex)}
                    className="w-full p-4 md:p-5 flex items-center justify-between gap-4 text-left hover:bg-white/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <Badge className={`${MEAL_TYPE_STYLES[meal.type] || 'bg-gray-100 text-gray-700'} text-xs md:text-sm px-2 md:px-3 py-1 mb-2`}>
                        {meal.type}
                      </Badge>
                      <h4 className="font-bold text-gray-800 text-base md:text-lg truncate">{meal.name}</h4>
                    </div>

                    <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
                      <div className="text-right">
                        <div className="text-xs md:text-sm text-gray-500 mb-0.5">Calorías</div>
                        <div className="text-xl md:text-2xl font-bold text-green-600">{meal.calories}</div>
                      </div>
                      <div className="w-6 h-6 flex items-center justify-center text-gray-400">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Collapsible ingredients */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-4 md:px-5 pb-4 md:pb-5 pt-2 border-t border-gray-100">
                          <div className="text-xs md:text-sm font-medium text-gray-600 mb-3">Ingredientes:</div>
                          <div className="flex flex-wrap gap-2">
                            {meal.ingredients.map((ingredient, i) => (
                              <span
                                key={i}
                                className="text-xs md:text-sm px-2 md:px-3 py-1 md:py-1.5 bg-green-50 text-green-700 rounded-full border border-green-200 font-medium"
                              >
                                {ingredient}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
