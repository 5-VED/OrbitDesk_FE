import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { selectIsAuthenticated, selectCurrentUser, selectAuthLoading } from '@/store/slices/authSlice';
import { Loader } from '@/components/ui/Loader';

export const AdminRoute = () => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectCurrentUser);
    const loading = useAppSelector(selectAuthLoading);

    if (loading) {
        return <Loader fullScreen />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (user?.role_type !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};