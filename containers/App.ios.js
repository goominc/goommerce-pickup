import React from 'react';
import { AsyncStorage, StatusBar, TabBarIOS, View } from 'react-native';
import { connect } from 'react-redux'
import { authActions } from 'goommerce-redux';

import EmptyView from '../components/EmptyView';
import Navigator from '../components/Navigator';
import Signin from '../components/Signin';
import routes from '../routes';

const App = React.createClass({
  getInitialState: function() {
    return {
      selectedTab: 'orders',
    };
  },
  componentDidMount() {
    const { auth, whoami } = this.props;
    if (auth.bearer && !auth.email) {
      whoami();
    }
  },
  signin(email, password) {
    this.props.login(email, password).then(
      (auth) => AsyncStorage.setItem('bearer', auth.bearer)
    );
  },
  render() {
    const { auth: { bearer, email } } = this.props;
    if (!bearer) {
      return <Signin signin={this.signin} />;
    }
    if (!email) {
      return <EmptyView text={'Loading...'} />;
    }

    return (
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />
        <TabBarIOS
          barTintColor="white">
          <TabBarIOS.Item
            icon={require('./images/tab_product.png')}
            title="상품픽업"
            selected={this.state.selectedTab === 'pickup'}
            onPress={() => {
              this.setState({ selectedTab: 'pickup' });
            }}>
            <Navigator initialRoute={routes.dashboard()} />
          </TabBarIOS.Item>
          <TabBarIOS.Item
            icon={require('./images/tab_profile.png')}
            title="내 정보"
            selected={this.state.selectedTab === 'profile'}
            onPress={() => {
              this.setState({ selectedTab: 'profile' });
            }}>
            <Navigator initialRoute={routes.profile()} />
          </TabBarIOS.Item>
        </TabBarIOS>
      </View>
    );
  }
});

export default connect(
  (state) => ({ auth: state.auth }) , authActions
)(App);
