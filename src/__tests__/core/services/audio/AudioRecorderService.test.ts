import { AudioRecorderService } from '@core/services/audio/AudioRecorderService';
import { Audio } from 'expo-av';

jest.mock('expo-av', () => ({
    Audio: {
        requestPermissionsAsync: jest.fn(),
        setAudioModeAsync: jest.fn(),
        Recording: {
            createAsync: jest.fn(),
        },
        RecordingOptionsPresets: {
            HIGH_QUALITY: {},
        }
    }
}));

describe('AudioRecorderService', () => {
    let service: AudioRecorderService;
    const mockRecording = {
        stopAndUnloadAsync: jest.fn(),
        getURI: jest.fn().mockReturnValue('file://audio.m4a'),
        getStatusAsync: jest.fn(),
    };

    beforeEach(() => {
        service = new AudioRecorderService();
        jest.clearAllMocks();
        (Audio.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
        (Audio.Recording.createAsync as jest.Mock).mockResolvedValue({ recording: mockRecording });
    });

    it('should start recording successfully', async () => {
        await service.startRecording();
        expect(Audio.requestPermissionsAsync).toHaveBeenCalled();
        expect(Audio.setAudioModeAsync).toHaveBeenCalled();
        expect(Audio.Recording.createAsync).toHaveBeenCalled();
    });

    it('should stop recording and return URI', async () => {
        await service.startRecording();
        const uri = await service.stopRecording();
        expect(mockRecording.stopAndUnloadAsync).toHaveBeenCalled();
        expect(uri).toBe('file://audio.m4a');
    });

    it('should throw if permission denied', async () => {
        (Audio.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });
        await expect(service.startRecording()).rejects.toThrow('Audio permission denied');
    });
});
