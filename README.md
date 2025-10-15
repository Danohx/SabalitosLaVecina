# 🍧 Sabalitos La Vecina: Sistema de Punto de Venta (POS) Móvil

Sistema de Punto de Venta (POS) Móvil diseñado para modernizar y optimizar la gestión de inventario y ventas minoristas, enfocado en negocios con alta rotación de stock como tiendas de helados, sabalitos, frituras y papelería.

## 🎯 Propósito y Valor de Negocio de la Aplicación

Sabalitos La Vecina transforma la gestión tradicional de inventario en una herramienta móvil **rápida y predictiva**. Los principales objetivos de la aplicación son:

1.  **Venta Instantánea (Front-end):** Proporcionar una interfaz de ventas fluida y sin *lag* (gracias a la virtualización y la eficiencia $O(1)$ ) que acelera la toma de pedidos y la confirmación de la venta.
2.  **Control de Stock en Tiempo Real:** Mantener un inventario digitalizado que permite al usuario sumar, restar y dar de baja productos de forma inmediata.
3.  **Gestión Proactiva de Crisis:** Utilizar un sistema de **Notificaciones Inteligentes** para alertar al usuario sobre niveles de stock **Bajo ($\le 10$ un.)** y **Crítico ($\le 5$ un.)**, previniendo la pérdida de ventas por agotamiento de producto.
4.  **Toma de Decisiones Informada:** Generar reportes de ganancias y transacciones por período, filtrando la rentabilidad por categoría (Sabalitos, Frituras, Papelería).

---

## 🚀 Arquitectura y Stack Tecnológico

Este proyecto ha sido rigurosamente optimizado bajo los principios de **Clean Code** y **Eficiencia Algorítmica ($O()$)** para garantizar una experiencia de usuario fluida, incluso con grandes volúmenes de datos históricos e inventario.

| Componente | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Frontend Móvil** | React Native | Interfaz de usuario multiplataforma (iOS/Android). |
| **Lenguaje** | TypeScript (TS) | Robustez, tipado estático y mejor mantenimiento del código. |
| **Gestión de Estado** | React Context API & Custom Hooks | Orquestación de estado global, lógica de negocio y separación de intereses (SoC). |
| **Persistencia** | `AsyncStorage` | Almacenamiento local persistente de inventario e historial de ventas. |

---

## ✨ Optimizaciones Críticas de Rendimiento Implementadas (v2.0)

Se implementó una refactorización arquitectónica completa para eliminar problemas de *lag*, fallos de imagen y operaciones de datos ineficientes.

### 1. Rendimiento de UI y Scroll (Virtualización)

* **Problema:** Lentitud del *scroll* en listas grandes y fallo de carga de imágenes.
* **Solución:** Uso de **Virtualización** en todas las vistas de lista:
    * **Ventas/Principal:** Migración a **`FlatList`** con `getItemLayout` (look-up **O(1)**).
    * **Inventario:** Uso de **`SectionList`** para agrupar y virtualizar eficientemente las listas por categoría.

### 2. Eficiencia de Datos y Lógica ($O(1)$ Operaciones)

* **Problema:** Operaciones de carrito y mutación de stock eran $O(N)$ (Tiempo Lineal).
* **Solución:** Los estados internos de **`useCart.ts`** y **`useInventoryOperations.ts`** fueron refactorizados a estructuras **Hashmap (Objetos JS)**, asegurando que la adición, eliminación y mutación de stock sean operaciones **O(1) (Tiempo Constante)**.

### 3. Estabilidad y Persistencia (I/O Throttling)

* **Problema:** Sobrecarga de I/O en `AsyncStorage` debido a escrituras inmediatas y concurrentes (ej., 5 clics = 5 escrituras completas del inventario).
* **Solución:** Implementación de la técnica de **Debouncing** en el *hook* `useStorage.ts`. Las operaciones de guardado ahora se ejecutan solo después de un breve período de inactividad, garantizando la integridad de los datos y reduciendo la carga del dispositivo.

---

## 💻 Desarrollo Local

### Pre-requisitos

* Node.js (LTS recomendado)
* npm o yarn
* Expo CLI (`npm install -g expo-cli`)

### Instalación

1.  Clonar el repositorio:
    ```bash
    git clone [URL_DEL_REPOSITORIO]
    cd SabalitosLaVecina
    ```
2.  Instalar dependencias:
    ```bash
    npm install
    ```
3.  Ejecutar el proyecto:
    ```bash
    npm start
    ```
    Escanea el código QR con la aplicación Expo Go para iniciar en tu dispositivo móvil o emulador.

💡 "El código es poesia... y a veces, un buen bug es metáfota."
- danohx, 2025

[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/dantohltz/)
