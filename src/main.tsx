import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import App from './App.tsx';
import './index.css';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App databaseClient={supabase} />
  </StrictMode>
);
