import { Provider } from 'react-redux';
import store from './src/redux/store';
import { DefaultTheme, PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import 'text-encoding';

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: 'black', // Change primary color from purple to something else
        background: 'white', // Or other colors
        text: 'black', // Modify text color if needed
    },
};

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <AppNavigator/>
      </PaperProvider>
    </Provider>
  );
}