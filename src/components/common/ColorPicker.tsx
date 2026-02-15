import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Slider from '@react-native-community/slider';
import {rgbToHex} from '../../utils/colors';

interface ColorPickerProps {
    initialColor?: string;
    onColorChange: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
    initialColor = '#FF6B6B',
    onColorChange,
}) => {
    const [r, setR] = useState<number>(255);
    const [g, setG] = useState<number>(107);
    const [b, setB] = useState<number>(107);

    useEffect(() => {
        if (initialColor) {
        const cleanHex = initialColor.replace('#', '');
        setR(parseInt(cleanHex.substring(0, 2), 16) || 255);
        setG(parseInt(cleanHex.substring(2, 4), 16) || 107);
        setB(parseInt(cleanHex.substring(4, 6), 16) || 107);
        }
    }, [initialColor]);

    useEffect(() => {
        const hex: string = rgbToHex(r, g, b);
        onColorChange(hex);
    }, [r, g, b, onColorChange]);

    return (
        <View style={styles.container}>
        <View style={[styles.preview, {backgroundColor: rgbToHex(r, g, b)}]}>
            <Text style={styles.previewText}>{rgbToHex(r, g, b)}</Text>
        </View>

        <View style={styles.sliderContainer}>
            <Text style={styles.label}>R: {r}</Text>
            <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={255}
            value={r}
            onValueChange={(value: number) => setR(Math.round(value))}
            minimumTrackTintColor="#EF4444"
            maximumTrackTintColor="#FEE2E2"
            thumbTintColor="#EF4444"
            />
        </View>

        <View style={styles.sliderContainer}>
            <Text style={styles.label}>G: {g}</Text>
            <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={255}
            value={g}
            onValueChange={(value: number) => setG(Math.round(value))}
            minimumTrackTintColor="#10B981"
            maximumTrackTintColor="#D1FAE5"
            thumbTintColor="#10B981"
            />
        </View>

        <View style={styles.sliderContainer}>
            <Text style={styles.label}>B: {b}</Text>
            <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={255}
            value={b}
            onValueChange={(value: number) => setB(Math.round(value))}
            minimumTrackTintColor="#3B82F6"
            maximumTrackTintColor="#DBEAFE"
            thumbTintColor="#3B82F6"
            />
        </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#1E293B',
        borderRadius: 12,
    },
    preview: {
        height: 60,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#374151',
    },
    previewText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 2,
    },
    sliderContainer: {
        marginBottom: 16,
    },
    label: {
        color: '#E5E7EB',
        marginBottom: 8,
        fontSize: 14,
        fontWeight: '600',
    },
    slider: {
        width: '100%',
        height: 40,
    },
});