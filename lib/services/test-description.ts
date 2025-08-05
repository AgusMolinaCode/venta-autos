/**
 * Test Script for Description Generator
 * Basic testing and example usage
 */

import {
  generateVehicleDescription,
  examplePayload,
} from "./description-generator";
import type { VehicleFormData } from "@/components/dashboard-admin/VehicleInfoFormComponents/types/VehicleFormTypes";

/**
 * Test the description generation service
 */
async function testDescriptionGeneration() {
  console.log("🧪 Testing Description Generation Service");
  console.log("=========================================");

  console.log("\n📋 Test payload:");
  console.log(JSON.stringify(examplePayload, null, 2));

  try {
    const result = await generateVehicleDescription(examplePayload);

    console.log("\n📥 Response:");
    if (result.success) {
      console.log("✅ Success!");
      console.log("Generated description:", result.descripcion);
    } else {
      console.log("❌ Failed!");
      console.log("Error:", result.error);
    }
  } catch (error) {
    console.log("\n💥 Exception caught:");
    console.error(error);
  }
}

/**
 * Test with minimum data
 */
async function testMinimumData() {
  console.log("\n🧪 Testing with minimum data");
  console.log("=============================");

  const minimumData: VehicleFormData = {
    marca: "Ford",
    modelo: "Focus",
    ano: 2020,
    tipo_vehiculo: "autos/camionetas",
  };

  console.log("Minimum payload:", JSON.stringify(minimumData, null, 2));

  try {
    const result = await generateVehicleDescription(minimumData);
    console.log("Result:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

/**
 * Test validation
 */
async function testValidation() {
  console.log("\n🧪 Testing validation");
  console.log("======================");

  // Test missing marca
  console.log("\n❌ Testing without marca:");
  const withoutMarca = {
    modelo: "Focus",
    ano: 2020,
    tipo_vehiculo: "autos/camionetas" as const,
  };

  try {
    const result = await generateVehicleDescription(withoutMarca as any);
    console.log("Result:", result);
  } catch (error) {
    console.error("Error:", error);
  }

  // Test missing modelo
  console.log("\n❌ Testing without modelo:");
  const withoutModelo = {
    marca: "Ford",
    ano: 2020,
    tipo_vehiculo: "autos/camionetas" as const,
  };

  try {
    const result = await generateVehicleDescription(withoutModelo as any);
    console.log("Result:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log("🧪 Description Generator Test Suite");
  console.log("===================================\n");

  // Test validation
  await testValidation();

  // Test minimum data
  await testMinimumData();

  // Test full generation (commented to avoid actual API calls)
  // await testDescriptionGeneration();

  console.log("\n✅ Tests completed!");
  console.log("\nTo test with actual service:");
  console.log("1. Set DESCRIPTION_SERVICE_URL environment variable");
  console.log("2. Uncomment testDescriptionGeneration() call");
  console.log("3. Run: npx tsx lib/services/test-description.ts");
}

// Export functions
export { testDescriptionGeneration, testMinimumData, testValidation, runTests };

// Run tests if executed directly
if (require.main === module) {
  runTests().catch(console.error);
}
