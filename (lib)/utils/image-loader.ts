// utils/image-loader.ts

import { ImageSourcePropType } from 'react-native';

const IMAGE_MAP = {
    'uva': require('../../assets/logos/uva.png'),
    'jamaica': require('../../assets/logos/jamaica.png'), 
    'tamarindo': require('../../assets/logos/tamarindo.png'), 
    'sandia': require('../../assets/logos/sandia.png'), 
    'mango': require('../../assets/logos/mango.png'), 
    'limon': require('../../assets/logos/limon.png'),
    'chicle': require('../../assets/logos/chicle.png'), 
    'maracuya': require('../../assets/logos/maracuya.png'), 
    'piña': require('../../assets/logos/piña.png'), 
    'grosella': require('../../assets/logos/grosella.png'), 
    'mora azul': require('../../assets/logos/mora_azul.png'), 
    'pistache': require('../../assets/logos/pistache.png'), 
    'coco': require('../../assets/logos/coco.png'), 
    'galleta': require('../../assets/logos/galleta.png'), 
    'nuez': require('../../assets/logos/nuez.png'), 
    'chocolate': require('../../assets/logos/chocolate.png'), 
    'rompope': require('../../assets/logos/rompope.png'), 
    'arroz con leche': require('../../assets/logos/arroz_con_leche.png'), 
    'vainilla': require('../../assets/logos/vainilla.png'), 
    'fresa': require('../../assets/logos/fresa.png'), 
    'oreo': require('../../assets/logos/oreo.png'), 
    'mangonada': require('../../assets/logos/mangonada.png'), 
    // 'chamoyada': require('../../assets/logos/chamoyada.png'), 
    // 'chocobanana': require('../../assets/logos/chocobanana.png'), 
    'otros': require('../../assets/logos/otros.png'), // Imagen de fallback
};

/**
 * Obtiene la fuente de la imagen local basada en el título del sabor.
 * @param title El título del sabor (ej: "MANGONADA").
 * @returns La fuente de la imagen local requerida o un clasico.
 */

export function getFlavorImageSource(title: string): ImageSourcePropType {
    const normalizedTitle = title.toLowerCase().trim();
    
    if (normalizedTitle in IMAGE_MAP) {
        return IMAGE_MAP[normalizedTitle as keyof typeof IMAGE_MAP];
    }
    return IMAGE_MAP.otros;
}