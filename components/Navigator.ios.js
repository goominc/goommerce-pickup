import React from 'react';
import { Navigator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import _ from 'lodash';

import NavBarBack from '../components/NavBarBack'

const NavigationBarRouteMapper = {
  LeftButton(route, navigator, index, navState) {
    if (index === 0) {
      return null;
    }
    const { title } = navState.routeStack[index - 1];
    return (<NavBarBack title={index > 1 && title} pop={navigator.pop}/>);
  },
  RightButton(route, navigator, index, navState) {
    const { component } = route;
    const rightButton = component.rightButton || _.get(component, 'WrappedComponent.rightButton');
    return rightButton && rightButton(navigator);
  },
  Title(route, navigator, index, navState) {
    return (
      <Text style={[styles.navBarText, styles.navBarTitleText]}>
        {route.title}
      </Text>
    );
  },
};

export default React.createClass({
  renderScene(route, navigator) {
    return (
      <View style={styles.scene}>
        <route.component {...route.props} push={navigator.push} pop={navigator.pop} />
      </View>
    );
  },
  render() {
    return (
      <Navigator
        initialRoute={this.props.initialRoute}
        navigationBar={
          <Navigator.NavigationBar
            routeMapper={NavigationBarRouteMapper}
            style={styles.navBar}
          />
        }
        renderScene={this.renderScene}
        style={styles.container}
      />
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scene: {
    flex: 1,
    paddingTop: 64, // NavigationBar
    paddingBottom: 50, // TabBarIOS
    backgroundColor: 'white',
  },
  navBar: {
    backgroundColor: '#3f4c5d',
    borderBottomWidth: 1,
    borderBottomColor: '#3f4c5d'
  },
  navBarText: {
    fontSize: 16,
    marginVertical: 10,
  },
  navBarTitleText: {
    color: 'white',
    fontWeight: 'bold',
    marginVertical: 9,
  },
  navBarLeftButton: {
    paddingLeft: 10,
  },
  navBarRightButton: {
    paddingRight: 10,
  },
  navBarButtonText: {
    color: '#5890FF',
  },
});
