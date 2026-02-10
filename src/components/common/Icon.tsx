import React from 'react';
import {Text, StyleSheet, ViewStyle} from 'react-native';

interface IconProps {
    name: string;
    size?: number;
    color?: string;
    style?: ViewStyle;
}

export const Icon: React.FC<IconProps> = ({
    name,
    size = 24,
    color = '#000',
    style,
    }) => {
    return <Text style={[styles.icon, {fontSize: size, color}, style]}>{name}</Text>;
};

const styles = StyleSheet.create({
    icon: {
        textAlign: 'center',
    },
});