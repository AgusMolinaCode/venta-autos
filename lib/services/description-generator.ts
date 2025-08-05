/**
 * Basic Description Generator Service
 * Simple POST request to external service with form data
 */

import type { VehicleFormData } from "@/components/dashboard-admin/VehicleInfoFormComponents/types/VehicleFormTypes";

// Service response interface
interface DescriptionResponse {
  success: boolean;
  descripcion?: string;
  error?: string;
}

// Configuration
const DESCRIPTION_SERVICE_URL =
  process.env.NEXT_PUBLIC_DESCRIPTION_SERVICE_URL || "";

/**
 * Generates vehicle description via external POST request
 * Sends all form data as raw body to external service
 */
export async function generateVehicleDescription(
  formData: VehicleFormData,
): Promise<DescriptionResponse> {
  try {
    // Validate minimum required data
    if (!formData.marca || !formData.modelo) {
      return {
        success: false,
        error: "Marca y modelo son requeridos para generar descripción",
      };
    }

    // Prepare payload with all form fields
    const payload = {
      marca: formData.marca,
      modelo: formData.modelo,
      ano: formData.ano,
      kilometraje: formData.kilometraje,
      version: formData.version,
      combustible: formData.combustible,
      transmision: formData.transmision,
      color: formData.color,
      tipo_vehiculo: formData.tipo_vehiculo,
    };

    console.log("🚗 Sending POST request to:", DESCRIPTION_SERVICE_URL);
    console.log("📤 Payload:", JSON.stringify(payload, null, 2));

    // Make POST request with raw body
    const response = await fetch(DESCRIPTION_SERVICE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log("📡 Response status:", response.status, response.statusText);
    console.log(
      "📡 Response headers:",
      Object.fromEntries(response.headers.entries()),
    );

    if (!response.ok) {
      // Try to get error details from response body
      let errorDetails = "";
      try {
        const errorText = await response.text();
        console.log("❌ Error response body:", errorText);
        errorDetails = errorText ? ` - ${errorText}` : "";
      } catch (e) {
        console.log("❌ Could not read error response body");
      }

      throw new Error(
        `HTTP error ${response.status}: ${response.statusText}${errorDetails}`,
      );
    }

    const data = await response.json();
    console.log("📥 Response received:", data);

    // Validate response structure
    if (data.success && data.descripcion) {
      return {
        success: true,
        descripcion: data.descripcion,
      };
    } else {
      return {
        success: false,
        error: data.error || "No se pudo generar la descripción",
      };
    }
  } catch (error) {
    console.error("❌ Error generating description:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error desconocido al generar descripción",
    };
  }
}

/**
 * Example usage and payload structure for testing
 */
export const examplePayload: VehicleFormData = {
  marca: "Toyota",
  modelo: "Corolla",
  ano: 2020,
  kilometraje: 50000,
  version: "XEI",
  combustible: "Nafta",
  transmision: "Manual",
  color: "Blanco",
  tipo_vehiculo: "autos/camionetas",
};

// Export types
export type { DescriptionResponse };
