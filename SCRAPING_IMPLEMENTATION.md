# 🕷️ Implementación de Scraping Directo a Autocosmos

## ✅ Implementación Completada

Se ha actualizado el sistema para hacer scraping directo al sitio web de Autocosmos en lugar de usar APIs intermedias, obteniendo los modelos directamente del HTML.

## 🔧 Cambios Realizados

### 1. API Route Actualizada: `/api/autocosmos/models/[brand]/route.ts`

#### ❌ Antes (Sistema DDD con AutocosmosService)
```typescript
const models = await autocosmosService.getModelsByBrand(autocosmoBrand.slug);
```

#### ✅ Ahora (Scraping directo)
```typescript
// 1. Hacer fetch directo a Autocosmos
const autocosnosUrl = `https://www.autocosmos.com.ar/guiadeprecios?Marca=${encodeURIComponent(autocosmosBrandName)}`;

const response = await fetch(autocosnosUrl, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
    // ... más headers para simular browser real
  }
});

// 2. Extraer HTML y parsear select
const html = await response.text();

// 3. Usar regex para extraer opciones del select
const selectRegex = /<select[^>]*data-role="modelo-select"[^>]*>(.*?)<\/select>/s;
const optionsRegex = /<option value="([^"]*)"[^>]*>([^<]+)<\/option>/g;
```

### 2. Parser HTML Robusto

#### Extracción de Datos del Select
El sistema ahora busca específicamente:

```html
<select class="form-item__select valid" data-role="modelo-select" ...>
  <option value="">Elegir modelo...</option>
  <option value="alaskan-pick---up">ALASKAN PICK - UP</option>
  <option value="captur">CAPTUR</option>
  <option value="clio">CLIO</option>
  <!-- ... más opciones ... -->
</select>
```

#### Lógica de Parsing
```typescript
while ((optionMatch = optionsRegex.exec(selectContent)) !== null) {
  const [, value, text] = optionMatch;
  
  // Saltar opción vacía "Elegir modelo..."
  if (value && value.trim() !== '' && text.trim() !== 'Elegir modelo...') {
    models.push({
      name: text.trim(),           // "CAPTUR"
      slug: value.trim(),          // "captur"
      brandSlug: autocosmoBrand.slug,  // "renault"
      displayName: text.trim(),    // "CAPTUR"
      isActive: true
    });
  }
}
```

### 3. Headers de Browser Real

Para evitar detección como bot:
```typescript
headers: {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
  'Accept-Encoding': 'gzip, deflate, br',
  'DNT': '1',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
}
```

## 📊 Comparación de Enfoques

| Aspecto | DDD + AutocosmosService | Scraping Directo |
|---------|------------------------|------------------|
| **Complejidad** | Alta (múltiples capas) | Baja (fetch + regex) |
| **Dependencias** | AutocosmosService, HttpClient, Cache | Solo fetch y regex |
| **Latencia** | Múltiples abstracciones | Directo a la fuente |
| **Mantenimiento** | Complejo | Simple |
| **Datos** | Procesados por DDD | Raw desde Autocosmos |
| **Error Handling** | Múltiples puntos | Un solo punto |

## 🚀 Flujo Actualizado

### 1. Usuario Selecciona Marca
```
Usuario selecciona "Renault" → Hook detecta cambio
```

### 2. Mapeo de Marca
```
"Renault" → BrandMappingService → { name: "RENAULT", slug: "renault" }
```

### 3. URL Construction
```
https://www.autocosmos.com.ar/guiadeprecios?Marca=renault
```

### 4. Scraping
```
Fetch página → Extraer HTML → Parsear select → Retornar modelos
```

### 5. Cache y UI
```
Modelos → Cache localStorage → UI actualizada con datos
```

## 📝 Ejemplo de Response

### Para Renault
```json
{
  "success": true,
  "data": [
    {
      "name": "ALASKAN PICK - UP",
      "slug": "alaskan-pick---up",
      "brandSlug": "renault",
      "displayName": "ALASKAN PICK - UP",
      "isActive": true
    },
    {
      "name": "CAPTUR",
      "slug": "captur",
      "brandSlug": "renault",
      "displayName": "CAPTUR",
      "isActive": true
    },
    {
      "name": "CLIO",
      "slug": "clio",
      "brandSlug": "renault",
      "displayName": "CLIO",
      "isActive": true
    }
    // ... más modelos
  ],
  "metadata": {
    "brand": {
      "local": "Renault",
      "autocosmos": "RENAULT",
      "slug": "renault"
    },
    "count": 24,
    "timestamp": "2024-01-01T00:00:00.000Z",
    "source": "autocosmos_scraping",
    "url": "https://www.autocosmos.com.ar/guiadeprecios?Marca=renault"
  }
}
```

## 🛡️ Manejo de Errores

### Errores Cubiertos
1. **Página no disponible**: HTTP 404/500
2. **Select no encontrado**: HTML structure cambió
3. **Regex no match**: Parsing falló
4. **Marca no mapeada**: Brand mapping falló
5. **Network timeout**: Conexión lenta

### Error Responses
```json
{
  "success": false,
  "error": {
    "code": "SCRAPING_ERROR",
    "message": "No se encontró el select de modelos en la página",
    "details": {
      "brand": "UnknownBrand",
      "url": "https://www.autocosmos.com.ar/guiadeprecios?Marca=unknownbrand",
      "timestamp": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

## 🔗 Integración con Sistema Existente

### Cache localStorage Funciona Igual
- ✅ Datos se guardan en cache por 10 minutos
- ✅ Carga instantánea en subsecuentes requests
- ✅ Auto-cleanup cada 30 minutos
- ✅ Indicador visual de cache

### Hook useAutocosmosModels Sin Cambios
- ✅ Misma API para el componente
- ✅ Estados loading, error, success iguales
- ✅ Cache strategy idéntica
- ✅ UI indicators funcionan igual

### VehicleInfoForm Sin Cambios
- ✅ Select dinámico funciona igual
- ✅ Estados de UI idénticos
- ✅ Error handling igual
- ✅ User experience sin cambios

## 🎯 Ventajas de la Nueva Implementación

### ✅ Simplicidad
- Menos capas de abstracción
- Código más directo y entendible
- Menos puntos de fallo

### ✅ Performance
- Un solo fetch en lugar de múltiples abstracciones
- Parsing directo sin transformaciones innecesarias
- Menor latencia

### ✅ Mantenimiento
- Un solo archivo para modificar si cambia Autocosmos
- Regex fáciles de ajustar si cambia HTML
- Error handling centralizado

### ✅ Datos Frescos
- Directamente de la fuente (Autocosmos)
- Sin intermediarios que puedan ser outdated
- HTML parsing confiable

## 🚨 Consideraciones

### Robustez
- El scraping depende de la estructura HTML de Autocosmos
- Si cambian el `data-role="modelo-select"`, habrá que actualizar
- Headers de browser importantes para evitar blocking

### Rate Limiting
- Cache de 10 minutos reduce calls a Autocosmos
- Headers simulan traffic normal
- Una llamada por marca por usuario cada 10 min

### Maintenance
- Monitorear si Autocosmos cambia estructura
- Actualizar regex si es necesario
- Logs para debug de parsing issues

## 🎉 Resultado

✅ **Scraping directo implementado y funcionando**
✅ **URL construction: `https://www.autocosmos.com.ar/guiadeprecios?Marca={marca}`**
✅ **Parser HTML robusto con regex**
✅ **Headers de browser real**
✅ **Error handling completo**
✅ **Cache localStorage funciona igual**
✅ **UI sin cambios para el usuario**

¡Ahora cuando selecciones "Renault" obtendrás todos los modelos directamente desde Autocosmos! 🚗