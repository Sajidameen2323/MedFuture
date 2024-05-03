// admin import
import services from './admin/services';
import adminDashboard from './admin/dashboard';
import appointmentDoctor from './doctor/appointment';
import manageDoctors from './admin/manageDoctors';
import manageAppointments from './admin/manageAppointments';
// ==============================|| MENU ITEMS ||============================== //

// doctor imports
import DoctorAppointmentGroup from './doctor/appointment';
import doctorDashboard from './doctor/dashboard';

// patient imports
import patientDashboard from './patient/dashboard';

const items = {
    items: [adminDashboard, services, manageDoctors, doctorDashboard, manageAppointments, DoctorAppointmentGroup, appointmentDoctor]
};

const getMenuItems = (role) => {

    if (role === "Admin") {
        return {
            items: [adminDashboard, services, manageDoctors, manageAppointments]
        };
    }
    else if (role === "Doctor") {
        return {
            items: [doctorDashboard, appointmentDoctor]
        }
    }
    else {
        return {
            items: [patientDashboard, DoctorAppointmentGroup]
        }
    }

}

export { getMenuItems }

export default items;