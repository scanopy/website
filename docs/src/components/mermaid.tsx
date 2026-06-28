'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import mermaid from 'mermaid';
import { TransformWrapper, TransformComponent, useControls } from 'react-zoom-pan-pinch';

// Scanopy docs Mermaid theme — light + dark variants matching global.css / the main site.
const sharedThemeVariables = {
  fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
  fontSize: '14px',
};

const darkThemeVariables = {
  primaryColor: '#3b82f6',
  primaryTextColor: '#f8fafc',
  primaryBorderColor: '#3b82f6',
  secondaryColor: '#fb7185',
  secondaryTextColor: '#f8fafc',
  secondaryBorderColor: '#fb7185',
  tertiaryColor: '#1f2937',
  tertiaryTextColor: '#f8fafc',
  tertiaryBorderColor: '#374151',
  background: '#1a1d29',
  mainBkg: '#1f2937',
  textColor: '#f8fafc',
  lineColor: '#94a3b8',
  nodeBkg: '#1f2937',
  nodeBorder: '#3b82f6',
  clusterBkg: '#151821',
  clusterBorder: '#374151',
  labelBackground: '#1a1d29',
  labelTextColor: '#f8fafc',
  edgeLabelBackground: '#1a1d29',
  flowchartTitleColor: '#f8fafc',
  attributeBackgroundColorOdd: '#1f2937',
  attributeBackgroundColorEven: '#1f2937',
  rowOdd: '#1f2937',
  rowEven: '#1f2937',
  ...sharedThemeVariables,
};

const lightThemeVariables = {
  primaryColor: '#eff6ff',
  primaryTextColor: '#0f172a',
  primaryBorderColor: '#2563eb',
  secondaryColor: '#fff1f2',
  secondaryTextColor: '#0f172a',
  secondaryBorderColor: '#e11d48',
  tertiaryColor: '#f1f5f9',
  tertiaryTextColor: '#0f172a',
  tertiaryBorderColor: '#e2e8f0',
  background: '#ffffff',
  mainBkg: '#ffffff',
  textColor: '#0f172a',
  lineColor: '#64748b',
  nodeBkg: '#ffffff',
  nodeBorder: '#2563eb',
  clusterBkg: '#f8fafc',
  clusterBorder: '#e2e8f0',
  labelBackground: '#ffffff',
  labelTextColor: '#0f172a',
  edgeLabelBackground: '#ffffff',
  flowchartTitleColor: '#0f172a',
  attributeBackgroundColorOdd: '#ffffff',
  attributeBackgroundColorEven: '#ffffff',
  rowOdd: '#ffffff',
  rowEven: '#ffffff',
  ...sharedThemeVariables,
};

// (Re)initialize mermaid for the active theme. Called before each render so diagrams
// re-render in the correct palette when the site theme changes.
function initMermaid(isDark: boolean) {
  mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    themeVariables: isDark ? darkThemeVariables : lightThemeVariables,
    flowchart: {
      useMaxWidth: true,
      htmlLabels: true,
      curve: 'basis',
      padding: 15,
    },
    er: {
      useMaxWidth: false, // Allow diagram to be larger than container (we have zoom/pan)
      layoutDirection: 'TB',
      minEntityWidth: 100,
      minEntityHeight: 75,
      entityPadding: 15,
      nodeSpacing: 180, // Increased from default 140
      rankSpacing: 100, // Increased from default 80
      diagramPadding: 30,
      fontSize: 12,
    },
    securityLevel: 'loose',
  });
}

// Fullscreen icon components
function ExpandIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
    </svg>
  );
}

function ShrinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
    </svg>
  );
}

interface ZoomControlsProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

function ZoomControls({ isFullscreen, onToggleFullscreen }: ZoomControlsProps) {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  return (
    <div className="mermaid-controls">
      <button
        onClick={() => zoomOut()}
        className="mermaid-control-btn"
        title="Zoom out"
        aria-label="Zoom out"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35M8 11h6" />
        </svg>
      </button>
      <button
        onClick={() => zoomIn()}
        className="mermaid-control-btn"
        title="Zoom in"
        aria-label="Zoom in"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35M11 8v6M8 11h6" />
        </svg>
      </button>
      <button
        onClick={() => resetTransform()}
        className="mermaid-control-btn"
        title="Reset zoom"
        aria-label="Reset zoom"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
      </button>
      <div className="mermaid-control-divider" />
      <button
        onClick={onToggleFullscreen}
        className="mermaid-control-btn"
        title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
      >
        {isFullscreen ? <ShrinkIcon /> : <ExpandIcon />}
      </button>
    </div>
  );
}

interface MermaidProps {
  chart: string;
  enableZoom?: boolean;
}

export function Mermaid({ chart, enableZoom = true }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDark, setIsDark] = useState(() =>
    typeof document !== 'undefined'
      ? document.documentElement.classList.contains('dark')
      : true,
  );

  // Follow the site theme (the `.dark` class on <html> is managed by next-themes).
  useEffect(() => {
    const read = () => setIsDark(document.documentElement.classList.contains('dark'));
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const renderChart = async () => {
      if (!containerRef.current) return;

      try {
        initMermaid(isDark);
        const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
        let { svg } = await mermaid.render(id, chart);

        // In dark mode, post-process the SVG to replace any white/light-gray fills
        // (e.g. ER diagram rows) with our dark card color. In light mode the default
        // light fills are already correct, so leave them.
        if (isDark) {
          svg = svg
            .replace(/fill="#ffffff"/gi, 'fill="#1f2937"')
            .replace(/fill="#f2f2f2"/gi, 'fill="#1f2937"')
            .replace(/fill="white"/gi, 'fill="#1f2937"')
            .replace(/fill: #ffffff/gi, 'fill: #1f2937')
            .replace(/fill: #f2f2f2/gi, 'fill: #1f2937')
            .replace(/fill: white/gi, 'fill: #1f2937');
        }

        setSvg(svg);
        setError(null);
      } catch (err) {
        console.error('Mermaid rendering error:', err);
        setError(err instanceof Error ? err.message : 'Failed to render diagram');
      }
    };

    renderChart();
  }, [chart, isDark]);

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === wrapperRef.current);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!wrapperRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await wrapperRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  }, []);

  // Handle Escape key in fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        document.exitFullscreen();
      }
    };

    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isFullscreen]);

  if (error) {
    return (
      <div className="mermaid-error rounded-lg border border-red-500/30 bg-red-500/10 p-4 my-4">
        <p className="text-red-400 text-sm">Failed to render diagram: {error}</p>
        <pre className="mt-2 text-xs text-gray-400 overflow-auto">{chart}</pre>
      </div>
    );
  }

  if (!enableZoom) {
    return (
      <div
        ref={containerRef}
        className="mermaid-diagram my-6"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    );
  }

  return (
    <div
      ref={(el) => {
        (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        (wrapperRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
      }}
      className={`mermaid-wrapper my-6 ${isFullscreen ? 'mermaid-fullscreen' : ''}`}
    >
      <TransformWrapper
        initialScale={1}
        minScale={0.1}
        maxScale={8}
        centerOnInit
        wheel={{ smoothStep: 0.05 }}
      >
        <ZoomControls isFullscreen={isFullscreen} onToggleFullscreen={toggleFullscreen} />
        <TransformComponent
          wrapperClass="mermaid-transform-wrapper"
          contentClass="mermaid-transform-content"
        >
          <div
            className="mermaid-diagram-inner"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}
