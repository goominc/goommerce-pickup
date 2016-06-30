import React from 'react';
import { Alert, AsyncStorage, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux'
import Button from 'react-native-button';
import { authActions } from 'goommerce-redux';

import _ from 'lodash';

const Profile = React.createClass({
  componentDidMount() {
    const { auth, whoami } = this.props;
    if (auth.bearer && !auth.email) {
      whoami();
    }
  },
  signout() {
    const onPress = () => this.props.logout().then(
      () => AsyncStorage.removeItem('bearer'));
    Alert.alert(
      '로그아웃', '링크샵스 픽업에서 로그아웃됩니다.',
      [ { text: '확인', onPress }, { text: '취소' } ]
    );
  },
  renderPair(key, value) {
    return (
      <View style={styles.pairContainer}>
        <Text style={styles.keyText}>{key}</Text>
        <Text style={styles.valueText}>{value}</Text>
      </View>
    )
  },
  render() {
    const { auth } = this.props;
    return (
      <View style={styles.container}>
        {this.renderPair('이름', auth.name)}
        {this.renderPair('등급', '일반')}
        {this.renderPair('아이디', auth.email)}
        {this.renderPair('연락처', auth.tel)}
        {this.renderPair('소속', '링크샵스')}
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
    flexDirection: 'column',
  },
  signoutContainer: {
    backgroundColor: '#7D8387',
    borderRadius: 6,
    marginTop: 20,
    overflow:'hidden',
    paddingHorizontal: 60,
    paddingVertical: 10,
  },
  pairContainer: {
    alignSelf: 'stretch',
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#DBDBDB',
    paddingBottom: 7,
    paddingHorizontal: 7,
    marginTop: 7,
  },
  keyText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  valueText: {
    color: '#595959',
  },
});

export default connect(
  (state) => ({ auth: state.auth }), authActions
)(Profile);
