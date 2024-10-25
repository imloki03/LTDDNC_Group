import { Provider } from 'react-redux';
import store from './src/redux/store';
import { PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider>
        <AppNavigator/>
      </PaperProvider>
    </Provider>
  );
}