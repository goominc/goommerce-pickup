import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default React.createClass({
  render() {
    return (
      <View style={styles.container}>
        <Text> dashboard </Text>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
