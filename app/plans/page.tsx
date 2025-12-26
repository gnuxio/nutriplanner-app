'use client';

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import PlansView from "./PlansView";

export default function PlansPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <PlansView user={user!} />
    </ProtectedRoute>
  );
}
