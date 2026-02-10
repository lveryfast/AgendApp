import React, {useState, useEffect} from 'react';
import {AppRegistry, StatusBar, View, ActivityIndicator, StyleSheet} from 'react-native';  // ✅ Agregar AppRegistry
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AppNavigator} from './src/navigation/AppNavigator';
import {initDatabase} from './src/database/initDatabase';
import {runMigrations} from './src/database/migrations';
import {useTheme} from './src/hooks/useTheme';
import './src/i18n';

const App: React.FC = () => {
  const [isReady, setIsReady] = useState<boolean>(false);
  const {isDark} = useTheme();

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
    <SafeAreaProvider>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#0F172A' : '#F3F4F6'}
      />
      <AppNavigator isDark={isDark} setIsDark={() => {}} />
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

AppRegistry.registerComponent('AgendaOffline', () => App);

export default App;