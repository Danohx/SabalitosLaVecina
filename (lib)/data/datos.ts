// data/datos.ts (o donde definiste tus datos)

// Tipo de Sabalitos
export type TipoSabor = 'Agua' | 'Leche' | 'Paletas'
export type TipoFritura = 'Palomitas' | 'Chicharrones' | 'Papas' | 'Otros'
export type TipoPapeleria = 'Lapices' | 'Lapiceros' | 'Borradores' | 'Sacapuntas' | 'Corrector' | 'Pegamento'

export type CategoriaProducto = 'Sabalitos' | 'Paletas' | 'Frituras' | 'Papeleria'; 

// Precios
export const PRECIOS_BASE: Record<TipoSabor, number> = {
  Agua: 2.00,
  Leche: 3.00,
  Paletas: 5.00 
};

export const PRECIOS_BASE_FRITURAS: Record<TipoFritura, number> = {
  Palomitas: 5.00,
  Chicharrones: 5.00,
  Papas: 5.00,
  Otros: 5.00
};

export const PRECIOS_BASE_PAPELERIA: Record<TipoPapeleria, number> = {
  Lapices: 5.00,
  Lapiceros: 7.00,
  Borradores: 4.00,
  Sacapuntas: 3.00,
  Corrector: 12.00,
  Pegamento: 8.00
};


export const UMBRAL_ALERTA = 5;

export type TipoProducto = TipoSabor | TipoFritura | TipoPapeleria;

export interface Producto {
  id: string; 
  titulo: string;
  imagen: any;
  stock: number;
  tipo: TipoProducto;
  precio: number;
  categoria: CategoriaProducto;
  descripcion?: string; // Opcional para más detalles
}

// Define la interfaz Sabor
export interface Sabor {
  id: string; 
  titulo: string;
  imagen: any;
  stock: number;
  tipo: TipoSabor;
  precio: number;
  categoria: CategoriaProducto;
}

// 🚨 NUEVA Interfaz de Venta Histórica (Reportes)
export interface VentaRegistro {
    id: string;
    saborId: string;
    titulo: string;
    tipo: TipoProducto;
    cantidad: number;
    categoria: CategoriaProducto;
    precioUnitario: number;
    ingresoTotal: number;
    fecha: number; // Timestamp
}

export interface AlertaStock {
    id: string; // ID único de la alerta (Sabor ID + Tipo)
    titulo: string;
    mensaje: string;
    nivel: 'Critico' | 'Bajo' | 'Seguro'; // Para el color
    saborId: string;
    stockActual: number;
}

export interface CartItem {
  id: string;
  quantity: number;
  tipo: TipoProducto; // Usa el tipo personalizado
}


// 🚨 CAMBIO CLAVE: El inventario inicial ahora es un array vacío.
export const INITIAL_INVENTORY: Sabor[] = [];

export const obtenerPrecio = (categoria: CategoriaProducto, tipo: TipoProducto): number => {
  switch (categoria) {
    case 'Sabalitos':
      return PRECIOS_BASE[tipo as TipoSabor] || 0;
    case 'Paletas':
      return PRECIOS_BASE[tipo as TipoSabor] || 0;
    case 'Frituras':
      return PRECIOS_BASE_FRITURAS[tipo as TipoFritura] || 0;
    case 'Papeleria':
      return PRECIOS_BASE_PAPELERIA[tipo as TipoPapeleria] || 0;
    default:
      return 0;
  }
};
