// assets
import { SettingOutlined } from '@ant-design/icons';

// icons
const icons = {
  SettingOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const account = {
  id: 'group-account',
  title: 'Account',
  type: 'group',
  children: [
    {
      id: 'account-settings',
      title: 'Account Settings',
      type: 'item',
      url: '/account/settings',
      icon: icons.SettingOutlined,
      breadcrumbs: false
    }
  ]
};

export default account;
