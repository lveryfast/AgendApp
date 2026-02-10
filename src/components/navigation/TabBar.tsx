import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {Icon} from '../common/Icon';

export const TabBar: React.FC<BottomTabBarProps> = ({
    state,
    descriptors,
    navigation,
    }) => {
    const icons: Record<string, string> = {
        Home: '🏠',
        Gestion: '⚙️',
        Configuracion: '👤',
    };

    return (
        <View style={styles.container}>
        {state.routes.map((route, index) => {
            const {options} = descriptors[route.key];
            const label: string =
            options.tabBarLabel !== undefined
                ? (options.tabBarLabel as string)
                : options.title !== undefined
                ? options.title
                : route.name;

            const isFocused: boolean = state.index === index;

            const onPress = (): void => {
            const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
            }
            };

            return (
            <TouchableOpacity
                key={route.key}
                onPress={onPress}
                style={[styles.tab, isFocused && styles.tabFocused]}
            >
                <Icon
                name={icons[route.name] || '📱'}
                size={24}
                color={isFocused ? '#3B82F6' : '#9CA3AF'}
                />
                <Text
                style={[
                    styles.label,
                    {color: isFocused ? '#3B82F6' : '#9CA3AF'},
                ]}
                >
                {label}
                </Text>
            </TouchableOpacity>
            );
        })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingBottom: 8,
        paddingTop: 8,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: -2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
    },
    tabFocused: {
        transform: [{scale: 1.1}],
    },
    label: {
        fontSize: 12,
        marginTop: 4,
        fontWeight: '500',
    },
});