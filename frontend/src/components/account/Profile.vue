<template>
    <div class="card">
        <div class="card-body">
            <a-form layout="vertical" @submit.prevent="submitUserDataHandler">
                <a-form-item
                    label="First name"
                    has-feedback
                    :validate-status="getError('firstName') && 'error'"
                    :help="getError('firstName')"
                >
                    <a-input
                        id="firstName"
                        v-model:value="user.firstName"
                        type="text"
                    />
                </a-form-item>

                <a-form-item
                    label="Last name"
                    has-feedback
                    :validate-status="getError('lastName') && 'error'"
                    :help="getError('lastName')"
                >
                    <a-input
                        id="lastName"
                        v-model:value="user.lastName"
                        type="text"
                    />
                </a-form-item>

                <a-form-item
                    label="Email"
                    has-feedback
                    :validate-status="getError('email') && 'error'"
                    :help="getError('email')"
                >
                    <a-input
                        id="email"
                        v-model:value="user.email"
                        type="text"
                        @input="isEmailTaken = false"
                    />
                </a-form-item>

                <a-form-item>
                    <a-button type="primary" html-type="submit">
                        <save-outlined />
                        Save
                    </a-button>
                </a-form-item>
            </a-form>
        </div>
    </div>
</template>

<script>
import useVuelidate from '@vuelidate/core';
import { mapActions, mapGetters } from 'vuex';
import { StatusCodes as HTTP } from 'http-status-codes';
import { required, minLength, email } from '@vuelidate/validators';
import SaveOutlined from '@ant-design/icons-vue/SaveOutlined';

export default {
    components: {
        SaveOutlined
    },

    setup() {
        return { v$: useVuelidate() };
    },

    data() {
        return {
            user: {},
            serverErrors: []
        };
    },

    validations() {
        return {
            user: {
                email: {
                    required,
                    email
                },
                firstName: {
                    required,
                    minLength: minLength(2)
                },
                lastName: {
                    required,
                    minLength: minLength(2)
                }
            }
        };
    },

    computed: {
        ...mapGetters({
            loggedUser: 'auth/loggedUser'
        })
    },

    created() {
        this.user = {
            email: this.loggedUser.email,
            firstName: this.loggedUser.firstName,
            lastName: this.loggedUser.lastName
        };
    },

    methods: {
        ...mapActions({
            updateProfile: 'auth/updateProfile'
        }),

        async submitUserDataHandler() {
            this.serverErrors = [];

            this.v$.$touch();

            if (this.v$.$invalid) {
                return;
            }

            try {
                await this.updateProfile(this.user);

                this.$toaster('Account has been updated!');
            } catch (error) {
                const { response } = error;

                if (response) {
                    const { data, status } = response;

                    if (status === HTTP.BAD_REQUEST && data.errors) {
                        this.serverErrors = data.errors;

                        this.$toasterError('Recheck your form.');

                        return;
                    }
                }

                console.error(error);

                this.$toasterError();
            }
        },

        getError(key) {
            return this.$getValidationErrorMessageHandler.handle(
                this.v$.user,
                this.serverErrors,
                key
            );
        }
    }
};
</script>
