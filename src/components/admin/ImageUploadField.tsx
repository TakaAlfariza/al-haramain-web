"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, AlertCircle } from "lucide-react";
import { compressImage, formatFileSize } from "@/lib/imageCompression";

interface ImageUploadFieldProps {
  name: string;
  label: string;
  currentUrl?: string;
  required?: boolean;
}

export default function ImageUploadField({
  name,
  label,
  currentUrl,
  required = false,
}: ImageUploadFieldProps) {
  const [preview, setPreview] = useState<string>(currentUrl || "");
  const [fileName, setFileName] = useState("");
  const [compressInfo, setCompressInfo] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);

    try {
      const result = await compressImage(file);
      setPreview(result.dataUrl);
      setFileName(file.name);
      setCompressInfo(
        `${formatFileSize(result.originalSize)} → ${formatFileSize(result.compressedSize)}`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memproses gambar.");
      setPreview("");
      setFileName("");
      setCompressInfo("");
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setPreview("");
    setFileName("");
    setCompressInfo("");
    setError("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div>
      <label className="block font-bold text-[#554536] mb-1 text-xs">{label}</label>

      {/* Hidden input to hold the data URL / existing URL for form submission */}
      <input type="hidden" name={name} value={preview} />

      <div className="border-2 border-dashed border-[#DCCBB1] rounded-xl p-4 bg-[#F6F0E6]/30 hover:bg-[#F6F0E6]/60 transition relative">
        {preview ? (
          <div className="flex items-start gap-3">
            <div className="w-20 h-20 rounded-lg overflow-hidden relative bg-[#F6F0E6] flex-shrink-0 border border-[#DCCBB1]/50">
              <Image src={preview} alt="Preview" fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              {fileName && (
                <p className="text-xs font-semibold text-[#554536] truncate">{fileName}</p>
              )}
              {compressInfo && (
                <p className="text-[10px] text-[#867362] mt-0.5">{compressInfo}</p>
              )}
              <button
                type="button"
                onClick={handleClear}
                className="mt-1.5 text-[10px] text-red-600 hover:underline flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Hapus Gambar
              </button>
            </div>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center cursor-pointer py-4">
            {uploading ? (
              <span className="text-xs text-[#867362] animate-pulse">Mengompres gambar...</span>
            ) : (
              <>
                <Upload className="w-6 h-6 text-[#B89A68] mb-1.5" />
                <span className="text-xs font-semibold text-[#554536]">
                  Klik atau seret foto ke sini
                </span>
                <span className="text-[10px] text-[#867362] mt-0.5">
                  JPG, PNG, WebP — Maks. 10 MB (Kompresi otomatis)
                </span>
              </>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
              required={required && !preview}
            />
          </label>
        )}
      </div>

      {error && (
        <div className="mt-1.5 flex items-center gap-1 text-[10px] text-red-600">
          <AlertCircle className="w-3 h-3" />
          {error}
        </div>
      )}
    </div>
  );
}
