// assets
import { LoginOutlined, ProfileOutlined, UnorderedListOutlined } from '@ant-design/icons';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
// icons
const icons = {
  LoginOutlined,
    ProfileOutlined,
    MedicalServicesIcon,
    UnorderedListOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: 'service',
  title: 'Services',
  type: 'group',
  children: [
    {
      id: 'service_add',
      title: 'Manage Services',
      type: 'item',
          url: '/admin/add-service',
          icon: icons.MedicalServicesIcon,
      target: false  
      },
      {
          id: 'service_edit',
          title: 'Edit Service',
          type: 'item',
          url: '/admin/edit-service',
          icon: icons.MedicalServicesIcon,
          target: false,
          hidden: true,
          breadcrumbs: false
      },
    {
      id: 'service_list',
      title: 'List Services',
      type: 'item',
        url: '/admin/services',
        icon: icons.UnorderedListOutlined,
      target: false
    }
  ]
};

export default pages;
