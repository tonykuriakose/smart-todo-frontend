import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

const GOOGLE_CLIENT_ID="711021198669-85uo6dnpb13ngj7htd977gg2k499odg4.apps.googleusercontent.com"

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster position='top-right' reverseOrder={false} />
    </QueryClientProvider>
  </GoogleOAuthProvider>
);