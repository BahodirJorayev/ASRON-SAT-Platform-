import React, { useMemo } from 'react';
import katex from 'katex';

interface KaTeXRendererProps {
  text: string;
  className?: string;
  inline?: boolean;
}

export const KaTeXRenderer: React.FC<KaTeXRendererProps> = ({
  text,
  className = '',
  inline = false,
}) => {
  const renderedHtml = useMemo(() => {
    if (!text) return '';

    try {
      // Replace $$...$$ block math first
      let processed = text.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
        try {
          return `<div class="katex-display-wrapper my-2 overflow-x-auto">${katex.renderToString(math.trim(), {
            displayMode: true,
            throwOnError: false,
          })}</div>`;
        } catch {
          return `$$${math}$$`;
        }
      });

      // Replace $...$ inline math (avoid matching escaped \$ or currency)
      processed = processed.replace(/\$([^\$\n]+?)\$/g, (_, math) => {
        try {
          return katex.renderToString(math.trim(), {
            displayMode: false,
            throwOnError: false,
          });
        } catch {
          return `$${math}$`;
        }
      });

      // Format line breaks if not inside HTML tags
      const paragraphs = processed.split(/\n\n+/);
      if (paragraphs.length > 1 && !inline) {
        return paragraphs
          .map((p) => `<p class="mb-3 last:mb-0 leading-relaxed">${p.replace(/\n/g, '<br/>')}</p>`)
          .join('');
      }

      return processed.replace(/\n/g, '<br/>');
    } catch {
      return text;
    }
  }, [text, inline]);

  if (inline) {
    return (
      <span
        className={`katex-text-container inline ${className}`}
        dangerouslySetInnerHTML={{ __html: renderedHtml }}
      />
    );
  }

  return (
    <div
      className={`katex-text-container leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
};
