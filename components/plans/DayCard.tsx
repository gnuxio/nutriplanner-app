'use client';

import { motion } from 'framer-motion';
import { Day, MEAL_TYPE_STYLES } from '@/lib/types/plans';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame } from 'lucide-react';

interface DayCardProps {
  day: Day;
  index: number;
}

export default function DayCard({ day, index }: DayCardProps) {
  const totalCalories = day.meals.reduce((sum, meal) => sum + meal.calories, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="bg-white/70 backdrop-blur-xl border-2 border-gray-200/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {day.name}
            </span>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="font-bold">{totalCalories}</span>
              <span>kcal</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {day.meals.map((meal, mealIndex) => (
              <div
                key={mealIndex}
                className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <Badge className={MEAL_TYPE_STYLES[meal.type] || 'bg-gray-100 text-gray-700'}>
                      {meal.type}
                    </Badge>
                    <h4 className="font-semibold text-gray-800 mt-2">{meal.name}</h4>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Calorías</div>
                    <div className="text-lg font-bold text-green-600">{meal.calories}</div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-xs text-gray-500 mb-2">Ingredientes:</div>
                  <div className="flex flex-wrap gap-2">
                    {meal.ingredients.map((ingredient, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full border border-green-100"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
