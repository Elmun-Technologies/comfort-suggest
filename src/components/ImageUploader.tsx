'use client';

import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, X } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (base64Image: string | null) => void;
}

export default function ImageUploader({ onImageSelected }: ImageUploaderProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Canvas orqali rasmni siqish
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.78);
          setImagePreview(compressedDataUrl);
          onImageSelected(compressedDataUrl);
        }
        setIsCompressing(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    onImageSelected(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
        id="image-file-input"
      />

      {!imagePreview ? (
        <label
          htmlFor="image-file-input"
          className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 active:scale-[0.99] border border-slate-700/80 rounded-2xl flex items-center justify-center gap-3 transition-all text-slate-200 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform">
            <Camera className="w-5 h-5" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-slate-100">
              {isCompressing ? 'Rasm yuklanmoqda...' : 'Rasm yoki brak suratini biriktirish'}
            </p>
            <p className="text-xs text-slate-400">Tovardagi nuqson, brak yoki chek suratini qoʻshing</p>
          </div>
        </label>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 group">
          <img
            src={imagePreview}
            alt="Biriktirilgan rasm"
            className="w-full h-48 object-cover rounded-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end justify-between p-3">
            <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900/80 px-2.5 py-1 rounded-lg backdrop-blur-sm">
              <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
              <span>Rasm biriktirildi</span>
            </div>
            <button
              type="button"
              onClick={removeImage}
              className="p-2 bg-rose-600/90 hover:bg-rose-600 text-white rounded-xl shadow-lg transition-transform active:scale-95"
              title="Rasmni o'chirish"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
