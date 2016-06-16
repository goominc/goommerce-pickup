import React from 'react';
import { AsyncStorage, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux'
import Button from 'react-native-button';
import { authActions, brandActions } from 'goommerce-redux';

import _ from 'lodash';

const Profile = React.createClass({
  componentDidMount() {
    const { brands, loadBrand } = this.props;
    brands.forEach((b) => loadBrand(b.id));
  },
  signout() {
    this.props.logout().then(() => AsyncStorage.removeItem('bearer'));
  },
  render() {
    const { brands = [] } = this.props;
    return (
      <View style={styles.container}>
        {brands.map((b, idx) => (
          <View key={b.id}>
            <Text>{_.get(b, 'name.ko')}</Text>
            <Text>{b.pathname && `https://www.linkshops.com/${b.pathname}`}</Text>
            <Text>{_.get(b, 'data.building.name')}</Text>
          </View>
        ))}
        <Button
          style={{color: 'white'}}
          styleDisabled={{color: 'red'}}
          containerStyle={styles.signoutContainer}
          onPress={this.signout}
        >
          로그아웃
        </Button>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  signoutContainer: {
    backgroundColor: '#7D8387',
    borderRadius: 6,
    marginTop: 20,
    overflow:'hidden',
    paddingHorizontal: 60,
    paddingVertical: 10,
  },
});

export default connect(
  (state) => {
    const { roles = [] } = state.auth;
    const brands = _.filter(roles,
      (r) => r.type === 'owner' || r.type === 'staff').map((r) => r.brand);
    brands.forEach((b) => {
      const { key } = brandActions.loadBrand(b.id);
      _.assign(b, state.brand[key]);
    });
    return { auth: state.auth, brands };
  }, _.assign({}, authActions, brandActions)
)(Profile);
