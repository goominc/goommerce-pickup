import React from 'react';
import {
  ListView,
  Platform,
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
} from 'react-native';

export default React.createClass({
  dataSource: new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
  }),
  renderRow(route) {
    const { title } = route();
    const TouchableElement = Platform.OS === 'android' ?
      TouchableNativeFeedback : TouchableHighlight;
    return (
      <View>
        <TouchableElement
          onPress={() => this.props.onSelect(route)}
          onShowUnderlay={this.props.onHighlight}
          onHideUnderlay={this.props.onUnhighlight}
        >
          <View><Text style={styles.title}>{title}</Text></View>
        </TouchableElement>
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
    const { routes } = this.props;
    const dataSource = this.dataSource.cloneWithRows(routes);
    return (
      <View style={styles.drawerContentWrapper}>
        <ListView
          dataSource={dataSource}
          renderRow={this.renderRow}
          renderSeparator={this.renderSeparator}
        />
      </View>
    );
  },
});

const styles = StyleSheet.create({
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    marginVertical: 10,
    marginHorizontal: 5,
  },
  rowSeparator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1,
  },
  rowSeparatorHide: {
    opacity: 0.0,
  },
});
