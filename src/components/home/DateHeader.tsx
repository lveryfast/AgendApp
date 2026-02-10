import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useCurrentTime} from '../../hooks/useCurrentTime';

interface DateHeaderProps {
    isDark: boolean;
}

export const DateHeader: React.FC<DateHeaderProps> = ({isDark}) => {
    const {formattedDate, formattedTime} = useCurrentTime();

    return (
        <View style={styles.container}>
        <Text style={[styles.date, {color: isDark ? '#F9FAFB' : '#1F2937'}]}>
            {formattedDate}
        </Text>
        <Text style={[styles.time, {color: isDark ? '#60A5FA' : '#3B82F6'}]}>
            {formattedTime}
        </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    date: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
    },
    time: {
        fontSize: 32,
        fontWeight: 'bold',
    },
});