// Basic Setup File
it('setup file', () => { expect(true).toBe(true); });

jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('expo-image-picker', () => ({
    launchImageLibraryAsync: jest.fn(),
    MediaTypeOptions: {
        Images: 'Images',
    },
}));

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

jest.mock('expo-file-system', () => ({
    readAsStringAsync: jest.fn(),
    EncodingType: { Base64: 'base64' },
    documentDirectory: 'file:///data/user/0/host.exp.exponent/files/',
}));

jest.mock('@react-native-google-signin/google-signin', () => ({
    GoogleSignin: {
        configure: jest.fn(),
        hasPlayServices: jest.fn(),
        signIn: jest.fn(),
        signOut: jest.fn(),
        getCurrentUser: jest.fn(),
        getTokens: jest.fn(),
    },
    GoogleSigninButton: 'GoogleSigninButton',
}));

jest.mock('react-native-keychain', () => ({
    setGenericPassword: jest.fn(),
    getGenericPassword: jest.fn(),
    resetGenericPassword: jest.fn(),
    ACCESSIBLE: {
        WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'WHEN_UNLOCKED_THIS_DEVICE_ONLY',
        // Add other needed constants here
    },
    ACCESS_CONTROL: {
        BIOMETRY_ANY_OR_DEVICE_PASSCODE: 'BIOMETRY_ANY_OR_DEVICE_PASSCODE',
    },
}));

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
// jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
