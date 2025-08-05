"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { IconX } from "@tabler/icons-react";
import {
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { getImageUrl } from "@/lib/image-utils";
import { FullscreenImageViewerProps } from "@/utils/interfaces";

export function FullscreenImageViewer({
  images,
  currentIndex,
  isOpen,
  onClose,
  vehicleTitle,
}: FullscreenImageViewerProps) {
  const [activeIndex, setActiveIndex] =
    useState(currentIndex);

  if (!isOpen || !images.length)
    return null;

  const handlePrevious = () => {
    setActiveIndex((prev) =>
      prev === 0
        ? images.length - 1
        : prev - 1,
    );
  };

  const handleNext = () => {
    setActiveIndex((prev) =>
      prev === images.length - 1
        ? 0
        : prev + 1,
    );
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-0 overflow-hidden">
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle>
              Visor de imágenes en
              pantalla completa -{" "}
              {vehicleTitle}
            </DialogTitle>
          </VisuallyHidden>
        </DialogHeader>

        <div className="relative w-full h-[95vh] flex items-center justify-center">
          {/* Close Button */}
          {/*<Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white border-0"
          >
            <IconX className="h-6 w-6" />
          </Button>*/}

          {/* Image Counter */}
          <div className="absolute top-4 left-4 z-50">
            <Badge className="bg-black/50 text-white border-0 backdrop-blur-sm">
              {activeIndex + 1} de{" "}
              {images.length}
            </Badge>
          </div>

          {/* Main Image */}
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={getImageUrl(
                images[activeIndex]
                  .storage_path,
              )}
              alt={`${vehicleTitle} - Foto ${activeIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              width={1920}
              height={1080}
              priority
            />
          </div>

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-0 size-12"
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-0 size-12"
              >
                <ArrowRight className="h-6 w-6" />
              </Button>
            </>
          )}

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto">
              {images.map(
                (image, index) => (
                  <button
                    key={
                      image.id || index
                    }
                    onClick={() =>
                      setActiveIndex(
                        index,
                      )
                    }
                    className={`relative flex-shrink-0 w-16 h-12 rounded-md overflow-hidden border-2 transition-all ${
                      index ===
                      activeIndex
                        ? "border-blue-500 ring-2 ring-blue-500/50"
                        : "border-white/30 hover:border-white/60"
                    }`}
                  >
                    <Image
                      src={getImageUrl(
                        image.storage_path,
                      )}
                      alt={`Miniatura ${index + 1}`}
                      className="w-full h-full object-cover"
                      width={64}
                      height={48}
                    />
                  </button>
                ),
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
