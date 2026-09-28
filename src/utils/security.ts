/**
 * Utilidades de Seguridad y Validación Estricta
 * Diseñado para rechazar código inyectado, XSS, scripts, SQL injection y payloads JSON.
 * Garantiza que todos los formularios procesen únicamente texto plano seguro.
 */

// Expresión regular para detectar tags HTML o XML (ej. <script>, <img onerror...>, etc.)
const HTML_TAG_REGEX = /<\/?[a-z][\s\S]*>/i;

// Expresión regular para detectar patrones de inyección de código JavaScript
const JS_CODE_PATTERNS = [
  /javascript\s*:/i,
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /on\w+\s*=/i, // onload=, onerror=, onclick=, onmouseover=
  /eval\s*\(/i,
  /Function\s*\(/i,
  /setTimeout\s*\(/i,
  /setInterval\s*\(/i,
  /document\s*\.\s*(cookie|location|write|getElementById)/i,
  /window\s*\.\s*(location|open|eval)/i,
  /fetch\s*\(/i,
  /XMLHttpRequest/i,
  /__proto__/i,
  /constructor\s*\(/i,
];

// Expresión regular para detectar intentos de inyección SQL
const SQL_PATTERNS = [
  /\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|UNION|CREATE|TRUNCATE)\b\s+.*\b(FROM|INTO|TABLE|DATABASE|WHERE|SET)\b/i,
  /--\s*$/m,
  /\bOR\b\s+['"]?1['"]?\s*=\s*['"]?1/i,
];

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
  sanitizedValue: string;
}

/**
 * Detecta si una cadena tiene estructura de objeto o arreglo JSON
 */
export function isJsonStructure(input: string): boolean {
  const trimmed = input.trim();
  if (
    (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
    (trimmed.startsWith('[') && trimmed.endsWith(']'))
  ) {
    try {
      const parsed = JSON.parse(trimmed);
      return typeof parsed === 'object' && parsed !== null;
    } catch {
      // Si parece JSON con comillas y llaves aunque esté mal formateado, también lo rechazamos por seguridad
      if (/^[\{\[][\s\S]*["'][a-zA-Z0-9_-]+["']\s*:[\s\S]*[\}\]]$/.test(trimmed)) {
        return true;
      }
      return false;
    }
  }
  return false;
}

/**
 * Valida que una entrada contenga únicamente texto plano descriptivo
 * Rechaza JSON, tags HTML, payloads de script y SQL injection.
 */
export function validateAndSanitizePlainText(
  input: string,
  fieldName: string = 'Este campo',
  options: {
    allowMultiline?: boolean;
    maxLength?: number;
    minLength?: number;
    required?: boolean;
  } = {}
): ValidationResult {
  const { allowMultiline = false, maxLength = 2000, minLength = 0, required = false } = options;

  if (!input || input.trim() === '') {
    if (required) {
      return {
        isValid: false,
        errorMessage: `${fieldName} es obligatorio.`,
        sanitizedValue: '',
      };
    }
    return { isValid: true, sanitizedValue: '' };
  }

  const trimmed = input.trim();

  // 1. Verificación de longitud
  if (minLength > 0 && trimmed.length < minLength) {
    return {
      isValid: false,
      errorMessage: `${fieldName} debe tener al menos ${minLength} caracteres.`,
      sanitizedValue: trimmed,
    };
  }

  if (trimmed.length > maxLength) {
    return {
      isValid: false,
      errorMessage: `${fieldName} excede el límite de ${maxLength} caracteres.`,
      sanitizedValue: trimmed.slice(0, maxLength),
    };
  }

  // 2. Detección de estructuras JSON
  if (isJsonStructure(trimmed)) {
    return {
      isValid: false,
      errorMessage: `Por seguridad, ${fieldName} no acepta objetos ni arreglos JSON. Solo se permite texto plano.`,
      sanitizedValue: '',
    };
  }

  // 3. Detección de tags HTML
  if (HTML_TAG_REGEX.test(trimmed)) {
    return {
      isValid: false,
      errorMessage: `Por seguridad, ${fieldName} no acepta etiquetas HTML o código incrustado (<...>).`,
      sanitizedValue: '',
    };
  }

  // 4. Detección de patrones JavaScript peligrosos
  for (const pattern of JS_CODE_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        isValid: false,
        errorMessage: `Por seguridad, ${fieldName} no permite fragmentos de código ni scripts ejecutables.`,
        sanitizedValue: '',
      };
    }
  }

  // 5. Detección de patrones SQL maliciosos
  for (const pattern of SQL_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        isValid: false,
        errorMessage: `Por seguridad, ${fieldName} contiene patrones no permitidos.`,
        sanitizedValue: '',
      };
    }
  }

  // 6. Sanitización pasiva: convertir caracteres especiales a representación textual limpia
  let cleanText = trimmed;
  if (!allowMultiline) {
    cleanText = cleanText.replace(/[\r\n\t]+/g, ' ');
  }

  // Eliminar caracteres de control invisibles o no imprimibles
  cleanText = cleanText.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  return {
    isValid: true,
    sanitizedValue: cleanText,
  };
}

/**
 * Valida que una URL sea segura (solo http://, https://, o rutas relativas seguras)
 * Rechaza esquemas maliciosos como javascript:, data:, vbscript:, etc.
 */
export function validateSafeUrl(
  urlInput: string,
  fieldName: string = 'La URL'
): ValidationResult {
  if (!urlInput || urlInput.trim() === '') {
    return { isValid: true, sanitizedValue: '' };
  }

  const trimmed = urlInput.trim();

  // Detección de esquemas prohibidos
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('file:')
  ) {
    return {
      isValid: false,
      errorMessage: `${fieldName} contiene un protocolo no permitido por seguridad.`,
      sanitizedValue: '',
    };
  }

  // Detección de tags HTML
  if (HTML_TAG_REGEX.test(trimmed)) {
    return {
      isValid: false,
      errorMessage: `${fieldName} no puede contener etiquetas de código.`,
      sanitizedValue: '',
    };
  }

  // Si es ruta relativa o ancla o https://
  if (
    trimmed.startsWith('/') ||
    trimmed.startsWith('#') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('http://')
  ) {
    return {
      isValid: true,
      sanitizedValue: trimmed,
    };
  }

  return {
    isValid: false,
    errorMessage: `${fieldName} debe ser una dirección web válida (iniciando con https:// o ruta relativa /).`,
    sanitizedValue: trimmed,
  };
}

/**
 * Valida y sanitiza contenido enriquecido para artículos de blog
 * Permite formato Markdown (#, ##, ###, **, *, ~~, <u>, ![imagen](url), [enlace](url), citas, listas, etc.)
 * Bloquea scripts ejecutables, inyecciones XSS y payloads maliciosos.
 */
export function validateAndSanitizeBlogContent(
  input: string,
  options: {
    maxLength?: number;
    minLength?: number;
    required?: boolean;
  } = {}
): ValidationResult {
  const { maxLength = 35000, minLength = 20, required = false } = options;

  if (!input || input.trim() === '') {
    if (required) {
      return {
        isValid: false,
        errorMessage: 'El contenido del artículo es obligatorio.',
        sanitizedValue: '',
      };
    }
    return { isValid: true, sanitizedValue: '' };
  }

  const trimmed = input.trim();

  if (trimmed.length < minLength) {
    return {
      isValid: false,
      errorMessage: `El artículo debe tener al menos ${minLength} caracteres.`,
      sanitizedValue: trimmed,
    };
  }

  if (trimmed.length > maxLength) {
    return {
      isValid: false,
      errorMessage: `El artículo excede el límite máximo de ${maxLength} caracteres.`,
      sanitizedValue: trimmed.slice(0, maxLength),
    };
  }

  // Detectar y bloquear scripts ejecutables y eventos inline
  for (const pattern of JS_CODE_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        isValid: false,
        errorMessage: 'Por seguridad, el contenido no puede incluir código ejecutable, scripts ni manejadores de eventos (onclick, onerror, etc.).',
        sanitizedValue: '',
      };
    }
  }

  // Detectar tags script o iframe
  if (/<(script|iframe|object|embed|applet|meta|link)\b/i.test(trimmed)) {
    return {
      isValid: false,
      errorMessage: 'Por seguridad, no se permiten etiquetas <script>, <iframe> u objetos externos incrustados.',
      sanitizedValue: '',
    };
  }

  return {
    isValid: true,
    sanitizedValue: trimmed,
  };
}

/**
 * Escapa caracteres HTML para renderizado o exportación segura
 */
export function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
