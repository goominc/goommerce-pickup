import _ from 'lodash';
import React from 'react';
import { BackAndroid, Navigator, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from 'react-native-button';
import { connect } from 'react-redux'

import Icon from './Icon';

let _navigator;
if (Platform.OS === 'android') {
  // FIXME: Uses NavigatorExperimental when it's ready.
  BackAndroid.addEventListener('hardwareBackPress', () => {
    if (_navigator && _navigator.getCurrentRoutes().length > 1) {
      _navigator.pop();
      return true;
    }
    return false;
  });
}

export default connect()(React.createClass({
  renderScene(route, navigator) {
    if (Platform.OS === 'android') {
      _navigator = navigator;
    }
    return (
      <View style={styles.scene}>
        <route.component {...route.props} {...this.props.childProps} push={navigator.push} pop={navigator.pop} />
      </View>
    );
  },
  routeMapper() {
    const { dispatch } = this.props;
    return {
      LeftButton(route, navigator, index, navState) {
        if (index === 0) {
          return null;
        }
        return (
          <Button onPress={() => navigator.pop()} containerStyle={styles.navBarButton}>
            <Icon name='arrow-back' size={23} color='white' />
          </Button>
        );
      },
      RightButton(route, navigator, index, navState) {
        const { component } = route;
        const rightButton = component.rightButton || _.get(component, 'WrappedComponent.rightButton');
        if (rightButton) {
          return (
            <View style={styles.navBarButton}>
              {rightButton(navigator, route)}
            </View>
          );
        }
      },
      Title(route, navigator, index, navState) {
        const { title, component } = route;
        if (_.isNil(title)) {
          const componentTitle = component.title || _.get(component, 'WrappedComponent.title');
          if (componentTitle) return componentTitle(dispatch);
        } else {
          return (
            <Text style={styles.navBarTitleText}>
              {title}
            </Text>
          );
        }
      },
    };
  },
  render() {
    return (
      <Navigator
        initialRoute={this.props.initialRoute}
        navigationBar={
          <Navigator.NavigationBar
            routeMapper={this.routeMapper()}
            style={styles.navBar}
          />
        }
        renderScene={this.renderScene}
        style={styles.container}
      />
    );
  }
}));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scene: {
    flex: 1,
    paddingTop: 64, // NavigationBar
    // paddingBottom: 50, // TabBarIOS
    backgroundColor: 'white',
  },
  navBar: {
    flexDirection: 'row',
    backgroundColor: '#3949AB',
    borderBottomWidth: 1,
    borderBottomColor: '#3f4c5d'
  },
  navBarTitleText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginVertical: 9,
  },
  navBarButton: {
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 9,
    paddingLeft: 10,
    paddingRight: 10,
  },
});
