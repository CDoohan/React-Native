import React from 'react';
import Main from './components/MainComponent';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import { ConfigureStore } from './redux/configureStore';
import { Loading } from './components/LoadingComponent';

const { store, persistor } = ConfigureStore();

if (__DEV__) {
  require('react-devtools');
}

export default function App() {
  return (
    // CONECTANDO A APLICAÇÃO COM A REDUX STORE
    <Provider store={store}>
      <PersistGate Loading={<Loading />} persistor={persistor}>
        <Main />
      </PersistGate>
    </Provider>
  );
}
