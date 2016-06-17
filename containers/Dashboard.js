import _ from 'lodash';
import React from 'react';
import { ListView, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import Button from 'react-native-button';

import Icon from '../components/Icon';
import RefreshableView from '../components/RefreshableView';

import routes from '../routes';

export default React.createClass({
  statics: {
    rightButton: (nav) => {
      return (
        <Button onPress={() => nav.push(routes.profile())}>
          <Icon name='person' size={23} color='white' />
        </Button>
      );
    },
  },
  dataSource: new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
  }),
  renderRow(row, sectionID, rowID, highlightRow) {
    const { brands, push } = this.props;
    const buildingId = _.get(brands[_.head(row).brandId], 'data.location.building.id');
    const buildingName = _.get(brands[_.head(row).brandId], 'data.location.building.name.ko');
    return (
      <TouchableHighlight
        onPress={() => push(routes.building(buildingName, { buildingId }))}
        onShowUnderlay={() => highlightRow(sectionID, rowID)}
        onHideUnderlay={() => highlightRow(null, null)}
      >
        <View style={styles.row}>
          <Text style={[styles.sectionText, { flex: 1 }]}>{buildingName}</Text>
          <Text style={[styles.sectionText, { flex: 1 }]}>{_.size(row)}</Text>
          <Text style={[styles.sectionText, { flex: 1 }]}>{_.size(_.uniqBy(row, 'brandId'))}</Text>
          <Text style={[styles.sectionText, { flex: 1 }]}></Text>
        </View>
      </TouchableHighlight>
    );
  },
  renderSectionHeader(sectionData, sectionID) {
    return (
      <View style={styles.section}>
        <Text style={[styles.sectionText, { flex: 1 }]}>
          빌딩명
        </Text>
        <Text style={[styles.sectionText, { flex: 1 }]}>
          전체주문수
        </Text>
        <Text style={[styles.sectionText, { flex: 1 }]}>
          주문매장수
        </Text>
        <Text style={[styles.sectionText, { flex: 1 }]}>
          픽업완료매장
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
    const { date, orders, brands } = this.props;
    const map = _.groupBy(orders, (o) => _.get(brands[o.brandId], 'data.location.building.id', ''));
    // FIXME: possible performance issue...
    const dataSource = this.dataSource.cloneWithRows(_.values(map));
    return (
      <RefreshableView onRefresh={this.props.onRefresh} contentContainerStyle={styles.container}>
        <View style={styles.summary}>
          <View style={[styles.summaryItem, { backgroundColor: '#9FA8DA' }]}>
            <Text style={[styles.summaryText]}>오늘의 픽업</Text>
            <Text style={[styles.summaryText, { fontSize: 25, marginTop: 10 }]}>{date.substring(5, 10)}</Text>
            <Text style={[styles.summaryText]}>AM 02:00</Text>
          </View>
          <View style={[styles.summaryItem, { backgroundColor: '#121854'}]}>
            <Text style={[styles.summaryText]}>주문처리현황</Text>
            <Text style={[styles.summaryText, { fontSize: 25, marginTop: 10 }]}>{_.size(orders)}</Text>
          </View>
          <View style={[styles.summaryItem, { backgroundColor: '#3949AB'}]}>
            <Text style={[styles.summaryText]}>픽업매장현황</Text>
            <Text style={[styles.summaryText, { fontSize: 25, marginTop: 10 }]}>{_.size(brands)}</Text>
          </View>
        </View>
        <ListView
          dataSource={dataSource}
          renderRow={this.renderRow}
          renderSectionHeader={this.renderSectionHeader}
          renderSeparator={this.renderSeparator}
          enableEmptySections
        />
      </RefreshableView>
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
