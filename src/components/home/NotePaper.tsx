import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';

interface NotePaperProps {
    children: React.ReactNode;
    style?: ViewStyle;
    isDark: boolean;
}

export const NotePaper: React.FC<NotePaperProps> = ({children, style, isDark}) => {
    return (
        <View
        style={[
            styles.container,
            {
            backgroundColor: isDark ? '#1E1E1E' : '#FFFBF0',
            shadowColor: isDark ? '#000' : '#000',
            },
            style,
        ]}
        >
        <View style={styles.lines}>
            {Array.from({length: 20}).map((_, index) => (
            <View
                key={index}
                style={[
                styles.line,
                {backgroundColor: isDark ? '#2D2D2D' : '#E5E7EB'},
                ]}
            />
            ))}
        </View>
        <View style={styles.content}>{children}</View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 8,
        overflow: 'hidden',
        elevation: 3,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.15,
        shadowRadius: 6,
    },
    lines: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    line: {
        height: 24,
        marginTop: 24,
        opacity: 0.5,
    },
    content: {
        flex: 1,
        position: 'relative',
        zIndex: 1,
    },
});