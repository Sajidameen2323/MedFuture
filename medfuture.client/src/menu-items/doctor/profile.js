// assets
import { UserOutlined,SafetyCertificateOutlined,FileDoneOutlined } from '@ant-design/icons';
// icons
const icons = {
  UserOutlined,
  SafetyCertificateOutlined,
  FileDoneOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const profile = {
  id: 'group-profile',
  title: 'Profile',
  type: 'group',
  children: [
    {
      id: 'profile',
      title: 'Profile',
      type: 'item',
      url: '/doctor/profile',
      icon: icons.UserOutlined,
      breadcrumbs: false
    },
    {
      id: 'qualifications',
      title: 'Qualifications',
      type: 'item',
      url: '/doctor/qualifications',
      icon: icons.SafetyCertificateOutlined,
      breadcrumbs: false
    },
    {
      id: 'specializations',
      title: 'Specializations',
      type: 'item',
      url: '/doctor/specializations',
      icon: icons.FileDoneOutlined,
      breadcrumbs: false
    },
  ]
};

export default profile;
