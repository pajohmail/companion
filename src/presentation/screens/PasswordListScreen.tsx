import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Appbar, List, FAB, TextInput, Button, Text, ActivityIndicator } from 'react-native-paper';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../state/StoreContext';
import { PasswordUI } from '../../state/stores/PasswordStore';
import { useNavigation } from '@react-navigation/native';
import { Logger } from '../../infrastructure/utils/Logger';

export const PasswordListScreen = observer(() => {
    const { passwordStore } = useStores();
    const navigation = useNavigation<any>();
    const [masterPassword, setMasterPassword] = useState('');
    const [search, setSearch] = useState('');

    useEffect(() => {
        // Try quick unlock on mount
        passwordStore.quickUnlock();
    }, []);

    const handleUnlock = async () => {
        const success = await passwordStore.unlock(masterPassword);
        if (success) {
            setMasterPassword('');
        }
    };

    const filteredPasswords = passwordStore.passwords.filter((p: PasswordUI) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        (p.username && p.username.toLowerCase().includes(search.toLowerCase()))
    );

    if (passwordStore.isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
                <Text>Loading Vault...</Text>
            </View>
        );
    }

    if (passwordStore.isLocked) {
        return (
            <View style={styles.container}>
                <Appbar.Header>
                    <Appbar.Content title="Companion Vault" />
                </Appbar.Header>
                <View style={styles.content}>
                    <Text variant="headlineMedium" style={styles.title}>Unlock Vault</Text>
                    <TextInput
                        label="Master Password"
                        value={masterPassword}
                        onChangeText={setMasterPassword}
                        secureTextEntry
                        style={styles.input}
                    />
                    <Button mode="contained" onPress={handleUnlock} style={styles.button}>
                        Unlock
                    </Button>
                    {passwordStore.error && <Text style={styles.error}>{passwordStore.error}</Text>}
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.Content title="Passwords" />
                <Appbar.Action icon="file-document" onPress={() => navigation.navigate('DocumentList')} />
                <Appbar.Action icon="cog" onPress={() => navigation.navigate('Settings')} />
                <Appbar.Action icon="lock" onPress={() => passwordStore.lock()} />
            </Appbar.Header>

            <View style={styles.searchContainer}>
                <TextInput
                    placeholder="Search passwords..."
                    value={search}
                    onChangeText={setSearch}
                    mode="outlined"
                    dense
                    left={<TextInput.Icon icon="magnify" />}
                />
            </View>

            <FlatList
                data={filteredPasswords}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <List.Item
                        title={item.title}
                        description={item.username}
                        left={props => <List.Icon {...props} icon="key" />}
                        onPress={() => navigation.navigate('PasswordDetail', { id: item.id })}
                    />
                )}
                ListEmptyComponent={<Text style={styles.empty}>No passwords found.</Text>}
            />

            <FAB
                icon="plus"
                style={styles.fab}
                onPress={() => navigation.navigate('PasswordAdd')}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    content: { padding: 20, justifyContent: 'center', flex: 1 },
    title: { textAlign: 'center', marginBottom: 20 },
    input: { marginBottom: 16 },
    button: { marginTop: 8 },
    error: { color: 'red', marginTop: 10, textAlign: 'center' },
    searchContainer: { padding: 16 },
    fab: { position: 'absolute', margin: 16, right: 0, bottom: 0 },
    empty: { textAlign: 'center', marginTop: 20, color: '#666' }
});
