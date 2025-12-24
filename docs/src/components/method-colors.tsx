'use client';

import { useEffect } from 'react';

const methodColors: Record<string, string> = {
  GET: '#22c55e',    // green
  POST: '#3b82f6',   // blue
  PUT: '#f59e0b',    // amber
  PATCH: '#f59e0b',  // amber
  DELETE: '#ef4444', // red
};

export function MethodColors() {
  useEffect(() => {
    const colorizeMethodsInSidebar = () => {
      // Find all sidebar links
      const sidebarLinks = document.querySelectorAll('nav a');

      sidebarLinks.forEach((link) => {
        const text = link.textContent || '';
        const methodMatch = text.match(/^(GET|POST|PUT|PATCH|DELETE)\s/);

        if (methodMatch && !link.querySelector('.method-tag')) {
          const method = methodMatch[1];
          const restOfText = text.slice(method.length + 1);

          // Create colored method tag
          const methodSpan = document.createElement('span');
          methodSpan.className = 'method-tag';
          methodSpan.textContent = method;
          methodSpan.style.cssText = `
            color: ${methodColors[method]};
            font-weight: 600;
            font-size: 0.7rem;
            font-family: ui-monospace, monospace;
            margin-right: 0.5rem;
            padding: 0.125rem 0.375rem;
            border-radius: 0.25rem;
            background: ${methodColors[method]}20;
          `;

          // Replace link content
          link.textContent = '';
          link.appendChild(methodSpan);
          link.appendChild(document.createTextNode(restOfText));
        }
      });
    };

    // Run on mount and when DOM changes (for navigation)
    colorizeMethodsInSidebar();

    const observer = new MutationObserver(colorizeMethodsInSidebar);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null;
}
