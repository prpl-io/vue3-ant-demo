import dayjs from 'dayjs';
import { createApp } from 'vue';
import Antd from 'ant-design-vue';

import App from './App.vue';
import store from '@/store';
import router from '@/router';
import PageHeader from '@/components/global/PageHeader';
import SkeletonLoader from '@/components/global/SkeletonLoader';
import GetValidationErrorMessageHandler from '@/services/GetValidationErrorMessageHandler';

require('./bootstrap/axios.config');
require('./bootstrap/global-styles');

const app = createApp(App);

app.use(router);
app.use(store);
app.use(Antd);

app.component('PageHeader', PageHeader);
app.component('SkeletonLoader', SkeletonLoader);

app.config.globalProperties.$dayjs = dayjs;

app.config.globalProperties.$toaster = function(message, type = 'success') {
    this.$message[type](message);
};
app.config.globalProperties.$toasterError = function(message = null) {
    this.$message.error(message || 'Something went wrong');
};

app.config.globalProperties.$getValidationErrorMessageHandler = new GetValidationErrorMessageHandler();

app.config.globalProperties.$filters = {
    formatDate: value => {
        if (value) {
            return dayjs(value).format('DD/MM/YYYY HH:mm:ss');
        }

        return '-';
    }
};

app.mount('#app');
