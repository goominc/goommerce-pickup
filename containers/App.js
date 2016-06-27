import _ from 'lodash';
import React, { PropTypes } from 'react';
import { AsyncStorage } from 'react-native';
import { connect } from 'react-redux'
import { authActions, uncleActions } from 'goommerce-redux';
import moment from 'moment';

import EmptyView from '../components/EmptyView';
import Navigator from '../components/Navigator';
import Signin from '../components/Signin';
import routes from '../routes';

const App = React.createClass({
  getInitialState: function() {
    return {
      date: moment().format('YYYY-MM-DD'),
    };
  },
  signin(email, password) {
    this.props.login(email, password).then((auth) =>
      AsyncStorage.setItem('bearer', auth.bearer));
  },
  render() {
    const { auth: { bearer, email }, uncle, loadUncleOrders } = this.props;
    if (!bearer) {
      return <Signin signin={this.signin} />;
    }

    const onRefresh = () => {
      this.setState({ date: moment().format('YYYY-MM-DD') });
      loadUncleOrders(this.state.date);
    };

    const { date } = this.state;
    return (
      <Navigator initialRoute={routes.dashboard()} childProps={{
        ...uncle[uncleActions.loadUncleOrders(date).key],
        date,
        onRefresh,
      }} />
    );
  }
});

export default connect(
  (state, ownProps) => {
    return { auth: state.auth, uncle: state.uncle };
  }, _.assign({}, authActions, uncleActions)
)(App);
