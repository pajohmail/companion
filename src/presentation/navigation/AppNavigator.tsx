import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthScreen } from '../screens/AuthScreen';
import { MainTabNavigator } from './MainTabNavigator';
import { useStores } from '../../state/StoreContext';
import { observer } from 'mobx-react-lite';
import { View, ActivityIndicator } from 'react-native';

const Stack = createStackNavigator();

export const AppNavigator = observer(() => {
    const { authStore } = useStores();
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        // Optional: Check persistence or auto-login here if not already done in Store
        setInitializing(false);
    }, []);

    if (initializing) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!authStore.user ? (
                <Stack.Screen name="Auth" component={AuthScreen} />
            ) : (
                <Stack.Screen name="Main" component={MainTabNavigator} />
            )}
        </Stack.Navigator>
    );
});
