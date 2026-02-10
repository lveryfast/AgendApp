import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useCurrentTime} from '../../hooks/useCurrentTime';

interface TimelineArrowProps {
    isDark: boolean;
}

export const TimelineArrow: React.FC<TimelineArrowProps> = ({isDark}) => {
    const {dayProgress} = useCurrentTime();

    const clampedProgress = Math.max(0, Math.min(100, dayProgress));
    
    const arrowColor: string = isDark ? '#60A5FA' : '#3B82F6';

    return (
        <View style={styles.container}>
        <View style={styles.lineContainer}>
            <View style={[styles.line, {backgroundColor: isDark ? '#374151' : '#E5E7EB'}]} />
            <View
            style={[
                styles.arrowContainer,
                {top: `${clampedProgress}%`},
            ]}
            >
            <View style={[styles.arrow, {borderLeftColor: arrowColor}]} />
            <Text style={[styles.arrowText, {color: arrowColor}]}>◀</Text>
            </View>
        </View>
        <View style={styles.timeLabels}>
            <Text style={[styles.label, {color: isDark ? '#9CA3AF' : '#6B7280'}]}>06:00</Text>
            <Text style={[styles.label, {color: isDark ? '#9CA3AF' : '#6B7280'}]}>14:00</Text>
            <Text style={[styles.label, {color: isDark ? '#9CA3AF' : '#6B7280'}]}>22:00</Text>
        </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 300,
        marginVertical: 16,
        paddingHorizontal: 16,
    },
    lineContainer: {
        width: 40,
        position: 'relative',
        alignItems: 'center',
    },
    line: {
        width: 2,
        height: '100%',
    },
    arrowContainer: {
        position: 'absolute',
        left: 0,
        flexDirection: 'row',
        alignItems: 'center',
        transform: [{translateY: -10}], // Centrar verticalmente
    },
    arrow: {
        width: 0,
        height: 0,
        borderTopWidth: 8,
        borderBottomWidth: 8,
        borderLeftWidth: 12,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
    },
    arrowText: {
        marginLeft: 4,
        fontSize: 12,
        fontWeight: 'bold',
    },
    timeLabels: {
        justifyContent: 'space-between',
        paddingVertical: 0,
        marginLeft: 8,
    },
    label: {
        fontSize: 12,
        fontWeight: '500',
    },
});