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

export const AppNavigator: React.FC = () => {
    return (
        <NavigationContainer>
        <Tab.Navigator
            tabBar={(props) => <TabBar {...props} />}
            screenOptions={{
            headerShown: false,
            }}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Gestion" component={ManageScreen} />
            <Tab.Screen name="Configuracion" component={ConfigScreen} />
        </Tab.Navigator>
        </NavigationContainer>
    );
};