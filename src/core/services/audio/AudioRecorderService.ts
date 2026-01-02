import { Audio } from 'expo-av';
import { Logger } from '../../../infrastructure/utils/Logger';

export interface IAudioRecorderService {
    startRecording(): Promise<void>;
    stopRecording(): Promise<string | null>; // Returns URI
    getRecordingStatus(): Promise<Audio.RecordingStatus | null>;
    requestPermissions(): Promise<boolean>;
}

export class AudioRecorderService implements IAudioRecorderService {
    private recording: Audio.Recording | null = null;

    async requestPermissions(): Promise<boolean> {
        try {
            const { status } = await Audio.requestPermissionsAsync();
            return status === 'granted';
        } catch (error) {
            Logger.error('Failed to request audio permissions', error);
            return false;
        }
    }

    async startRecording(): Promise<void> {
        try {
            const permission = await this.requestPermissions();
            if (!permission) throw new Error('Audio permission denied');

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );

            this.recording = recording;
        } catch (error) {
            Logger.error('Failed to start recording', error);
            throw error;
        }
    }

    async stopRecording(): Promise<string | null> {
        if (!this.recording) return null;

        try {
            await this.recording.stopAndUnloadAsync();
            const uri = this.recording.getURI();
            this.recording = null;
            return uri;
        } catch (error) {
            Logger.error('Failed to stop recording', error);
            throw error;
        }
    }

    async getRecordingStatus(): Promise<Audio.RecordingStatus | null> {
        if (!this.recording) return null;
        return this.recording.getStatusAsync();
    }
}
