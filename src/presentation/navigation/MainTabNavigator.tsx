import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { PasswordListScreen } from '../screens/PasswordListScreen';
import { PasswordDetailScreen } from '../screens/PasswordDetailScreen';
import { PasswordAddScreen } from '../screens/PasswordAddScreen';
import { DocumentListScreen } from '../screens/DocumentListScreen';
import { DocumentDetailScreen } from '../screens/DocumentDetailScreen';
import { DocumentAddScreen } from '../screens/DocumentAddScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { IconButton } from 'react-native-paper';

const Tab = createBottomTabNavigator();
const PasswordStack = createStackNavigator();
const DocumentStack = createStackNavigator();

const PasswordStackNavigator = () => (
    <PasswordStack.Navigator screenOptions={{ headerShown: false }}>
        <PasswordStack.Screen name="PasswordList" component={PasswordListScreen} />
        <PasswordStack.Screen name="PasswordDetail" component={PasswordDetailScreen} />
        <PasswordStack.Screen name="PasswordAdd" component={PasswordAddScreen} />
    </PasswordStack.Navigator>
);

const DocumentStackNavigator = () => (
    <DocumentStack.Navigator screenOptions={{ headerShown: false }}>
        <DocumentStack.Screen name="DocumentList" component={DocumentListScreen} />
        <DocumentStack.Screen name="DocumentDetail" component={DocumentDetailScreen} />
        <DocumentStack.Screen name="DocumentAdd" component={DocumentAddScreen} />
    </DocumentStack.Navigator>
);

export const MainTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ color, size, focused }) => {
                    let iconName = 'circle';
                    if (route.name === 'Passwords') {
                        iconName = focused ? 'lock' : 'lock-outline';
                    } else if (route.name === 'Documents') {
                        iconName = focused ? 'file-document' : 'file-document-outline';
                    } else if (route.name === 'Settings') {
                        iconName = focused ? 'cog' : 'cog-outline';
                    }
                    return <IconButton icon={iconName} iconColor={color} size={size} />;
                },
                tabBarActiveTintColor: '#6200ee',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Passwords" component={PasswordStackNavigator} />
            <Tab.Screen name="Documents" component={DocumentStackNavigator} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
};
