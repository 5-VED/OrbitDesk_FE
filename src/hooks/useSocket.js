import { useEffect, useRef } from 'react';
import { connectSocket, disconnectSocket, getSocket } from '@/lib/socket';

export function useSocket() {
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = connectSocket();
        return () => {
            disconnectSocket();
        };
    }, []);

    return socketRef.current || getSocket();
}

export function useSocketEvent(eventName, handler) {
    const socket = getSocket();
    const handlerRef = useRef(handler);
    handlerRef.current = handler;

    useEffect(() => {
        if (!socket) return;

        const listener = (...args) => handlerRef.current(...args);
        socket.on(eventName, listener);

        return () => {
            socket.off(eventName, listener);
        };
    }, [socket, eventName]);
}
