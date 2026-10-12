import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './ui/tokens.css';
import './ui/base.css';
import './ui/components.css';
import './ui/screens.css';
import { App } from './app/App.tsx';
import { applyPrefsToDocument, loadPrefs } from './storage/prefs.ts';

// Apply theme and text size before the first paint to avoid a flash.
applyPrefsToDocument(loadPrefs());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
