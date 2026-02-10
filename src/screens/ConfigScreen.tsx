import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
    Switch,
} from 'react-native';
import {
    launchImageLibrary,
    launchCamera,
    ImagePickerResponse,
    CameraOptions,
    ImageLibraryOptions,
} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTheme} from '../hooks/useTheme';
import {useImageColors} from '../hooks/useImageColors';
import {Icon} from '../components/common/Icon';
import {storage, StorageKeys} from '../utils/storage';

type Language = 'es' | 'en';

export interface ConfigScreenProps {
    isDark: boolean;
    setIsDark: (value: boolean) => void; 
}

export const ConfigScreen: React.FC<ConfigScreenProps> = ({
    isDark,
    setIsDark,
}) => {
    const {themeMode, setThemeMode, isAdaptive, setAdaptiveMode} = useTheme();
    const {extractColors, palette} = useImageColors();
    const [language, setLanguage] = useState<Language>('es');
    const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async (): Promise<void> => {
        const savedLang = await AsyncStorage.getItem(StorageKeys.LANGUAGE);
        const savedImage = await storage.get(StorageKeys.BACKGROUND_IMAGE);
        if (savedLang) setLanguage(savedLang as Language);
        if (savedImage) setBackgroundImage(savedImage);
    };

    const selectImage = async (fromCamera: boolean): Promise<void> => {
        const options: CameraOptions & ImageLibraryOptions = {
        mediaType: 'photo',
        quality: 0.8 as 0.8,
        includeBase64: false,
        maxHeight: 2000,
        maxWidth: 2000,
        };

        const result: ImagePickerResponse = fromCamera
        ? await launchCamera(options)
        : await launchImageLibrary(options);

        if (result.assets && result.assets[0].uri) {
        const uri: string = result.assets[0].uri;
        setBackgroundImage(uri);
        await storage.set(StorageKeys.BACKGROUND_IMAGE, uri);

        if (isAdaptive) {
            await extractColors(uri);
        }
        }
    };

    const clearBackground = async (): Promise<void> => {
        setBackgroundImage(null);
        await storage.remove(StorageKeys.BACKGROUND_IMAGE);
    };

    const toggleAdaptive = async (value: boolean): Promise<void> => {
        await setAdaptiveMode(value);
        if (value && backgroundImage) {
        await extractColors(backgroundImage);
        }
    };

    const changeLanguage = async (lang: Language): Promise<void> => {
        setLanguage(lang);
        await AsyncStorage.setItem(StorageKeys.LANGUAGE, lang);
    };

    const toggleTheme = (): void => {
        setIsDark(!isDark);
    };

    const bgColor: string = isDark ? '#0F172A' : '#F3F4F6';
    const cardBg: string = isDark ? '#1E293B' : '#FFFFFF';
    const textColor: string = isDark ? '#F9FAFB' : '#1F2937';
    const subTextColor: string = isDark ? '#9CA3AF' : '#6B7280';

    return (
        <ScrollView style={[styles.container, {backgroundColor: bgColor}]}>
        <View style={styles.header}>
            <Text style={[styles.title, {color: textColor}]}>Configuración</Text>
        </View>

        <View style={[styles.section, {backgroundColor: cardBg}]}>
            <Text style={[styles.sectionTitle, {color: textColor}]}>🌐 Idioma</Text>
            <View style={styles.radioGroup}>
            <TouchableOpacity
                style={styles.radioOption}
                onPress={() => changeLanguage('es')}
            >
                <View
                style={[
                    styles.radio,
                    language === 'es' && styles.radioSelected,
                ]}
                />
                <Text style={[styles.radioLabel, {color: textColor}]}>
                Español
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.radioOption}
                onPress={() => changeLanguage('en')}
            >
                <View
                style={[
                    styles.radio,
                    language === 'en' && styles.radioSelected,
                ]}
                />
                <Text style={[styles.radioLabel, {color: textColor}]}>
                English
                </Text>
            </TouchableOpacity>
            </View>
        </View>

        <View style={[styles.section, {backgroundColor: cardBg}]}>
            <Text style={[styles.sectionTitle, {color: textColor}]}>
            🖼️ Fondo de Pantalla
            </Text>

            {backgroundImage && (
            <Image
                source={{uri: backgroundImage}}
                style={styles.previewImage}
                resizeMode="cover"
            />
            )}

            <View style={styles.imageButtons}>
            <TouchableOpacity
                style={styles.imageButton}
                onPress={() => selectImage(false)}
            >
                <Icon name="🖼️" size={20} />
                <Text style={styles.imageButtonText}>Galería</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.imageButton}
                onPress={() => selectImage(true)}
            >
                <Icon name="📷" size={20} />
                <Text style={styles.imageButtonText}>Cámara</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.imageButton, styles.defaultButton]}
                onPress={clearBackground}
            >
                <Icon name="🔄" size={20} />
                <Text style={styles.imageButtonText}>Default</Text>
            </TouchableOpacity>
            </View>
        </View>

        <View style={[styles.section, {backgroundColor: cardBg}]}>
            <Text style={[styles.sectionTitle, {color: textColor}]}>🎨 Tema</Text>
            <View style={styles.radioGroup}>
            {(['light', 'dark', 'auto'] as const).map((mode) => (
                <TouchableOpacity
                key={mode}
                style={styles.radioOption}
                onPress={() => setThemeMode(mode)}
                >
                <View
                    style={[
                    styles.radio,
                    themeMode === mode && styles.radioSelected,
                    ]}
                />
                <Text style={[styles.radioLabel, {color: textColor}]}>
                    {mode === 'light'
                    ? 'Claro'
                    : mode === 'dark'
                        ? 'Oscuro'
                        : 'Auto'}
                </Text>
                </TouchableOpacity>
            ))}
            </View>
            
            {/* Botón para probar setIsDark */}
            <TouchableOpacity
            style={[styles.toggleButton, {backgroundColor: isDark ? '#3B82F6' : '#F59E0B'}]}
            onPress={toggleTheme}
            >
            <Text style={styles.toggleButtonText}>
                {isDark ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
            </Text>
            </TouchableOpacity>
        </View>

        <View style={[styles.section, {backgroundColor: cardBg}]}>
            <View style={styles.row}>
            <View style={styles.adaptiveInfo}>
                <Text style={[styles.sectionTitle, {color: textColor}]}>
                ✨ Tema Adaptativo (IA)
                </Text>
                <Text style={[styles.adaptiveDesc, {color: subTextColor}]}>
                Extrae paleta de colores de la imagen de fondo
                </Text>
            </View>
            <Switch
                value={isAdaptive}
                onValueChange={toggleAdaptive}
                trackColor={{false: '#374151', true: '#3B82F6'}}
                thumbColor={isAdaptive ? '#FFFFFF' : '#9CA3AF'}
            />
            </View>

            {isAdaptive && palette && (
            <View style={styles.palettePreview}>
                <Text style={[styles.paletteTitle, {color: subTextColor}]}>
                Paleta detectada:
                </Text>
                <View style={styles.colorsRow}>
                <View
                    style={[styles.colorBox, {backgroundColor: palette.primary}]}
                />
                <View
                    style={[styles.colorBox, {backgroundColor: palette.secondary}]}
                />
                <View
                    style={[styles.colorBox, {backgroundColor: palette.accent}]}
                />
                </View>
            </View>
            )}
        </View>

        <View style={[styles.section, {backgroundColor: cardBg}]}>
            <Text style={[styles.sectionTitle, {color: textColor}]}>ℹ️ Acerca de</Text>
            <Text style={[styles.version, {color: subTextColor}]}>
            Versión 1.0.0 • Offline Mode
            </Text>
            <Text style={[styles.credits, {color: subTextColor}]}>
            React Native CLI + SQLite
            </Text>
        </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 16,
        paddingBottom: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    section: {
        margin: 16,
        marginTop: 0,
        marginBottom: 12,
        padding: 16,
        borderRadius: 12,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    radioGroup: {
        gap: 12,
    },
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#6B7280',
        marginRight: 12,
    },
    radioSelected: {
        borderColor: '#3B82F6',
        backgroundColor: '#3B82F6',
    },
    radioLabel: {
        fontSize: 16,
    },
    toggleButton: {
        marginTop: 16,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    toggleButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    previewImage: {
        width: '100%',
        height: 150,
        borderRadius: 8,
        marginBottom: 12,
    },
    imageButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    imageButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3B82F6',
        padding: 12,
        borderRadius: 8,
        gap: 8,
    },
    defaultButton: {
        backgroundColor: '#6B7280',
    },
    imageButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    adaptiveInfo: {
        flex: 1,
    },
    adaptiveDesc: {
        fontSize: 12,
        marginTop: 4,
    },
    palettePreview: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    paletteTitle: {
        fontSize: 12,
        marginBottom: 8,
    },
    colorsRow: {
        flexDirection: 'row',
        gap: 8,
    },
    colorBox: {
        width: 40,
        height: 40,
        borderRadius: 8,
    },
    version: {
        fontSize: 14,
        marginBottom: 4,
    },
    credits: {
        fontSize: 12,
    },
});