import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Appbar, TextInput, Button, Text, Divider, IconButton, Snackbar } from 'react-native-paper';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../state/StoreContext';
import { PasswordUI } from '../../state/stores/PasswordStore';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';

export const PasswordDetailScreen = observer(() => {
    const { passwordStore } = useStores();
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { id } = route.params;

    const password = passwordStore.passwords.find((p: PasswordUI) => p.id === id);
    const [showPassword, setShowPassword] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);

    if (!password) {
        return (
            <View style={styles.container}>
                <Appbar.Header>
                    <Appbar.BackAction onPress={() => navigation.goBack()} />
                    <Appbar.Content title="Details" />
                </Appbar.Header>
                <View style={styles.center}>
                    <Text>Password not found.</Text>
                </View>
            </View>
        );
    }

    const copyToClipboard = async (text: string, label: string) => {
        await Clipboard.setStringAsync(text);
        setSnackbarVisible(true);
    };

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title={password.title} />
                <Appbar.Action icon="pencil" onPress={() => console.log('Edit not implemented')} />
            </Appbar.Header>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.fieldContainer}>
                    <Text variant="labelLarge">Username</Text>
                    <View style={styles.row}>
                        <Text variant="bodyLarge" style={styles.value}>{password.username}</Text>
                        <IconButton icon="content-copy" onPress={() => copyToClipboard(password.username, 'Username')} />
                    </View>
                </View>
                <Divider />

                <View style={styles.fieldContainer}>
                    <Text variant="labelLarge">Password</Text>
                    <View style={styles.row}>
                        <Text variant="bodyLarge" style={styles.value}>
                            {showPassword ? password.password : '••••••••'}
                        </Text>
                        <View style={styles.actions}>
                            <IconButton
                                icon={showPassword ? "eye-off" : "eye"}
                                onPress={() => setShowPassword(!showPassword)}
                            />
                            <IconButton
                                icon="content-copy"
                                onPress={() => copyToClipboard(password.password, 'Password')}
                            />
                        </View>
                    </View>
                </View>
                <Divider />

                {password.website && (
                    <>
                        <View style={styles.fieldContainer}>
                            <Text variant="labelLarge">Website</Text>
                            <View style={styles.row}>
                                <Text variant="bodyLarge" style={styles.value}>{password.website}</Text>
                                <IconButton icon="content-copy" onPress={() => copyToClipboard(password.website!, 'Website')} />
                            </View>
                        </View>
                        <Divider />
                    </>
                )}

                {password.notes && (
                    <View style={styles.fieldContainer}>
                        <Text variant="labelLarge">Notes</Text>
                        <Text variant="bodyMedium" style={{ marginTop: 4 }}>{password.notes}</Text>
                    </View>
                )}
            </ScrollView>

            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={2000}
            >
                Copied to clipboard
            </Snackbar>
        </View>
    );
});

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    content: { padding: 20 },
    fieldContainer: { paddingVertical: 16 },
    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    value: { flex: 1, marginRight: 8 },
    actions: { flexDirection: 'row' }
});
