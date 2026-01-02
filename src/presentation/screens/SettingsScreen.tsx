import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, List, Switch, TextInput, Text, Divider, HelperText } from 'react-native-paper';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../state/StoreContext';
import { useNavigation } from '@react-navigation/native';

export const SettingsScreen = observer(() => {
    const { settingsStore } = useStores();
    const navigation = useNavigation();

    // Local state for key input to avoid constant store updates/keychain writes as user types
    // Actually, store logic writes to Keychain on every setApiKey. Better to have a explicit "Save" or debounce.
    // Let's use explicit save for the key.
    // The "useOwnKey" toggle can be immediate.

    // We don't want to show the actual key if it exists, maybe just placeholders?
    // Store has `hasApiKey`.

    const [apiKey, setApiKey] = useState('');
    const [showKeyInput, setShowKeyInput] = useState(false);

    const toggleUseOwnKey = () => {
        settingsStore.setUseOwnKey(!settingsStore.useOwnKey);
    };

    const handleSaveKey = async () => {
        if (apiKey) {
            await settingsStore.setApiKey(apiKey);
            setApiKey(''); // Clear buffer
            setShowKeyInput(false);
        }
    };

    const handleClearKey = async () => {
        await settingsStore.setApiKey('');
    };

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Settings" />
            </Appbar.Header>

            <View style={styles.content}>
                <List.Section>
                    <List.Subheader>Gemini AI Configuration</List.Subheader>

                    <List.Item
                        title="Use Custom API Key"
                        description="Use your own Gemini API Key instead of Account Quota"
                        right={() => <Switch value={settingsStore.useOwnKey} onValueChange={toggleUseOwnKey} />}
                    />
                    <Divider />

                    {settingsStore.useOwnKey && (
                        <View style={styles.keySection}>
                            <View style={styles.statusRow}>
                                <Text variant="bodyMedium">
                                    Status: {settingsStore.hasApiKey ? '✅ Key Configured' : '⚠️ No Key Set'}
                                </Text>
                                {settingsStore.hasApiKey && (
                                    <Button mode="text" onPress={handleClearKey} compact>
                                        Remove Key
                                    </Button>
                                )}
                            </View>

                            <Button
                                mode="outlined"
                                onPress={() => setShowKeyInput(!showKeyInput)}
                                style={styles.toggleBtn}
                            >
                                {showKeyInput ? 'Cancel Update' : (settingsStore.hasApiKey ? 'Update API Key' : 'Enter API Key')}
                            </Button>

                            {showKeyInput && (
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        label="Enter Gemini API Key"
                                        value={apiKey}
                                        onChangeText={setApiKey}
                                        secureTextEntry
                                        autoCapitalize="none"
                                    />
                                    <HelperText type="info">
                                        Your key will be stored securely in the device Keychain.
                                    </HelperText>
                                    <Button
                                        mode="contained"
                                        onPress={handleSaveKey}
                                        disabled={!apiKey}
                                        style={styles.saveBtn}
                                    >
                                        Save Key
                                    </Button>
                                </View>
                            )}
                        </View>
                    )}

                    {!settingsStore.useOwnKey && (
                        <View style={styles.infoSection}>
                            <Text variant="bodySmall" style={styles.infoText}>
                                Using Account Quota will attempt to use the Google Account signed into the app.
                                Ensure your account has access to Gemini/Vertex AI features.
                            </Text>
                        </View>
                    )}
                </List.Section>
            </View>
        </View>
    );
});

// Need Button import which I missed above?
import { Button } from 'react-native-paper';

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    content: { flex: 1 },
    keySection: { padding: 16, backgroundColor: '#f9f9f9' },
    statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    toggleBtn: { marginBottom: 10 },
    inputContainer: { marginTop: 10 },
    saveBtn: { marginTop: 10 },
    infoSection: { padding: 16 },
    infoText: { color: '#666' }
});
