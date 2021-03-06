<template>
    <div>
        <page-header :title="title" :items="items" />

        <a-layout-content class="content-wrapper">
            <a-form-item>
                <a-button type="primary" @click="$router.push(`/tasks/add`)">
                    Add new
                </a-button>
            </a-form-item>

            <a-table
                :columns="columns"
                :row-key="item => item.id"
                :data-source="tasks"
                :pagination="pagination"
                :loading="loading"
                :scroll="{ x: true }"
                @change="handleTableChange"
            >
                <template #completedAt="{ record }">
                    <a-tag :color="record.completedAt ? 'green' : 'red'">
                        {{ record.completedAt ? 'YES' : 'NO' }}
                    </a-tag>
                </template>
                <template #createdAt="{ text }">
                    <span>
                        {{ $filters.formatDate(text) }}
                    </span>
                </template>
                <template #actions="{ record }">
                    <span>
                        <a @click="$router.push(`/tasks/${record.id}/edit`)">
                            Edit
                        </a>
                        <a-divider type="vertical" />
                        <span v-if="!record.completedAt">
                            <a
                                :style="{ color: '#52c41a' }"
                                @click="completeTask(record.id)"
                            >
                                Complete
                            </a>
                            <a-divider type="vertical" />
                        </span>
                        <a
                            :style="{ color: '#f5222d' }"
                            @click="confirmDelete(record.id)"
                        >
                            Delete
                        </a>
                    </span>
                </template>
            </a-table>
        </a-layout-content>

        <confirmation-modal
            v-if="idToDelete"
            @confirm="deleteTask"
            @cancel="modalCanceled"
        />
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import { StatusCodes as HTTP } from 'http-status-codes';
import ConfirmationModal from '@/components/common/ConfirmationModal';

export default {
    components: {
        ConfirmationModal
    },

    data() {
        return {
            title: 'Tasks',
            items: [
                {
                    text: 'Vue3 Demo',
                    path: '/'
                },
                {
                    text: 'Tasks'
                }
            ],
            columns: [
                {
                    title: 'Title',
                    dataIndex: 'title',
                    sorter: true
                },
                {
                    title: 'Completed',
                    dataIndex: 'completedAt',
                    sorter: true,
                    key: 'completedAt',
                    slots: { customRender: 'completedAt' }
                },
                {
                    title: 'Created at',
                    dataIndex: 'createdAt',
                    sorter: true,
                    defaultSortOrder: 'descend',
                    key: 'createdAt',
                    slots: { customRender: 'createdAt' }
                },
                {
                    title: 'Actions',
                    dataIndex: 'actions',
                    slots: { customRender: 'actions' }
                }
            ],
            tasks: [],
            loading: false,
            pagination: {
                current: 1,
                pageSize: 10,
                pageSizeOptions: ['10', '20', '50', '100'],
                showSizeChanger: true
            },
            idToDelete: null
        };
    },

    created() {
        this.fetchTasks({ page: 1, perPage: 10 });
    },

    methods: {
        ...mapActions({
            index: 'tasks/index',
            delete: 'tasks/destroy',
            complete: 'tasks/complete'
        }),

        handleTableChange(pagination, filters, sorter) {
            this.pagination = { ...this.pagination, ...pagination };

            this.fetchTasks({
                perPage: pagination.pageSize,
                page: pagination.current,
                sortBy: sorter.field,
                descending: sorter.order === 'descend',
                ...filters
            });
        },

        async fetchTasks(params = {}) {
            try {
                this.loading = true;

                const { rows, count } = await this.index({
                    ...params,
                    search: this.search
                });

                this.tasks = rows;
                this.pagination = { ...this.pagination, total: count };
            } catch (err) {
                console.error(err);

                this.$toasterError();
            } finally {
                this.loading = false;
            }
        },

        async completeTask(id) {
            try {
                const updatedTask = await this.complete(id);

                const index = this.tasks.findIndex(
                    task => task.id === updatedTask.id
                );

                this.tasks.splice(index, 1, updatedTask);

                this.$toaster('Task has been completed!');
            } catch (err) {
                console.error(err);

                this.$toasterError();
            }
        },

        confirmDelete(id) {
            this.idToDelete = id;
        },

        async deleteTask() {
            try {
                await this.delete(this.idToDelete);

                this.tasks = this.tasks.filter(
                    item => item.id !== this.idToDelete
                );
                this.pagination = {
                    ...this.pagination,
                    total: this.pagination.total--
                };

                this.idToDelete = null;

                this.$toaster('Task has been deleted.');
            } catch (error) {
                const { response } = error;

                if (response) {
                    const { data, status } = response;

                    if (status === HTTP.UNPROCESSABLE_ENTITY && data) {
                        this.$toasterError(data);

                        return;
                    }
                }

                console.error(error);

                this.$toasterError();
            }
        },

        modalCanceled() {
            this.idToDelete = null;
        }
    }
};
</script>
