import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Appbar, TextInput, Button, HelperText } from 'react-native-paper';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../state/StoreContext';
import { useNavigation } from '@react-navigation/native';
import { Logger } from '../../infrastructure/utils/Logger';

export const PasswordAddScreen = observer(() => {
    const { passwordStore } = useStores();
    const navigation = useNavigation();

    const [title, setTitle] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [website, setWebsite] = useState('');
    const [notes, setNotes] = useState('');
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!title || !username || !password) return; // Simple validation

        setSaving(true);
        try {
            await passwordStore.addPassword({
                title,
                username,
                password,
                website: website || null,
                notes: notes || null,
                category: 'General' // Default for now
            });
            navigation.goBack();
        } catch (e) {
            Logger.error('Failed to add password', e);
            // Handle error (show snackbar etc)
        } finally {
            setSaving(false);
        }
    };

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Add Password" />
            </Appbar.Header>

            <ScrollView contentContainerStyle={styles.content}>
                <TextInput
                    label="Title"
                    value={title}
                    onChangeText={setTitle}
                    style={styles.input}
                />
                <TextInput
                    label="Username"
                    value={username}
                    onChangeText={setUsername}
                    style={styles.input}
                    autoCapitalize="none"
                />
                <TextInput
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry // Toggle?
                    style={styles.input}
                    autoCapitalize="none"
                />
                <TextInput
                    label="Website"
                    value={website}
                    onChangeText={setWebsite}
                    style={styles.input}
                    autoCapitalize="none"
                    keyboardType="url"
                />
                <TextInput
                    label="Notes"
                    value={notes}
                    onChangeText={setNotes}
                    style={styles.input}
                    multiline
                />

                <Button
                    mode="contained"
                    onPress={handleSave}
                    loading={saving}
                    disabled={saving || !title || !username || !password}
                    style={styles.button}
                >
                    Save
                </Button>
            </ScrollView>
        </View>
    );
});

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    content: { padding: 20 },
    input: { marginBottom: 16 },
    button: { marginTop: 8 },
});
