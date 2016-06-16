import Building from './containers/Building';
import Dashboard from './containers/Dashboard';
import Profile from './containers/Profile';

export default {
  building: (title, props) => ({ title, component: Building, props }),
  dashboard: (props) => ({ title: 'LinkShops', component: Dashboard, props }),
  profile: (props) => ({ title: '내 정보', component: Profile, props }),
};
