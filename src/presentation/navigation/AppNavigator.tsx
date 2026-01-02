import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { PasswordListScreen } from '../screens/PasswordListScreen';
import { PasswordDetailScreen } from '../screens/PasswordDetailScreen';
import { PasswordAddScreen } from '../screens/PasswordAddScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

import { DocumentListScreen } from '../screens/DocumentListScreen';
import { DocumentDetailScreen } from '../screens/DocumentDetailScreen';
import { DocumentAddScreen } from '../screens/DocumentAddScreen';

const Stack = createStackNavigator();

export const AppNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="PasswordList" component={PasswordListScreen} />
            <Stack.Screen name="PasswordDetail" component={PasswordDetailScreen} />
            <Stack.Screen name="PasswordAdd" component={PasswordAddScreen} />
            <Stack.Screen name="DocumentList" component={DocumentListScreen} />
            <Stack.Screen name="DocumentDetail" component={DocumentDetailScreen} />
            <Stack.Screen name="DocumentAdd" component={DocumentAddScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
    );
};
