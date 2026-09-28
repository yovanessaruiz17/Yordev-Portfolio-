import React from 'react';
import { ExternalLink, Quote } from 'lucide-react';

interface BlogContentRendererProps {
  content?: string;
  className?: string;
}

/**
 * Función auxiliar para parsear formato en línea dentro de un párrafo o elemento:
 * - Negrita: **texto**
 * - Cursiva: *texto*
 * - Subrayado: <u>texto</u>
 * - Tachado: ~~texto~~
 * - Código inline: `codigo`
 * - Enlaces / Redirecciones: [texto](url)
 */
function renderInlineFormatting(text: string): React.ReactNode[] {
  // Regex combinada para capturar enlaces, imágenes, negrita, cursiva, código, tachado y subrayado
  const regex = /(\[.*?\]\(.*?\)|\*\*.*?\*\*|\*.*?\*|<u>.*?<\/u>|~~.*?~~|`.*?`)/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (!part) return null;

    // 1. Enlace [texto](url)
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      const linkText = linkMatch[1];
      const linkUrl = linkMatch[2];
      const isExternal = linkUrl.startsWith('http://') || linkUrl.startsWith('https://');
      return (
        <a
          key={index}
          href={linkUrl}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="inline-flex items-center gap-1 font-semibold text-purple-400 hover:text-purple-300 underline decoration-purple-500/50 hover:decoration-purple-300 transition-colors"
        >
          {linkText}
          {isExternal && <ExternalLink className="w-3 h-3 inline-block shrink-0" />}
        </a>
      );
    }

    // 2. Negrita **texto**
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={index} className="font-bold text-white tracking-wide">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // 3. Subrayado <u>texto</u>
    if (part.startsWith('<u>') && part.endsWith('</u>') && part.length >= 7) {
      return (
        <u key={index} className="underline decoration-purple-400 decoration-2 underline-offset-4">
          {part.slice(3, -4)}
        </u>
      );
    }

    // 4. Tachado ~~texto~~
    if (part.startsWith('~~') && part.endsWith('~~') && part.length >= 4) {
      return (
        <s key={index} className="line-through text-slate-400">
          {part.slice(2, -2)}
        </s>
      );
    }

    // 5. Cursiva *texto*
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      return (
        <em key={index} className="italic text-purple-200">
          {part.slice(1, -1)}
        </em>
      );
    }

    // 6. Código inline `codigo`
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 mx-0.5 rounded-md bg-purple-950/70 border border-purple-800/40 text-purple-300 font-mono text-xs sm:text-sm"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

export const BlogContentRenderer: React.FC<BlogContentRendererProps> = ({ content, className = '' }) => {
  if (!content) {
    return <p className="text-slate-400 italic">No hay contenido disponible para este artículo.</p>;
  }

  // Dividir el contenido por bloques (separados por una o más líneas vacías)
  const rawBlocks = content.split(/\n\s*\n/);

  return (
    <div className={`space-y-5 text-slate-200 leading-relaxed ${className}`}>
      {rawBlocks.map((block, blockIdx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // 1. Separador horizontal --- o ***
        if (/^(\-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
          return (
            <hr
              key={blockIdx}
              className="my-8 border-t border-purple-900/40"
            />
          );
        }

        // 2. Imagen entre el texto: ![alt](url)
        const imageMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
        if (imageMatch) {
          const altText = imageMatch[1];
          const imgUrl = imageMatch[2];
          return (
            <figure
              key={blockIdx}
              className="my-6 rounded-2xl overflow-hidden border border-purple-900/40 bg-slate-900/60 p-2 sm:p-3 shadow-xl shadow-purple-950/20 group"
            >
              <img
                src={imgUrl}
                alt={altText || 'Imagen del artículo'}
                className="w-full max-h-[500px] object-cover rounded-xl transition-transform duration-300 group-hover:scale-[1.01]"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              {altText && (
                <figcaption className="text-center text-xs text-slate-400 mt-2.5 px-3 italic">
                  {altText}
                </figcaption>
              )}
            </figure>
          );
        }

        // 3. Título H1 (# Título)
        if (trimmed.startsWith('# ')) {
          const text = trimmed.slice(2);
          return (
            <h2
              key={blockIdx}
              className="text-2xl sm:text-3xl font-extrabold text-white mt-8 mb-4 tracking-tight border-b border-purple-500/30 pb-3 flex items-center gap-2"
            >
              <span className="w-2 h-6 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-full inline-block" />
              {renderInlineFormatting(text)}
            </h2>
          );
        }

        // 4. Subtítulo H2 (## Subtítulo)
        if (trimmed.startsWith('## ')) {
          const text = trimmed.slice(3);
          return (
            <h3
              key={blockIdx}
              className="text-xl sm:text-2xl font-bold text-purple-200 mt-6 mb-3 tracking-tight"
            >
              {renderInlineFormatting(text)}
            </h3>
          );
        }

        // 5. Encabezado de Sección H3 (### Encabezado)
        if (trimmed.startsWith('### ')) {
          const text = trimmed.slice(4);
          return (
            <h4
              key={blockIdx}
              className="text-lg sm:text-xl font-semibold text-purple-300 mt-5 mb-2"
            >
              {renderInlineFormatting(text)}
            </h4>
          );
        }

        // 6. Cita destacada (> Cita)
        if (trimmed.startsWith('> ') || trimmed.startsWith('>')) {
          const quoteLines = trimmed
            .split('\n')
            .map((line) => line.replace(/^>\s?/, ''))
            .join(' ');
          return (
            <blockquote
              key={blockIdx}
              className="relative my-6 pl-5 pr-4 py-4 rounded-r-2xl border-l-4 border-purple-500 bg-gradient-to-r from-purple-950/40 to-transparent italic text-purple-100 text-sm sm:text-base leading-relaxed"
            >
              <Quote className="w-5 h-5 text-purple-400 mb-1 opacity-70" />
              <p>{renderInlineFormatting(quoteLines)}</p>
            </blockquote>
          );
        }

        // 7. Bloque de Código (``` ... ```)
        if (trimmed.startsWith('```') && trimmed.endsWith('```') && trimmed.length >= 6) {
          const codeLines = trimmed.slice(3, -3).replace(/^[a-z0-9_-]*\n/i, '');
          return (
            <pre
              key={blockIdx}
              className="my-5 p-4 rounded-xl bg-[#070b16] border border-purple-900/40 text-purple-200 font-mono text-xs sm:text-sm overflow-x-auto leading-relaxed shadow-inner"
            >
              <code>{codeLines}</code>
            </pre>
          );
        }

        // 8. Lista con viñetas (- elemento o * elemento)
        const lines = trimmed.split('\n');
        const isBulletList = lines.every((line) => /^[-*]\s+/.test(line.trim()));
        if (isBulletList) {
          return (
            <ul key={blockIdx} className="my-4 space-y-2 pl-2">
              {lines.map((line, liIdx) => {
                const itemText = line.trim().replace(/^[-*]\s+/, '');
                return (
                  <li key={liIdx} className="flex items-start gap-2.5 text-slate-300 text-sm sm:text-base">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 shrink-0 shadow-sm shadow-purple-500" />
                    <span>{renderInlineFormatting(itemText)}</span>
                  </li>
                );
              })}
            </ul>
          );
        }

        // 9. Lista numerada (1. elemento)
        const isNumberedList = lines.every((line) => /^\d+\.\s+/.test(line.trim()));
        if (isNumberedList) {
          return (
            <ol key={blockIdx} className="my-4 space-y-2 pl-2">
              {lines.map((line, liIdx) => {
                const match = line.trim().match(/^(\d+)\.\s+(.*)$/);
                const number = match ? match[1] : String(liIdx + 1);
                const itemText = match ? match[2] : line;
                return (
                  <li key={liIdx} className="flex items-start gap-2.5 text-slate-300 text-sm sm:text-base">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-purple-950/80 border border-purple-700/50 text-purple-300 text-xs font-bold shrink-0 mt-0.5">
                      {number}
                    </span>
                    <span>{renderInlineFormatting(itemText)}</span>
                  </li>
                );
              })}
            </ol>
          );
        }

        // 10. Párrafo normal con soporte multilínea suave
        return (
          <p key={blockIdx} className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {lines.map((line, lineIdx) => (
              <React.Fragment key={lineIdx}>
                {lineIdx > 0 && <br />}
                {renderInlineFormatting(line)}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
};
