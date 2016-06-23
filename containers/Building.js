import _ from 'lodash';
import React from 'react';
import { ListView, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import Button from 'react-native-button';
import naturalCompare from 'natural-compare-lite';

import Icon from '../components/Icon';
import RefreshableList from '../components/RefreshableList';
import { isPickedUp } from './util';

import routes from '../routes';

const floor = (o) => _.get(o.brand, 'data.location.floor');
const flatNumber = (o) => _.get(o.brand, 'data.location.flatNumber');

export default React.createClass({
  statics: {
    rightButton: (nav, { props }) => {
      return (
        <Button onPress={() => nav.push(routes.search(props))}>
          <View style={{ padding: 5 }}>
            <Icon name='search' size={23} color='white' />
          </View>
        </Button>
      );
    },
  },
  dataSource: new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
  }),
  getInitialState() {
    return { sort: 'location' };
  },
  renderRow(row, sectionID, rowID, highlightRow) {
    const { push } = this.props;
    const brandName = _.get(row.brand, 'name.ko');
    const location = `${floor(row)} ${flatNumber(row)}`;
    return (
      <TouchableHighlight
        onPress={() => push(routes.brand(`${brandName} ${location}`, { brandId: row.brand.id }))}
        onShowUnderlay={() => highlightRow(sectionID, rowID)}
        onHideUnderlay={() => highlightRow(null, null)}
      >
        <View style={[styles.row, { backgroundColor: _.size(row.orders) === row.pickedUpCount ? '#A3A3AB' : 'white' }]}>
          <Text style={[styles.sectionText, { flex: 1 }]}>{brandName}</Text>
          <Text style={[styles.sectionText, { flex: 1 }]}>{location}</Text>
          <Text style={[styles.sectionText, { flex: 1 }]}>{_.size(row.orders)}</Text>
          <Text style={[styles.sectionText, { flex: 1 }]}>{row.pickedUpCount}</Text>
        </View>
      </TouchableHighlight>
    );
  },
  renderSectionHeader(sectionData, sectionID) {
    const { sort } = this.state;
    return (
      <View style={styles.section}>
        <Text style={[styles.sectionText, { flex: 1 }]}>
          매장명
        </Text>
        <Button containerStyle={{ flex: 1 }} onPress={() => this.setState({ sort: 'location' })}>
          <Text style={[styles.sectionText, { color: sort === 'location' ? 'white' : 'black' }]}>
            위치
          </Text>
        </Button>
        <Button containerStyle={{ flex: 1 }} onPress={() => this.setState({ sort: 'orderCount' })}>
          <Text style={[styles.sectionText, { color: sort === 'orderCount' ? 'white' : 'black' }]}>
            전체주문
          </Text>
        </Button>
        <Button containerStyle={{ flex: 1 }} onPress={() => this.setState({ sort: 'pickedUpCount' })}>
          <Text style={[styles.sectionText, { color: sort === 'pickedUpCount' ? 'white' : 'black' }]}>
            완료된 주문
          </Text>
        </Button>
      </View>
    );
  },
  renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    var style = styles.rowSeparator;
    if (adjacentRowHighlighted) {
        style = [style, styles.rowSeparatorHide];
    }
    return (
      <View key={'SEP_' + sectionID + '_' + rowID}  style={style}/>
    );
  },
  render() {
    const { date, orders, brands, buildingId } = this.props;
    const rows = _.chain(orders)
      .filter((o) => (_.get(brands[o.brandId], 'data.location.building.id') === buildingId))
      .groupBy('brandId').map((orders, brandId) => ({
        brand: brands[brandId],
        orders,
        pickedUpCount: _.chain(orders).filter(isPickedUp).size().value(),
      })).value().sort((a, b) => {
        const pickedUp = (o) => (_.size(o.orders) === o.pickedUpCount);
        const defaultSort = pickedUp(a) - pickedUp(b);
        if (this.state.sort === 'location') {
          return defaultSort || naturalCompare(floor(a), floor(b)) || naturalCompare(flatNumber(a), flatNumber(b));
        } else if (this.state.sort === 'orderCount') {
          return defaultSort || (_.size(b.orders) - _.size(a.orders));
        }
        return defaultSort || (b.pickedUpCount - a.pickedUpCount);
      });
    // FIXME: possible performance issue...
    const dataSource = this.dataSource.cloneWithRows(rows);
    return (
      <RefreshableList
        dataSource={dataSource}
        renderRow={this.renderRow}
        renderSectionHeader={this.renderSectionHeader}
        renderSeparator={this.renderSeparator}
        enableEmptySections
        onRefresh={this.props.onRefresh}
      />
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  summary: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-around',
  },
  summaryItem: {
    flex: 1,
    height: 100,
    borderRadius: 4,
    marginVertical: 10,
    marginHorizontal: 10,
    padding: 8,
  },
  summaryText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  rowSeparator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1,
  },
  rowSeparatorHide: {
    opacity: 0.0,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    backgroundColor: '#42A5F5',
    paddingVertical: 10,
  },
  sectionText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
