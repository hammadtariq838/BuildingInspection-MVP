import { Outlet, createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { Navigate } from '@tanstack/react-router';
import { useRefreshTokenMutation } from '@/services/user/userApiSlice';
import { clearAuth, setRefreshToken } from '@/features/auth/authSlice';
import { jwtDecode } from 'jwt-decode';

function ProtectedRoute() {
  const dispatch = useAppDispatch();
  const { accessToken, refreshToken } = useAppSelector((state) => state.auth);
  const [refreshTokenApi, { isLoading }] = useRefreshTokenMutation();
  const isAuthorized = accessToken !== null;

  useEffect(() => {
    const checkAuth = async () => {
      if (!accessToken) {
        dispatch(clearAuth());
        return;
      }

      const decoded = jwtDecode(accessToken);
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        try {
          const response = await refreshTokenApi({ refresh: refreshToken! }).unwrap();
          dispatch(setRefreshToken(response.access));
        } catch (error) {
          console.log('Failed to refresh token:', error);
          dispatch(clearAuth());
        }
      }
    };

    if (!isAuthorized) {
      checkAuth();
    }
  }, [dispatch, isAuthorized, refreshTokenApi, accessToken, refreshToken]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthorized ? <Outlet /> : <Navigate to="/login" />;
}


export const Route = createFileRoute('/_protected')({
  component: () => <ProtectedRoute />
})