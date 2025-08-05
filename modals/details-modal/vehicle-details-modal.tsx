"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/formatters";
import {
  IconCar,
  IconCalendar,
  IconSettings,
  IconMaximize,
} from "@tabler/icons-react";
import { getImageUrl } from "@/lib/image-utils";
import { VehicleDetailsModalProps } from "@/utils/interfaces";
import { FullscreenImageViewer } from "./components/fullscreen-image-viewer";
import { VehicleDetailsGrid } from "./components/vehicle-details-grid";
import { truncateDescription, shouldShowReadMore } from "@/utils/helpers";

export function VehicleDetailsModal({
  vehicle,
  isOpen,
  onClose,
}: VehicleDetailsModalProps) {
  const [fullscreenImageIndex, setFullscreenImageIndex] = useState<number | null>(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  if (!vehicle) return null;

  const handleImageClick = (index: number) => {
    setFullscreenImageIndex(index);
  };

  const handleCloseFullscreen = () => {
    setFullscreenImageIndex(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[100vh] overflow-y-auto bg-card border rounded-2xl shadow-xl">
        <DialogHeader className="space-y-4 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <IconCar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-foreground">
                {vehicle.marca} {vehicle.modelo}
              </DialogTitle>
              <DialogDescription className="text-base mt-1">
                Año {vehicle.ano} • Detalles completos del vehículo
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Photos Section with Carousel */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg text-foreground">
                  Galería de Fotos
                </h3>
                {vehicle.fotos && vehicle.fotos.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {vehicle.fotos.length} {vehicle.fotos.length === 1 ? "foto" : "fotos"}
                  </Badge>
                )}
              </div>

              {vehicle.fotos && vehicle.fotos.length > 0 ? (
                <div className="relative">
                  <Carousel
                    className="w-full"
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                  >
                    <CarouselContent>
                      {vehicle.fotos.map((foto, index) => (
                        <CarouselItem key={foto.id}>
                          <div
                            className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted border border-border shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group"
                            onClick={() => handleImageClick(index)}
                          >
                            <Image
                              src={getImageUrl(foto.storage_path)}
                              alt={`${vehicle.marca} ${vehicle.modelo} - Foto ${index + 1}`}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              priority={foto.is_primary}
                              width={600}
                              height={450}
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />

                            {/* Photo Indicators */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                            {/* Primary Badge */}
                            {foto.is_primary && (
                              <div className="absolute top-3 left-3">
                                <Badge className="bg-primary/90 hover:bg-primary text-primary-foreground border-0 shadow-lg">
                                  Principal
                                </Badge>
                              </div>
                            )}

                            {/* Zoom Indicator */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-2">
                                <IconMaximize className="h-5 w-5 text-gray-800" />
                              </div>
                            </div>

                            {/* Photo Counter */}
                            <div className="absolute bottom-3 right-3">
                              <Badge
                                variant="secondary"
                                className="bg-background/80 text-foreground border border-border/50 backdrop-blur-sm"
                              >
                                {index + 1} de {vehicle?.fotos?.length}
                              </Badge>
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>

                    {/* Navigation Buttons */}
                    <CarouselPrevious className="left-4 bg-background/90 hover:bg-background border-border/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200" />
                    <CarouselNext className="right-4 bg-background/90 hover:bg-background border-border/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200" />
                  </Carousel>

                  {/* Thumbnail Navigation */}
                  {vehicle.fotos && vehicle.fotos.length > 1 && (
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                      {vehicle.fotos.map((foto, index) => (
                        <div
                          key={`thumb-${foto.id}`}
                          className="relative flex-shrink-0 w-16 h-12 rounded-md overflow-hidden border-2 border-border hover:border-primary transition-colors cursor-pointer"
                        >
                          <Image
                            src={getImageUrl(foto.storage_path)}
                            alt={`Miniatura ${index + 1}`}
                            className="w-full h-full object-cover"
                            width={64}
                            height={48}
                          />
                          {foto.is_primary && (
                            <div className="absolute inset-0 ring-2 ring-primary ring-offset-1" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-80 bg-muted/50 rounded-xl border-2 border-dashed border-border">
                  <div className="text-center p-6">
                    <div className="p-4 bg-muted rounded-full w-fit mx-auto mb-4">
                      <IconCar className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h4 className="font-medium text-foreground mb-2">
                      Sin fotos disponibles
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      No se han cargado imágenes para este vehículo
                    </p>
                  </div>
                </div>
              )}

              {/* Description Section - Full Width */}
              <div className="space-y-3">
                <h4 className="font-semibold text-lg text-foreground flex items-center gap-2">
                  <IconCar className="h-5 w-5" />
                  Descripción del Vehículo
                </h4>
                <div className="p-6 bg-gradient-to-br from-muted/30 to-muted/20 rounded-xl border border-border/50">
                  {vehicle.descripcion && vehicle.descripcion.trim() !== "" ? (
                    <div className="space-y-3">
                      <p className="whitespace-pre-wrap leading-relaxed text-base text-foreground">
                        {shouldShowReadMore(vehicle.descripcion) && !isDescriptionExpanded
                          ? `${truncateDescription(vehicle.descripcion)}...`
                          : vehicle.descripcion}
                      </p>
                      
                      {shouldShowReadMore(vehicle.descripcion) && (
                        <button
                          onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                          className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
                        >
                          {isDescriptionExpanded ? (
                            <>
                              <span>Leer menos</span>
                              <svg className="w-3 h-3 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            </>
                          ) : (
                            <>
                              <span>Leer más</span>
                              <svg className="w-3 h-3 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap leading-relaxed text-base text-muted-foreground italic">
                      No hay descripción disponible para este vehículo
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg text-foreground">
                  Información del Vehículo
                </h3>
              </div>

              <div className="space-y-6">
                {/* Price Section - Enhanced with Blue Theme */}
                <div className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-800/50 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-blue-500/20 rounded-xl">
                      <IconSettings className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <span className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                        Precio de Venta
                      </span>
                      <p className="text-sm text-blue-600 dark:text-blue-400">
                        Precio final del vehículo
                      </p>
                    </div>
                  </div>
                  <div className="bg-white/70 dark:bg-blue-950/30 rounded-xl p-6 border border-blue-200/50 dark:border-blue-800/30">
                    <div className="text-4xl font-black text-blue-700 dark:text-blue-300 tracking-tight">
                      {new Intl.NumberFormat("es-AR", {
                        style: "currency",
                        currency: vehicle.moneda === "USD" ? "USD" : "ARS",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(vehicle.precio)}
                    </div>
                    <div className="mt-2 text-sm text-blue-600 dark:text-blue-400 font-medium">
                      {vehicle.moneda === "USD" ? "Dólares Americanos" : "Pesos Argentinos"}
                    </div>
                  </div>
                </div>

                {/* Vehicle Details Grid */}
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">
                    Especificaciones Técnicas
                  </h4>
                  <VehicleDetailsGrid vehicle={vehicle} />
                </div>

                {/* Metadata */}
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <IconCalendar className="h-4 w-4" />
                    <span>Creado el {formatDate(vehicle.created_at!)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fullscreen Image Viewer */}
        {vehicle.fotos && fullscreenImageIndex !== null && (
          <FullscreenImageViewer
            images={vehicle.fotos}
            currentIndex={fullscreenImageIndex}
            isOpen={fullscreenImageIndex !== null}
            onClose={handleCloseFullscreen}
            vehicleTitle={`${vehicle.marca} ${vehicle.modelo}`}
          />
        )}

        <DialogFooter className="pt-6 border-t border-border">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 sm:flex-none"
            >
              Cerrar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}