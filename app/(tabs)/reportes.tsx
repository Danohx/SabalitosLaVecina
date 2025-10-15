// app/(tabs)/reportes.tsx (Optimizado)

import { View, Text, StyleSheet, FlatList, ActivityIndicator, Dimensions } from 'react-native';
import React, { useMemo, useState, useCallback } from 'react';
import { useInventory } from '../../(lib)/context/InventoryContext';
import { COLOR_PALETTE } from '../../(lib)/utils/colors';
import { CategoriaProducto } from '../../(lib)/data/datos';
import TypeCard from '../../(lib)/components/TypeCard';
import SaleItem from '../../(lib)/components/SaleItem';
import PeriodSelector from '../../(lib)/components/PeriodSelector';
import SummaryCard from '../../(lib)/components/SummaryCard';

const PAGE_SIZE = 15;

type AggregatedDataItem = {
    type: string;
    totalRevenue: number;
    transactionCount: number;
};

type TypeConfig = {
    icon: string;
    label: string;
    badgeStyle: any;
    color: string;
};

const MemoizedSaleItem = React.memo(SaleItem);

const useProcessedSales = (salesHistory: any[], selectedPeriod: string | number | null) => {
    return useMemo(() => {
        let cutoffDate: Date | null = null;
        
        if (selectedPeriod === 'today') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            cutoffDate = today;
        } else if (typeof selectedPeriod === 'number') {
            cutoffDate = new Date(new Date().setDate(new Date().getDate() - selectedPeriod));
        }

        // Paso 1: Filtrado O(N)
        const filteredHistory = salesHistory.filter(sale => 
            !cutoffDate || new Date(sale.fecha) >= cutoffDate
        );
        const aggregated = filteredHistory.reduce((acc: Record<string, AggregatedDataItem>, sale) => {
            const category = sale.categoria || 'General';
            
            if (!acc[category]) {
                acc[category] = { type: category, totalRevenue: 0, transactionCount: 0 };
            }

            acc[category].totalRevenue += sale.ingresoTotal;
            acc[category].transactionCount++;
            
            return acc;
        }, {});
        const aggregatedArray = Object.values(aggregated).sort((a, b) => b.totalRevenue - a.totalRevenue);
        const sortedSales = [...filteredHistory].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

        const totalRevenue = aggregatedArray.reduce((sum, item) => sum + item.totalRevenue, 0);

        return { aggregatedData: aggregatedArray, processedSales: sortedSales, totalRevenue };
    }, [salesHistory, selectedPeriod]); // Se ejecuta solo si estos cambian
}


const Reportes = () => {
    const { salesHistory, isLoading } = useInventory();
    const [page, setPage] = useState(1);
    const [selectedPeriod, setSelectedPeriod] = useState<string | number | null>('today');

    const { aggregatedData, processedSales, totalRevenue } = useProcessedSales(salesHistory, selectedPeriod);
    const getTypeConfig = useCallback((category: CategoriaProducto | string): TypeConfig => {
        switch(category) {
            case 'Sabalitos':
                return { icon: '🍧', label: 'Sabalitos', badgeStyle: styles.sabalitosBadge, color: '#FF6B6B' };
            case 'Paletas':
                return { icon: '🍭', label: 'Paletas', badgeStyle: styles.paletasBadge, color: '#4ECDC4' };
            case 'Frituras':
                return { icon: '🍿', label: 'Frituras', badgeStyle: styles.friturasBadge, color: '#FFD166' };
            case 'Papeleria':
                return { icon: '📚', label: 'Papeleria', badgeStyle: styles.papeleriaBadge, color: '#6A0572' };
            default:
                return { icon: '📦', label: 'General', badgeStyle: styles.defaultBadge, color: '#9E9E9E' };
        }
    }, []);

    const pagedSales = useMemo(() => {
        const end = page * PAGE_SIZE;
        return processedSales.slice(0, end);
    }, [processedSales, page]);

    const loadMore = useCallback(() => {
        if (pagedSales.length < processedSales.length) {
            setPage(prevPage => prevPage + 1);
        }
    }, [processedSales.length, pagedSales.length]);

    const handlePeriodChange = (value: string | number | null) => {
        setPage(1); // Resetear paginación
        setSelectedPeriod(value);
    };

    const MemoizedListHeader = useMemo(() => () => (
        <View style={styles.headerContainer}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Reporte de Ganancias</Text>
                <Text style={styles.headerSubtitle}>Resumen de tu actividad comercial</Text>
            </View>

            <SummaryCard totalRevenue={totalRevenue} selectedPeriod={selectedPeriod} />

            <PeriodSelector selectedPeriod={selectedPeriod} onPeriodChange={handlePeriodChange} />

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Ganancias por Categoria</Text>
                <Text style={styles.sectionCount}>({aggregatedData.length} Tipos)</Text>
            </View>
            
            <FlatList
                data={aggregatedData}
                renderItem={({ item }) => <TypeCard item={item} getTypeConfig={getTypeConfig} />}
                keyExtractor={item => item.type}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.aggregatedList}
            />

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Historial de Transacciones</Text>
                <Text style={styles.sectionCount}>({processedSales.length} ventas)</Text>
            </View>
        </View>
    ), [totalRevenue, selectedPeriod, aggregatedData, processedSales.length, handlePeriodChange, getTypeConfig]); 

    const renderItem = ({ item, index }: { item: any, index: number }) => (
        <MemoizedSaleItem item={item} index={index} getTypeConfig={getTypeConfig} />
    );

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLOR_PALETTE.primary} />
                <Text style={styles.loading}>Cargando reportes...</Text>
            </View>
        );
    }

    if (salesHistory.length === 0) {
        return (
            <View style={styles.container}>
                <MemoizedListHeader />
                <View style={styles.emptyState}>
                    <Text style={styles.emptyIcon}>📊</Text>
                    <Text style={styles.emptyTitle}>No hay ventas registradas</Text>
                    <Text style={styles.emptySubtitle}>
                        Cuando realices ventas, aparecerán en este historial
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={pagedSales}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={MemoizedListHeader}
                contentContainerStyle={styles.scrollContent}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                    pagedSales.length < processedSales.length 
                        ? <ActivityIndicator size="small" color={COLOR_PALETTE.primary} style={styles.loadingMore} /> 
                        : pagedSales.length > 0 
                        ? <Text style={styles.endOfList}>Fin del historial.</Text>
                        : null
                    }
            />
        </View>
    );
};

export default Reportes;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLOR_PALETTE.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading: { 
    textAlign: 'center', 
    marginTop: 16,
    color: COLOR_PALETTE.textSecondary,
    fontSize: 16,
  },
  endOfList: {
    textAlign: 'center',
    paddingVertical: 10,
    color: COLOR_PALETTE.textLight,
    fontSize: 12,
  },
  headerContainer: {
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 10,
  },
  headerTitle: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: COLOR_PALETTE.textPrimary,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLOR_PALETTE.textSecondary,
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLOR_PALETTE.textPrimary,
  },
  sectionCount: {
    fontSize: 14,
    color: COLOR_PALETTE.textSecondary,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  aggregatedList: {
    paddingVertical: 5,
    paddingRight: 10,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLOR_PALETTE.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLOR_PALETTE.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingMore: {
    marginVertical: 10,
  },
  // Estilos para getTypeConfig
  waterBadge: {
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
  },
  milkBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  candyBadge: {
    backgroundColor: 'rgba(255, 105, 180, 0.1)',
  },
  defaultBadge: {
    backgroundColor: 'rgba(158, 158, 158, 0.1)',
  },
  sabalitosBadge: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  paletasBadge: {
      backgroundColor: 'rgba(78, 205, 196, 0.1)',
  },
  friturasBadge: {
      backgroundColor: 'rgba(255, 209, 102, 0.1)',
  },
  papeleriaBadge: {
      backgroundColor: 'rgba(106, 5, 114, 0.1)',
  },

});
