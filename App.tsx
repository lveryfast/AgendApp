import React, {useState, useEffect} from 'react';
import {StatusBar, View, ActivityIndicator, StyleSheet} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {I18nextProvider} from 'react-i18next';
import {AppNavigator} from './src/navigation/AppNavigator';
import {AppProvider, useApp} from './src/context/AppContext';
import {initDatabase} from './src/database/initDatabase';
import {runMigrations} from './src/database/migrations';
import i18n from './src/i18n';

const AppContent: React.FC = () => {
  const [isReady, setIsReady] = useState<boolean>(false);
  const {isDark} = useApp();

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async (): Promise<void> => {
    try {
      await initDatabase();
      await runMigrations();
      setIsReady(true);
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  };

  if (!isReady) {
    return (
      <View style={[styles.loading, {backgroundColor: isDark ? '#0F172A' : '#F3F4F6'}]}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#0F172A' : '#F3F4F6'}
      />
      <AppNavigator />
    </>
  );
};

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <I18nextProvider i18n={i18n}>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </I18nextProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;