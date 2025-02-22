import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { CssBaseline } from '@mui/material';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { SnackbarProvider } from 'notistack';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './app/store.ts';
import { GOOGLE_CLIENT_ID } from './constants.ts';
import { addAuthorization } from './api.ts';

addAuthorization(store);

createRoot(document.getElementById('root')!).render(
  <>
    <CssBaseline />
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <BrowserRouter>
          <SnackbarProvider
            autoHideDuration={3000}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            maxSnack={1}
          >
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
              <App />
            </GoogleOAuthProvider>
          </SnackbarProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </>,
);
