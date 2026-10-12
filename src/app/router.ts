/**
 * Minimal hash router: deep links work on GitHub Pages subpaths without server
 * rewrites, and the service worker only ever needs to serve index.html.
 */
import { useEffect, useState } from 'react';

export type Route =
  | { name: 'home' }
  | { name: 'topics' }
  | { name: 'macro'; macroId: string }
  | { name: 'review' }
  | { name: 'settings' }
  | { name: 'session' }
  | { name: 'listen' }
  | { name: 'card'; itemId: string }
  | { name: 'case'; itemId: string };

export function parseHash(hash: string): Route {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  switch (parts[0]) {
    case undefined:
      return { name: 'home' };
    case 'topics':
      return parts[1] ? { name: 'macro', macroId: parts[1] } : { name: 'topics' };
    case 'review':
      return { name: 'review' };
    case 'settings':
      return { name: 'settings' };
    case 'session':
      return { name: 'session' };
    case 'listen':
      return { name: 'listen' };
    case 'card':
      return parts[1] ? { name: 'card', itemId: parts[1] } : { name: 'home' };
    case 'case':
      return parts[1] ? { name: 'case', itemId: parts[1] } : { name: 'home' };
    default:
      return { name: 'home' };
  }
}

export function href(route: Route): string {
  switch (route.name) {
    case 'home':
      return '#/';
    case 'macro':
      return `#/topics/${encodeURIComponent(route.macroId)}`;
    case 'card':
      return `#/card/${encodeURIComponent(route.itemId)}`;
    case 'case':
      return `#/case/${encodeURIComponent(route.itemId)}`;
    default:
      return `#/${route.name}`;
  }
}

export function navigate(route: Route): void {
  const next = href(route);
  if (location.hash !== next) location.hash = next;
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(location.hash));
  useEffect(() => {
    const on = () => {
      setRoute(parseHash(location.hash));
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}
