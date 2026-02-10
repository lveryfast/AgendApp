import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Event} from '../../models/Event';
import {getContrastColor} from '../../utils/colors';

interface EventBlockProps {
    event: Event;
}

export const EventBlock: React.FC<EventBlockProps> = ({event}) => {
    const textColor: string = getContrastColor(event.color);

    return (
        <View style={[styles.container, {backgroundColor: event.color}]}>
        <View style={styles.timeContainer}>
            <Text style={[styles.time, {color: textColor}]}>⏰</Text>
        </View>
        <View style={styles.content}>
            <Text style={[styles.title, {color: textColor}]}>{event.title}</Text>
            <Text style={[styles.timeRange, {color: textColor}]}>
            {event.startTime} - {event.endTime}
            </Text>
            {event.description ? (
            <Text style={[styles.description, {color: textColor}]} numberOfLines={2}>
                {event.description}
            </Text>
            ) : null}
        </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderRadius: 12,
        marginVertical: 6,
        marginHorizontal: 16,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    timeContainer: {
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    time: {
        fontSize: 20,
    },
    content: {
        flex: 1,
        padding: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    timeRange: {
        fontSize: 14,
        opacity: 0.9,
        marginBottom: 4,
    },
    description: {
        fontSize: 12,
        opacity: 0.8,
    },
});