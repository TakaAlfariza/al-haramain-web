/**
 * Client-side image compression utility.
 * Resizes images >1920px wide, converts to JPEG/WebP, ensures <10MB.
 */

const MAX_WIDTH = 1920;
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const INITIAL_QUALITY = 0.85;
const MIN_QUALITY = 0.3;

export interface CompressedImage {
  file: File;
  dataUrl: string;
  originalSize: number;
  compressedSize: number;
}

export async function compressImage(file: File): Promise<CompressedImage> {
  if (!file.type.startsWith("image/")) {
    throw new Error("File harus berupa gambar (JPG, PNG, WebP).");
  }

  if (file.size > MAX_SIZE_BYTES) {
    throw new Error("Ukuran file maksimal 10MB. Silakan pilih file yang lebih kecil.");
  }

  const originalSize = file.size;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          const ratio = MAX_WIDTH / width;
          width = MAX_WIDTH;
          height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context tidak tersedia."));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        let quality = INITIAL_QUALITY;
        let dataUrl = canvas.toDataURL("image/jpeg", quality);

        while (dataUrl.length > MAX_SIZE_BYTES && quality > MIN_QUALITY) {
          quality -= 0.1;
          dataUrl = canvas.toDataURL("image/jpeg", quality);
        }

        const byteString = atob(dataUrl.split(",")[1]);
        const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });
        const compressedFile = new File(
          [blob],
          file.name.replace(/\.[^.]+$/, ".jpg"),
          { type: "image/jpeg" }
        );

        resolve({
          file: compressedFile,
          dataUrl,
          originalSize,
          compressedSize: compressedFile.size,
        });
      };
      img.onerror = () => reject(new Error("Gagal memuat gambar."));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Gagal membaca file."));
    reader.readAsDataURL(file);
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}
