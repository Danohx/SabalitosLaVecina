// app/_layout.tsx

import { Stack } from 'expo-router';
import { InventoryProvider } from '../(lib)/context/InventoryContext';

export default function Layout() {
  return (
    <InventoryProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> 
      </Stack>
    </InventoryProvider>
  ); 
}