import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // 👈 Importar la librería de iconos

export default function TabLayout() {
  return (
      <Tabs
      screenOptions={{
        headerTitleAlign: 'center',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
        tabBarStyle: {},
        tabBarLabelStyle: {
            fontWeight: 'bold',
        },
            // 🚨 Color de pestaña activa (para resaltar el icono)
            tabBarActiveTintColor: '#f4511e',
        }}
    >
      {/* 👈 ¡DEBES INCLUIR LAS RUTAS AQUÍ! */}
      <Tabs.Screen
        name="index" // El archivo index.tsx
        options={{ 
            title: 'Vender', 
            tabBarIcon: ({ color, size }) => (
                <Ionicons name="cash-outline" size={size} color={color} />
            ),
         }}
      />
      <Tabs.Screen
        name="alertas" // El archivo Alertas.tsx
        options={{ 
            title: 'Alertas', 
            tabBarIcon: ({ color, size }) => (
                <Ionicons name="cube-outline" size={size} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="inventario" // El archivo Inventario.tsx
        options={{ 
            title: 'Inventario',
            tabBarIcon: ({ color, size }) => (
                <Ionicons name="notifications-outline" size={size} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="reportes" // El archivo Reportes.tsx
        options={{ 
            title: 'Ganancias',
            tabBarIcon: ({ color, size }) => (
                <Ionicons name="bar-chart-outline" size={size} color={color} />
            ),
        }}
      />
      {/* ... */}
    </Tabs>
  );
}

