import _ from 'lodash';
import React from 'react';
import { Navigator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from 'react-native-button';
import Ionicons from 'react-native-vector-icons/Ionicons';

const NavigationBarRouteMapper = {
  LeftButton(route, navigator, index, navState) {
    if (index === 0) {
      return null;
    }
    return (
      <Button onPress={() => navigator.pop()} containerStyle={styles.navBarButton}>
        <Ionicons name='ios-arrow-back' size={23} color='white' />
      </Button>
    );
  },
  RightButton(route, navigator, index, navState) {
    const { component } = route;
    const rightButton = component.rightButton || _.get(component, 'WrappedComponent.rightButton');
    if (rightButton) {
      return (
        <View style={styles.navBarButton}>
          {rightButton(navigator)}
        </View>
      );
    }
  },
  Title(route, navigator, index, navState) {
    return (
      <Text style={styles.navBarTitleText}>
        {route.title}
      </Text>
    );
  },
};

export default React.createClass({
  renderScene(route, navigator) {
    return (
      <View style={styles.scene}>
        <route.component {...route.props} {...this.props.childProps} push={navigator.push} pop={navigator.pop} />
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
    // paddingBottom: 50, // TabBarIOS
    backgroundColor: 'white',
  },
  navBar: {
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
