import React, {useState, useCallback, useMemo} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    SafeAreaView,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {useApp} from '../context/AppContext';
import {DateHeader} from '../components/home/DateHeader';
import {TaskPanel} from '../components/home/TaskPanel';
import {WeekService} from '../services/WeekService';
import {DayService} from '../services/DayService';
import {EventService} from '../services/EventService';
import {Week} from '../models/Week';
import {Day} from '../models/Day';
import {Event} from '../models/Event';
import {storage, StorageKeys} from '../utils/storage';
import {getTranslatedDayName} from '../utils/date';

const useCurrentTime = () => {
    const [currentTime, setCurrentTime] = React.useState(new Date());

    React.useEffect(() => {
        const timer = setInterval(() => {
        setCurrentTime(new Date());
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    const dayProgress = React.useMemo(() => {
        const hours = currentTime.getHours();
        const minutes = currentTime.getMinutes();
        const totalMinutes = hours * 60 + minutes;
        const startOfDay = 6 * 60; 
        const endOfDay = 22 * 60; 

        if (totalMinutes < startOfDay) return 0;
        if (totalMinutes > endOfDay) return 100;

        return ((totalMinutes - startOfDay) / (endOfDay - startOfDay)) * 100;
    }, [currentTime]);

    return {currentTime, dayProgress};
};

interface TimeBlockProps {
    startTime: string;
    endTime: string;
    title?: string;
    description?: string;
    color?: string;
    isDark: boolean;
    isEmpty?: boolean;
}

const TimeBlock: React.FC<TimeBlockProps> = ({
    startTime,
    endTime,
    title,
    description,
    color,
    isDark,
    isEmpty = false,
}) => {
    if (isEmpty) {
        return (
        <View style={[styles.emptyBlock, {borderColor: isDark ? '#374151' : '#E5E7EB'}]}>
            <Text style={[styles.emptyTime, {color: isDark ? '#6B7280' : '#9CA3AF'}]}>
            {startTime} - {endTime}
            </Text>
            <Text style={[styles.emptyLabel, {color: isDark ? '#6B7280' : '#9CA3AF'}]}>
            Libre
            </Text>
        </View>
        );
    }

    return (
        <View style={[styles.eventBlock, {backgroundColor: color || '#3B82F6'}]}>
        <View style={styles.eventTimeContainer}>
            <Text style={styles.eventTimeIcon}>⏰</Text>
        </View>
        <View style={styles.eventContent}>
            <Text style={styles.eventTitle}>{title}</Text>
            <Text style={styles.eventTimeRange}>
            {startTime} - {endTime}
            </Text>
            {description ? (
            <Text style={styles.eventDescription} numberOfLines={2}>
                {description}
            </Text>
            ) : null}
        </View>
        </View>
    );
};

interface TimelineLineProps {
    dayProgress: number;
    isDark: boolean;
}

const TimelineLine: React.FC<TimelineLineProps> = ({dayProgress, isDark}) => {
    const clampedProgress = Math.max(0, Math.min(100, dayProgress));

    return (
        <View style={styles.timelineContainer}>
        <View style={[styles.timelineLine, {backgroundColor: isDark ? '#374151' : '#E5E7EB'}]} />
        <View style={[styles.timelineArrow, {top: `${clampedProgress}%`}]}>
            <View style={[styles.arrow, {borderLeftColor: isDark ? '#60A5FA' : '#3B82F6'}]} />
        </View>
        <View style={styles.timeMarkers}>
            <Text style={[styles.timeMarker, {color: isDark ? '#9CA3AF' : '#6B7280'}]}>06:00</Text>
            <Text style={[styles.timeMarker, {color: isDark ? '#9CA3AF' : '#6B7280'}]}>14:00</Text>
            <Text style={[styles.timeMarker, {color: isDark ? '#9CA3AF' : '#6B7280'}]}>22:00</Text>
        </View>
        </View>
    );
};

interface TimelineProps {
    events: Event[];
    isDark: boolean;
}

const Timeline: React.FC<TimelineProps> = ({events, isDark}) => {
    const {dayProgress} = useCurrentTime();

    const timeBlocks = useMemo(() => {
        const blocks: Array<{
        start: string;
        end: string;
        event?: Event;
        isEmpty: boolean;
        }> = [];

        const startHour = 6;
        const endHour = 22;

        const timeToMinutes = (time: string): number => {
        const [h, m] = time.split(':').map(Number);
        return h * 60 + m;
        };

        const minutesToTime = (minutes: number): string => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        };

        let currentMinutes = startHour * 60;
        const endMinutes = endHour * 60;

        const sortedEvents = [...events].sort((a, b) => 
        timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
        );

        for (const event of sortedEvents) {
        const eventStart = timeToMinutes(event.startTime);
        const eventEnd = timeToMinutes(event.endTime);

        if (eventStart > currentMinutes) {
            blocks.push({
            start: minutesToTime(currentMinutes),
            end: minutesToTime(eventStart),
            isEmpty: true,
            });
        }

        blocks.push({
            start: event.startTime,
            end: event.endTime,
            event,
            isEmpty: false,
        });

        currentMinutes = Math.max(currentMinutes, eventEnd);
        }

        if (currentMinutes < endMinutes) {
        blocks.push({
            start: minutesToTime(currentMinutes),
            end: minutesToTime(endMinutes),
            isEmpty: true,
        });
        }

        return blocks;
    }, [events]);

    return (
        <View style={styles.timelineWrapper}>
        <TimelineLine dayProgress={dayProgress} isDark={isDark} />

        <View style={styles.blocksContainer}>
            {timeBlocks.map((block, index) => (
            <TimeBlock
                key={index}
                startTime={block.start}
                endTime={block.end}
                title={block.event?.title}
                description={block.event?.description}
                color={block.event?.color}
                isDark={isDark}
                isEmpty={block.isEmpty}
            />
            ))}
        </View>
        </View>
    );
};

export const HomeScreen: React.FC = () => {
    const {t} = useTranslation();
    const {isDark, language} = useApp();
    const [currentWeek, setCurrentWeek] = useState<Week | null>(null);
    const [todayEvents, setTodayEvents] = useState<Event[]>([]);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [currentDay, setCurrentDay] = useState<Day | null>(null);

    useFocusEffect(
        useCallback(() => {
        loadCurrentWeek();
        }, [language])
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

            <View style={[styles.noteContainer, {backgroundColor: isDark ? '#1E293B' : '#FFFBF0'}]}>
                <View style={styles.eventsHeader}>
                <Text
                    style={[
                    styles.eventsTitle,
                    {color: isDark ? '#F9FAFB' : '#1F2937'},
                    ]}
                >
                    📝 {t('home.events')}
                </Text>
                <Text
                    style={[
                    styles.dayName,
                    {color: isDark ? '#9CA3AF' : '#6B7280'},
                    ]}
                >
                    {currentDay ? getTranslatedDayName(currentDay.dayName) : ''}
                </Text>
                </View>

                <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                showsVerticalScrollIndicator={false}
                >
                <Timeline events={todayEvents} isDark={isDark} />
                </ScrollView>
            </View>
            </>
        ) : (
            <View style={styles.emptyWeek}>
            <Text style={[styles.emptyWeekText, {color: isDark ? '#9CA3AF' : '#6B7280'}]}>
                {t('home.noWeek')}
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
        borderRadius: 12,
        padding: 16,
        elevation: 2,
    },
    eventsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    eventsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    dayName: {
        fontSize: 14,
        fontWeight: '500',
    },
    timelineWrapper: {
        flexDirection: 'row',
        minHeight: 400,
    },
    timelineContainer: {
        width: 60,
        position: 'relative',
        alignItems: 'center',
    },
    timelineLine: {
        width: 2,
        height: '100%',
        position: 'absolute',
    },
    timelineArrow: {
        position: 'absolute',
        left: -5,
        transform: [{translateY: -8}],
    },
    arrow: {
        width: 0,
        height: 0,
        borderTopWidth: 8,
        borderBottomWidth: 8,
        borderLeftWidth: 12,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
    },
    timeMarkers: {
        height: '100%',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    timeMarker: {
        fontSize: 10,
        fontWeight: '500',
    },

    blocksContainer: {
        flex: 1,
        marginLeft: 12,
    },
    eventBlock: {
        flexDirection: 'row',
        borderRadius: 12,
        marginBottom: 8,
        minHeight: 80,
        overflow: 'hidden',
    },
    eventTimeContainer: {
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    eventTimeIcon: {
        fontSize: 20,
    },
    eventContent: {
        flex: 1,
        padding: 12,
        justifyContent: 'center',
    },
    eventTitle: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    eventTimeRange: {
        color: '#FFFFFF',
        fontSize: 12,
        opacity: 0.9,
        marginBottom: 2,
    },
    eventDescription: {
        color: '#FFFFFF',
        fontSize: 12,
        opacity: 0.8,
    },
    emptyBlock: {
        borderRadius: 12,
        marginBottom: 8,
        minHeight: 60,
        borderWidth: 2,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
    },
    emptyTime: {
        fontSize: 12,
        fontWeight: '500',
    },
    emptyLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 4,
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