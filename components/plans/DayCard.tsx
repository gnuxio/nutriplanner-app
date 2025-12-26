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
          <div className="space-y-5">
            {day.meals.map((meal, mealIndex) => (
              <div
                key={mealIndex}
                className="p-5 rounded-2xl bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 hover:border-gray-200 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <Badge className={`${MEAL_TYPE_STYLES[meal.type] || 'bg-gray-100 text-gray-700'} text-sm px-3 py-1`}>
                      {meal.type}
                    </Badge>
                    <h4 className="font-bold text-gray-800 mt-3 text-lg">{meal.name}</h4>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-sm text-gray-500 mb-1">Calorías</div>
                    <div className="text-2xl font-bold text-green-600">{meal.calories}</div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-sm font-medium text-gray-600 mb-3">Ingredientes:</div>
                  <div className="flex flex-wrap gap-2">
                    {meal.ingredients.map((ingredient, i) => (
                      <span
                        key={i}
                        className="text-sm px-3 py-1.5 bg-green-50 text-green-700 rounded-full border border-green-200 font-medium"
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
