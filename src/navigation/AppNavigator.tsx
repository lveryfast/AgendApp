import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {HomeScreen} from '../screens/HomeScreen';
import {ManageScreen} from '../screens/ManageScreen';
import {ConfigScreen} from '../screens/ConfigScreen';
import {TabBar} from '../components/navigation/TabBar';

export type RootTabParamList = {
    Home: undefined;
    Gestion: undefined;
    Configuracion: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

interface AppNavigatorProps {
    isDark: boolean;
    setIsDark: (value: boolean) => void;
}

export const AppNavigator: React.FC<AppNavigatorProps> = ({
    isDark,
    setIsDark,
}) => {
    return (
        <NavigationContainer>
        <Tab.Navigator
            tabBar={(props) => <TabBar {...props} />}
            screenOptions={{
            headerShown: false,
            }}
        >
            <Tab.Screen name="Home">
            {() => <HomeScreen isDark={isDark} />}
            </Tab.Screen>
            <Tab.Screen name="Gestion">
            {() => <ManageScreen isDark={isDark} />}
            </Tab.Screen>
            <Tab.Screen name="Configuracion">
            {() => <ConfigScreen isDark={isDark} setIsDark={setIsDark} />}
            </Tab.Screen>
        </Tab.Navigator>
        </NavigationContainer>
    );
}; 