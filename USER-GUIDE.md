# 📚 Guía del Usuario - Sistema de Gestión de Vehículos

## Índice
- [🚀 Primeros Pasos](#-primeros-pasos)
- [🏠 Dashboard Principal](#-dashboard-principal)
- [🚗 Gestión de Vehículos](#-gestión-de-vehículos)
- [📸 Gestión de Fotos](#-gestión-de-fotos)
- [💰 Gestión de Precios](#-gestión-de-precios)
- [🔍 Búsqueda y Filtrado](#-búsqueda-y-filtrado)
- [⚠️ Solución de Problemas](#️-solución-de-problemas)

---

## 🚀 Primeros Pasos

### Requisitos del Sistema
- **Navegador**: Chrome, Firefox, Safari, Edge (versiones recientes)
- **Conexión**: Internet estable para carga de imágenes
- **Resolución**: Mínimo 1024x768px (responsive en móviles)

### Acceso al Sistema
1. **URL**: Accede a la aplicación a través de tu navegador
2. **Sin autenticación**: El sistema es completamente público
3. **Dashboard**: Serás redirigido automáticamente al dashboard principal

### Primera Configuración
- No se requiere configuración inicial
- Todos los datos se almacenan automáticamente en la base de datos
- Las imágenes se almacenan en Supabase Storage

---

## 🏠 Dashboard Principal

### Navegación Principal
El dashboard cuenta con dos vistas principales:

#### 1. **Vista Dashboard** 
- **Función**: Panel de control y acceso rápido a funciones principales
- **Contenido**: Formulario para agregar nuevos vehículos
- **Acceso**: Clic en "Dashboard" en la barra lateral

#### 2. **Vista Listado de Autos**
- **Función**: Gestión completa de vehículos existentes
- **Contenido**: Tabla con todos los vehículos, filtros, y acciones
- **Acceso**: Clic en "Listado de Autos" en la barra lateral

### Elementos de la Interfaz

#### Barra Lateral
```
📊 Dashboard          ← Panel principal
🚗 Listado de Autos  ← Gestión de vehículos
⚙️  Configuración     ← Configuraciones del sistema
🌙 Modo Oscuro        ← Toggle tema claro/oscuro
```

#### Barra Superior
- **Toggle de tema**: Cambiar entre modo claro y oscuro
- **Responsive**: Se adapta automáticamente a dispositivos móviles

---

## 🚗 Gestión de Vehículos

### Agregar Nuevo Vehículo

#### Paso 1: Acceder al Formulario
1. Ve al **Dashboard** desde la barra lateral
2. Encontrarás el formulario "Agregar Nuevo Vehículo"

#### Paso 2: Información Básica
```
📋 Campos Obligatorios:
├── Marca*              (ej: Toyota, Ford, Chevrolet)
├── Modelo*             (ej: Corolla, Focus, Cruze)
├── Año*                (1970 - 2025)
├── Precio*             (número entero o decimal)
└── Moneda*             (ARS o USD)

📝 Campos Opcionales:
├── Kilometraje         (número entero)
├── Versión             (ej: "2.0 Turbo", "Full")
├── Combustible         (Nafta, Gasoil, Híbrido, etc.)
├── Transmisión         (Manual, Automática, CVT, etc.)
├── Color               (Blanco, Negro, Rojo, etc.)
└── Descripción         (texto libre hasta 500 caracteres)
```

#### Paso 3: Selección de Marca y Modelo
El sistema incluye integración con **Autocosmos** para ayudarte:

1. **Marca**: 
   - Selecciona de la lista desplegable
   - O escribe para buscar
   - Opción "Otra marca" para marcas no listadas

2. **Modelo**:
   - Se carga automáticamente según la marca seleccionada
   - Lista actualizada desde Autocosmos
   - Opción "Otro modelo" disponible

3. **Año**:
   - Se carga automáticamente según marca y modelo
   - Rango válido: 1970-2025

#### Paso 4: Subir Fotos
- **Mínimo**: 1 foto requerida
- **Máximo**: 15 fotos por vehículo
- **Formatos**: JPG, PNG, WEBP
- **Tamaño**: Máximo 10MB por archivo
- **Drag & Drop**: Arrastra archivos o haz clic para seleccionar

#### Paso 5: Guardar
1. **Validación**: El sistema valida todos los campos automáticamente
2. **Envío**: Haz clic en "Guardar Vehículo"
3. **Confirmación**: Recibirás una notificación de éxito
4. **Redirección**: El vehículo aparecerá en el listado

### Ejemplo Completo: Agregar Toyota Corolla 2020

```
✅ Información Básica:
├── Marca: Toyota
├── Modelo: Corolla
├── Año: 2020
├── Kilometraje: 45000
├── Versión: XEi 2.0 CVT
├── Combustible: Nafta
├── Transmisión: CVT
├── Color: Blanco
├── Precio: 8500000
├── Moneda: ARS
└── Descripción: "Toyota Corolla 2020 en excelente estado, mantenimientos al día, único dueño. Incluye service completo y documentación al día."

📸 Fotos (5 archivos):
├── 01_frente.jpg (2.3 MB)
├── 02_lateral.jpg (1.8 MB) ← Foto principal
├── 03_trasera.jpg (2.1 MB)
├── 04_interior.jpg (1.9 MB)
└── 05_motor.jpg (2.4 MB)
```

---

### Editar Vehículo Existente

#### Acceso a Edición
1. Ve a **"Listado de Autos"**
2. Busca el vehículo que deseas editar
3. Haz clic en el menú "**⋮**" (tres puntos) de la fila
4. Selecciona **"Editar"**

#### Proceso de Edición
1. **Modal de Edición**: Se abrirá un modal con la información actual
2. **Modificar Campos**: Cambia los datos que necesites
3. **Gestión de Fotos**: 
   - Mantener fotos existentes o subir nuevas
   - Si subes nuevas fotos, **reemplazarán completamente** las actuales
4. **Guardar Cambios**: Haz clic en "Actualizar Vehículo"

### Estados del Vehículo
```
🟡 Preparación  ← Estado inicial, en proceso de carga
🟢 Publicado    ← Visible y disponible para venta
⏸️  Pausado     ← Temporalmente no disponible
✅ Vendido      ← Vehículo vendido, archivado
```

### Eliminar Vehículo
⚠️ **Advertencia**: Esta acción no se puede deshacer

1. En el listado, haz clic en el menú "**⋮**"
2. Selecciona **"Eliminar"**
3. **Confirma** en el modal de confirmación
4. El vehículo será eliminado permanentemente

---

## 📸 Gestión de Fotos

### Especificaciones Técnicas
```
📏 Tamaños Recomendados:
├── Mínimo: 800x600 px
├── Óptimo: 1200x800 px  
└── Máximo: 4000x4000 px

📦 Formatos Soportados:
├── JPEG/JPG ← Recomendado
├── PNG      ← Buena calidad
└── WEBP     ← Mejor compresión

⚖️ Limitaciones:
├── Tamaño: Máximo 10 MB por archivo
├── Cantidad: Máximo 15 fotos por vehículo
└── Validación: Verificación automática de tipo de archivo
```

### Subir Fotos - Método Drag & Drop
1. **Arrastra** los archivos desde tu explorador
2. **Suelta** sobre el área de carga (se resalta en azul)
3. **Verificación**: El sistema valida automáticamente cada archivo
4. **Vista previa**: Verás las fotos cargadas con información del archivo

### Subir Fotos - Método Click
1. Haz clic en **"Seleccionar Fotos"**
2. Se abrirá el explorador de archivos
3. **Selecciona múltiples archivos** (Ctrl/Cmd + clic)
4. Haz clic en **"Abrir"**

### Gestión de Fotos Existentes

#### Al Editar un Vehículo:
```
📸 Escenarios de Fotos:
├── ✅ Mantener fotos actuales
│   └── No subir nuevas fotos = fotos actuales se mantienen
├── 🔄 Reemplazar todas las fotos  
│   └── Subir nuevas fotos = las actuales se eliminan
└── ⚠️ Advertencia visual cuando subes nuevas fotos
```

### Tipos de Fotos Recomendadas
```
🚗 Fotos Esenciales:
├── 1. Frente del vehículo
├── 2. Lateral derecho (principal)
├── 3. Trasera del vehículo
├── 4. Interior completo
└── 5. Tablero/kilometraje

📋 Fotos Adicionales (opcionales):
├── Motor
├── Llantas/neumáticos
├── Detalles específicos
├── Defectos (si los hay)
└── Documentación
```

### Problemas Comunes con Fotos

#### Error: "Archivo muy grande"
- **Causa**: El archivo supera los 10 MB
- **Solución**: Comprime la imagen o usa formato JPEG con menor calidad
- **Herramientas**: Paint, Photoshop, herramientas online de compresión

#### Error: "Tipo de archivo no válido"
- **Causa**: Formato no soportado (ej: GIF, BMP, TIFF)
- **Solución**: Convierte a JPG, PNG o WEBP
- **Herramientas**: Convertidores online o software de edición

#### Error: "Imagen muy pequeña"
- **Causa**: Resolución menor a 100x100px
- **Solución**: Usa imágenes de mayor resolución (mínimo 800x600px)

---

## 💰 Gestión de Precios

### Configuración de Precios

#### Monedas Soportadas
```
💱 Monedas:
├── 🇦🇷 ARS (Peso Argentino)    ← Por defecto
└── 🇺🇸 USD (Dólar Estadounidense)
```

#### Formato de Precios
```
✅ Formatos Aceptados:
├── Números enteros: 1500000
├── Con decimales: 1500000.50
├── Con separador de miles: Se formatea automáticamente
└── Rango: 1 - 999,999,999

❌ No Válidos:
├── Números negativos
├── Texto (ej: "consultar")
├── Símbolos (ej: $, USD)
└── Valor 0
```

### Ejemplos de Precios Válidos

#### En Pesos Argentinos (ARS)
```
🇦🇷 Ejemplos ARS:
├── Auto económico: 3.500.000
├── Auto medio: 8.500.000  
├── Auto premium: 25.000.000
└── Auto de lujo: 45.000.000
```

#### En Dólares (USD)
```
🇺🇸 Ejemplos USD:
├── Auto económico: 15000
├── Auto medio: 25000
├── Auto premium: 45000
└── Auto de lujo: 85000
```

### Cambiar Precio de Vehículo Existente

#### Método 1: Modal de Precio Rápido
1. En el listado, localiza el vehículo
2. Haz clic en el **precio actual** (aparece como botón)
3. Se abre modal "Actualizar Precio"
4. Ingresa el **nuevo precio**
5. Selecciona la **moneda** (ARS/USD)
6. Haz clic en **"Actualizar"**

#### Método 2: Edición Completa
1. Menú "**⋮**" → **"Editar"**  
2. Modifica el precio en el formulario completo
3. Guarda todos los cambios

### Referencias de Precios

#### Integración con Servicios Externos
El sistema incluye integración con:
- **Autocosmos**: Referencias de precios del mercado
- **MercadoLibre**: Análisis de precios de vehículos similares
- **APIs de Cotización**: Para conversión ARS/USD automática

---

## 🔍 Búsqueda y Filtrado

### Sistema de Filtros

#### Filtros por Estado
```
🔍 Filtros de Estado:
├── 📋 Todos         ← Ver todos los vehículos
├── 🟡 Preparación   ← En proceso de carga
├── 🟢 Publicado     ← Disponibles para venta
├── ⏸️  Pausado      ← Temporalmente no disponibles
└── ✅ Vendido       ← Vehículos vendidos
```

#### Búsqueda de Texto
```
🔎 Búsqueda en:
├── Marca del vehículo
├── Modelo del vehículo  
├── Versión
├── Color
└── Descripción
```

#### Cómo Usar la Búsqueda
1. **Campo de búsqueda**: En la parte superior del listado
2. **Escribe** cualquier término (marca, modelo, color, etc.)
3. **Búsqueda en tiempo real**: Los resultados se filtran automáticamente
4. **Limpiar**: Borra el texto para ver todos los vehículos

### Ordenamiento

#### Columnas Ordenables
```
📊 Ordenar por:
├── 🏷️  Marca (A-Z, Z-A)
├── 🚗 Modelo (A-Z, Z-A)
├── 📅 Año (más nuevo, más viejo)
├── 💰 Precio (mayor, menor)
├── 📊 Estado
└── 📆 Fecha de creación (más reciente, más antigua)
```

#### Cómo Ordenar
1. Haz clic en el **encabezado** de cualquier columna
2. **Primera vez**: Orden ascendente (↑)
3. **Segunda vez**: Orden descendente (↓)
4. **Indicador visual**: Flecha muestra dirección del orden

### Ejemplo de Búsqueda Avanzada

```
🔍 Búsquedas Útiles:
├── "Toyota Corolla"     ← Buscar marca y modelo específico
├── "2020"               ← Buscar por año
├── "Automática"         ← Buscar por tipo de transmisión
├── "Rojo"               ← Buscar por color
├── "Full"               ← Buscar por versión
└── "único dueño"        ← Buscar en descripción
```

---

## ⚠️ Solución de Problemas

### Problemas de Carga

#### La página no carga
```
🔧 Soluciones:
├── 1. Actualizar navegador (F5 o Ctrl+R)
├── 2. Verificar conexión a Internet
├── 3. Limpiar caché del navegador
├── 4. Intentar en modo incógnito
└── 5. Probar con otro navegador
```

#### Las imágenes no se cargan
```
🔧 Soluciones:
├── 1. Verificar conexión estable
├── 2. Esperar carga completa (archivos grandes)
├── 3. Actualizar página
└── 4. Verificar formato de archivo (JPG, PNG, WEBP)
```

### Errores de Formulario

#### "Datos del vehículo inválidos"
```
✅ Verificar:
├── Marca: Debe estar seleccionada
├── Modelo: Debe estar seleccionado
├── Año: Debe ser entre 1970-2025
├── Precio: Debe ser mayor a 0
└── Fotos: Mínimo 1 foto requerida
```

#### "Archivo muy grande"
```
🔧 Soluciones:
├── 1. Comprimir imagen (usar JPEG con 80% calidad)
├── 2. Redimensionar imagen (máximo 1920x1080)
├── 3. Usar herramientas online de compresión
└── 4. Cambiar formato a WEBP (menor tamaño)
```

#### "Tipo de archivo no válido"
```
✅ Formatos aceptados:
├── .jpg / .jpeg
├── .png
└── .webp

❌ NO aceptados:
├── .gif
├── .bmp
├── .tiff
└── .pdf
```

### Problemas de Rendimiento

#### La aplicación está lenta
```
🔧 Optimizaciones:
├── 1. Cerrar pestañas innecesarias
├── 2. Limpiar caché del navegador
├── 3. Usar imágenes optimizadas (menor tamaño)
├── 4. Verificar conexión a Internet
└── 5. Actualizar navegador
```

#### Error al guardar vehículo
```
🔍 Verificar:
├── Conexión a Internet estable
├── Todos los campos obligatorios completos
├── Formatos de archivo correctos
├── Tamaños de imagen válidos
└── Si persiste: actualizar página e intentar nuevamente
```

### Problemas de Interfaz

#### El diseño se ve raro
```
🔧 Soluciones:
├── 1. Actualizar navegador (F5)
├── 2. Verificar zoom (debe ser 100%)
├── 3. Probar en otro navegador
└── 4. Desactivar extensiones del navegador
```

#### Modo oscuro no funciona
```
🔧 Soluciones:
├── 1. Hacer clic en el toggle de tema (🌙)
├── 2. Actualizar página
├── 3. Limpiar caché del navegador
└── 4. La preferencia se guarda automáticamente
```

### Contacto y Soporte

Si los problemas persisten:
1. **Documenta** el error (captura de pantalla)
2. **Nota** qué estabas haciendo cuando ocurrió
3. **Incluye** información del navegador y sistema operativo
4. **Reporta** el problema a través de los canales de soporte

---

## 📱 Uso en Dispositivos Móviles

### Compatibilidad
- ✅ **Responsive Design**: Se adapta automáticamente a móviles y tablets
- ✅ **Funcionalidad Completa**: Todas las funciones disponibles en móvil
- ✅ **Touch Friendly**: Interfaz optimizada para pantalla táctil

### Diferencias en Móvil
```
📱 Adaptaciones Móviles:
├── 🍔 Menú hamburguesa ← Barra lateral se contrae
├── 📋 Tabla → Cards     ← Vista de tarjetas en lugar de tabla
├── 📸 Carga táctil      ← Tomar fotos directamente con cámara
└── 🔍 Búsqueda expandida ← Campo de búsqueda más prominente
```

### Consejos para Móviles
1. **Fotos**: Puedes tomar fotos directamente con la cámara del dispositivo
2. **Navegación**: Usa gestos de swipe para navegar entre secciones
3. **Zoom**: Pellizca para hacer zoom en imágenes
4. **Orientación**: Funciona en modo vertical y horizontal

---

Esta guía cubre todos los aspectos principales del sistema. Para información técnica adicional, consulta la documentación para desarrolladores.