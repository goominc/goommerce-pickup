import Brand from './containers/Brand';
import Building from './containers/Building';
import Dashboard from './containers/Dashboard';
import Profile from './containers/Profile';
import Search from './containers/Search';

export default {
  brand: (title, props) => ({ title, component: Brand, props }),
  building: (title, props) => ({ title, component: Building, props }),
  dashboard: (props) => ({ title: 'LinkShops', component: Dashboard, props }),
  profile: (props) => ({ title: '내 정보', component: Profile, props }),
  search: (props) => ({ component: Search, props }),
};
