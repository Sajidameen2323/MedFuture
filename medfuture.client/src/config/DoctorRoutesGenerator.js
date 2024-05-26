import { lazy } from "react";
import Loadable from 'components/Loadable';


const TodaysAppointments = Loadable(lazy(() => import("pages/Doctor/Appointment/TodaysAppointments")));

const AppointmentActionPage = Loadable(lazy(() => import("pages/Doctor/Appointment/AppointmentActionPage")));
const ConsultationPage = Loadable(lazy(() => import("pages/Doctor/Appointment/Consultation/ConsultationPage2")));
const DoctorQualifications = Loadable(lazy(() => import("pages/Doctor/DoctorQualifications")));
const DoctorSpecializations = Loadable(lazy(() => import("pages/Doctor/DoctorSpecializations")));
const DoctorProfile = Loadable(lazy(() => import("pages/Doctor/DoctorProfile")));

export default function GetDoctorRoutes(props) {

    return [


        {
            id: 'todays_appointments',
            path: 'appointments/today',
            loader: props.doctorOnlyLoader,
            Component: TodaysAppointments
        },
        {
            id: 'appointment_doc_action',
            path: 'appointments/:appointmentId/action',
            loader: props.doctorOnlyLoader,
            Component: AppointmentActionPage
        },
        {
            id: 'app_consultation',
            path: 'appointments/:appointmentId/consultation',
            loader: props.doctorOnlyLoader,
            Component: ConsultationPage
        },
        {
            id: 'profile',
            path: 'profile',
            loader: props.doctorOnlyLoader,
            Component: DoctorProfile
        },
        {
            id: 'qualifications',
            path: 'qualifications',
            loader: props.doctorOnlyLoader,
            Component: DoctorQualifications
        },
        {
            id: 'specializations',
            path: 'specializations',
            loader: props.doctorOnlyLoader,
            Component: DoctorSpecializations
        },
    ]

}