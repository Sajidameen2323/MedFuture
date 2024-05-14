import { lazy } from "react";
import Loadable from 'components/Loadable';

const Weather = Loadable(lazy(() => import("pages/Weather")));
const PatientProfile = Loadable(lazy(() => import("pages/Patient/Profile")));
const Allergies = Loadable(lazy(() => import("pages/Patient/Allergies")));
const Diagnoses = Loadable(lazy(() => import("pages/Patient/Diagnoses")));
const AppointmentsList = Loadable(lazy(() => import("pages/Patient/Appointment/Index")));
const AppointmentActionPage = Loadable(lazy(() => import("pages/Patient/Appointment/AppointmentActionPage")));
const HealthcareConsultationSummary = Loadable(lazy(() => import("pages/Patient/Appointment/ConsultationSummary")));

export default function GetPatientRoutes(props) {

    return [

        {
            path: "overview",
            loader: props.patientOnlyLoader,
            Component: Weather,
        },
        {
            id: 'patient_profile',
            path: 'profile',
            loader: props.patientOnlyLoader,
            Component: PatientProfile
        },
        {
            id: 'patient_allergies',
            path: 'allergies',
            loader: props.patientOnlyLoader,
            Component: Allergies
        },
        {
            id: 'patient_diagnoses',
            path: 'diognoses',
            loader: props.patientOnlyLoader,
            Component: Diagnoses
        },
        {
            id: 'patient_appointments',
            path: 'appointments',
            loader: props.patientOnlyLoader,
            Component: AppointmentsList
        },
        {
            id: 'appointment_patient_action',
            path: 'appointments/:appointmentId/action',
            loader: props.doctorOnlyLoader,
            Component: AppointmentActionPage
        },
        {
            id: 'app_consultation_patient',
            path: 'appointments/:appointmentId/consultation',
            loader: props.doctorOnlyLoader,
            Component: HealthcareConsultationSummary
        },
    ]

}