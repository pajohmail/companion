import React, { useState } from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { Appbar, TextInput, Button, SegmentedButtons, Text, HelperText, ActivityIndicator } from 'react-native-paper';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../state/StoreContext';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

export const DocumentAddScreen = observer(() => {
    const { documentStore } = useStores();
    const navigation = useNavigation();

    const [title, setTitle] = useState('');
    const [mode, setMode] = useState('text'); // 'text' | 'image' | 'voice'
    const [textContent, setTextContent] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [imageBase64, setImageBase64] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            base64: true,
            quality: 0.7,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
            setImageBase64(result.assets[0].base64 || undefined);
        }
    };

    const handleRecordToggle = async () => {
        if (documentStore.isRecording) {
            const text = await documentStore.stopRecordingAndTranscribe();
            if (text) {
                setTextContent(text);
                setMode('text'); // Switch to text mode to edit transcription
            }
        } else {
            await documentStore.startRecording();
        }
    };

    const handleSave = async () => {
        if (!title.trim()) return;
        setLoading(true);
        try {
            await documentStore.addDocument(
                title,
                mode === 'image' ? imageBase64 : undefined,
                mode === 'text' || mode === 'voice' ? textContent : undefined,
                []
            );
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Add Document" />
                <Appbar.Action icon="check" onPress={handleSave} disabled={loading || !title || documentStore.isRecording} />
            </Appbar.Header>

            <ScrollView contentContainerStyle={styles.content}>
                <TextInput
                    label="Title"
                    value={title}
                    onChangeText={setTitle}
                    mode="outlined"
                    style={styles.input}
                    disabled={documentStore.isRecording}
                />

                <SegmentedButtons
                    value={mode}
                    onValueChange={setMode}
                    buttons={[
                        { value: 'text', label: 'Type' },
                        { value: 'image', label: 'Scan' },
                        { value: 'voice', label: 'Voice' },
                    ]}
                    style={styles.segment}
                />

                {mode === 'text' && (
                    <TextInput
                        label="Text Content"
                        value={textContent}
                        onChangeText={setTextContent}
                        mode="outlined"
                        multiline
                        numberOfLines={10}
                        style={styles.textArea}
                    />
                )}

                {mode === 'image' && (
                    <View style={styles.imageSection}>
                        <Button mode="outlined" onPress={pickImage} icon="camera">
                            Pick / Take Image
                        </Button>
                        {imageUri && (
                            <Image source={{ uri: imageUri }} style={styles.preview} />
                        )}
                        <HelperText type="info">
                            Gemini will extract text from this image automatically.
                        </HelperText>
                    </View>
                )}

                {mode === 'voice' && (
                    <View style={styles.voiceSection}>
                        <Button
                            mode={documentStore.isRecording ? "contained" : "outlined"}
                            onPress={handleRecordToggle}
                            icon={documentStore.isRecording ? "stop" : "microphone"}
                            buttonColor={documentStore.isRecording ? 'red' : undefined}
                            loading={documentStore.isLoading && mode === 'voice'}
                        >
                            {documentStore.isRecording ? "Stop Recording" : "Start Recording"}
                        </Button>
                        <HelperText type="info">
                            Recording will be transcribed by Gemini and converted to text.
                        </HelperText>
                    </View>
                )}

                {(loading || documentStore.isLoading) && <ActivityIndicator animating={true} style={styles.loader} />}

                <Button
                    mode="contained"
                    onPress={handleSave}
                    style={styles.saveBtn}
                    loading={loading}
                    disabled={loading || !title || documentStore.isRecording}
                >
                    Save Document
                </Button>
            </ScrollView>
        </View>
    );
});

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    content: { padding: 16 },
    input: { marginBottom: 16 },
    segment: { marginBottom: 16 },
    textArea: { marginBottom: 16, backgroundColor: '#fff' },
    imageSection: { alignItems: 'center', marginBottom: 16 },
    voiceSection: { alignItems: 'center', marginBottom: 16, padding: 20 },
    preview: { width: 200, height: 200, marginTop: 16, borderRadius: 8 },
    saveBtn: { marginTop: 16 },
    loader: { marginTop: 10 }
});
