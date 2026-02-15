import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useApp} from '../context/AppContext';

export const ConfigScreen: React.FC = () => {
    const {t, i18n} = useTranslation();
    const {isDark, setThemeMode, themeMode, setLanguage, language} = useApp();
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
            <Text style={[styles.sectionTitle, {color: textColor}]}>
            ℹ️ {t('config.about')}
            </Text>
            <Text style={[styles.version, {color: isDark ? '#9CA3AF' : '#6B7280'}]}>
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
    version: {
        fontSize: 14,
        marginBottom: 4,
    },
});