import React from 'react';
import { Image, StyleSheet, Text, TextInput, View } from 'react-native';
import Button from 'react-native-button';

export default React.createClass({
  getInitialState() {
    return {};
  },
  signin() {
    const { email, password } = this.state;
    this.props.signin(email, password);
  },
  render() {
    return (
      <Image source={require('./images/login_bg.png')} resizeMode='contain' style={styles.container}>
        <View style={styles.desc}>
          <Image source={require('./images/logo.png')} style={{ height: 40, width: 160, resizeMode: 'contain' }}/>
          <Text style={{ color: '#0f164e', fontSize: 25, fontWeight: 'bold', backgroundColor: 'transparent' }}>PICK UP</Text>
        </View>
        <TextInput
          autoCapitalize='none'
          autoCorrect={false}
          keyboardType='email-address'
          onChangeText={(email) => this.setState({ email })}
          placeholder='e-mail'
          style={styles.input}
          value={this.state.email}
        />
        <TextInput
          autoCapitalize='none'
          autoCorrect={false}
          onChangeText={(password) => this.setState({ password })}
          placeholder='password'
          secureTextEntry={true}
          style={styles.input}
          value={this.state.password}
        />
        <Button
          style={{ color: 'white', fontSize: 15 }}
          containerStyle={styles.signinContainer}
          onPress={this.signin}
        >
          로그인
        </Button>
        <View style={styles.footer}>
          <Text style={{ color: '#ff5500', fontSize: 11 }}>구매를 원하시면 <Text style={{ fontWeight: 'bold' }}>여기</Text>를 눌러주세요</Text>
        </View>
      </Image>
    );
  },
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: 'white',
    flex: 1,
    height: null,
    justifyContent: 'center',
    width: null,
  },
  desc: {
    alignItems: 'center',
    marginBottom: 40,
  },
  input: {
    backgroundColor: '#EBEDF9',
    borderRadius: 6,
    fontSize: 14,
    color: '#a1a1a1',
    height: 50,
    marginHorizontal: 40,
    marginVertical: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  signinContainer: {
    alignSelf: 'stretch',
    backgroundColor: '#42A5F5',
    borderRadius: 6,
    marginVertical: 20,
    marginHorizontal: 40,
    overflow:'hidden',
    paddingVertical: 10,
  },
  footer: {
    alignItems: 'center',
  },
});
