import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@/styles/tailwind.css';
import '@/styles/main.scss';
import App from 'src/App';

const root = document.getElementById('root');
if (!root) {
  throw new Error('Root element not found');
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);
