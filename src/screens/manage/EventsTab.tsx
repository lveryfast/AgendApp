import React, {useState, useEffect, useCallback} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    TextInput,
    Alert,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useFocusEffect} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {useApp} from '../../context/AppContext';
import {Week} from '../../models/Week';
import {Day} from '../../models/Day';
import {Event} from '../../models/Event';
import {WeekService} from '../../services/WeekService';
import {DayService} from '../../services/DayService';
import {EventService} from '../../services/EventService';
import {ColorPicker} from '../../components/common/ColorPicker';
import {Icon} from '../../components/common/Icon';
import {getTranslatedDayName} from '../../utils/date';

export const EventsTab: React.FC = () => {
    const {t} = useTranslation();
    const {isDark} = useApp();
    const [weeks, setWeeks] = useState<Week[]>([]);
    const [selectedWeekId, setSelectedWeekId] = useState<string>('');
    const [days, setDays] = useState<Day[]>([]);
    const [selectedDayId, setSelectedDayId] = useState<string>('');
    const [events, setEvents] = useState<Event[]>([]);
    const [isCreating, setIsCreating] = useState<boolean>(false);

    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [startTime, setStartTime] = useState<string>('09:00');
    const [endTime, setEndTime] = useState<string>('10:00');
    const [color, setColor] = useState<string>('#FF6B6B');

    useFocusEffect(
        useCallback(() => {
        loadWeeks();
        }, [])
    );

    useEffect(() => {
        if (selectedWeekId) {
        loadDays(selectedWeekId);
        }
    }, [selectedWeekId]);

    useEffect(() => {
        if (selectedDayId) {
        loadEvents(selectedDayId);
        }
    }, [selectedDayId]);

    const loadWeeks = async (): Promise<void> => {
        const data: Week[] = await WeekService.getAllWeeks();
        setWeeks(data);
        if (data.length > 0 && !selectedWeekId) {
        setSelectedWeekId(data[0].id);
        }
    };

    const loadDays = async (weekId: string): Promise<void> => {
        const data: Day[] = await DayService.getDaysByWeekId(weekId);
        setDays(data);
        if (data.length > 0) {
        setSelectedDayId(data[0].id);
        }
    };

    const loadEvents = async (dayId: string): Promise<void> => {
        const data: Event[] = await EventService.getEventsByDayId(dayId);
        setEvents(data);
    };

    const saveEvent = async (): Promise<void> => {
        if (!title.trim() || !selectedDayId) {
        Alert.alert('Error', t('manage.fillRequired'));
        return;
        }

        try {
        await EventService.createEvent(
            selectedDayId,
            title.trim(),
            description.trim(),
            startTime,
            endTime,
            color,
        );
        resetForm();
        setIsCreating(false);
        await loadEvents(selectedDayId);
        Alert.alert('Éxito', t('manage.eventCreated'));
        } catch (error) {
        Alert.alert('Error', t('manage.eventError'));
        }
    };

    const deleteEvent = async (id: string): Promise<void> => {
        Alert.alert(t('manage.confirm'), t('manage.deleteEventConfirm'), [
        {text: t('manage.cancel'), style: 'cancel'},
        {
            text: t('manage.delete'),
            style: 'destructive',
            onPress: async () => {
            await EventService.deleteEvent(id);
            await loadEvents(selectedDayId);
            },
        },
        ]);
    };

    const resetForm = (): void => {
        setTitle('');
        setDescription('');
        setStartTime('09:00');
        setEndTime('10:00');
        setColor('#FF6B6B');
    };

    const bgColor: string = isDark ? '#0F172A' : '#F3F4F6';
    const cardBg: string = isDark ? '#1E293B' : '#FFFFFF';
    const textColor: string = isDark ? '#F9FAFB' : '#1F2937';
    const subTextColor: string = isDark ? '#9CA3AF' : '#6B7280';
    const inputBg: string = isDark ? '#0F172A' : '#F9FAFB';

    return (
        <ScrollView style={[styles.container, {backgroundColor: bgColor}]}>
        <View style={[styles.selectors, {backgroundColor: cardBg}]}>
            <Text style={[styles.label, {color: textColor}]}>{t('manage.selectWeek')}:</Text>
            <View style={[styles.pickerContainer, {backgroundColor: inputBg}]}>
            <Picker
                selectedValue={selectedWeekId}
                onValueChange={(itemValue: string) => setSelectedWeekId(itemValue)}
                style={{color: textColor}}
                dropdownIconColor={textColor}
            >
                {weeks.map((week: Week) => (
                <Picker.Item key={week.id} label={week.title} value={week.id} />
                ))}
            </Picker>
            </View>

            <Text style={[styles.label, {color: textColor, marginTop: 12}]}>{t('manage.selectDay')}:</Text>
            <View style={[styles.pickerContainer, {backgroundColor: inputBg}]}>
            <Picker
                selectedValue={selectedDayId}
                onValueChange={(itemValue: string) => setSelectedDayId(itemValue)}
                style={{color: textColor}}
                dropdownIconColor={textColor}
            >
                {days.map((day: Day) => (
                <Picker.Item 
                    key={day.id} 
                    label={getTranslatedDayName(day.dayName)} 
                    value={day.id} 
                />
                ))}
            </Picker>
            </View>
        </View>

        {isCreating ? (
            <View style={[styles.form, {backgroundColor: cardBg}]}>
            <Text style={[styles.formTitle, {color: textColor}]}>
                📝 {t('manage.newEvent')}
            </Text>

            <Text style={[styles.label, {color: textColor}]}>{t('manage.eventTitle')}:</Text>
            <TextInput
                style={[
                styles.input,
                {backgroundColor: inputBg, color: textColor},
                ]}
                placeholder={t('manage.eventTitle')}
                placeholderTextColor={subTextColor}
                value={title}
                onChangeText={setTitle}
            />

            <Text style={[styles.label, {color: textColor}]}>{t('manage.description')}:</Text>
            <TextInput
                style={[
                styles.input,
                styles.textArea,
                {backgroundColor: inputBg, color: textColor},
                ]}
                placeholder={t('manage.description')}
                placeholderTextColor={subTextColor}
                value={description}
                onChangeText={setDescription}
                multiline={true}
                numberOfLines={3}
            />

            <View style={styles.timeContainer}>
                <View style={styles.timeInput}>
                <Text style={[styles.label, {color: textColor}]}>{t('manage.startTime')}:</Text>
                <TextInput
                    style={[
                    styles.input,
                    {backgroundColor: inputBg, color: textColor},
                    ]}
                    value={startTime}
                    onChangeText={setStartTime}
                    placeholder="HH:mm"
                    placeholderTextColor={subTextColor}
                />
                </View>
                <View style={styles.timeInput}>
                <Text style={[styles.label, {color: textColor}]}>{t('manage.endTime')}:</Text>
                <TextInput
                    style={[
                    styles.input,
                    {backgroundColor: inputBg, color: textColor},
                    ]}
                    value={endTime}
                    onChangeText={setEndTime}
                    placeholder="HH:mm"
                    placeholderTextColor={subTextColor}
                />
                </View>
            </View>

            <Text style={[styles.label, {color: textColor}]}>{t('manage.color')}:</Text>
            <ColorPicker initialColor={color} onColorChange={setColor} />

            <View style={styles.formButtons}>
                <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                    setIsCreating(false);
                    resetForm();
                }}
                >
                <Text style={styles.buttonText}>{t('manage.cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={saveEvent}
                >
                <Text style={styles.buttonText}>{t('manage.save')}</Text>
                </TouchableOpacity>
            </View>
            </View>
        ) : (
            <TouchableOpacity
            style={[styles.addButton, {backgroundColor: cardBg}]}
            onPress={() => setIsCreating(true)}
            >
            <Icon name="➕" size={20} />
            <Text style={[styles.addButtonText, {color: textColor}]}>
                {t('manage.newEvent')}
            </Text>
            </TouchableOpacity>
        )}

        <View style={styles.eventsList}>
            <Text style={[styles.sectionTitle, {color: textColor}]}>
            {t('manage.dayEvents')}
            </Text>
            {events.map((event: Event) => (
            <View
                key={event.id}
                style={[styles.eventCard, {backgroundColor: event.color}]}
            >
                <View style={styles.eventInfo}>
                <Text style={styles.eventTime}>
                    {event.startTime} - {event.endTime}
                </Text>
                <Text style={styles.eventTitle}>{event.title}</Text>
                {event.description ? (
                    <Text style={styles.eventDesc}>{event.description}</Text>
                ) : null}
                </View>
                <TouchableOpacity
                onPress={() => deleteEvent(event.id)}
                style={styles.deleteBtn}
                >
                <Icon name="🗑️" size={16} />
                </TouchableOpacity>
            </View>
            ))}
            {events.length === 0 && (
            <Text style={[styles.emptyText, {color: subTextColor}]}>
                {t('manage.noEvents')}
            </Text>
            )}
        </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    selectors: {
        margin: 16,
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
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 16,
        marginTop: 0,
        padding: 16,
        borderRadius: 12,
        elevation: 2,
    },
    addButtonText: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    form: {
        margin: 16,
        marginTop: 0,
        padding: 16,
        borderRadius: 12,
        elevation: 2,
    },
    formTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    input: {
        height: 48,
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        marginBottom: 12,
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
        paddingTop: 12,
    },
    timeContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    timeInput: {
        flex: 1,
    },
    formButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 16,
    },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 10,
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
        fontSize: 14,
    },
    eventsList: {
        padding: 16,
        paddingTop: 0,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    eventCard: {
        flexDirection: 'row',
        borderRadius: 12,
        padding: 16,
        marginBottom: 8,
        elevation: 2,
    },
    eventInfo: {
        flex: 1,
    },
    eventTime: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
        opacity: 0.9,
        marginBottom: 4,
    },
    eventTitle: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    eventDesc: {
        color: '#FFFFFF',
        fontSize: 12,
        opacity: 0.8,
        marginTop: 4,
    },
    deleteBtn: {
        padding: 8,
        justifyContent: 'center',
    },
    emptyText: {
        textAlign: 'center',
        paddingVertical: 40,
        fontStyle: 'italic',
    },
});