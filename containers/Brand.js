import _ from 'lodash';
import React from 'react';
import { ListView, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import Button from 'react-native-button';
import moment from 'moment';

// FIXME: move to some other place.
moment.locale('ko', {
  relativeTime : {
    future : "%s 후",
    past : "%s 전",
    s : "몇초",
    m : "일분",
    mm : "%d분",
    h : "한시간",
    hh : "%d시간",
    d : "하루",
    dd : "%d일",
    M : "한달",
    MM : "%d달",
    y : "일년",
    yy : "%d년"
  },
});

import RefreshableList from '../components/RefreshableList';
import Icon from '../components/Icon';

import routes from '../routes';

export default React.createClass({
  statics: {
    rightButton: (nav) => {
      return (
        <Button onPress={() => nav.popToTop()}>
          <Icon name='home' size={23} color='white' />
        </Button>
      );
    },
  },
  dataSource: new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
  }),
  onRefresh() {
  },
  renderRow(row, sectionID, rowID, highlightRow) {
    const { buyers } = this.props;
    const shortId = _.padStart(row.orderId, 3, '0').substr(-3);
    const at = _.chain(row.logs).filter({ type: 2001 }).maxBy('id').get('createdAt').value();
    return (
      <TouchableHighlight
        onPress={() => console.log('cc')}
        onShowUnderlay={() => highlightRow(sectionID, rowID)}
        onHideUnderlay={() => highlightRow(null, null)}
      >
        <View style={styles.row}>
          <View style={styles.checkboxContainer}>
            <Icon name='checkbox' size={30} color='#384DA8' />
          </View>
          <Text style={[styles.sectionText, { flex: 1 }]}>{`링크# ${_.get(buyers[row.buyerId], 'data.order.name', shortId)}`}</Text>
          <Text style={[styles.sectionText, { flex: 1 }]}>{_.sumBy(row.orderProducts, (o) => _.get(o.data, 'stock.quantity', o.quantity))}</Text>
          <Text style={[styles.sectionText, { flex: 1 }]}>{at && moment(at).fromNow()}</Text>
        </View>
      </TouchableHighlight>
    );
  },
  renderSectionHeader(sectionData, sectionID) {
    return (
      <View style={styles.section}>
        <Text style={[styles.sectionText, { flex: 1 }]}>
          픽업확인
        </Text>
        <Text style={[styles.sectionText, { flex: 1 }]}>
          주문자명
        </Text>
        <Text style={[styles.sectionText, { flex: 1 }]}>
          상품수량
        </Text>
        <Text style={[styles.sectionText, { flex: 1 }]}>
          포장완료시간
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
    const { date, orders, brands, brandId } = this.props;
    const brandOrders = _.filter(orders, (o) => (o.brandId === brandId));
    // FIXME: possible performance issue...
    const dataSource = this.dataSource.cloneWithRows(brandOrders);
    return (
      <RefreshableList
        dataSource={dataSource}
        renderRow={this.renderRow}
        renderSectionHeader={this.renderSectionHeader}
        renderSeparator={this.renderSeparator}
        enableEmptySections
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
    paddingVertical: 2,
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
  checkboxContainer: {
    flex: 1,
    alignItems: 'center',
  },
});
