<template>
    <a-layout :style="{ minHeight: '100vh' }">
        <sidebar />

        <a-layout>
            <navbar />

            <a-layout-content>
                <slot />
            </a-layout-content>

            <a-layout-footer style="text-align: center">
                2021 © Vue3 Demo
            </a-layout-footer>
        </a-layout>
    </a-layout>
</template>

<script>
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';

export default {
    components: {
        Navbar,
        Sidebar
    }
};
</script>
