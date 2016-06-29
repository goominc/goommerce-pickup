import _ from 'lodash';
import React from 'react';
import { Dimensions, ListView, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';
import { connect } from 'react-redux'

import routes from '../routes';

const Search = React.createClass({
  statics: {
    title: (dispatch) => {
      const { width } = Dimensions.get('window');
      return (
        <View style={{ width: width - 80, flex: 1, justifyContent: 'center' }}>
          <TextInput
            style={{ height: 30, backgroundColor: '#9FA9D8', fontSize: 18, paddingVertical: 0 }}
            placeholder='매장찾기'
            autoCorrect={false}
            autoFocus
            autoCapitalize='none'
            onChangeText={(text) => dispatch({
              type: 'BRAND_SEARCH',
              payload: text,
            })}
          />
        </View>
      );
    },
  },
  dataSource: new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
  }),
  componentDidMount() {
    this.props.dispatch({
      type: 'BRAND_SEARCH',
      payload: '',
    });
  },
  renderRow(row, sectionID, rowID, highlightRow) {
    const { push } = this.props;
    const brandName = _.get(row, 'name.ko');
    const location = `${_.get(row, 'data.location.floor')} ${_.get(row, 'data.location.flatNumber')}`;
    return (
      <TouchableHighlight
        onPress={() => push(routes.brand(brandName, location, { brandId: row.id }))}
        onShowUnderlay={() => highlightRow(sectionID, rowID)}
        onHideUnderlay={() => highlightRow(null, null)}
      >
        <View style={styles.row}>
          <Text style={[styles.rowText]}>{brandName}</Text>
          <Text style={[styles.rowText]}>{location}</Text>
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
    const { date, orders, brands, buildingId, search } = this.props;
    const searchText = _.get(search, 'brand');
    const rows = _.chain(orders).map('brandId').uniq().map((id) => brands[id])
      .filter((b) => {
        const str = _.toLower(`${_.get(b, 'name.ko')} ${_.get(b, 'data.location.floor')} ${_.get(b, 'data.location.flatNumber')}`);
        return _.get(b, 'data.location.building.id') === buildingId && (!searchText || str.indexOf(searchText) !== -1);
      }).value();
    // FIXME: possible performance issue...
    const dataSource = this.dataSource.cloneWithRows(rows);
    return (
      <ListView
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
  rowText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 12,
    color: '#777777',
    flex: 1,
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
    fontSize: 11,
    color: '#262d56',
  },
});

export default connect((state) => ({ search: state.search }))(Search);
