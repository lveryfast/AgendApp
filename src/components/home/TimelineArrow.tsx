import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useCurrentTime} from '../../hooks/useCurrentTime';

interface TimelineArrowProps {
    isDark: boolean;
}

export const TimelineArrow: React.FC<TimelineArrowProps> = ({isDark}) => {
    const {dayProgress} = useCurrentTime();

    const arrowColor: string = isDark ? '#60A5FA' : '#3B82F6';

    return (
        <View style={styles.container}>
        <View style={styles.line}>
            <View
            style={[
                styles.arrow,
                {top: `${dayProgress}%`, borderRightColor: arrowColor},
            ]}
            >
            <Text style={[styles.arrowText, {color: arrowColor}]}>←</Text>
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
        height: 200,
        marginVertical: 16,
        paddingHorizontal: 16,
    },
    line: {
        width: 2,
        backgroundColor: '#E5E7EB',
        marginRight: 16,
        position: 'relative',
    },
    arrow: {
        position: 'absolute',
        left: -6,
        width: 0,
        height: 0,
        borderTopWidth: 6,
        borderBottomWidth: 6,
        borderRightWidth: 12,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    arrowText: {
        position: 'absolute',
        left: 8,
        fontSize: 16,
        fontWeight: 'bold',
    },
    timeLabels: {
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    label: {
        fontSize: 12,
        fontWeight: '500',
    },
});