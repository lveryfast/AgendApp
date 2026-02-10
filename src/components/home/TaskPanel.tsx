import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    ScrollView,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Task} from '../../models/Task';
import {TaskService} from '../../services/TaskService';
import {TaskCheckbox} from '../common/TaskCheckbox';
import {Icon} from '../common/Icon';

interface TaskPanelProps {
    weekId: string;
    isDark: boolean;
    onTaskUpdate?: () => void;
}

export const TaskPanel: React.FC<TaskPanelProps> = ({
    weekId,
    isDark,
    onTaskUpdate,
}) => {
    const {t} = useTranslation();
    const [expanded, setExpanded] = useState<boolean>(false);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [stats, setStats] = useState<{completed: number; pending: number}>({
        completed: 0,
        pending: 0,
    });
    const animation = useState(new Animated.Value(0))[0];

    useEffect(() => {
        loadTasks();
    }, [weekId]);

    const loadTasks = async (): Promise<void> => {
        const [tasksData, statsData] = await Promise.all([
        TaskService.getTasksByWeekId(weekId),
        TaskService.getTaskStats(weekId),
        ]);
        setTasks(tasksData);
        setStats(statsData);
    };

    const toggleExpand = (): void => {
        setExpanded(!expanded);
        Animated.spring(animation, {
        toValue: expanded ? 0 : 1,
        useNativeDriver: false,
        }).start();
    };

    const toggleTask = async (task: Task): Promise<void> => {
        const newCompleted: number = task.completed === 1 ? 0 : 1;
        await TaskService.toggleTask(task.id, newCompleted);
        await loadTasks();
        onTaskUpdate?.();
    };

    const panelHeight = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [80, 300],
    });

    const textColor: string = isDark ? '#F9FAFB' : '#1F2937';
    const subTextColor: string = isDark ? '#9CA3AF' : '#6B7280';
    const bgColor: string = isDark ? '#1E293B' : '#FFFFFF';

    return (
        <Animated.View style={[styles.container, {height: panelHeight, backgroundColor: bgColor}]}>
        <TouchableOpacity style={styles.header} onPress={toggleExpand}>
            <View style={styles.titleRow}>
            <Icon name="📋" size={20} />
            <Text style={[styles.title, {color: textColor}]}>{t('home.tasks')}</Text>
            <Icon name={expanded ? '▼' : '▶'} size={16} color={subTextColor} />
            </View>
            <View style={styles.statsRow}>
            <Text style={[styles.stat, {color: '#10B981'}]}>
                ✅ {t('home.completed')}: {stats.completed}
            </Text>
            <Text style={[styles.stat, {color: '#F59E0B'}]}>
                ⏳ {t('home.pending')}: {stats.pending}
            </Text>
            </View>
        </TouchableOpacity>

        {expanded && (
            <ScrollView style={styles.taskList}>
            {tasks.map(task => (
                <TaskCheckbox
                key={task.id}
                checked={task.completed === 1}
                onPress={() => toggleTask(task)}
                title={task.title}
                titleStyle={{color: textColor}}
                />
            ))}
            {tasks.length === 0 && (
                <Text style={[styles.emptyText, {color: subTextColor}]}>
                {t('home.noTasks')}
                </Text>
            )}
            </ScrollView>
        )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 16,
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    header: {
        padding: 16,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 8,
        flex: 1,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    stat: {
        fontSize: 14,
        fontWeight: '600',
    },
    taskList: {
        padding: 16,
        paddingTop: 0,
    },
    emptyText: {
        textAlign: 'center',
        paddingVertical: 20,
        fontStyle: 'italic',
    },
});