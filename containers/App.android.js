import React from 'react';
import {
  AsyncStorage,
  BackAndroid,
  Dimensions,
  DrawerLayoutAndroid,
  Navigator,
  StatusBar,
  StyleSheet,
  View
} from 'react-native';
import { connect } from 'react-redux'
import { authActions } from 'goommerce-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import _ from 'lodash';

import routes from '../routes';
import EmptyView from '../components/EmptyView';
import Signin from '../components/Signin';
import RouteList from '../components/RouteList';

const DRAWER_WIDTH_LEFT = 56;

// FIXME: Uses NavigatorExperimental when it's ready.
let _navigator;
BackAndroid.addEventListener('hardwareBackPress', () => {
  if (_navigator && _navigator.getCurrentRoutes().length > 1) {
    _navigator.pop();
    return true;
  }
  return false;
});

const App = React.createClass({
  componentDidMount() {
    const { auth, whoami } = this.props;
    if (auth.bearer && !auth.email) {
      whoami();
    }
  },
  componentWillMount() {
    BackAndroid.addEventListener('hardwareBackPress', this.handleBackButtonPress);
  },
  handleBackButtonPress() {
    if (this._overrideBackPressForDrawerLayout) {
      // This hack is necessary because drawer layout provides an imperative API
      // with open and close methods. This code would be cleaner if the drawer
      // layout provided an `isOpen` prop and allowed us to pass a `onDrawerClose` handler.
      this.drawer && this.drawer.closeDrawer();
      return true;
    }
    return false;
  },
  signin(email, password) {
    this.props.login(email, password).then(
      (auth) => AsyncStorage.setItem('bearer', auth.bearer)
    );
  },
  renderScene(route, navigator) {
    _navigator = navigator;
    return (
      <View style={styles.scene}>
        <MaterialIcons.ToolbarAndroid
          navIconName="menu"
          onIconClicked={() => this.drawer.openDrawer()}
          style={styles.toolbar}
          title={route.title}
        />
        <route.component {...route.props} push={navigator.push} />
      </View>
    );
  },
  renderDrawerContent() {
    return (
      <View style={styles.drawerContentWrapper}>
        <RouteList
          routes={[routes.dashboard, routes.profile]}
          onSelect={(route) => {
            if (brands.length && _navigator) {
              this.drawer && this.drawer.closeDrawer();
              _navigator.resetTo(route(), 0);
            }
          }}
        />
      </View>
    );
  },
  renderApp() {
    const { auth: { bearer, email } } = this.props;
    if (!bearer) {
      return (<Signin signin={this.signin} />);
    }
    if (!email) {
      return <EmptyView text={'Loading...'} />;
    }

    return (
      <Navigator
        initialRoute={routes.dashboard()}
        renderScene={this.renderScene}
        style={styles.container}
      />
    );
  },
  render() {
    return (
      <DrawerLayoutAndroid
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        drawerWidth={Dimensions.get('window').width - DRAWER_WIDTH_LEFT}
        keyboardDismissMode="on-drag"
        onDrawerOpen={() => {
          this._overrideBackPressForDrawerLayout = true;
        }}
        onDrawerClose={() => {
          this._overrideBackPressForDrawerLayout = false;
        }}
        ref={(drawer) => { this.drawer = drawer; }}
        renderNavigationView={this.renderDrawerContent}
        statusBarBackgroundColor="#589c90"
      >
        {this.renderApp()}
      </DrawerLayoutAndroid>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  toolbar: {
    backgroundColor: '#e9eaed',
    height: 56,
  },
  scene: {
    flex: 1,
    backgroundColor: 'white',
  },
  drawerContentWrapper: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: 'white',
  },
});

export default connect(
  (state) => ({ auth: state.auth }) , authActions
)(App);
