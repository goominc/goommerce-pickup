import _ from 'lodash';
import React from 'react';
import { Alert, AsyncStorage, Platform, StyleSheet, Text, View } from 'react-native';
import { Provider } from 'react-redux'
import { config as configApiClient } from 'goommerce-api-client';
import configureStore, { errorActions } from 'goommerce-redux';
import moment from 'moment';

import App from './containers/App';

if (__DEV__) {
  configApiClient({ apiRoot: (Platform.OS === 'ios') ? 'http://localhost:8080' : 'http://10.0.3.2:8080' });
} else {
  configApiClient({ apiRoot: 'https://www.linkshops.com' });
}

const store = configureStore({
  search(state = {}, action) {
    const { payload, type } = action;
    if (type === 'BRAND_SEARCH') {
      return _.assign({}, state, { brand: payload });
    }
    return state;
  },
});

store.subscribe(() => {
  const { error: { message, status } } = store.getState();
  if (message) {
    Alert.alert(
      'Error',
      message,
      [{
        text: 'OK', onPress: () => {
          errorActions.resetError()(store.dispatch);
          if (status === 401) {
            AsyncStorage.removeItem('bearer').then(() => store.dispatch( { type: 'LOGOUT' }));
          }
        }
      }],
    );
  }
});

export default React.createClass({
  getInitialState() {
    return { loaded: false };
  },
  componentDidMount() {
    AsyncStorage.getItem('bearer').then(
      (bearer) => {
        store.dispatch({ type: 'LOGIN', payload: { bearer } });
        this.setState({ loaded: true });
      }
    );
  },
  render() {
    if (!this.state.loaded) {
      return (
        <View>
          <Text>
            Loading...
          </Text>
        </View>
      );
    }
    return (
      <Provider store={store}>
        <App date={moment().format('YYYY-MM-DD')}/>
      </Provider>
    );
  }
});
