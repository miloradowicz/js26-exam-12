import { Route, Routes } from 'react-router-dom';
import { Container } from '@mui/material';

import { useAppSelector } from './app/hooks';
import { selectError, selectUser } from './features/users/usersSlice';
import SignIn from './features/users/containers/SignIn';
import SignUp from './features/users/containers/SignUp';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { isGenericError } from './helpers/error-helpers';
import Header from './components/UI/Header/Header';
import ImagesViewer from './features/images/containers/ImagesViewer';
import Page404 from './components/Page404/Page404';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import ImageCreator from './features/images/containers/ImageCreator';
import { signInRoute, signUpRoute } from './constants';

const App = () => {
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();

  const user = useAppSelector(selectUser);
  const userError = useAppSelector(selectError);

  useEffect(() => {
    if (userError) {
      closeSnackbar();
    }

    if (isGenericError(userError)) {
      enqueueSnackbar(userError.error, { variant: 'error' });
    }
  }, [closeSnackbar, enqueueSnackbar, userError]);

  return (
    <>
      <Header />
      <Container sx={{ py: 8, px: 2, minWidth: 360 }}>
        <Routes>
          <Route path="/" element={<ImagesViewer />} />
          <Route path="/images" element={<ImagesViewer />} />
          <Route path="/images/by-author/:id" element={<ImagesViewer />} />
          <Route
            path="/images/my-images"
            element={
              <ProtectedRoute
                isAllowed={user?.role === 'user' || user?.role === 'admin'}
              >
                <ImagesViewer authorId={user?._id} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/images/new"
            element={
              <ProtectedRoute
                isAllowed={user?.role === 'user' || user?.role === 'admin'}
              >
                <ImageCreator />
              </ProtectedRoute>
            }
          />
          <Route path={signInRoute} element={<SignIn />} />
          <Route path={signUpRoute} element={<SignUp />} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </Container>
    </>
  );
};

export default App;
