import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { selectIsAuthenticated } from '@/store/slices/authSlice';
import { connectSocket, disconnectSocket } from '@/lib/socket';

export const ProtectedRoute = () => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    useEffect(() => {
        if (isAuthenticated) {
            connectSocket();
        }
        return () => {
            disconnectSocket();
        };
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

