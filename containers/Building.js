import _ from 'lodash';
import React from 'react';
import { ListView, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import Button from 'react-native-button';

import Icon from '../components/Icon';
import RefreshableList from '../components/RefreshableList';

import routes from '../routes';

export default React.createClass({
  statics: {
    rightButton: (nav, { props }) => {
      return (
        <Button onPress={() => nav.push(routes.search(props))}>
          <Icon name='search' size={23} color='white' />
        </Button>
      );
    },
  },
  dataSource: new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
  }),
  renderRow(row, sectionID, rowID, highlightRow) {
    const { brands, push } = this.props;
    const brand = brands[_.head(row).brandId];
    const brandName = _.get(brand, 'name.ko');
    const location = `${_.get(brand, 'data.location.floor')} ${_.get(brand, 'data.location.flatNumber')}`;
    return (
      <TouchableHighlight
        onPress={() => push(routes.brand(`${brandName} ${location}`, { brandId: brand.id }))}
        onShowUnderlay={() => highlightRow(sectionID, rowID)}
        onHideUnderlay={() => highlightRow(null, null)}
      >
        <View style={styles.row}>
          <Text style={[styles.sectionText, { flex: 1 }]}>{brandName}</Text>
          <Text style={[styles.sectionText, { flex: 1 }]}>{location}</Text>
          <Text style={[styles.sectionText, { flex: 1 }]}>{_.size(row)}</Text>
          <Text style={[styles.sectionText, { flex: 1 }]}></Text>
        </View>
      </TouchableHighlight>
    );
  },
  renderSectionHeader(sectionData, sectionID) {
    return (
      <View style={styles.section}>
        <Text style={[styles.sectionText, { flex: 1 }]}>
          매장명
        </Text>
        <Text style={[styles.sectionText, { flex: 1 }]}>
          위치
        </Text>
        <Text style={[styles.sectionText, { flex: 1 }]}>
          전체주문
        </Text>
        <Text style={[styles.sectionText, { flex: 1 }]}>
          완료된 주문
        </Text>
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
    const brandOrders = _.chain(orders)
      .filter((o) => (_.get(brands[o.brandId], 'data.location.building.id') === buildingId))
      .groupBy('brandId').value();
    // FIXME: possible performance issue...
    const dataSource = this.dataSource.cloneWithRows(_.values(brandOrders));
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
    marginLeft: 4,
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
