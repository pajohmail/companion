export const AppConfig = {
    env: process.env.EXPO_PUBLIC_APP_ENV || 'development',
    logLevel: process.env.EXPO_PUBLIC_LOG_LEVEL || 'debug',
    api: {
        geminiApiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY || '',
        googleClientId: {
            android: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || '',
            ios: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || '',
            web: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '',
        }
    },
    encryption: {
        salt: process.env.EXPO_PUBLIC_ENCRYPTION_SALT || 'default-dev-salt',
    }
};
