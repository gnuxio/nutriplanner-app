'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Camera, Loader2 } from 'lucide-react';
import { uploadAvatar } from '@/lib/api/profile';

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  userName: string;
  onUploadSuccess: (url: string) => void;
}

export default function AvatarUpload({
  currentAvatarUrl,
  userName,
  onUploadSuccess
}: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // File validation
  const validateFile = (file: File): boolean => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!validTypes.includes(file.type)) {
      setError('Solo se permiten imágenes JPG, PNG o WebP');
      return false;
    }

    if (file.size > maxSize) {
      setError('La imagen no debe superar 5MB');
      return false;
    }

    return true;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (!validateFile(file)) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    try {
      setUploading(true);
      const { avatar_url } = await uploadAvatar(file);
      onUploadSuccess(avatar_url);
      setPreview(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir imagen');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  // Generate initials for default avatar
  const initials = userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        {/* Avatar Display */}
        <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg relative">
          {preview || currentAvatarUrl ? (
            <Image
              src={preview || currentAvatarUrl || ''}
              alt="Avatar"
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-3xl font-bold">
              {initials}
            </div>
          )}
        </div>

        {/* Upload Overlay */}
        {!uploading && (
          <label className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center">
            <Camera className="w-8 h-8 text-white" />
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
              disabled={uploading}
            />
          </label>
        )}

        {/* Loading Spinner */}
        {uploading && (
          <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg border border-red-100">
          {error}
        </p>
      )}

      {/* Upload Instructions */}
      <p className="text-sm text-gray-500 text-center">
        {uploading ? 'Subiendo imagen...' : 'Clic en la imagen para cambiar tu foto'}
      </p>
    </div>
  );
}
