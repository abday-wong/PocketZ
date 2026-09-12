'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePocketStore } from '@/store/usePocketStore';
import { SavingsGoal, TargetMedia } from '@/types';
import {
  X,
  Upload,
  Camera,
  Link as LinkIcon,
  Trash2,
  Video,
  Image as ImageIcon,
  Check,
} from 'lucide-react';

interface TargetModalProps {
  isOpen: boolean;
  onClose: () => void;
  goalToEdit?: SavingsGoal | null;
}

export function TargetModal({ isOpen, onClose, goalToEdit }: TargetModalProps) {
  const { addGoal, updateGoal } = usePocketStore();

  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [productUrl, setProductUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const [mediaList, setMediaList] = useState<TargetMedia[]>([]);
  const [externalUrl, setExternalUrl] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (goalToEdit) {
      setTitle(goalToEdit.title);
      setTargetAmount(goalToEdit.targetAmount.toString());
      setProductUrl(goalToEdit.productUrl || '');
      setNotes(goalToEdit.notes || '');
      setIsPrimary(goalToEdit.isPrimary);
      setMediaList(goalToEdit.media || []);
    } else {
      setTitle('');
      setTargetAmount('');
      setProductUrl('');
      setNotes('');
      setIsPrimary(false);
      setMediaList([]);
    }
  }, [goalToEdit, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const isVideo = file.type.startsWith('video/');
      const reader = new FileReader();

      reader.onload = (event) => {
        const resultUrl = event.target?.result as string;
        if (resultUrl) {
          const newMedia: TargetMedia = {
            id: 'media-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 4),
            type: isVideo ? 'video' : 'image',
            url: resultUrl,
            name: file.name,
            createdAt: new Date().toISOString(),
          };
          setMediaList((prev) => [...prev, newMedia]);
        }
      };

      reader.readAsDataURL(file);
    });

    // Reset input value so same file can be chosen again if needed
    e.target.value = '';
  };

  const handleAddExternalUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!externalUrl.trim()) return;

    const isVideo = externalUrl.endsWith('.mp4') || externalUrl.endsWith('.webm');
    const newMedia: TargetMedia = {
      id: 'media-' + Date.now().toString(36),
      type: isVideo ? 'video' : 'image',
      url: externalUrl.trim(),
      name: 'External Media',
      createdAt: new Date().toISOString(),
    };

    setMediaList((prev) => [...prev, newMedia]);
    setExternalUrl('');
  };

  const handleRemoveMedia = (id: string) => {
    setMediaList((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseInt(targetAmount, 10);
    if (!title.trim() || !amountNum || amountNum <= 0) return;

    if (goalToEdit) {
      updateGoal(goalToEdit.id, {
        title: title.trim(),
        targetAmount: amountNum,
        productUrl: productUrl.trim() || undefined,
        notes: notes.trim() || undefined,
        isPrimary,
        media: mediaList,
      });
    } else {
      addGoal({
        title: title.trim(),
        targetAmount: amountNum,
        productUrl: productUrl.trim() || undefined,
        notes: notes.trim() || undefined,
        isPrimary,
        media: mediaList,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-zinc-100">
            {goalToEdit ? 'Edit Target Barang' : 'Tambah Target Barang Baru'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-mono font-medium text-zinc-400 mb-1">
              Nama Barang / Target *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Sony WH-1000XM5 Black"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:border-lime-400 focus:outline-none"
            />
          </div>

          {/* Target Amount */}
          <div>
            <label className="block text-xs font-mono font-medium text-zinc-400 mb-1">
              Harga Target (Rp) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 font-mono text-xs text-zinc-500">Rp</span>
              <input
                type="number"
                required
                min="10000"
                step="5000"
                placeholder="4500000"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-10 py-2.5 font-mono text-xs text-zinc-100 placeholder-zinc-600 focus:border-lime-400 focus:outline-none tabular-nums"
              />
            </div>
          </div>

          {/* Media Section (Photos / Videos) */}
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono font-semibold text-zinc-300">
                Media Barang (Visual Motivasi)
              </label>
              <span className="text-[10px] font-mono text-zinc-500">
                {mediaList.length} media terpasang
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mb-3">
              Upload foto asli atau video unboxing pendek (MP4/GIF) agar kamu selalu ingat tujuan
              menabung.
            </p>

            {/* Media Upload Buttons */}
            <div className="flex flex-wrap gap-2">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/mp4,video/webm"
                onChange={handleFileUpload}
                className="hidden"
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/70 px-3 py-1.5 text-xs font-mono text-zinc-300 hover:bg-zinc-700 transition-colors"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Pilih File (Foto/Video)</span>
              </button>

              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/70 px-3 py-1.5 text-xs font-mono text-zinc-300 hover:bg-zinc-700 transition-colors"
              >
                <Camera className="h-3.5 w-3.5" />
                <span>Kamera Langsung</span>
              </button>
            </div>

            {/* Paste URL */}
            <div className="mt-3 flex gap-2">
              <input
                type="url"
                placeholder="Atau tempel URL gambar (https://...)"
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-[11px] text-zinc-200 placeholder-zinc-600 focus:border-lime-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddExternalUrl}
                disabled={!externalUrl.trim()}
                className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-mono text-zinc-200 hover:bg-zinc-700 disabled:opacity-40 transition-colors"
              >
                Pasang URL
              </button>
            </div>

            {/* Media Thumbnails Grid */}
            {mediaList.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {mediaList.map((m, idx) => (
                  <div
                    key={m.id}
                    className="group relative aspect-square overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900"
                  >
                    {m.type === 'video' ? (
                      <video src={m.url} className="h-full w-full object-cover" />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.url} alt={`Media ${idx}`} className="h-full w-full object-cover" />
                    )}

                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => handleRemoveMedia(m.id)}
                        className="rounded p-1 text-red-400 hover:bg-red-500/20"
                        title="Hapus media"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="absolute bottom-1 left-1 rounded bg-black/70 px-1 text-[9px] font-mono text-zinc-300">
                      {m.type === 'video' ? <Video className="inline h-2.5 w-2.5" /> : <ImageIcon className="inline h-2.5 w-2.5" />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product URL */}
          <div>
            <label className="block text-xs font-mono font-medium text-zinc-400 mb-1">
              Link Toko Online (Opsional)
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-3.5 top-3 h-3.5 w-3.5 text-zinc-500" />
              <input
                type="url"
                placeholder="https://tokopedia.com/... atau https://shopee.co.id/..."
                value={productUrl}
                onChange={(e) => setProductUrl(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 pl-9 pr-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:border-lime-400 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-mono font-medium text-zinc-400 mb-1">
              Catatan / Motivasi Pribadi (Opsional)
            </label>
            <textarea
              rows={2}
              placeholder="Mengapa barang ini penting untuk kamu beli?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-lime-400 focus:outline-none"
            />
          </div>

          {/* Set as Primary Target Checkbox */}
          <div className="flex items-center gap-2.5 pt-1">
            <input
              type="checkbox"
              id="isPrimary"
              checked={isPrimary}
              onChange={(e) => setIsPrimary(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-lime-400 focus:ring-lime-400"
            />
            <label htmlFor="isPrimary" className="text-xs font-mono text-zinc-300 cursor-pointer">
              Jadikan Target Utama (Hero di Beranda)
            </label>
          </div>

          {/* Submit */}
          <div className="mt-6 flex justify-end gap-2 border-t border-zinc-800/80 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-800 px-4 py-2.5 font-mono text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-xl bg-lime-400 px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-zinc-950 hover:bg-lime-300 transition-colors"
            >
              {goalToEdit ? 'Simpan Perubahan' : 'Buat Target'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
