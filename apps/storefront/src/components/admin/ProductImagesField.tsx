"use client";

import { useRef, useState } from "react";

const MAX_IMAGES = 5;

export function ProductImagesField({ existingImages }: { existingImages: string[] }) {
  const [removed, setRemoved] = useState<Set<string>>(new Set());
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const keptCount = existingImages.filter((u) => !removed.has(u)).length;
  const remainingSlots = Math.max(0, MAX_IMAGES - keptCount - newFiles.length);

  function syncInputFiles(files: File[]) {
    const dt = new DataTransfer();
    files.forEach((f) => dt.items.add(f));
    if (inputRef.current) inputRef.current.files = dt.files;
  }

  function addFiles(list: FileList | null) {
    if (!list || list.length === 0) return;
    const incoming = Array.from(list).filter((f) => f.type.startsWith("image/"));
    const next = [...newFiles, ...incoming].slice(0, MAX_IMAGES - keptCount);
    setNewFiles(next);
    syncInputFiles(next);
  }

  function removeNewFile(index: number) {
    const next = newFiles.filter((_, i) => i !== index);
    setNewFiles(next);
    syncInputFiles(next);
  }

  function toggleRemoveExisting(url: string) {
    setRemoved((prev) => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url);
      else next.add(url);
      return next;
    });
  }

  return (
    <div>
      <span className="text-sm font-semibold text-azul-confianza">
        Imágenes (máximo {MAX_IMAGES})
      </span>

      {existingImages.length > 0 && (
        <div className="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-5">
          {existingImages.map((url) => {
            const isRemoved = removed.has(url);
            return (
              <div key={url} className="relative">
                <input type="hidden" name="existingImages" value={url} />
                <div
                  className={`rounded-lg border p-1 ${
                    isRemoved
                      ? "border-red-300 opacity-40"
                      : "border-azul-confianza/15"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- viene del bucket de Storage, dominio dinámico */}
                  <img
                    src={url}
                    alt=""
                    className="aspect-square w-full rounded object-contain"
                  />
                </div>
                <label className="mt-1 flex items-center justify-center gap-1 text-xs text-red-600">
                  <input
                    type="checkbox"
                    name="removeImages"
                    value={url}
                    checked={isRemoved}
                    onChange={() => toggleRemoveExisting(url)}
                  />
                  Quitar
                </label>
              </div>
            );
          })}
        </div>
      )}

      {newFiles.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-5">
          {newFiles.map((file, i) => (
            <div key={`${file.name}-${i}`} className="relative">
              <div className="rounded-lg border border-aqua-bienestar/50 p-1">
                {/* eslint-disable-next-line @next/next/no-img-element -- preview local antes de subir */}
                <img
                  src={URL.createObjectURL(file)}
                  alt=""
                  className="aspect-square w-full rounded object-contain"
                />
              </div>
              <button
                type="button"
                onClick={() => removeNewFile(i)}
                className="mt-1 w-full text-xs font-semibold text-red-600"
              >
                Quitar (nueva)
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        onClick={() => remainingSlots > 0 && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (remainingSlots > 0) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (remainingSlots > 0) addFiles(e.dataTransfer.files);
        }}
        className={`mt-3 flex min-h-[96px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center text-sm transition-colors ${
          remainingSlots === 0
            ? "cursor-not-allowed border-gris-pizarra/20 text-gris-pizarra/40"
            : dragOver
              ? "border-azul-confianza bg-azul-confianza/5 text-azul-confianza"
              : "border-azul-confianza/25 text-gris-pizarra"
        }`}
      >
        {remainingSlots === 0 ? (
          <span>Ya tienes {MAX_IMAGES} imágenes — quita alguna para agregar otra.</span>
        ) : (
          <span>
            Arrastra imágenes aquí o haz click para elegir
            <br />
            ({remainingSlots} espacio{remainingSlots === 1 ? "" : "s"} disponible
            {remainingSlots === 1 ? "" : "s"})
          </span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        name="newImages"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => addFiles(e.target.files)}
      />
    </div>
  );
}
