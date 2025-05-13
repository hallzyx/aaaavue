import { createRouter, createWebHistory } from 'vue-router';

import HomeComponent from "../public/pages/homeComponent.vue";
import RoomsListComponent from "../rooms/pages/rooms-listComponent.vue";

const preferencesComponent = () => import("../profiles/pages/preferencesComponent.vue");
const bookComponent = () => import("../crm/pages/bookComponent.vue");
const myBookingsComponent = () => import("../crm/pages/myBookingsComponent.vue");
const iotDevicesComponent = () => import("../guest-experience/pages/iotDevicesComponent.vue");
const requestStaffComponent = () => import("../crm/pages/requestStaffComponent.vue");
const customerRequestsComponent = () => import("../crm/pages/customerRequestsComponent.vue");
const adminComponent = () => import("../billing/pages/adminComponent.vue");
const bookingsTrackerComponent = () => import("../crm/pages/bookingsTrackerComponent.vue");
const customerServiceComponent = () => import("../crm/pages/customerServiceComponent.vue");
const loginComponent = () => import("../auth/pages/loginComponent.vue");
const registerComponent = () => import("../auth/pages/registerComponent.vue");
const notFoundComponent = () => import("../public/pages/notFoundComponent.vue");
const profileComponent = () => import("../profiles/pages/profileComponent.vue");

// Rutas organizadas por dominio (bounded contexts)
const routes = [
    {
        path: '/home',
        name: 'Home',
        component: HomeComponent,
        meta: { title: 'Home' }
    },
    {
        path: '/rooms',
        name: 'Rooms',
        component: RoomsListComponent,
        meta: { title: 'Rooms' }
    },
    {
        path: '/auth',
        name: 'Auth',
        redirect: '/auth/login',
        children: [
            {
                path: 'login',
                name: 'Login',
                component: loginComponent,
                meta: { title: 'Login' }
            },
            {
                path: 'register',
                name: 'Register',
                component: registerComponent,
                meta: { title: 'Register' }
            }
        ]
    },
    {
        path: '/profiles',
        name: 'Profiles',
        redirect: '/home',
        children: [
            {
                path: 'profile',
                name: 'Profile',
                component: profileComponent,
                meta: { title: 'Profile' }
            },
            {
                path: '/preferences',
                name: 'Preferences',
                component: preferencesComponent,
                meta: { title: 'Preferences' }
            }
        ]
    },

    {
        path: '/crm',
        name: 'CRM',
        redirect: '/home',
        children: [
            {
                path: 'book',
                name: 'Book',
                component: bookComponent,
                meta: { title: 'Book' }
            },
            {
                path: 'my-bookings',
                name: 'MyBookings',
                component: myBookingsComponent,
                meta: { title: 'My Bookings' }
            },
            {
                path: 'customer-service',
                name: 'CustomerService',
                component: customerServiceComponent,
                meta: { title: 'Customer Service' }
            },
            {
                path: 'customer-requests',
                name: 'CustomerRequests',
                component: customerRequestsComponent,
                meta: { title: 'Customer Requests' }
            },
            {
                path: 'request-staff',
                name: 'RequestStaff',
                component: requestStaffComponent,
                meta: { title: 'Request Staff' }
            },
            {
                path: 'bookings-tracker',
                name: 'BookingsTracker',
                component: bookingsTrackerComponent,
                meta: { title: 'Bookings Tracker' }
            }
        ]
    },

    // Guest Experience context
    {
        path: '/guest-experience',
        name: 'GuestExperience',
        redirect: '/home',
        children: [
            {
                path: 'iot-devices',
                name: 'IotDevices',
                component: iotDevicesComponent,
                meta: { title: 'IoT Devices' }
            }
        ]
    },
    {
        path: '/billing',
        name: 'Billing',
        redirect: '/home',
        children: [
            {
                path: 'admin',
                name: 'Admin',
                component: adminComponent,
                meta: { title: 'Admin' }
            }
        ]
    },
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: notFoundComponent,
        meta: { title: 'Page Not Found' }
    }
];


export const router = createRouter({
    history: createWebHistory(),
    routes,
})
router.beforeEach((to, from, next) => {
    console.log(`Navigating from ${from.name} to ${to.name}`);
    let baseTitle = 'Custom Host';
    document.title = `${baseTitle} | ${to.meta['title']}`;
    next();
});

export default router;