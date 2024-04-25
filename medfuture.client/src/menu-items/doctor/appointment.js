// assets
import { DashboardOutlined } from '@ant-design/icons';

// icons
const icons = {
    DashboardOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const appointmentGroup = {
    id: 'group-appointment',
    title: 'Navigation',
    type: 'group',
    children: [
        {
            id: 'consultation',
            title: 'Consultation',
            type: 'item',
            url: '/account/con',
            icon: icons.DashboardOutlined,
            breadcrumbs: false
        }
    ]
};

export default appointmentGroup;
