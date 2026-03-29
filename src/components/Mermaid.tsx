import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose',
});

interface MermaidProps {
  chart: string;
}

export const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      mermaid.render(`mermaid-${Math.random().toString(36).substring(7)}`, chart).then((result) => {
        if (containerRef.current) {
          containerRef.current.innerHTML = result.svg;
        }
      }).catch((e) => {
        console.error("Mermaid rendering error", e);
        if (containerRef.current) {
          containerRef.current.innerHTML = `<div class="text-red-500 p-4 bg-red-50 rounded-lg border border-red-200">Failed to render mindmap. Please check the syntax.</div>`;
        }
      });
    }
  }, [chart]);

  return <div ref={containerRef} className="mermaid-container overflow-x-auto flex justify-center" />;
};
