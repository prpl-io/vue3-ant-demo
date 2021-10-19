<template>
    <a-layout-header
        :style="{
            background: '#fff',
            display: 'flex',
            justifyContent: 'flex-end'
        }"
    >
        <a-menu
            mode="horizontal"
            :style="{ lineHeight: '64px' }"
            :selected-keys="[$route.path]"
        >
            <a-sub-menu>
                <template #title>
                    <span>
                        <setting-outlined />
                        {{ loggedUser.fullName }}
                    </span>
                </template>
                <a-menu-item key="/account">
                    <router-link to="/account">
                        <span> My account </span>
                    </router-link>
                </a-menu-item>
                <a-menu-item key="/logout">
                    <router-link to="/logout">
                        <span> Logout </span>
                    </router-link>
                </a-menu-item>
            </a-sub-menu>
        </a-menu>
    </a-layout-header>
</template>

<script>
import { mapGetters } from 'vuex';
import SettingOutlined from '@ant-design/icons-vue/SettingOutlined';

export default {
    components: {
        SettingOutlined
    },

    computed: {
        ...mapGetters({
            loggedUser: 'auth/loggedUser'
        })
    }
};
</script>
