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
import {Week} from '../../models/Week';
import {Day} from '../../models/Day';
import {WeekService} from '../../services/WeekService';
import {DayService} from '../../services/DayService';
import {Icon} from '../../components/common/Icon';

interface WeeksTabProps {
    isDark: boolean;
}

export const WeeksTab: React.FC<WeeksTabProps> = ({isDark}) => {
    const [weeks, setWeeks] = useState<Week[]>([]);
    const [expandedWeek, setExpandedWeek] = useState<string | null>(null);
    const [weekDays, setWeekDays] = useState<Record<string, Day[]>>({});
    const [newWeekTitle, setNewWeekTitle] = useState<string>('');
    const [isCreating, setIsCreating] = useState<boolean>(false);

    useEffect(() => {
        loadWeeks();
    }, []);

    const loadWeeks = async (): Promise<void> => {
        const data = await WeekService.getAllWeeks();
        setWeeks(data);
    };

    const createWeek = async (): Promise<void> => {
        if (!newWeekTitle.trim()) {
        Alert.alert('Error', 'El título no puede estar vacío');
        return;
        }

        try {
        const week = await WeekService.createWeek(newWeekTitle.trim());
        await DayService.createDaysForWeek(week.id);
        setNewWeekTitle('');
        setIsCreating(false);
        await loadWeeks();
        } catch (error) {
        Alert.alert('Error', 'No se pudo crear la semana');
        }
    };

    const deleteWeek = async (id: string): Promise<void> => {
        Alert.alert('Confirmar', '¿Eliminar esta semana y todos sus datos?', [
        {text: 'Cancelar', style: 'cancel'},
        {
            text: 'Eliminar',
            style: 'destructive',
            onPress: async () => {
            await WeekService.deleteWeek(id);
            await loadWeeks();
            },
        },
        ]);
    };

    const toggleExpand = async (weekId: string): Promise<void> => {
        if (expandedWeek === weekId) {
        setExpandedWeek(null);
        } else {
        setExpandedWeek(weekId);
        if (!weekDays[weekId]) {
            const days = await DayService.getDaysByWeekId(weekId);
            setWeekDays(prev => ({...prev, [weekId]: days}));
        }
        }
    };

    const renderWeek = useCallback(
        ({item}: {item: Week}) => {
        const isExpanded: boolean = expandedWeek === item.id;
        const days: Day[] = weekDays[item.id] || [];

        return (
            <View
            style={[
                styles.weekCard,
                {
                backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                borderColor: isDark ? '#374151' : '#E5E7EB',
                },
            ]}
            >
            <View style={styles.weekHeader}>
                <TouchableOpacity
                style={styles.weekTitleContainer}
                onPress={() => toggleExpand(item.id)}
                >
                <Icon name={isExpanded ? '📂' : '📁'} size={20} />
                <Text
                    style={[
                    styles.weekTitle,
                    {color: isDark ? '#F9FAFB' : '#1F2937'},
                    ]}
                >
                    {item.title}
                </Text>
                <Icon name={isExpanded ? '▼' : '▶'} size={12} color={isDark ? '#9CA3AF' : '#6B7280'} />
                </TouchableOpacity>
                <TouchableOpacity
                onPress={() => deleteWeek(item.id)}
                style={styles.deleteButton}
                >
                <Icon name="🗑️" size={18} />
                </TouchableOpacity>
            </View>

            {isExpanded && (
                <View style={styles.daysContainer}>
                {days.map((day: Day) => (
                    <View
                    key={day.id}
                    style={[
                        styles.dayChip,
                        {backgroundColor: isDark ? '#0F172A' : '#F3F4F6'},
                    ]}
                    >
                    <Text
                        style={[
                        styles.dayChipText,
                        {color: isDark ? '#E5E7EB' : '#374151'},
                        ]}
                    >
                        {day.dayName}
                    </Text>
                    </View>
                ))}
                </View>
            )}
            </View>
        );
        },
        [expandedWeek, weekDays, isDark],
    );

    const bgColor: string = isDark ? '#0F172A' : '#F3F4F6';
    const inputBg: string = isDark ? '#374151' : '#FFFFFF';
    const textColor: string = isDark ? '#F9FAFB' : '#1F2937';

    return (
        <View style={[styles.container, {backgroundColor: bgColor}]}>
        {isCreating ? (
            <View
            style={[
                styles.inputContainer,
                {backgroundColor: isDark ? '#1E293B' : '#FFFFFF'},
            ]}
            >
            <TextInput
                style={[
                styles.input,
                {backgroundColor: inputBg, color: textColor},
                ]}
                placeholder="Título de la semana"
                placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                value={newWeekTitle}
                onChangeText={setNewWeekTitle}
                autoFocus
            />
            <View style={styles.inputButtons}>
                <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                    setIsCreating(false);
                    setNewWeekTitle('');
                }}
                >
                <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={createWeek}
                >
                <Text style={styles.buttonText}>Guardar</Text>
                </TouchableOpacity>
            </View>
            </View>
        ) : (
            <TouchableOpacity
            style={[
                styles.addButton,
                {backgroundColor: isDark ? '#1E293B' : '#FFFFFF'},
            ]}
            onPress={() => setIsCreating(true)}
            >
            <Icon name="➕" size={20} />
            <Text style={[styles.addButtonText, {color: textColor}]}>
                Nueva Semana
            </Text>
            </TouchableOpacity>
        )}

        <FlatList
            data={weeks}
            renderItem={renderWeek}
            keyExtractor={(item: Week) => item.id}
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
    list: {
        padding: 16,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 16,
        padding: 16,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    addButtonText: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    inputContainer: {
        margin: 16,
        padding: 16,
        borderRadius: 12,
        elevation: 2,
    },
    input: {
        height: 48,
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        marginBottom: 12,
    },
    inputButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    button: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        marginLeft: 8,
    },
    cancelButton: {
        backgroundColor: '#6B7280',
    },
    saveButton: {
        backgroundColor: '#3B82F6',
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    weekCard: {
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        overflow: 'hidden',
    },
    weekHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    weekTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    weekTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
        flex: 1,
    },
    deleteButton: {
        padding: 8,
    },
    daysContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 12,
        paddingTop: 0,
        gap: 8,
    },
    dayChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    dayChipText: {
        fontSize: 12,
        fontWeight: '500',
    },
});