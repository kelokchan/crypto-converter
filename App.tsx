import { Ionicons } from '@expo/vector-icons';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import { QueryClient, QueryClientProvider } from 'react-query';
import FlashMessage from 'react-native-flash-message';
import AppContextProvider, { useApp } from './src/context/AppContext';
import Home from './src/Home';

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

const App = () => {
  const app = useApp();
  const { theme, toggleTheme, loaded } = app;
  const isDarkTheme = theme === 'dark';

  if (!loaded) {
    return null;
  }

  return (
    <NavigationContainer
      theme={isDarkTheme ? NavigationDarkTheme : NavigationDefaultTheme}>
      <QueryClientProvider client={queryClient}>
        <PaperProvider
          settings={{
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            icon: (props) => <Ionicons {...props} />,
          }}
          theme={isDarkTheme ? PaperDarkTheme : PaperDefaultTheme}>
          <StatusBar style={isDarkTheme ? 'light' : 'dark'} />
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={Home}
              options={{
                title: 'Crypto Converter',
                headerRight: () => (
                  <Ionicons
                    onPress={toggleTheme}
                    name={isDarkTheme ? 'sunny' : 'moon'}
                    size={24}
                    color={isDarkTheme ? 'white' : 'black'}
                  />
                ),
              }}
            />
          </Stack.Navigator>
        </PaperProvider>
      </QueryClientProvider>
      <FlashMessage position="bottom" />
    </NavigationContainer>
  );
};

export default () => (
  <AppContextProvider>
    <App />
  </AppContextProvider>
);
