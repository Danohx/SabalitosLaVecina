// app/_layout.tsx

import { Stack } from 'expo-router';
import { InventoryProvider } from '../(lib)/context/InventoryContext';
import { ToastProvider } from '../(lib)/context/ToastContext';

export default function Layout() {
  return (
    <ToastProvider> 
      <InventoryProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> 
        </Stack>
      </InventoryProvider>
    </ToastProvider>
  ); 
}