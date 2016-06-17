import _ from 'lodash';

export function isPickedUp(order) {
  // 104: OUT_OF_STOCK
  // 200: PICKED_UP
  return _.every(order.orderProducts, (o) => o.status === 200 || o.status === 104);
}
