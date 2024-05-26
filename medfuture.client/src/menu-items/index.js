// common imports
import userAccount from './account';

// admin import
import services from './admin/services';
import adminDashboard from './admin/dashboard';
import appointmentDoctor from './doctor/appointment';
import manageDoctors from './admin/manageDoctors';
import manageAppointments from './admin/manageAppointments';


// ==============================|| MENU ITEMS ||============================== //

// doctor imports
import DoctorAppointmentGroup from './doctor/appointment';
import DoctorProfileGroup from './doctor/profile';


// patient imports
import patientProfile from './patient/profile';
import patientMedicalNav from './patient/medical';
import patientAppointments from './patient/appointment';


const items = {
    items: [adminDashboard, services, manageDoctors, manageAppointments, DoctorAppointmentGroup, appointmentDoctor, patientProfile,
        patientMedicalNav, patientAppointments, userAccount, DoctorProfileGroup]
};

const getMenuItems = (role) => {

    if (role === "Admin") {
        return {
            items: [adminDashboard, services, manageDoctors, manageAppointments, userAccount]
        };
    }
    else if (role === "Doctor") {
        return {
            items: [appointmentDoctor,DoctorProfileGroup,userAccount]
        }
    }
    else if (role === "Patient") {
        return {
            items: [patientAppointments, patientProfile, patientMedicalNav,userAccount]
        }
    }
    else {
        return {
            items: []
        }
    }

}

export { getMenuItems }

export default items;