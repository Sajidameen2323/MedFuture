// assets
import { LoginOutlined, ProfileOutlined } from '@ant-design/icons';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
// icons
const icons = {
  LoginOutlined,
    ProfileOutlined,
    MedicalServicesIcon
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: 'service',
  title: 'Services',
  type: 'group',
  children: [
    {
      id: 'service_add',
      title: 'Add Service',
      type: 'item',
          url: '/account/add-service',
      icon: icons.LoginOutlined,
      target: false  
    },
    {
      id: 'service_list',
      title: 'List Services',
      type: 'item',
        url: '/account/services',
        icon: icons.MedicalServicesIcon,
      target: false
    }
  ]
};

export default pages;
