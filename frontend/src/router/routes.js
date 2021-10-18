import store from '@/store';
import startCase from 'lodash/startCase';

const routes = [
    { name: 'account', add: false, edit: false },
    { name: 'users', adminOnly: true },
    'tasks'
];

const defaultOptions = {
    index: true,
    add: true,
    edit: true,
    adminOnly: false
};

const crudRoutes = routes.flatMap(route => {
    const property = route.name || route;
    const adminOnly = !!route?.adminOnly;

    const title = startCase(property);

    const indexRoute = {
        path: `/${property}`,
        name: property,
        component: () => import(`@/views/${property}/Index`),
        meta: {
            title,
            authRequired: true,
            adminOnly
        }
    };
    const addRoute = {
        path: `/${property}/add`,
        name: `${property}Add`,
        component: () => import(`@/views/${property}/Single`),
        meta: {
            title: `${title} Management`,
            authRequired: true,
            adminOnly
        }
    };
    const editRoute = {
        path: `/${property}/:id/edit`,
        name: `${property}Edit`,
        component: () => import(`@/views/${property}/Single`),
        meta: {
            title: `${title} Management`,
            authRequired: true,
            adminOnly
        }
    };

    if (typeof route === 'string') {
        return [indexRoute, addRoute, editRoute];
    }

    const { index, add, edit } = { ...defaultOptions, ...route };
    const routes = [];

    if (index) {
        routes.push(indexRoute);
    }

    if (add) {
        routes.push(addRoute);
    }

    if (edit) {
        routes.push(editRoute);
    }

    return routes;
});

export default [
    ...crudRoutes,

    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/Index'),
        meta: {
            title: 'Login',
            guestOnly: true,
            layout: 'auth'
        }
    },
    {
        path: '/sign-up',
        name: 'sign-up',
        component: () => import('@/views/sign-up/Index'),
        meta: {
            title: 'Sign up',
            guestOnly: true,
            layout: 'auth'
        }
    },
    {
        path: '/set-password/:token',
        name: 'setPassword',
        component: () => import('@/views/set-password/Index'),
        meta: {
            title: 'Set password',
            guestOnly: true,
            layout: 'auth'
        }
    },
    {
        path: '/reset-password/:token',
        name: 'resetPassword',
        component: () => import('@/views/set-password/Index'),
        meta: {
            title: 'Reset password',
            guestOnly: true,
            layout: 'auth'
        }
    },
    {
        path: '/forget-password',
        name: 'forgetPassword',
        component: () => import('@/views/forget-password/Index'),
        meta: {
            title: 'Forget Password',
            guestOnly: true,
            layout: 'auth'
        }
    },
    {
        path: '/logout',
        name: 'logout',
        component: () => import('@/views/logout/Index'),
        meta: {
            title: 'Logout',
            layout: 'loader',
            authRequired: true
        }
    },

    {
        path: '/',
        name: 'dashboard',
        component: () => import('@/views/dashboard/Index'),
        meta: {
            title: 'Dashboard',
            authRequired: true
        }
    },

    {
        path: '/:catchAll(.*)',
        name: 'erroPage',
        component: () => import('@/layouts/error'),
        meta: {
            title: 'Page not found',
            layout: (() =>
                store.getters['auth/loggedIn'] ? 'default' : 'auth')()
        }
    }
];
