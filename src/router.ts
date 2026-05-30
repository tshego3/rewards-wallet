import { useState, useCallback } from 'react';
import type { RouteState, Screen } from './types';

const INITIAL_STATE: RouteState = { screen: 'dashboard' };

function parseHash(): RouteState {
  const hash = window.location.hash.slice(1) || '/';
  const parts = hash.split('/').filter(Boolean);

  switch (parts[0]) {
    case 'search':
      return { screen: 'search' };
    case 'settings':
      return { screen: 'settings' };
    case 'card':
      if (parts[1]) return { screen: 'details', cardId: parts[1] };
      return INITIAL_STATE;
    case 'add':
      return { screen: 'add' };
    case 'edit':
      if (parts[1]) return { screen: 'edit', cardId: parts[1] };
      return INITIAL_STATE;
    default:
      return INITIAL_STATE;
  }
}

export function navigate(screen: Screen, cardId?: string): void {
  switch (screen) {
    case 'dashboard':
      window.location.hash = '/';
      break;
    case 'search':
      window.location.hash = '/search';
      break;
    case 'settings':
      window.location.hash = '/settings';
      break;
    case 'details':
      window.location.hash = `/card/${cardId}`;
      break;
    case 'add':
      window.location.hash = '/add';
      break;
    case 'edit':
      window.location.hash = `/edit/${cardId}`;
      break;
  }
}

export function useRouter(): RouteState {
  const [route, setRoute] = useState<RouteState>(parseHash);

  const handleHashChange = useCallback(() => {
    setRoute(parseHash());
  }, []);

  // Attach listener on first call
  useState(() => {
    window.addEventListener('hashchange', handleHashChange);
    return undefined;
  });

  return route;
}
