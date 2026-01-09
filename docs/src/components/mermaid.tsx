'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import mermaid from 'mermaid';
import { TransformWrapper, TransformComponent, useControls } from 'react-zoom-pan-pinch';

// Scanopy docs theme - matches global.css colors
const scanopyTheme = {
  theme: 'base' as const,
  themeVariables: {
    // Background colors
    primaryColor: '#3b82f6',
    primaryTextColor: '#f8fafc',
    primaryBorderColor: '#3b82f6',

    // Secondary colors (rose accent)
    secondaryColor: '#fb7185',
    secondaryTextColor: '#f8fafc',
    secondaryBorderColor: '#fb7185',

    // Tertiary colors
    tertiaryColor: '#1f2937',
    tertiaryTextColor: '#f8fafc',
    tertiaryBorderColor: '#374151',

    // Background
    background: '#1a1d29',
    mainBkg: '#1f2937',

    // Text
    textColor: '#f8fafc',
    lineColor: '#94a3b8',

    // Node colors
    nodeBkg: '#1f2937',
    nodeBorder: '#3b82f6',

    // Cluster/subgraph colors
    clusterBkg: '#151821',
    clusterBorder: '#374151',

    // Label colors
    labelBackground: '#1a1d29',
    labelTextColor: '#f8fafc',

    // Edge colors
    edgeLabelBackground: '#1a1d29',

    // Flowchart specific
    flowchartTitleColor: '#f8fafc',

    // ER Diagram specific - fix alternating row colors
    attributeBackgroundColorOdd: '#1f2937',
    attributeBackgroundColorEven: '#1f2937',
    rowOdd: '#1f2937',
    rowEven: '#1f2937',

    // Font
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: '14px',
  },
};

// Initialize mermaid with our theme
mermaid.initialize({
  startOnLoad: false,
  ...scanopyTheme,
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

  useEffect(() => {
    const renderChart = async () => {
      if (!containerRef.current) return;

      try {
        const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
        let { svg } = await mermaid.render(id, chart);

        // Post-process SVG to fix ER diagram row colors
        // Replace white/light gray fills with our dark theme color
        svg = svg
          .replace(/fill="#ffffff"/gi, 'fill="#1f2937"')
          .replace(/fill="#f2f2f2"/gi, 'fill="#1f2937"')
          .replace(/fill="white"/gi, 'fill="#1f2937"')
          .replace(/fill: #ffffff/gi, 'fill: #1f2937')
          .replace(/fill: #f2f2f2/gi, 'fill: #1f2937')
          .replace(/fill: white/gi, 'fill: #1f2937');

        setSvg(svg);
        setError(null);
      } catch (err) {
        console.error('Mermaid rendering error:', err);
        setError(err instanceof Error ? err.message : 'Failed to render diagram');
      }
    };

    renderChart();
  }, [chart]);

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
