import { createApp } from 'vue';
import { createPinia } from 'pinia';

import AppLayout from './layouts/AppLayout.vue';
import { router } from './router';

import './styles/main.scss';

const app = createApp(AppLayout);

app.use(createPinia());
app.use(router);

app.mount('#app');
