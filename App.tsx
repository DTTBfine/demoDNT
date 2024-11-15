import * as React from 'react';
import { StyleSheet } from 'react-native';
//import tw from 'tailwind-react-native-classnames';
import AppNavigation from './src/presentation/navigation/AppNavigation';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import reduxStore from './redux';

const { store, persistor } = reduxStore();

export default function App() {
  return (
    <Provider store={store}>
      <AppNavigation />
      {/* <PersistGate loading={null} persistor={persistor}>
        <AppNavigation />
      </PersistGate> */}
    </Provider>
  );
}

