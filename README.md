# 🚀 Yorleidys Ruiz - Portafolio Profesional & Panel de Gestión

Portafolio web interactivo de **Yorleidys Ruiz**, Ingeniera de Sistemas y Desarrolladora Full Stack. Diseñado con una interfaz moderna y estética ciberespacial en tonos morado/neón, catálogo dinámico de proyectos, blog técnico, panel de control administrativo protegido con autenticación en dos factores (2FA), formulario con reCAPTCHA antispam y sincronización opcional con base de datos en la nube (Google Cloud Firebase / Firestore).

---

## 🌟 Características Principales

- 🎨 **Diseño Moderno & Responsivo**: Paleta de colores violeta/neón con modo oscuro, tarjetas con brillo perimetral, tipografía Plus Jakarta Sans y animaciones fluidas.
- 📱 **Secciones Integradas**:
  - **Hero**: Presentación profesional con botones de llamada a la acción y enlaces a redes.
  - **Propuesta de Valor & Servicios**: Desarrollo Web a medida, E-commerce, CMS (WordPress), APIs y optimización SEO.
  - **Proyectos**: Filtro interactivo por categorías (Desarrollo Web, E-commerce, WordPress, Laravel, UI/UX).
  - **Stack Tecnológico**: Frontend, backend, CMS, base de datos y herramientas de desarrollo.
  - **Blog Técnico**: Artículos de arquitectura web, buenas prácticas y tutoriales.
  - **Formulario de Contacto Seguro**: Con validación de campos, enlaces directos a WhatsApp/Email y **reCAPTCHA** integrado contra bots.
- 🔐 **Panel de Gestión Administrativa Seguro**:
  - Acceso privado mediante **Login con Cifrado SHA-256**.
  - **Autenticación en Dos Pasos (2FA)** mediante código TOTP de 6 dígitos y códigos de respaldo.
  - **Protección Anti-Fuerza Bruta**: Bloqueo automático de 45 segundos tras 5 intentos fallidos consecutivos.
  - Pestaña de **WhatsApp & Redes**: Configuración dinámica del número de WhatsApp (con mensaje inicial precargado y generación automática de enlace para los dos botones del sitio), junto a los perfiles de GitHub, LinkedIn, Instagram y correo electrónico.
  - Pestaña de **Seguridad & Acceso** para cambiar la contraseña maestra y gestionar el 2FA.
- 🗄️ **Gestión de Datos Híbrida**:
  - Almacenamiento local persistente inmediato con `localStorage`.
  - Integración directa con **Google Firebase Firestore** para sincronización multi-dispositivo en la nube.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18, TypeScript, Vite.
- **Estilos**: Tailwind CSS con paleta moderna oscura (`#080b13`, violeta, índigo y esmeralda).
- **Iconografía**: `lucide-react`.
- **Criptografía**: Web Crypto API (SHA-256) con salado seguro de contraseñas.
- **Base de Datos**: Google Cloud Firestore (REST API v1 / Firebase Web SDK).

---

## 🔐 Credenciales de Acceso al Panel de Administración

Para acceder al panel privado de administración (botón **"Acceso Admin"** en el menú superior o pie de página):

- **Usuario / Correo:** `yorle170203@gmail.com` *(o el alias `admin`)*
- **Contraseña Maestra Inicial:** `AdminYorleidys2026!`
- **Paso 2 (2FA):** Copiar el código dinámico de 6 dígitos que aparece en pantalla o usar el código de respaldo de emergencia `849201`.

*(Puedes cambiar esta contraseña y activar/desactivar el 2FA en cualquier momento desde la pestaña **Seguridad & Acceso** dentro del panel).*

---

## 📖 Paso a Paso para Conectar a la Base de Datos (Firebase Firestore)

Para que tus proyectos y publicaciones del blog se sincronicen en la nube de Google en tiempo real, sigue estos 5 sencillos pasos:

### 1. Crear el Proyecto en Google Firebase
1. Ingresa a la consola oficial: [console.firebase.google.com](https://console.firebase.google.com/).
2. Inicia sesión con tu cuenta de Google.
3. Haz clic en **"Crear un proyecto"** (o "Agregar proyecto").
4. Asígnale un nombre (por ejemplo: `yorleidys-portafolio`) y desactiva o activa Google Analytics según prefieras.
5. Presiona **"Continuar"** y espera a que finalice la creación.

### 2. Crear la Base de Datos Firestore
1. En el menú lateral izquierdo de tu consola de Firebase, ve a **Compilación > Firestore Database**.
2. Haz clic en el botón **"Crear base de datos"**.
3. Selecciona la ubicación geográfica más cercana (por ejemplo: `nam5 (us-central)` o `southamerica-east1`).
4. En el asistente de reglas de seguridad, selecciona **"Comenzar en modo de prueba"** (Test Mode) para permitir lecturas y escrituras durante el desarrollo.
5. Haz clic en **"Habilitar"**.

### 3. Configurar las Reglas de Seguridad en Firestore
1. Dentro de Firestore Database, entra a la pestaña **Reglas** (Rules).
2. Pega las siguientes reglas recomendadas para proteger tus colecciones y presiona **"Publicar"**:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Proyectos: Lectura pública para los visitantes de la web, escritura permitida
    match /proyectos/{document=**} {
      allow read: if true;
      allow write: if true;
    }
    // Artículos del Blog: Lectura pública, escritura permitida
    match /articulos_blog/{document=**} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

### 4. Obtener las Credenciales Web de tu Aplicación
1. En la consola de Firebase, haz clic en el icono de engranaje ⚙️ (junto a "Descripción general del proyecto") y elige **Configuración del proyecto**.
2. En la pestaña **General**, baja hasta la sección **"Tus apps"** y haz clic en el icono de código web **`</>`**.
3. Escribe un apodo para la app (ej: `Portafolio Web`) y haz clic en **"Registrar app"**.
4. Firebase te mostrará el objeto `firebaseConfig`:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef..."
};
```

### 5. Vincular en tu Panel de Control
1. En tu portafolio, haz clic en el botón superior **"Acceso Admin"**.
2. Inicia sesión con tus credenciales y el código 2FA.
3. Ve a la pestaña **"Conexión Firebase"**.
4. Pega tu **Project ID** y tu **API Key** en los campos correspondientes.
5. Haz clic en **"Probar Conexión"**. El sistema validará automáticamente en tiempo real la respuesta de Google Cloud.
6. Haz clic en **"Guardar Configuración"**.
7. ¡Listo! A partir de ese momento, cada proyecto o artículo que crees o edites se guardará de forma segura en Firestore.

---

## 💻 Comandos para Desarrollo Local

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo en http://localhost:3000
npm run dev

# 3. Compilar para producción
npm run build

# 4. Validar tipos de TypeScript
npm run lint
```

---

## 👩‍💻 Autora

**Yorleidys Ruiz**  
Ingeniera de Sistemas & Desarrolladora Web Full Stack  
Cartagena, Colombia  
- Email: [yorle170203@gmail.com](mailto:yorle170203@gmail.com)  
- WhatsApp: Disponible en la sección de contacto
