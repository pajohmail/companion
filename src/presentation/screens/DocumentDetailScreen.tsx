import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Appbar, Text, TextInput, Button, Divider, Card, ActivityIndicator } from 'react-native-paper';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../state/StoreContext';
import { useNavigation, useRoute } from '@react-navigation/native';

export const DocumentDetailScreen = observer(() => {
    const { documentStore } = useStores();
    const navigation = useNavigation();
    const route = useRoute<any>();
    const { id } = route.params;

    const [message, setMessage] = useState('');

    useEffect(() => {
        documentStore.selectDocument(id);
    }, [id]);

    const doc = documentStore.selectedDocument;

    if (!doc) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator animating={true} />
            </View>
        );
    }

    const handleSend = async () => {
        if (!message.trim()) return;
        await documentStore.sendMessage(message);
        setMessage('');
    };

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title={doc.title} subtitle={doc.mimeType} />
            </Appbar.Header>

            <ScrollView style={styles.content}>
                <Card style={styles.card}>
                    <Card.Content>
                        <Text variant="bodyMedium" style={styles.docContent}>
                            {doc.content.slice(0, 500)}{doc.content.length > 500 ? '...' : ''}
                        </Text>
                        {doc.tags.length > 0 && (
                            <View style={styles.tags}>
                                {doc.tags.map(tag => (
                                    <Text key={tag} style={styles.tag}>#{tag} </Text>
                                ))}
                            </View>
                        )}
                    </Card.Content>
                </Card>

                <Divider style={styles.divider} />
                <Text variant="titleMedium" style={styles.sectionTitle}>Chat with Document</Text>

                <View style={styles.chatContainer}>
                    {documentStore.chatHistory.map((msg, index) => (
                        <View key={index} style={[
                            styles.messageBubble,
                            msg.role === 'user' ? styles.userBubble : styles.modelBubble
                        ]}>
                            <Text style={styles.messageText}>
                                {msg.role === 'model' ? '🤖 ' : '👤 '}
                                {msg.text}
                            </Text>
                        </View>
                    ))}
                    {documentStore.chatHistory.length === 0 && (
                        <Text style={styles.placeholder}>Ask questions about this document...</Text>
                    )}
                </View>
            </ScrollView>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <View style={styles.inputArea}>
                    <TextInput
                        placeholder="Type a message..."
                        value={message}
                        onChangeText={setMessage}
                        style={styles.input}
                        right={<TextInput.Icon icon="send" onPress={handleSend} />}
                        onSubmitEditing={handleSend}
                    />
                </View>
            </KeyboardAvoidingView>
        </View>
    );
});

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    content: { flex: 1, padding: 16 },
    card: { marginBottom: 16, backgroundColor: '#f0f0f0' },
    docContent: { color: '#333' },
    tags: { flexDirection: 'row', marginTop: 8 },
    tag: { color: 'blue', fontWeight: 'bold' },
    divider: { marginVertical: 16 },
    sectionTitle: { marginBottom: 8, fontWeight: 'bold' },
    chatContainer: { paddingBottom: 20 },
    messageBubble: { padding: 12, borderRadius: 8, marginBottom: 8, maxWidth: '90%' },
    userBubble: { alignSelf: 'flex-end', backgroundColor: '#e3f2fd' },
    modelBubble: { alignSelf: 'flex-start', backgroundColor: '#fff', borderWidth: 1, borderColor: '#eee' },
    messageText: { fontSize: 16 },
    placeholder: { fontStyle: 'italic', color: '#999', textAlign: 'center', marginTop: 20 },
    inputArea: { padding: 16, borderTopWidth: 1, borderTopColor: '#eee' },
    input: { backgroundColor: '#fff' }
});
