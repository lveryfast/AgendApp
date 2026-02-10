import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';

interface TaskCheckboxProps {
    checked: boolean;
    onPress: () => void;
    title: string;
    titleStyle?: object;
}

export const TaskCheckbox: React.FC<TaskCheckboxProps> = ({
    checked,
    onPress,
    title,
    titleStyle,
}) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
        <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
            {checked && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={[styles.title, checked && styles.titleCompleted, titleStyle]}>
            {title}
        </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#3B82F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    checkboxChecked: {
        backgroundColor: '#3B82F6',
    },
    checkmark: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 16,
        color: '#1F2937',
        flex: 1,
    },
    titleCompleted: {
        textDecorationLine: 'line-through',
        color: '#9CA3AF',
    },
});