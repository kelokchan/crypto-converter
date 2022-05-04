import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Appearance } from 'react-native';

type Theme = 'light' | 'dark';

const DEFAULT_THEME = Appearance.getColorScheme() || 'light';

const AppContext = createContext({
  theme: DEFAULT_THEME,
  loaded: false,
  toggleTheme: () => {},
});

const AppContextProvider: React.FC = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
  const [loaded, setLoaded] = useState(false);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme]);

  useEffect(() => {
    AsyncStorage.getItem('APP_THEME').then((value) => {
      if (value) {
        setTheme(value as Theme);
      }

      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (theme !== DEFAULT_THEME) {
      AsyncStorage.setItem('APP_THEME', theme || 'light');
    }
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      loaded,
      toggleTheme,
    }),
    [loaded, theme, toggleTheme],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => useContext(AppContext);

export default AppContextProvider;
