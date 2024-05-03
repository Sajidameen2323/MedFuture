import { lazy } from "react";
import Loadable from 'components/Loadable';

const Weather = Loadable(lazy(() => import("pages/Weather")));
const TodaysAppointments = Loadable(lazy(() => import("pages/Doctor/Consultation/TodaysAppointments")));

const AppointmentActionPage = Loadable(lazy(() => import("pages/Doctor/Consultation/AppointmentActionPage")));


export default function GetDoctorRoutes(props) {

    return [

        {
            path: "overview",
            loader: props.adminOnlyLoader,
            Component: Weather,
        },
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
        }

    ]

}