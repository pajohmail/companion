import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Title, Paragraph } from 'react-native-paper';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../state/StoreContext';
import { Button } from '../components/common/Button';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';

export const AuthScreen = observer(() => {
    const { authStore } = useStores();

    const handleGoogleLogin = () => {
        authStore.login();
    };

    return (
        <View style={styles.container}>
            <Title style={styles.title}>Companion App</Title>
            <Paragraph style={styles.subtitle}>Secure your digital life</Paragraph>

            {authStore.error && (
                <Text style={styles.error}>{authStore.error}</Text>
            )}

            <Button
                onPress={handleGoogleLogin}
                loading={authStore.isLoading}
                disabled={authStore.isLoading}
                icon="google"
            >
                Sign in with Google
            </Button>

            {/* Alternative: Native Google Button if preferred, but custom button gives more control */}
            {/* <GoogleSigninButton
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={handleGoogleLogin}
                disabled={authStore.isLoading}
            /> */}
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 40,
        color: '#666',
    },
    error: {
        color: 'red',
        marginBottom: 20,
    },
});
