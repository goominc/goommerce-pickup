import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default React.createClass({
  render() {
    const { pop, title } = this.props;
    return (
      <TouchableOpacity
        onPress={() => pop()}
        style={styles.navBarLeftButton}>
        <Ionicons name='chevron-left' size={23} color='grey' />
        <Text style={[styles.navBarText, styles.navBarButtonText]}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  }
});

const styles = StyleSheet.create({
  navBarText: {
    fontSize: 16,
    marginVertical: 10,
  },
  navBarLeftButton: {
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  navBarButtonText: {
    color: '#5890FF',
  },
  backButtonImage: {
    width: 13,
    height: 21,
  },
});
