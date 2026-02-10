import React, {useState} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useApp} from '../context/AppContext';
import {WeeksTab} from './manage/WeeksTab';
import {EventsTab} from './manage/EventsTab';
import {TasksTab} from './manage/TasksTab';

type TabType = 'weeks' | 'events' | 'tasks';

export const ManageScreen: React.FC = () => {
    const {t} = useTranslation();
    const {isDark} = useApp();
    const [activeTab, setActiveTab] = useState<TabType>('weeks');

    const bgColor: string = isDark ? '#0F172A' : '#F3F4F6';
    const textColor: string = isDark ? '#F9FAFB' : '#1F2937';

    const renderTab = (): React.ReactElement => {
        switch (activeTab) {
        case 'weeks':
            return <WeeksTab />;
        case 'events':
            return <EventsTab />;
        case 'tasks':
            return <TasksTab />;
        default:
            return <WeeksTab />;
        }
    };

    const getTabLabel = (tab: TabType): string => {
        switch (tab) {
        case 'weeks':
            return t('manage.weeks');
        case 'events':
            return t('manage.events');
        case 'tasks':
            return t('manage.tasks');
        default:
            return '';
        }
    };

    return (
        <SafeAreaView style={[styles.container, {backgroundColor: bgColor}]}>
        <View style={styles.header}>
            <Text style={[styles.title, {color: textColor}]}>{t('manage.title')}</Text>
        </View>

        <View style={styles.tabBar}>
            {(['weeks', 'events', 'tasks'] as TabType[]).map((tab) => (
            <TouchableOpacity
                key={tab}
                style={[
                styles.tab,
                activeTab === tab && styles.activeTab,
                {borderColor: isDark ? '#374151' : '#E5E7EB'},
                ]}
                onPress={() => setActiveTab(tab)}
            >
                <Text
                style={[
                    styles.tabText,
                    {
                    color:
                        activeTab === tab
                        ? '#3B82F6'
                        : isDark
                            ? '#9CA3AF'
                            : '#6B7280',
                    },
                ]}
                >
                {getTabLabel(tab)}
                </Text>
            </TouchableOpacity>
            ))}
        </View>

        <View style={styles.content}>{renderTab()}</View>
        </SafeAreaView>
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
    tabBar: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderBottomWidth: 2,
    },
    activeTab: {
        borderBottomColor: '#3B82F6',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
    },
    content: {
        flex: 1,
    },
});