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
    ImagePickerResponse,
    ImageLibraryOptions,
} from 'react-native-image-picker';
import {useTranslation} from 'react-i18next';
import {useApp} from '../context/AppContext';
import {Icon} from '../components/common/Icon';
import {storage, StorageKeys} from '../utils/storage';

export const ConfigScreen: React.FC = () => {
    const {t, i18n} = useTranslation();
    const {isDark, setThemeMode, themeMode, setLanguage, language} = useApp();
    const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
    const [isAdaptive, setIsAdaptive] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async (): Promise<void> => {
        const savedImage = await storage.get(StorageKeys.BACKGROUND_IMAGE);
        if (savedImage) setBackgroundImage(savedImage);
    };

    const selectImage = async (): Promise<void> => {
        const options: ImageLibraryOptions = {
        mediaType: 'photo',
        quality: 0.8 as 0.8,
        includeBase64: false,
        maxHeight: 2000,
        maxWidth: 2000,
        };

        const result: ImagePickerResponse = await launchImageLibrary(options);

        if (result.assets && result.assets[0].uri) {
        const uri: string = result.assets[0].uri;
        setBackgroundImage(uri);
        await storage.set(StorageKeys.BACKGROUND_IMAGE, uri);
        }
    };

    const clearBackground = async (): Promise<void> => {
        setBackgroundImage(null);
        await storage.remove(StorageKeys.BACKGROUND_IMAGE);
    };

    const handleChangeLanguage = async (lang: 'es' | 'en') => {
        await setLanguage(lang);
        await i18n.changeLanguage(lang);
    };

    const handleChangeTheme = async (mode: 'light' | 'dark' | 'auto') => {
        await setThemeMode(mode);
    };

    const bgColor: string = isDark ? '#0F172A' : '#F3F4F6';
    const cardBg: string = isDark ? '#1E293B' : '#FFFFFF';
    const textColor: string = isDark ? '#F9FAFB' : '#1F2937';
    const subTextColor: string = isDark ? '#9CA3AF' : '#6B7280';

    return (
        <ScrollView style={[styles.container, {backgroundColor: bgColor}]}>
        <View style={styles.header}>
            <Text style={[styles.title, {color: textColor}]}>
            {t('config.title')}
            </Text>
        </View>

        <View style={[styles.section, {backgroundColor: cardBg}]}>
            <Text style={[styles.sectionTitle, {color: textColor}]}>
            🌐 {t('config.language')}
            </Text>
            <View style={styles.radioGroup}>
            <TouchableOpacity
                style={styles.radioOption}
                onPress={() => handleChangeLanguage('es')}
            >
                <View
                style={[
                    styles.radio,
                    language === 'es' && styles.radioSelected,
                ]}
                />
                <Text style={[styles.radioLabel, {color: textColor}]}>
                {t('config.spanish')}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.radioOption}
                onPress={() => handleChangeLanguage('en')}
            >
                <View
                style={[
                    styles.radio,
                    language === 'en' && styles.radioSelected,
                ]}
                />
                <Text style={[styles.radioLabel, {color: textColor}]}>
                {t('config.english')}
                </Text>
            </TouchableOpacity>
            </View>
        </View>

        <View style={[styles.section, {backgroundColor: cardBg}]}>
            <Text style={[styles.sectionTitle, {color: textColor}]}>
            🖼️ {t('config.background')}
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
                onPress={selectImage}
            >
                <Icon name="🖼️" size={20} />
                <Text style={styles.imageButtonText}>{t('config.gallery')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.imageButton, styles.defaultButton]}
                onPress={clearBackground}
            >
                <Icon name="🔄" size={20} />
                <Text style={styles.imageButtonText}>{t('config.default')}</Text>
            </TouchableOpacity>
            </View>
        </View>

        <View style={[styles.section, {backgroundColor: cardBg}]}>
            <Text style={[styles.sectionTitle, {color: textColor}]}>
            🎨 {t('config.theme')}
            </Text>
            <View style={styles.radioGroup}>
            {(['light', 'dark', 'auto'] as const).map((mode) => (
                <TouchableOpacity
                key={mode}
                style={styles.radioOption}
                onPress={() => handleChangeTheme(mode)}
                >
                <View
                    style={[
                    styles.radio,
                    themeMode === mode && styles.radioSelected,
                    ]}
                />
                <Text style={[styles.radioLabel, {color: textColor}]}>
                    {t(`config.${mode}`)}
                </Text>
                </TouchableOpacity>
            ))}
            </View>
        </View>

        <View style={[styles.section, {backgroundColor: cardBg}]}>
            <View style={styles.row}>
            <View style={styles.adaptiveInfo}>
                <Text style={[styles.sectionTitle, {color: textColor}]}>
                ✨ {t('config.adaptive')}
                </Text>
                <Text style={[styles.adaptiveDesc, {color: subTextColor}]}>
                {t('config.adaptiveDesc')}
                </Text>
            </View>
            <Switch
                value={isAdaptive}
                onValueChange={setIsAdaptive}
                trackColor={{false: '#374151', true: '#3B82F6'}}
                thumbColor={isAdaptive ? '#FFFFFF' : '#9CA3AF'}
            />
            </View>
        </View>

        <View style={[styles.section, {backgroundColor: cardBg}]}>
            <Text style={[styles.sectionTitle, {color: textColor}]}>
            ℹ️ {t('config.about')}
            </Text>
            <Text style={[styles.version, {color: subTextColor}]}>
            {t('config.version')}
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
    version: {
        fontSize: 14,
        marginBottom: 4,
    },
});