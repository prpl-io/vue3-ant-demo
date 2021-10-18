import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';
import routes from './routes';

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach(async (routeTo, routeFrom, next) => {
    const authRequired = routeTo.matched.some(route => route.meta.authRequired);
    const guestOnly = routeTo.matched.some(route => route.meta.guestOnly);
    const adminOnly = routeTo.matched.some(route => route.meta.adminOnly);

    if (!authRequired && !guestOnly && !adminOnly) {
        return next();
    }

    const { getters, dispatch } = store;
    const loggedIn = getters['auth/loggedIn'];
    const isAdmin = getters['auth/isAdmin'];

    if (adminOnly) {
        if (isAdmin) {
            const validUser = await dispatch('auth/validate');

            return validUser ? next() : redirectToDashboard();
        }

        return redirectToDashboard();
    }

    if (authRequired) {
        if (loggedIn) {
            const validUser = await dispatch('auth/validate');

            return validUser ? next() : redirectToLogin();
        }

        return redirectToLogin();
    }

    if (guestOnly) {
        if (loggedIn) {
            const validUser = await dispatch('auth/validate');

            return validUser ? redirectToDashboard() : next();
        }

        return next();
    }

    function redirectToLogin() {
        next({ name: 'login', query: { redirectFrom: routeTo.fullPath } });
    }

    function redirectToDashboard() {
        next({ name: 'dashboard' });
    }
});

const DEFAULT_TITLE = 'Vue 3 Demo';

router.afterEach(to => {
    document.title =
        `${to?.meta?.title || ''} | ${DEFAULT_TITLE}` || DEFAULT_TITLE;
});

export default router;
