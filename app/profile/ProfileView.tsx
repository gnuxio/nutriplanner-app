'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getProfile, type ProfileResponse } from '@/lib/api/profile';
import { User } from '@/lib/auth/client';
import AvatarUpload from '@/components/profile/AvatarUpload';
import ChangePasswordModal from '@/components/profile/ChangePasswordModal';
import ProfileInfoCard from '@/components/profile/ProfileInfoCard';
import { GOAL_LABELS } from '@/lib/types/profile';
import {
  User as UserIcon,
  Target,
  MapPin,
  Flame,
  UtensilsCrossed,
  Shield
} from 'lucide-react';

interface ProfileViewProps {
  user: User;
}

export default function ProfileView({ user }: ProfileViewProps) {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProfile();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpdate = (newUrl: string) => {
    setProfile(prev => prev ? { ...prev, avatar_url: newUrl } : null);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'No se encontró el perfil'}</p>
          <button
            onClick={loadProfile}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Reintentar
          </button>
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
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Mi Perfil
          </h1>
          <p className="text-gray-600 mt-2">Gestiona tu información personal</p>
        </motion.div>

        {/* Avatar Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/70 backdrop-blur-xl rounded-3xl border-2 border-gray-200/50 p-8 mb-6 shadow-lg"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <AvatarUpload
              currentAvatarUrl={profile.avatar_url}
              userName={`${profile.name || ''} ${profile.last_name || ''}`.trim() || user.name || 'Usuario'}
              onUploadSuccess={handleAvatarUpdate}
            />
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                {profile.name} {profile.last_name}
              </h2>
              <p className="text-gray-600 mt-1">{user.email}</p>
            </div>
          </div>
        </motion.div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ProfileInfoCard
              title="Información Personal"
              icon={UserIcon}
            >
              <div className="space-y-3">
                {profile.name && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nombre:</span>
                    <span className="font-semibold text-gray-800">{profile.name}</span>
                  </div>
                )}
                {profile.last_name && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Apellido:</span>
                    <span className="font-semibold text-gray-800">{profile.last_name}</span>
                  </div>
                )}
                {profile.country && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">País:</span>
                    <span className="font-semibold text-gray-800 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-600" />
                      {profile.country}
                    </span>
                  </div>
                )}
              </div>
            </ProfileInfoCard>
          </motion.div>

          {/* Fitness Goals Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ProfileInfoCard
              title="Objetivos de Fitness"
              icon={Target}
            >
              <div className="space-y-4">
                {profile.goal && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Objetivo:</span>
                    <span className="font-semibold text-gray-800">
                      {GOAL_LABELS[profile.goal] || profile.goal}
                    </span>
                  </div>
                )}
                {profile.calories && (
                  <div className="mt-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-100">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 text-gray-600 text-sm mb-1">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span>Calorías diarias</span>
                      </div>
                      <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        {profile.calories.toLocaleString()}
                      </div>
                      <div className="text-gray-500 text-sm mt-1">kcal/día</div>
                    </div>
                  </div>
                )}
              </div>
            </ProfileInfoCard>
          </motion.div>

          {/* Preferences Card */}
          {profile.dislikes && profile.dislikes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <ProfileInfoCard
                title="Preferencias Alimenticias"
                icon={UtensilsCrossed}
              >
                <div>
                  <p className="text-gray-600 text-sm mb-3">No me gusta:</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.dislikes.map((item, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm border border-red-100"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </ProfileInfoCard>
            </motion.div>
          )}

          {/* Security Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <ProfileInfoCard
              title="Seguridad"
              icon={Shield}
            >
              <div className="space-y-3">
                <ChangePasswordModal />
                <p className="text-sm text-gray-500 mt-4 text-center">
                  Para cerrar sesión, usa el botón en el menú lateral
                </p>
              </div>
            </ProfileInfoCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
