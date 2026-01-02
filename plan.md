# Companion App - Implementationsplan

## Projektöversikt

React Native + Expo app med tre huvudfunktioner:
1. **Lösenordshanterare** - Krypterad lagring med OCR från foton
2. **Gemini AI & Dokument** - Chat och dokumentanalys
3. **Röst till Dokument** - Inspelning, transkribering och sammanfattning

## Teknisk Stack

- **Framework:** React Native (latest) med Expo
- **Språk:** TypeScript
- **Paradigm:** Objektorienterad programmering (OOP)
- **State Management:** MobX
- **UI Library:** React Native Paper
- **Testing:** Jest + React Native Testing Library (TDD)
- **Autentisering:** react-native-google-signin
- **Lagring:** Google Drive API
- **AI/LLM:** Google Gemini API
- **Säkerhet:** react-native-keychain + AES-256-GCM kryptering
- **Media:** expo-camera, expo-av

## Arkitektur

### Mappstruktur
```
companion/
├── src/
│   ├── core/                           # Kärnlogik (OOP)
│   │   ├── entities/                   # Domänmodeller
│   │   │   ├── base/
│   │   │   │   ├── Entity.ts
│   │   │   │   └── EncryptableEntity.ts
│   │   │   ├── Password.ts
│   │   │   ├── Document.ts
│   │   │   ├── VoiceNote.ts
│   │   │   └── User.ts
│   │   ├── services/                   # Business services
│   │   │   ├── encryption/
│   │   │   │   ├── EncryptionService.ts
│   │   │   │   ├── AESEncryption.ts
│   │   │   │   └── KeychainManager.ts
│   │   │   ├── storage/
│   │   │   │   ├── GoogleDriveService.ts
│   │   │   │   └── StorageService.ts
│   │   │   ├── ai/
│   │   │   │   ├── GeminiService.ts
│   │   │   │   ├── OCRService.ts
│   │   │   │   └── TranscriptionService.ts
│   │   │   ├── auth/
│   │   │   │   ├── GoogleAuthService.ts
│   │   │   │   └── AuthService.ts
│   │   │   └── media/
│   │   │       ├── CameraService.ts
│   │   │       └── AudioRecorderService.ts
│   │   ├── repositories/               # Data access
│   │   │   ├── base/
│   │   │   │   └── Repository.ts
│   │   │   ├── PasswordRepository.ts
│   │   │   ├── DocumentRepository.ts
│   │   │   └── VoiceNoteRepository.ts
│   │   ├── use-cases/                  # Application logic
│   │   │   ├── password/
│   │   │   ├── document/
│   │   │   └── voice/
│   │   └── di/                         # Dependency Injection
│   │       ├── Container.ts
│   │       └── types.ts
│   ├── infrastructure/                 # Externa integrationer
│   │   ├── api/
│   │   ├── config/
│   │   └── utils/
│   ├── state/                          # MobX stores
│   │   ├── stores/
│   │   ├── RootStore.ts
│   │   └── StoreContext.tsx
│   ├── presentation/                   # UI Layer
│   │   ├── components/
│   │   ├── screens/
│   │   ├── navigation/
│   │   ├── hooks/
│   │   ├── viewmodels/
│   │   └── theme/
│   └── __tests__/
├── App.tsx
├── package.json
├── tsconfig.json
└── jest.config.js
```

## Implementationssteg

### Fas 1: Projektsetup (Dag 1-3)

#### Steg 1: Skapa Expo projekt
```bash
npx create-expo-app companion --template blank-typescript
cd companion
```

#### Steg 2: Installera dependencies
```bash
# Core dependencies
npm install react-native-paper @react-navigation/native @react-navigation/bottom-tabs
npm install @react-native-google-signin/google-signin
npm install react-native-keychain
npm install expo-camera expo-av
npm install mobx mobx-react-lite
npm install react-native-crypto-js axios

# Dev dependencies
npm install --save-dev @types/react @types/react-native
npm install --save-dev @testing-library/react-native @testing-library/jest-native
npm install --save-dev jest @types/jest
npm install --save-dev eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

#### Steg 3: Konfigurera TypeScript
Skapa/uppdatera `tsconfig.json` med strict mode och path aliases.

#### Steg 4: Konfigurera Jest
Skapa `jest.config.js` med coverage thresholds.

#### Steg 5: Skapa mappstruktur
```bash
mkdir -p src/{core,infrastructure,state,presentation}
mkdir -p src/core/{entities,services,repositories,use-cases,di}
mkdir -p src/infrastructure/{api,config,utils}
mkdir -p src/state/stores
mkdir -p src/presentation/{components,screens,navigation,hooks,viewmodels,theme}
```

### Fas 2: Core Infrastructure (Dag 4-7)

#### Steg 6: Logger & ErrorHandler
- `src/infrastructure/utils/Logger.ts`
- `src/infrastructure/utils/ErrorHandler.ts`
- `src/infrastructure/utils/errors.ts`

#### Steg 7: AppConfig
- `src/infrastructure/config/AppConfig.ts`
- `src/infrastructure/config/env.ts`
- `.env.example`

#### Steg 8: Base Classes
- `src/core/entities/base/Entity.ts`
- `src/core/entities/base/EncryptableEntity.ts`
- `src/core/repositories/base/Repository.ts`
- `src/infrastructure/api/base/APIClient.ts`

#### Steg 9: Dependency Injection
- `src/core/di/Container.ts`
- `src/core/di/types.ts`

### Fas 3: Autentisering (Dag 8-14)

#### Steg 10: Google Auth Service
- `src/core/services/auth/AuthService.ts` (interface)
- `src/core/services/auth/GoogleAuthService.ts`
- Skriv unit tests först (TDD)

#### Steg 11: Auth Store
- `src/state/stores/base/BaseStore.ts`
- `src/state/stores/AuthStore.ts`
- Skriv tests

#### Steg 12: Auth UI
- `src/presentation/screens/AuthScreen.tsx`
- `src/presentation/components/common/Button.tsx`
- Testa inloggningsflöde

#### Steg 13: Root Store & Context
- `src/state/RootStore.ts`
- `src/state/StoreContext.tsx`
- Hook: `src/presentation/hooks/useStores.ts`

### Fas 4: Lösenordshanterare (Dag 15-35)

#### Steg 14-17: Kryptering
- `src/core/services/encryption/AESEncryptionService.ts`
- `src/core/services/encryption/KeychainManager.ts`
- `src/core/entities/Password.ts`
- Omfattande tester för kryptering

#### Steg 18-21: Camera & OCR Services
- `src/core/services/media/CameraService.ts`
- `src/infrastructure/api/GeminiAPIClient.ts`
- `src/core/services/ai/GeminiService.ts`
- `src/core/services/ai/OCRService.ts`

#### Steg 22-24: Google Drive Integration
- `src/infrastructure/api/GoogleDriveClient.ts`
- `src/core/services/storage/GoogleDriveService.ts`
- `src/core/repositories/PasswordRepository.ts`

#### Steg 25-28: Password Use Cases
- `src/core/use-cases/password/ScanPasswordNoteUseCase.ts`
- `src/core/use-cases/password/CreatePasswordUseCase.ts`
- `src/core/use-cases/password/DecryptPasswordUseCase.ts`
- `src/core/use-cases/password/DeletePasswordUseCase.ts`
- `src/state/stores/PasswordStore.ts`

#### Steg 29-35: Password UI
- `src/presentation/viewmodels/PasswordManagerViewModel.ts`
- `src/presentation/components/password/CameraScanner.tsx`
- `src/presentation/components/password/PasswordList.tsx`
- `src/presentation/components/password/PasswordItem.tsx`
- `src/presentation/components/password/PasswordForm.tsx`
- `src/presentation/screens/PasswordManagerScreen.tsx`
- Integration tests

### Fas 5: Gemini AI & Dokument (Dag 36-49)

#### Steg 36-38: Document Foundation
- `src/core/entities/Document.ts`
- `src/core/repositories/DocumentRepository.ts`
- Tests

#### Steg 39-42: Document Use Cases
- `src/core/use-cases/document/ChatWithGeminiUseCase.ts`
- `src/core/use-cases/document/AnalyzeDocumentUseCase.ts`
- `src/core/use-cases/document/SaveDocumentUseCase.ts`
- `src/state/stores/DocumentStore.ts`

#### Steg 43-49: Document UI
- `src/presentation/viewmodels/GeminiDocumentViewModel.ts`
- `src/presentation/components/document/ChatInterface.tsx`
- `src/presentation/components/document/MessageBubble.tsx`
- `src/presentation/components/document/DocumentAnalyzer.tsx`
- `src/presentation/components/document/DocumentList.tsx`
- `src/presentation/screens/GeminiDocumentScreen.tsx`

### Fas 6: Röst till Dokument (Dag 50-63)

#### Steg 50-52: Voice Foundation
- `src/core/services/media/AudioRecorderService.ts`
- `src/core/entities/VoiceNote.ts`
- `src/core/repositories/VoiceNoteRepository.ts`

#### Steg 53-56: Voice Use Cases
- `src/core/services/ai/TranscriptionService.ts`
- `src/core/use-cases/voice/RecordVoiceUseCase.ts`
- `src/core/use-cases/voice/TranscribeVoiceUseCase.ts`
- `src/state/stores/VoiceNoteStore.ts`

#### Steg 57-63: Voice UI
- `src/presentation/viewmodels/VoiceToDocumentViewModel.ts`
- `src/presentation/components/voice/VoiceRecorder.tsx`
- `src/presentation/components/voice/AudioVisualizer.tsx`
- `src/presentation/components/voice/TranscriptionView.tsx`
- `src/presentation/screens/VoiceToDocumentScreen.tsx`

### Fas 7: Navigation & Polish (Dag 64-77)

#### Steg 64-66: Navigation
- `src/presentation/navigation/TabNavigator.tsx`
- `src/presentation/navigation/RootNavigator.tsx`
- `src/presentation/navigation/navigationTypes.ts`

#### Steg 67-70: UI Polish
- Error boundaries
- Loading states
- Empty states
- Theme refinement

#### Steg 71-77: Testing & Bugfixar
- Integration tests
- Bug fixes
- Performance optimization
- Security audit

### Fas 8: Deployment (Dag 78-84)

#### Steg 78-84: Production
- Production config
- Build optimization
- App store assets
- Beta testing
- Submission

## Google Cloud Console Setup

### 1. Skapa nytt projekt
1. Gå till [Google Cloud Console](https://console.cloud.google.com)
2. Skapa nytt projekt: "Companion App"

### 2. Aktivera API:er
- Google Drive API
- Gemini API (Generative Language API)

### 3. OAuth 2.0 Credentials
1. Navigera till "Credentials"
2. Skapa OAuth 2.0 Client ID för:
   - Android (com.yourname.companion)
   - iOS (com.yourname.companion)
3. Lägg till scopes:
   - `https://www.googleapis.com/auth/drive.file`
   - `https://www.googleapis.com/auth/userinfo.profile`

### 4. Gemini API Key
1. Gå till "APIs & Services" → "Credentials"
2. Skapa API Key
3. Begränsa till Generative Language API

## Environment Variables

Skapa `.env` fil:
```env
GOOGLE_CLIENT_ID=your-android-client-id.apps.googleusercontent.com
GOOGLE_WEB_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
GOOGLE_IOS_CLIENT_ID=your-ios-client-id.apps.googleusercontent.com
GEMINI_API_KEY=your-gemini-api-key
APP_ENV=development
LOG_LEVEL=debug
ENCRYPTION_SALT=your-random-salt-here
```

## Säkerhetsarkitektur

### Zero-Knowledge Encryption Flow
```
User Master Password
    ↓
PBKDF2 (100,000 iterations + salt)
    ↓
Master Encryption Key
    ↓
Keychain (biometric protected)
    ↓
AES-256-GCM Encryption
    ↓
Encrypted Data → Google Drive
```

### Viktiga säkerhetsprinciper
1. Kryptering sker endast lokalt på device
2. Google Drive får endast encrypted blobs
3. Master key lagras i Keychain med biometric protection
4. Ingen plaintext data lämnar enheten

## TDD Workflow

### För varje komponent:
1. **Red:** Skriv test först (ska faila)
2. **Green:** Implementera minimal kod
3. **Refactor:** Förbättra utan att bryta test

### Test struktur:
```typescript
describe('ComponentName', () => {
  describe('method/feature', () => {
    it('should do something specific', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

---

## Startprompt för Google AI Studio (Gemini)

Kopiera och använd denna prompt i Google AI Studio för att få hjälp med implementationen:

```
Jag bygger en React Native + Expo app enligt följande specifikation:

PROJEKT: Companion App
PARADIGM: Objektorienterad programmering (OOP)
SPRÅK: TypeScript
STATE: MobX
TESTING: Test-Driven Development (TDD) med Jest

APP-FUNKTIONER:
1. Lösenordshanterare med Zero-Knowledge kryptering (AES-256-GCM)
2. Gemini AI dokumentanalys och chat
3. Röstinspelning med transkribering via Gemini

ARKITEKTUR:
- Core Layer: Entities, Services, Repositories, Use Cases, DI Container
- Infrastructure Layer: API Clients, Config, Utils (Logger, ErrorHandler)
- State Layer: MobX Stores (Auth, Password, Document, VoiceNote)
- Presentation Layer: Components, Screens, ViewModels, Navigation

TEKNISK STACK:
- react-native-google-signin (autentisering)
- Google Drive API (lagring)
- Google Gemini API (OCR, chat, transkribering)
- react-native-keychain (säker key storage)
- expo-camera, expo-av (media)
- React Native Paper (UI)

SÄKERHETSKRAV:
- Zero-knowledge arkitektur
- Client-side AES-256-GCM kryptering
- PBKDF2 key derivation (100k iterations)
- Master key i Keychain med biometric protection
- Ingen plaintext till Google Drive

NUVARANDE UPPGIFT:
[Beskriv specifik uppgift här, t.ex.:
"Jag behöver implementera AESEncryptionService.ts som ska hantera kryptering och dekryptering av lösenord med AES-256-GCM. Klassen ska ha metoderna: encrypt(), decrypt(), generateKey(), hashPassword() och en privat deriveKey() metod. Jag vill följa TDD så börja med att skapa test-filen först."]

Följ dessa principer:
1. Skriv alltid tester FÖRST (TDD)
2. Använd klasser och OOP-principer (SOLID)
3. TypeScript strict mode
4. Dependency Injection för testbarhet
5. Tydlig separation of concerns

Ge mig:
1. Test-fil med omfattande test cases
2. Implementation av klassen/komponenten
3. Förklaring av design-beslut
4. Eventuella edge cases att tänka på

Börja med test-filen för [KOMPONENTEN].
```

## Hur du använder Gemini för implementation

### Exempel 1: Implementera AESEncryptionService

**Prompt till Gemini:**
```
Nuvarande uppgift: Implementera AESEncryptionService.ts

Krav:
- Klass som implementerar IEncryptionService interface
- Metoder: encrypt(), decrypt(), generateKey(), hashPassword(), deriveKey()
- AES-256-GCM algoritm
- PBKDF2 för key derivation med 100,000 iterationer
- Salt och IV handling
- Comprehensive error handling

Börja med att skapa test-filen först enligt TDD.
```

### Exempel 2: Implementera Password Entity

**Prompt till Gemini:**
```
Nuvarande uppgift: Implementera Password entity som ärver från EncryptableEntity

Krav:
- Privata fields: title, username, password, notes, encryptedData
- Metoder: encrypt(), decrypt(), validate(), toJSON()
- Ärvning från EncryptableEntity<PasswordDTO>
- Validering av required fields
- TypeScript strict typing

Skapa test-fil först, sedan implementation.
```

### Exempel 3: Implementera ScanPasswordNoteUseCase

**Prompt till Gemini:**
```
Nuvarande uppgift: Implementera ScanPasswordNoteUseCase

Flow:
1. Ta foto med CameraService
2. OCR med OCRService (Gemini)
3. Skapa Password entity
4. Kryptera med master key från KeychainManager
5. Spara via PasswordRepository

Dependencies:
- CameraService
- OCRService
- AESEncryptionService
- PasswordRepository
- KeychainManager

Skapa test-fil med mocks för alla dependencies, sedan implementation.
```

## Tips för effektiv utveckling

1. **En komponent i taget:** Följ implementationsordningen strikt
2. **TDD genomgående:** Alltid test först
3. **Mock dependencies:** Använd jest.mock() för externa services
4. **Integration tests:** Testa hela flöden när komponenter är klara
5. **Refactor kontinuerligt:** Håll koden clean
6. **Security review:** Granska krypteringslogik extra noggrant
7. **Performance:** Profila regelbundet, optimera vid behov

## Checklista innan lansering

- [ ] Alla tests passerar (100% coverage för core logic)
- [ ] Security audit genomförd
- [ ] Ingen plaintext data läcker till Google Drive
- [ ] Master key är säkert lagrad i Keychain
- [ ] Error handling på plats överallt
- [ ] Loading states för alla async operationer
- [ ] Offline support där möjligt
- [ ] Accessibility testing
- [ ] Performance optimization
- [ ] App ikoner och splash screen
- [ ] Privacy policy och terms of service
- [ ] Beta testing med riktiga användare

---

**Lycka till med utvecklingen! 🚀**

För frågor eller support kring specifika implementationsdetaljer, använd startprompt-mallen med Google AI Studio (Gemini).
