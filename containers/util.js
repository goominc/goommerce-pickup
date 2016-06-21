import _ from 'lodash';

export function isPickedUp(order) {
  // 200: PICKED_UP
  return _.every(order.orderProducts, (o) => o.status === 200);
}
