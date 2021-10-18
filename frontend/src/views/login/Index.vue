<template>
    <a-card title="Log In" :style="{ textAlign: 'center' }">
        <a-form
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 19 }"
            @submit.prevent="loginHandler"
        >
            <a-form-item
                label="Email"
                :validate-status="getError('email') && 'error'"
                :help="getError('email')"
            >
                <a-input
                    id="email"
                    v-model:value="email"
                    type="email"
                    placeholder="Email"
                />
            </a-form-item>

            <a-form-item
                label="Password"
                :validate-status="getError('password') && 'error'"
                :help="getError('password')"
            >
                <a-input
                    id="password"
                    v-model:value="password"
                    type="password"
                    placeholder="Password"
                />
            </a-form-item>

            <a-alert
                v-if="isAuthError"
                message="Wrong credentials!"
                type="error"
                show-icon
                closable
                :style="{ marginBottom: '16px' }"
            />

            <a-form-item :wrapper-col="{ span: 24 }">
                <a-button
                    :disabled="isProcessing"
                    type="primary"
                    html-type="submit"
                    :style="{ width: '100%' }"
                >
                    Submit
                </a-button>
            </a-form-item>

            <router-link to="/forget-password">
                Forgot your password?
            </router-link>

            <p>
                Don't have an account?
                <router-link to="/sign-up">
                    <span> Sign Up </span>
                </router-link>
            </p>
        </a-form>
    </a-card>
</template>

<script>
import { mapActions } from 'vuex';
import useVuelidate from '@vuelidate/core';
import { required, email } from '@vuelidate/validators';
import { StatusCodes as HTTP } from 'http-status-codes';

export default {
    setup() {
        return { v$: useVuelidate() };
    },

    data() {
        return {
            email: '',
            password: '',
            isAuthError: false,
            isProcessing: false,
            serverErrors: []
        };
    },

    validations() {
        return {
            password: {
                required
            },
            email: {
                required,
                email
            }
        };
    },

    methods: {
        ...mapActions({
            login: 'auth/login'
        }),

        async loginHandler() {
            this.serverErrors = [];
            this.isProcessing = true;
            this.isAuthError = false;

            try {
                await this.login({
                    email: this.email,
                    password: this.password
                });

                const { redirectFrom = '/' } = this.$route.query;

                const redirectRoute = !['/logout', '/login'].includes(
                    redirectFrom
                )
                    ? redirectFrom
                    : { name: 'dashboard' };

                this.$router.push(redirectRoute);
            } catch (error) {
                const { response } = error;

                if (response) {
                    const { data, status } = response;

                    if (status === HTTP.BAD_REQUEST && data.errors) {
                        this.serverErrors = data.errors;

                        this.$toasterError('Recheck your form.');

                        return;
                    }

                    if (status === HTTP.UNAUTHORIZED) {
                        this.isAuthError = true;

                        return;
                    }
                }

                console.error(error);

                this.$toasterError();
            } finally {
                this.isProcessing = false;
            }
        },

        getError(key) {
            return this.$getValidationErrorMessageHandler.handle(
                this.v$,
                this.serverErrors,
                key
            );
        }
    }
};
</script>
