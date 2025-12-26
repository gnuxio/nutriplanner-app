'use client';

import { ProtectedRoute } from "@/components/ProtectedRoute";
import PlanDetailView from "./PlanDetailView";
import { use } from 'react';

interface PlanDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function PlanDetailPage({ params }: PlanDetailPageProps) {
  const { id } = use(params);

  return (
    <ProtectedRoute>
      <PlanDetailView planId={id} />
    </ProtectedRoute>
  );
}
