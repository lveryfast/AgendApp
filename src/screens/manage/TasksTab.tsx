import React, {useState, useEffect, useCallback} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    TextInput,
    Alert,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useFocusEffect} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {useApp} from '../../context/AppContext';
import {Week} from '../../models/Week';
import {Task} from '../../models/Task';
import {WeekService} from '../../services/WeekService';
import {TaskService} from '../../services/TaskService';
import {TaskCheckbox} from '../../components/common/TaskCheckbox';
import {Icon} from '../../components/common/Icon';

export const TasksTab: React.FC = () => {
    const {t} = useTranslation();
    const {isDark} = useApp();
    const [weeks, setWeeks] = useState<Week[]>([]);
    const [selectedWeekId, setSelectedWeekId] = useState<string>('');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTaskTitle, setNewTaskTitle] = useState<string>('');
    const [stats, setStats] = useState<{completed: number; pending: number}>({
        completed: 0,
        pending: 0,
    });

    useFocusEffect(
        useCallback(() => {
        loadWeeks();
        }, [])
    );

    useEffect(() => {
        if (selectedWeekId) {
        loadTasks();
        }
    }, [selectedWeekId]);

    const loadWeeks = async (): Promise<void> => {
        const data: Week[] = await WeekService.getAllWeeks();
        setWeeks(data);
        if (data.length > 0 && !selectedWeekId) {
        setSelectedWeekId(data[0].id);
        }
    };

    const loadTasks = async (): Promise<void> => {
        const [tasksData, statsData] = await Promise.all([
        TaskService.getTasksByWeekId(selectedWeekId),
        TaskService.getTaskStats(selectedWeekId),
        ]);
        setTasks(tasksData);
        setStats(statsData);
    };

    const addTask = async (): Promise<void> => {
        if (!newTaskTitle.trim()) return;
        try {
        await TaskService.createTask(selectedWeekId, newTaskTitle.trim());
        setNewTaskTitle('');
        await loadTasks();
        } catch (error) {
        Alert.alert('Error', t('manage.taskError'));
        }
    };

    const toggleTask = async (task: Task): Promise<void> => {
        const newCompleted: number = task.completed === 1 ? 0 : 1;
        await TaskService.toggleTask(task.id, newCompleted);
        await loadTasks();
    };

    const deleteTask = async (id: string): Promise<void> => {
        Alert.alert(t('manage.confirm'), t('manage.deleteTaskConfirm'), [
        {text: t('manage.cancel'), style: 'cancel'},
        {
            text: t('manage.delete'),
            style: 'destructive',
            onPress: async () => {
            await TaskService.deleteTask(id);
            await loadTasks();
            },
        },
        ]);
    };

    const bgColor: string = isDark ? '#0F172A' : '#F3F4F6';
    const cardBg: string = isDark ? '#1E293B' : '#FFFFFF';
    const textColor: string = isDark ? '#F9FAFB' : '#1F2937';
    const subTextColor: string = isDark ? '#9CA3AF' : '#6B7280';
    const inputBg: string = isDark ? '#0F172A' : '#F9FAFB';

    return (
        <View style={[styles.container, {backgroundColor: bgColor}]}>
        <View style={[styles.selector, {backgroundColor: cardBg}]}>
            <Text style={[styles.label, {color: textColor}]}>{t('manage.selectWeek')}:</Text>
            <View style={[styles.pickerContainer, {backgroundColor: inputBg}]}>
            <Picker
                selectedValue={selectedWeekId}
                onValueChange={(itemValue: string) => setSelectedWeekId(itemValue)}
                style={{color: textColor}}
                dropdownIconColor={textColor}>
                {weeks.map((week: Week) => (
                <Picker.Item key={week.id} label={week.title} value={week.id} />
                ))}
            </Picker>
            </View>
        </View>

        <View style={[styles.inputRow, {backgroundColor: cardBg}]}>
            <TextInput
            style={[
                styles.input,
                {backgroundColor: inputBg, color: textColor},
            ]}
            placeholder={t('manage.newTask')}
            placeholderTextColor={subTextColor}
            value={newTaskTitle}
            onChangeText={setNewTaskTitle}
            onSubmitEditing={addTask}
            />
            <TouchableOpacity style={styles.addButton} onPress={addTask}>
            <Icon name="➕" size={20} color="#FFFFFF" />
            </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
            <Text style={[styles.stat, {color: '#10B981'}]}>
            ✅ {stats.completed}
            </Text>
            <Text style={[styles.stat, {color: '#F59E0B'}]}>
            ⏳ {stats.pending}
            </Text>
            <Text style={[styles.statTotal, {color: subTextColor}]}>
            {t('manage.total')}: {stats.completed + stats.pending}
            </Text>
        </View>

        <FlatList
            data={tasks}
            keyExtractor={(item: Task) => item.id}
            renderItem={({item}: {item: Task}) => (
            <View style={[styles.taskItem, {backgroundColor: cardBg}]}>
                <TaskCheckbox
                checked={item.completed === 1}
                onPress={() => toggleTask(item)}
                title={item.title}
                titleStyle={{color: textColor}}
                />
                <TouchableOpacity
                onPress={() => deleteTask(item.id)}
                style={styles.deleteButton}
                >
                <Icon name="🗑️" size={18} />
                </TouchableOpacity>
            </View>
            )}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
        />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    selector: {
        margin: 16,
        marginBottom: 8,
        padding: 16,
        borderRadius: 12,
        elevation: 2,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    pickerContainer: {
        borderRadius: 8,
        overflow: 'hidden',
    },
    inputRow: {
        flexDirection: 'row',
        margin: 16,
        marginTop: 0,
        marginBottom: 8,
        padding: 12,
        borderRadius: 12,
        elevation: 2,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        height: 40,
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
        marginRight: 8,
    },
    addButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#3B82F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
        gap: 24,
    },
    stat: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    statTotal: {
        fontSize: 14,
        fontWeight: '500',
    },
    list: {
        padding: 16,
        paddingTop: 8,
    },
    taskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        marginBottom: 8,
        elevation: 1,
    },
    deleteButton: {
        padding: 8,
    },
});