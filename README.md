# 🚗 Bs.As Cars

### *Tu mejor opción para tu próximo vehículo*

---

## 🌟 ¿Qué es Bs.As Cars?

**Bs.As Cars** es un marketplace moderno y completo para la compra y venta de vehículos. La plataforma permite a vendedores registrados publicar sus autos con toda la información necesaria, mientras que los compradores pueden explorar un catálogo dinámico, filtrar por características específicas y contactar directamente con los vendedores.

---

## ✨ Características Principales

### 🔐 **Sistema de Autenticación**
- Registro e inicio de sesión seguro con **Supabase Auth**
- Gestión de perfiles de usuario
- Protección de rutas privadas

### 📊 **Dashboard Personalizado**
- **Métricas en tiempo real**: Total de vehículos, valor del inventario, precios promedio
- **Estados de publicación**: En preparación, publicados, pausados, vendidos
- **Gestión completa**: Editar, pausar o eliminar publicaciones

### 🚙 **Listado de Vehículos**
- Catálogo visual con imágenes de alta calidad
- **Filtros avanzados**:
  - 🏷️ Marca y modelo
  - 📅 Año de fabricación
  - 🛣️ Kilometraje
  - ⛽ Tipo de combustible (Nafta, Diésel, GNC, Eléctrico, Híbrido)
  - ⚙️ Transmisión (Manual, Automática, CVT)
- Sistema de búsqueda inteligente
- Ordenamiento personalizable

### 📝 **Publicación de Vehículos**
- Formularios intuitivos con validación
- Carga de múltiples imágenes
- Especificaciones técnicas detalladas
- Estados de publicación flexibles

---

## 🛠️ Tecnologías Utilizadas

### **Frontend**
| Tecnología | Uso |
|------------|-----|
| ⚛️ **React 19** | Biblioteca principal de UI |
| ⚡ **Next.js 15** | Framework con App Router |
| 🎨 **Tailwind CSS 4** | Estilos y diseño responsivo |
| 🎭 **Framer Motion** | Animaciones fluidas |
| 📦 **Radix UI** | Componentes accesibles |

### **Backend & Database**
| Tecnología | Uso |
|------------|-----|
| 🗄️ **Supabase** | Base de datos PostgreSQL |
| 🔑 **Supabase Auth** | Autenticación de usuarios |
| 📡 **Supabase Storage** | Almacenamiento de imágenes |

### **Gestión de Estado**
| Tecnología | Uso |
|------------|-----|
| 🔄 **TanStack Query** | Fetching y caché de datos |
| 📋 **React Hook Form** | Manejo de formularios |
| ✅ **Zod** | Validación de esquemas |
| 🎯 **Custom Hooks** | Lógica reutilizable (15+ hooks especializados) |

### **UI/UX**
| Tecnología | Uso |
|------------|-----|
| 🎨 **Lucide React** | Iconografía moderna |
| 🌙 **next-themes** | Modo oscuro/claro |
| 🔔 **Sonner** | Notificaciones toast |
| 📊 **TanStack Table** | Tablas interactivas |

---

## 🎨 Diseño y Experiencia de Usuario

### **Paleta de Colores**
- 🟢 **Verde esmeralda**: Color principal para CTAs y elementos destacados
- ⚫ **Fondos oscuros**: Interfaz moderna y elegante
- 🎯 **Estados codificados por color**:
  - 🟠 Naranja: En preparación
  - 🟢 Verde: Publicado
  - 🟡 Amarillo: Pausado
  - 🔵 Azul: Vendido

### **Interfaz**
- ✅ Diseño completamente responsivo
- ✅ Animaciones suaves y transiciones fluidas
- ✅ Componentes reutilizables y modulares
- ✅ Feedback visual inmediato en todas las acciones

---

## 📁 Estructura del Proyecto

```
venta-autos/
├── 📱 app/                      # App Router de Next.js 15
│   ├── api/                    # API Routes
│   ├── dashboard/              # Panel de administración
│   │   └── page.tsx           # Métricas y estadísticas
│   ├── login/                  # Autenticación de usuarios
│   ├── marcas/                 # Gestión de marcas
│   │   ├── [id]/              # Rutas dinámicas por marca
│   │   └── vehiculos/         # Vehículos por marca
│   └── vehiculos/              # Catálogo público
│       ├── layout.tsx         # Layout de vehículos
│       └── page.tsx           # Listado con filtros
│
├── 🧩 components/              # Componentes reutilizables
│   ├── auth/                  # Componentes de autenticación
│   ├── brands/                # Gestión de marcas
│   ├── dashboard-admin/       # Panel administrativo
│   ├── landing/               # Página principal
│   ├── motion-primitives/     # Animaciones con Framer Motion
│   ├── providers/             # Context providers
│   └── ui/                    # Sistema de diseño (Radix UI)
│
├── 🎣 hooks/                   # Custom Hooks especializados
│   ├── use-all-vehicles.ts    # Obtener todos los vehículos
│   ├── use-autocosmos-models.ts  # Integración Autocosmos
│   ├── use-brand-filters.ts   # Filtros por marca
│   ├── use-car-form-state.ts  # Estado de formularios
│   ├── use-car-valuation.ts   # Valuación de vehículos
│   ├── use-currency-conversion.ts # Conversión de monedas
│   ├── use-description-generator.ts # IA para descripciones
│   ├── use-pagination.ts      # Paginación de listados
│   └── use-price-reference.ts # Referencias de precios
│
├── 🔧 lib/                     # Configuración y utilidades
│   ├── supabase/              # Cliente de Supabase
│   └── utils/                 # Funciones helper
│
├── 🗂️ domain/                  # Lógica de negocio
├── 📚 constants/               # Constantes globales
├── 🌐 contexts/                # React Context
└── 🎨 globals.css             # Estilos globales
```

---

## 🚀 Funcionalidades Destacadas

### **🤖 Inteligencia Artificial**
- **Generador de descripciones**: Crea descripciones atractivas automáticamente usando IA
- **Valuación inteligente**: Estima el valor de mercado de vehículos
- **Referencias de precios**: Compara con datos del mercado en tiempo real

### **🔌 Integraciones Externas**
- **Autocosmos API**: Datos de modelos y especificaciones técnicas
- **Conversión de monedas**: Precios en diferentes divisas actualizados
- **Web scraping**: Obtención de información de mercado

### **Para Vendedores**
1. 📸 Publicar vehículos con múltiples fotos
2. 📊 Dashboard con métricas detalladas de sus publicaciones
3. 🤖 Generación automática de descripciones con IA
4. 💰 Valuación automática basada en datos del mercado
5. ✏️ Editar información en cualquier momento
6. ⏸️ Pausar o reactivar publicaciones
7. 📈 Ver estadísticas de visualizaciones e interés

### **Para Compradores**
1. 🔍 Explorar catálogo completo con imágenes de calidad
2. 🎛️ Filtros avanzados por marca, modelo, año, precio, etc.
3. 🏷️ Navegación por marcas específicas
4. 📱 Contactar directamente con vendedores
5. 💡 Ver especificaciones técnicas detalladas
6. 💵 Comparar precios en diferentes monedas
7. 📊 Referencias de precios del mercado

---

## 🔒 Seguridad

- ✅ Autenticación robusta con Supabase
- ✅ Validación de datos en cliente y servidor
- ✅ Protección de rutas privadas con middleware
- ✅ Sanitización de inputs con Zod
- ✅ Row Level Security (RLS) en Supabase

---

## 📈 Optimizaciones

- ⚡ **Next.js 15 Turbopack**: Compilación ultra rápida
- 🎯 **React Server Components**: Renderizado optimizado
- 💾 **TanStack Query**: Caché inteligente de datos
- 🖼️ **Next/Image**: Optimización automática de imágenes
- 📦 **Code splitting**: Carga bajo demanda

---

## 🎯 Casos de Uso

1. **Concesionarias**: Publicar inventario completo
2. **Vendedores particulares**: Vender vehículo usado
3. **Compradores**: Encontrar el auto ideal
4. **Comparadores**: Analizar opciones del mercado

---

## 📸 Capturas de Pantalla

### 🏠 Página Principal
*Diseño atractivo con hero section y últimos vehículos agregados*

### 📋 Listado de Vehículos
*Filtros avanzados y cards visuales con información clave*

### 📊 Dashboard
*Métricas en tiempo real y gestión completa de publicaciones*

### 📝 Gestión de Inventario
*Tabla detallada con estados, acciones rápidas y búsqueda*

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Si tienes ideas para mejorar la plataforma, no dudes en:

1. 🍴 Fork del proyecto
2. 🌿 Crear una rama (`git checkout -b feature/nueva-funcionalidad`)
3. 💾 Commit de cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. 📤 Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. 🎉 Abrir un Pull Request

---

## 📝 Licencia

Este proyecto es de código privado.

---

## 👨‍💻 Autor

Desarrollado con ❤️ para revolucionar la forma de comprar y vender vehículos.

---

<div align="center">

### ⭐ Si te gusta este proyecto, dale una estrella!

**Bs.As Cars** - *Tu mejor opción para tu próximo vehículo* 🚗

</div>
