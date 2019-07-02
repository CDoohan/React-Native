import React from 'react';
import Main from './components/MainComponent';
import { Provider } from 'react-redux';
import { ConfigureStore } from './redux/configureStore';

const store = ConfigureStore();

if (__DEV__) {
  require('react-devtools');
}

export default function App() {
  return (
    // CONECTANDO A APLICAÇÃO COM A REDUX STORE
    <Provider store={store}>
      <Main />
    </Provider>
  );
}
