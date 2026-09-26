import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { 
  UploadCloud, 
  Image as ImageIcon, 
  X, 
  Loader2, 
  CheckCircle2, 
  Link as LinkIcon, 
  AlertCircle,
  FileImage
} from 'lucide-react';
import { uploadImageFile } from '../../utils/api';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
  helpText?: string;
  onNotify?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  required = false,
  helpText = 'Format JPG, PNG, WEBP, GIF, SVG (Maks. 10 MB)',
  onNotify
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showManualUrl, setShowManualUrl] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProcessFile = async (file: File) => {
    // 1. Validate file size (10 MB max)
    const maxBytes = 10 * 1024 * 1024;
    if (file.size > maxBytes) {
      const err = `Ukuran file ${(file.size / (1024 * 1024)).toFixed(1)} MB melebihi batas maksimum 10 MB.`;
      setUploadError(err);
      if (onNotify) onNotify(err, 'error');
      return;
    }

    // 2. Validate MIME type
    if (!file.type.startsWith('image/')) {
      const err = 'File yang dipilih bukan gambar yang valid.';
      setUploadError(err);
      if (onNotify) onNotify(err, 'error');
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const result = await uploadImageFile(file);
      // Update form state with uploaded image path (e.g. /uploads/sgc_...)
      onChange(result.url);
      if (onNotify) {
        onNotify(`Gambar "${file.name}" berhasil diunggah ke server!`, 'success');
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      const msg = err.message || 'Gagal mengunggah file gambar ke hosting.';
      setUploadError(msg);
      if (onNotify) onNotify(msg, 'error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleProcessFile(files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleProcessFile(files[0]);
    }
  };

  const isLocalUpload = value && value.startsWith('/uploads/');

  return (
    <div className="space-y-2">
      {/* Label & Top Bar */}
      <div className="flex items-center justify-between">
        <label className="block text-slate-300 font-semibold text-xs flex items-center gap-1.5">
          <FileImage className="w-3.5 h-3.5 text-amber-500" />
          <span>{label}</span>
          {required && <span className="text-rose-500 font-bold">*</span>}
        </label>

        <button
          type="button"
          onClick={() => setShowManualUrl(!showManualUrl)}
          className="text-[11px] text-amber-400 hover:text-amber-300 font-medium transition-colors flex items-center gap-1 cursor-pointer"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showManualUrl ? 'Sembunyikan URL manual' : 'Atau input link URL'}</span>
        </button>
      </div>

      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Image Preview Card (if value exists) */}
      {value ? (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center gap-4 relative overflow-hidden group">
          {/* Thumbnail preview */}
          <div className="relative w-full sm:w-28 h-28 rounded-xl bg-slate-900 overflow-hidden border border-slate-800 shrink-0">
            <img
              src={value}
              alt="Preview"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                // fallback placeholder if image cannot be loaded
                (e.target as any).src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400';
              }}
            />
            {isLocalUpload && (
              <div className="absolute top-1.5 left-1.5 bg-emerald-500/90 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs uppercase">
                Hosting
              </div>
            )}
          </div>

          {/* Details & Actions */}
          <div className="flex-1 min-w-0 w-full space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                isLocalUpload 
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-slate-800 text-slate-300 border border-slate-700'
              }`}>
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                {isLocalUpload ? 'File Server Hostinger' : 'URL Eksternal'}
              </span>
              <span className="text-[11px] text-slate-400 font-mono truncate max-w-[240px]">
                {value}
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Gambar siap digunakan dan otomatis tersimpan saat Anda menekan tombol simpan formulir.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Mengunggah...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Ganti File Gambar</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => onChange('')}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Hapus</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Upload Dropzone */
        <div
          onClick={() => !isUploading && fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-amber-400 bg-amber-500/10'
              : 'border-slate-800 hover:border-amber-500/50 bg-slate-950/60 hover:bg-slate-900/40'
          } ${isUploading ? 'opacity-70 pointer-events-none' : ''}`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center py-3 space-y-2">
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
              <div className="text-xs font-bold text-white">Sedang mengunggah gambar ke server Hostinger...</div>
              <div className="text-[11px] text-slate-400">Menyimpan ke folder public/uploads/</div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-2 space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center transition-transform group-hover:scale-110">
                <UploadCloud className="w-6 h-6" />
              </div>

              <div>
                <span className="text-xs font-bold text-white block">
                  Klik untuk pilih file gambar atau seret (drag & drop) ke sini
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  {helpText}
                </span>
              </div>

              <div className="pt-1">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-amber-400 text-xs font-semibold shadow-xs">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Pilih dari Laptop / HP</span>
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Manual URL Input Fallback (Toggleable) */}
      {showManualUrl && (
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 space-y-1.5 animate-in fade-in duration-200">
          <label className="block text-[11px] font-semibold text-slate-400">
            Atau masukkan link URL gambar (misal Unsplash atau CDN lain):
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://images.unsplash.com/... atau /uploads/..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <div className="flex items-center gap-1.5 text-rose-400 text-xs bg-rose-950/30 border border-rose-900/50 p-2.5 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
};
