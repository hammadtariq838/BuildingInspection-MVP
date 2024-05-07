import { useAppDispatch } from '@/app/hooks'
import { clearAuth } from '@/features/auth/authSlice';
import { Navigate, createLazyFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner';


function Logout() {
  const dispatch = useAppDispatch();
  dispatch(clearAuth());
  toast.success('Logout successful');
  return <Navigate to="/login" />
}

export const Route = createLazyFileRoute('/_public/logout')({
  component: Logout,
})