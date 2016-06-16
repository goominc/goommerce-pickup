import _ from 'lodash';
import React, { PropTypes } from 'react';
import { AsyncStorage } from 'react-native';
import { connect } from 'react-redux'
import { authActions, uncleActions } from 'goommerce-redux';

import EmptyView from '../components/EmptyView';
import Navigator from '../components/Navigator';
import Signin from '../components/Signin';
import routes from '../routes';

const App = React.createClass({
  childContextTypes: {
    refresh: PropTypes.func,
  },
  getInitialState: function() {
    return {
      selectedTab: 'orders',
    };
  },
  getChildContext() {
    return {
      refresh() {
        this.props.loadUncleOrders(this.props.date);
      },
    };
  },
  componentDidMount() {
    const { auth, whoami, loadUncleOrders, date } = this.props;
    if (auth.bearer && !auth.email) {
      whoami();
    }
    loadUncleOrders(date);
  },
  signin(email, password) {
    this.props.login(email, password).then(
      (auth) => AsyncStorage.setItem('bearer', auth.bearer)
    );
  },
  render() {
    const { auth: { bearer, email } } = this.props;
    if (!bearer) {
      return <Signin signin={this.signin} />;
    }
    if (!email) {
      return <EmptyView text={'Loading...'} />;
    }

    return (
      <Navigator initialRoute={routes.dashboard()} childProps={_.pick(this.props, 'date', 'orders', 'brands', 'buyers')} />
    );
  }
});

export default connect(
  (state, ownProps) => {
    const { key } = uncleActions.loadUncleOrders(ownProps.date);
    return { auth: state.auth, ...state.uncle[key] };
  }, _.assign({}, authActions, uncleActions)
)(App);
