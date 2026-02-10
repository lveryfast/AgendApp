import React, {useState, useCallback} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    SafeAreaView,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {DateHeader} from '../components/home/DateHeader';
import {TaskPanel} from '../components/home/TaskPanel';
import {EventBlock} from '../components/home/EventBlock';
import {TimelineArrow} from '../components/home/TimelineArrow';
import {NotePaper} from '../components/home/NotePaper';
import {WeekService} from '../services/WeekService';
import {DayService} from '../services/DayService';
import {EventService} from '../services/EventService';
import {Week} from '../models/Week';
import {Day} from '../models/Day';
import {Event} from '../models/Event';
import {storage, StorageKeys} from '../utils/storage';
import {getDayName} from '../utils/date';

interface HomeScreenProps {
    isDark: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({isDark}) => {
    const [currentWeek, setCurrentWeek] = useState<Week | null>(null);
    const [todayEvents, setTodayEvents] = useState<Event[]>([]);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [currentDay, setCurrentDay] = useState<Day | null>(null);
    useFocusEffect(
        useCallback(() => {
        loadCurrentWeek();
        }, [])
    );

    const loadCurrentWeek = async (): Promise<void> => {
        try {
        const savedWeekId = await storage.get(StorageKeys.LAST_WEEK_ID);
        let week: Week | null = null;

        if (savedWeekId) {
            week = await WeekService.getWeekById(savedWeekId);
        }

        if (!week) {
            const weeks = await WeekService.getAllWeeks();
            if (weeks.length > 0) {
            week = weeks[0];
            }
        }

        if (week) {
            setCurrentWeek(week);
            await storage.set(StorageKeys.LAST_WEEK_ID, week.id);
            await loadTodayEvents(week.id);
        }
        } catch (error) {
        console.error('Error loading week:', error);
        }
    };

    const loadTodayEvents = async (weekId: string): Promise<void> => {
        try {
        const days = await DayService.getDaysByWeekId(weekId);
        const today = new Date();
        const dayIndex = (today.getDay() + 6) % 7;
        const todayDay = days.find((d: Day) => d.dayIndex === dayIndex);

        if (todayDay) {
            setCurrentDay(todayDay);
            const events = await EventService.getEventsByDayId(todayDay.id);
            setTodayEvents(events);
        }
        } catch (error) {
        console.error('Error loading events:', error);
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        if (currentWeek) {
        await loadTodayEvents(currentWeek.id);
        }
        setRefreshing(false);
    }, [currentWeek]);

    const bgColor: string = isDark ? '#0F172A' : '#F3F4F6';

    return (
        <SafeAreaView style={[styles.container, {backgroundColor: bgColor}]}>
        <DateHeader isDark={isDark} />

        {currentWeek ? (
            <>
            <TaskPanel
                weekId={currentWeek.id}
                isDark={isDark}
                onTaskUpdate={() => {}}
            />

            <NotePaper isDark={isDark} style={styles.noteContainer}>
                <View style={styles.eventsHeader}>
                <Text
                    style={[
                    styles.eventsTitle,
                    {color: isDark ? '#F9FAFB' : '#1F2937'},
                    ]}
                >
                    📝 Eventos del Día
                </Text>
                <Text
                    style={[
                    styles.dayName,
                    {color: isDark ? '#9CA3AF' : '#6B7280'},
                    ]}
                >
                    {currentDay ? currentDay.dayName : getDayName(new Date().getDay())}
                </Text>
                </View>

                <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                showsVerticalScrollIndicator={false}
                >
                {todayEvents.length > 0 ? (
                    todayEvents.map((event: Event) => (
                    <EventBlock key={event.id} event={event} />
                    ))
                ) : (
                    <View style={styles.emptyState}>
                    <Text
                        style={[
                        styles.emptyText,
                        {color: isDark ? '#9CA3AF' : '#6B7280'},
                        ]}
                    >
                        No hay eventos programados para hoy
                    </Text>
                    </View>
                )}
                </ScrollView>

                <TimelineArrow isDark={isDark} />
            </NotePaper>
            </>
        ) : (
            <View style={styles.emptyWeek}>
            <Text style={[styles.emptyWeekText, {color: isDark ? '#9CA3AF' : '#6B7280'}]}>
                No hay semanas creadas.{'\n'}Ve a Gestión para crear una.
            </Text>
            </View>
        )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    noteContainer: {
        flex: 1,
        margin: 16,
        marginTop: 8,
    },
    eventsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        paddingBottom: 8,
    },
    eventsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    dayName: {
        fontSize: 14,
        fontWeight: '500',
    },
    emptyState: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        fontStyle: 'italic',
    },
    emptyWeek: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyWeekText: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
    },
});