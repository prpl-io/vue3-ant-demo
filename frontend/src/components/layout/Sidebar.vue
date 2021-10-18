<template>
    <a-layout-sider breakpoint="sm">
        <div :style="{ margin: '16px' }">
            <router-link to="/">
                <h2 :style="{ color: '#fff' }">
                    <span> Vue3 Demo </span>
                </h2>
            </router-link>
        </div>
        <a-menu theme="dark" mode="inline" :selected-keys="[currentKey]">
            <a-menu-item v-for="item in items" :key="item.link">
                <router-link :to="item.link">
                    <component :is="item.icon" />
                    <span class="nav-text">{{ item.text }}</span>
                </router-link>
            </a-menu-item>
        </a-menu>
    </a-layout-sider>
</template>

<script>
import { mapGetters } from 'vuex';
import TeamOutlined from '@ant-design/icons-vue/TeamOutlined';
import ProjectOutlined from '@ant-design/icons-vue/ProjectOutlined';
import UnorderedListOutlined from '@ant-design/icons-vue/UnorderedListOutlined';

export default {
    components: {
        TeamOutlined,
        ProjectOutlined,
        UnorderedListOutlined
    },

    computed: {
        ...mapGetters({
            isAdmin: 'auth/isAdmin'
        }),

        items() {
            const allUsers = [
                {
                    text: 'Dashboard',
                    link: '/',
                    icon: 'project-outlined'
                },
                {
                    text: 'Tasks',
                    link: '/tasks',
                    icon: 'unordered-list-outlined'
                }
            ];

            if (!this.isAdmin) {
                return allUsers;
            }

            return [
                ...allUsers,
                {
                    text: 'Users',
                    link: '/users',
                    icon: 'team-outlined'
                }
            ];
        },

        currentKey() {
            const [, path] = this.$route.path.split('/');

            return `/${path}`;
        }
    }
};
</script>
