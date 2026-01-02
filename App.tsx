import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from './src/presentation/navigation/AppNavigator';
import { Provider as PaperProvider } from 'react-native-paper';
import { StoreProvider, useStores } from './src/state/StoreContext';
import { AuthScreen } from './src/presentation/screens/AuthScreen';
import { observer } from 'mobx-react-lite';

const Main = observer(() => {
  const { authStore } = useStores();

  if (!authStore.user) {
    return <AuthScreen />;
  }

  return (
    <View style={styles.container}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
      <StatusBar style="auto" />
    </View>
  );
});

export default function App() {
  return (
    <StoreProvider>
      <PaperProvider>
        <Main />
      </PaperProvider>
    </StoreProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
