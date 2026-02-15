import notifee, {TriggerType, TimestampTrigger, AndroidImportance, AndroidCategory} from '@notifee/react-native';
import {Event} from '../models/Event';
import {Task} from '../models/Task';
import {EventService} from './EventService';
import {TaskService} from './TaskService';

class NotificationService {
    private static instance: NotificationService;
    
    private constructor() {
        this.initialize();
    }

    static getInstance(): NotificationService {
        if (!NotificationService.instance) {
        NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }

    private async initialize() {
        await notifee.requestPermission();
        await notifee.createChannel({
        id: 'events',
        name: 'Eventos',
        importance: AndroidImportance.HIGH,
        vibration: true,
        vibrationPattern: [300, 500],
        });

        await notifee.createChannel({
        id: 'tasks',
        name: 'Tareas',
        importance: AndroidImportance.DEFAULT,
        });
    }

    async scheduleEventNotification(event: Event, dayDate: Date): Promise<void> {
        const [hours, minutes] = event.startTime.split(':').map(Number);
        const eventDate = new Date(dayDate);
        eventDate.setHours(hours, minutes, 0, 0);
        const notificationTime = new Date(eventDate.getTime() - 5 * 60 * 1000);

        if (notificationTime <= new Date()) {
        return;
        }

        const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: notificationTime.getTime(),
        };

        await notifee.createTriggerNotification(
        {
            id: `event-${event.id}`,
            title: '⏰ Evento próximo',
            body: `${event.title} comienza a las ${event.startTime}`,
            android: {
            channelId: 'events',
            importance: AndroidImportance.HIGH,
            category: AndroidCategory.EVENT,
            pressAction: {id: 'default'},
            actions: [
                {title: 'Ver', pressAction: {id: 'view'}},
                {title: 'Posponer 5min', pressAction: {id: 'snooze'}},
            ],
            },
            data: {
            type: 'event',
            eventId: event.id,
            },
        },
        trigger,
        );
    }

    async scheduleDayNotifications(dayId: string, dayDate: Date): Promise<void> {
        await this.cancelDayNotifications(dayId);
        
        const events = await EventService.getEventsByDayId(dayId);
        
        for (const event of events) {
        await this.scheduleEventNotification(event, dayDate);
        }
    }
    async cancelDayNotifications(dayId: string): Promise<void> {
        const notifications = await notifee.getTriggerNotificationIds();
        const dayNotifications = notifications.filter(id => id.startsWith(`event-${dayId}`));
        if (dayNotifications.length > 0) {
        await notifee.cancelTriggerNotifications(dayNotifications);
        }
    }

    async sendTaskCompletedNotification(task: Task): Promise<void> {
        await notifee.displayNotification({
        title: '✅ Tarea completada',
        body: `Has completado: ${task.title}`,
        android: {
            channelId: 'tasks',
            smallIcon: 'ic_launcher',
        },
        });
    }

    async scheduleDailyTaskReminder(weekId: string): Promise<void> {
        const tasks = await TaskService.getTasksByWeekId(weekId);
        const pendingCount = tasks.filter(t => t.completed === 0).length;

        if (pendingCount === 0) return;

        const now = new Date();
        const morning = new Date(now);
        morning.setHours(8, 0, 0, 0);
        
        if (morning <= now) {
        morning.setDate(morning.getDate() + 1);
        }

        const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: morning.getTime(),
        repeatFrequency: 24 * 60 * 60 * 1000, // Diario
        };

        await notifee.createTriggerNotification(
        {
            id: 'daily-tasks',
            title: '📋 Tareas pendientes',
            body: `Tienes ${pendingCount} tareas pendientes para hoy`,
            android: {
            channelId: 'tasks',
            pressAction: {id: 'default'},
            },
        },
        trigger,
        );
    }

    async cancelAllNotifications(): Promise<void> {
        await notifee.cancelAllNotifications();
        const triggerIds = await notifee.getTriggerNotificationIds();
        if (triggerIds.length > 0) {
        await notifee.cancelTriggerNotifications(triggerIds);
        }
    }
}

export const notificationService = NotificationService.getInstance();