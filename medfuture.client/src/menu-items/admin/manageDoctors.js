// assets
import { UserAddOutlined, UnorderedListOutlined } from '@ant-design/icons';


// icons
const icons = {
    UserAddOutlined,
    UnorderedListOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: 'manage-doctors',
  title: 'Doctors',
  type: 'group',
  children: [
    {
      id: 'doctor_add',
      title: 'Register Doctor',
      type: 'item',
          url: '/account/add-doctor',
          icon: icons.UserAddOutlined,
      target: false  
    },
    {
      id: 'doctor_list',
      title: 'List Doctors',
      type: 'item',
        url: '/account/doctors',
        icon: icons.UnorderedListOutlined,
      target: false
    }
  ]
};

export default pages;
