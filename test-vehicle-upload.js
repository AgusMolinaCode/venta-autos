// Script para probar la carga de vehículo con imágenes
// Este script simula lo que hace el formulario

const FormData = require('form-data');
const fs = require('fs');
const fetch = require('node-fetch');

async function testVehicleUpload() {
  try {
    console.log('🧪 Probando carga de vehículo...');
    
    const formData = new FormData();
    
    // Datos del vehículo
    formData.append('marca', 'Toyota');
    formData.append('modelo', 'Corolla');
    formData.append('ano', '2020');
    formData.append('precio', '25000');
    formData.append('moneda', 'USD');
    formData.append('kilometraje', '50000');
    formData.append('color', 'Blanco');
    formData.append('combustible', 'Nafta');
    formData.append('transmision', 'Manual');
    formData.append('descripcion', 'Vehículo de prueba');
    
    // Crear archivos de prueba si no existen
    const testImagePath = '/tmp/test-image.jpg';
    if (!fs.existsSync(testImagePath)) {
      // Crear una imagen de prueba muy simple (1x1 pixel JPEG)
      const jpegHeader = Buffer.from([
        0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48,
        0x00, 0x48, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43, 0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xC0, 0x00, 0x11, 0x08, 0x00, 0x01,
        0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01, 0xFF, 0xC4, 0x00, 0x14,
        0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x08, 0xFF, 0xDA, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3F, 0x00, 0xAA, 0xFF, 0xD9
      ]);
      fs.writeFileSync(testImagePath, jpegHeader);
    }
    
    // Agregar archivo de imagen
    formData.append('fotos', fs.createReadStream(testImagePath), {
      filename: 'test-image.jpg',
      contentType: 'image/jpeg'
    });
    
    console.log('📤 Enviando datos...');
    
    const response = await fetch('http://localhost:3000/api/vehiculos', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.text();
    console.log('📡 Status:', response.status);
    console.log('📝 Response:', result);
    
    // Limpiar archivo de prueba
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
    }
    
  } catch (error) {
    console.error('❌ Error en prueba:', error);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  testVehicleUpload();
}

module.exports = { testVehicleUpload };