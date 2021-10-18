<template>
    <a-form layout="vertical">
        <a-form-item v-if="editMode" label="Completed">
            <a-tag :color="task.completedAt ? 'green' : 'red'">
                {{ task.completedAt ? 'YES' : 'NO' }}
            </a-tag>
        </a-form-item>

        <a-form-item
            label="Title"
            has-feedback
            :validate-status="getError('title') && 'error'"
            :help="getError('title')"
        >
            <a-input id="title" v-model:value="task.title" type="text" />
        </a-form-item>

        <a-form-item
            label="Description"
            has-feedback
            :validate-status="getError('description') && 'error'"
            :help="getError('description')"
        >
            <a-textarea
                id="description"
                v-model:value="task.description"
                type="text"
                dir="auto"
                :auto-size="{ minRows: 4 }"
            />
        </a-form-item>
    </a-form>
</template>

<script>
export default {
    props: {
        value: {
            type: Object,
            required: false,
            default: () => ({})
        },
        editMode: {
            type: Boolean,
            required: false,
            default: false
        },
        validation: {
            type: Object,
            required: true
        },
        serverErrors: {
            type: Array,
            required: true
        }
    },

    emits: ['update:value'],

    data() {
        return {
            task: {}
        };
    },

    watch: {
        task() {
            this.$emit('update:value', this.task);
        }
    },

    created() {
        this.task = { ...this.value };
    },

    methods: {
        getError(key) {
            return this.$getValidationErrorMessageHandler.handle(
                this.validation.task,
                this.serverErrors,
                key
            );
        }
    }
};
</script>
