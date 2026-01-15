import type { RouteRecordRaw } from 'vue-router';

export const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/modules/people/pages/HomePage.vue')
    },
    {
        path: '/random',
        name: 'random-list',
        component: () => import('@/modules/people/pages/PeopleListPage.vue'),
        props: { source: 'random' }
    },
    {
        path: '/history',
        name: 'history-list',
        component: () => import('@/modules/people/pages/PeopleListPage.vue'),
        props: { source: 'saved' }
    },
    {
        path: '/profile/:source/:id',
        name: 'profile-details',
        component: () => import('@/modules/people/pages/PersonDetailsPage.vue'),
        props: true
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: () => import('@/app/pages/NotFoundPage.vue')
    }
];
