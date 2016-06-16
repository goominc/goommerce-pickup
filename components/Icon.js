import React from 'react';
import { Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default React.createClass({
  render() {
    const name = `${Platform.OS === 'ios' ? 'ios' : 'md'}-${this.props.name}`;
    return (<Ionicons {...this.props} name={name} />);
  }
});
