// project import
import pages from './admin/pages';
import adminDashboard from './admin/dashboard';
import patientDashboard from './patient/dashboard';
import utilities from './admin/utilities';
import support from './admin/support';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
    items: [adminDashboard, pages, utilities, support]
};

const getMenuItems = (role) => {

    if (role === "Admin") {
        return {
            items: [adminDashboard, pages, utilities, support]
        };
    }
    else if (role === "Doctor") {
        return {
            items: [support]
        }
    }
    else {
        return {
            items: [patientDashboard]
        }
    }

}

export { getMenuItems }
export default menuItems;
