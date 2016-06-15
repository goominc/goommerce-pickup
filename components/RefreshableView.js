import React from 'react';
import { RefreshControl, ScrollView } from 'react-native';

export default React.createClass({
  getInitialState() {
    return { isRefreshing: false };
  },
  _onRefresh() {
    this.setState({isRefreshing: true});
    const { onRefresh } = this.props;
    Promise.resolve(onRefresh()).then(() => this.setState({ isRefreshing: false }));
  },
  render() {
    return (
      <ScrollView
        {...this.props}
        refreshControl={
          <RefreshControl
            refreshing={this.state.isRefreshing}
            onRefresh={this._onRefresh}
          />
        }
      />
    );
  }
});
