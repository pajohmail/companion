# Companion App

A secure, AI-powered companion application built with React Native (Expo) and TypeScript.

## Features

### 🔐 Password Manager
- **Secure Storage**: Uses AES-256-GCM encryption for password fields.
- **Keychain Integration**: The master key is securely stored in the device's Keychain/Keystore.
- **Google Drive Sync**: Encrypted password database (`passwords.json`) is synced to your Google Drive App Data folder.
- **OCR**: Scan credentials from images using Gemini AI.

### 📄 Document Management
- **Digitize**: Scan images or record voice notes to create documents.
- **AI Powered**:
  - **OCR**: Extract text from images.
  - **Transcriptions**: Convert voice notes to text using Gemini 1.5 Flash.
  - **Chat**: Chat with your documents to get summaries or answer questions.
- **Dual Authentication**: Choose between using your Google Account's free quota or your own Gemini API Key for higher limits.

### ⚙️ Architecture
- **Clean Architecture**: Separation of concerns (Presentation, Domain/Core, Infrastructure).
- **State Management**: MobX for reactive state management.
- **Dependency Injection**: Custom DI container for loose coupling.
- **Testing**: Comprehensive Unit and Integration tests using Jest.

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/pajohmail/companion.git
   cd companion
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configuration**
   - The app uses `Google Sign-In`. You will need to configure `google-services.json` (Android) and `GoogleService-Info.plist` (iOS) in the root directory for standard builds, or use Expo's config plugins.
   - *Note*: For development in Expo Go, some Google Sign-In features might require a custom dev client.

### Running the App

- **Start Metro Bundler**:
  ```bash
  npm start
  ```
- **Run on Android/iOS**:
  Press `a` for Android or `i` for iOS in the terminal window.

### Testing

Run the test suite:
```bash
npm test
```

## Project Structure

```
src/
├── core/                   # Domain Logic
│   ├── entities/           # Data Models (Password, Document, etc.)
│   ├── repositories/       # Data Access Interfaces & Implementations
│   ├── services/           # Core Business Logic (Auth, Encryption, AI)
│   └── use-cases/          # Application Actions
├── infrastructure/         # External tools & Config
│   ├── config/             # App Config
│   └── utils/              # Loggers, Error Handlers
├── presentation/           # UI Layer
│   ├── components/         # Reusable React components
│   ├── navigation/         # Navigators (Tab, Stack)
│   └── screens/            # Application Screens
└── state/                  # MobX Stores
```

## Security Note

- **Master Key**: Generated locally and stored in the secure hardware element (Keychain). It never leaves the device.
- **Encryption**: Data is encrypted *before* being sent to Google Drive.
- **AI Privacy**: When using Gemini, data is sent to Google's API. Review Google's AI data policy.

## License

MIT
