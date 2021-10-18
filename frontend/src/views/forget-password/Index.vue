<template>
    <a-card title="Forgot password" :style="{ textAlign: 'center' }">
        <div v-if="emailSent">
            <p>
                An email has been sent. Please check for an email from company
                and click on the included link to reset your password.
            </p>
            <router-link to="/login">
                <span> Back to login </span>
            </router-link>
        </div>

        <div v-else>
            <p>
                Enter your email address and we'll send you an email with
                instructions to reset your password.
            </p>
            <a-form @submit.prevent="tryToSendLink">
                <a-form-item
                    has-feedback
                    :validate-status="getError('email') && 'error'"
                    :help="getError('email')"
                >
                    <a-input
                        id="email"
                        v-model:value="email"
                        type="email"
                        placeholder="Enter Email"
                    />
                </a-form-item>

                <a-form-item>
                    <a-button
                        type="primary"
                        html-type="submit"
                        :style="{ width: '100%' }"
                    >
                        Send Reset Password Link
                    </a-button>
                </a-form-item>
            </a-form>

            <p>
                Already have an account?
                <router-link to="/login">
                    <span> Log In </span>
                </router-link>
            </p>
        </div>
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

    validations() {
        return {
            email: { required, email }
        };
    },

    data() {
        return {
            email: '',
            emailSent: false,
            serverErrors: []
        };
    },

    methods: {
        ...mapActions({
            sendResetPasswordLink: 'auth/sendResetPasswordLink'
        }),

        async tryToSendLink() {
            this.serverErrors = [];

            this.v$.$touch();

            if (this.v$.$invalid) {
                return;
            }

            try {
                await this.sendResetPasswordLink(this.email);

                this.email = '';
                this.emailSent = true;
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
                this.v$,
                this.serverErrors,
                key
            );
        }
    }
};
</script>
