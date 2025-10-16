// context/ToastContext.tsx
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import ToastComponent, { ToastType } from '../components/ToastComponent';

interface ToastState {
    message: string;
    type: ToastType;
    duration: number;
    isVisible: boolean;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toast, setToast] = useState<ToastState>({
        message: '',
        type: 'info',
        duration: 3000,
        isVisible: false,
    });

    const hideToast = useCallback(() => {
        setToast(prev => ({ ...prev, isVisible: false }));
    }, []);

    const showToast = useCallback((
        message: string, 
        type: ToastType = 'info', 
        duration: number = 3000
    ) => {
        // Ocultar cualquier toast anterior antes de mostrar el nuevo
        hideToast(); 
        
        setToast({
            message,
            type,
            duration,
            isVisible: true,
        });
    }, [hideToast]);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast.isVisible && (
                <ToastComponent
                    message={toast.message}
                    type={toast.type}
                    duration={toast.duration}
                    onHide={hideToast}
                />
            )}
        </ToastContext.Provider>
    );
};

// El Hook de consumo
export const useToast = () => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast debe ser usado dentro de un ToastProvider');
    }
    return context;
};