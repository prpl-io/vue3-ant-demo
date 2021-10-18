<template>
    <a-card title="Reset password" :style="{ textAlign: 'center' }">
        <div v-if="incorrectToken || passwordChanged">
            <p>
                {{
                    passwordChanged
                        ? 'Password has been changed.'
                        : 'Incorrect Token'
                }}
            </p>
            <router-link to="/login">
                <span> Back to login </span>
            </router-link>
        </div>
        <div v-else>
            <a-form @submit.prevent="tryToReset">
                <a-form-item
                    :validate-status="getError('password') && 'error'"
                    :help="getError('password')"
                >
                    <a-input
                        id="password"
                        v-model:value="password"
                        type="password"
                        placeholder="New password"
                    />
                </a-form-item>
                <a-form-item
                    :validate-status="
                        getError('passwordConfirmation') && 'error'
                    "
                    :help="getError('passwordConfirmation')"
                >
                    <a-input
                        id="passwordConfirmation"
                        v-model:value="passwordConfirmation"
                        type="password"
                        placeholder="Password confirmation"
                    />
                </a-form-item>
                <a-form-item>
                    <a-button
                        type="primary"
                        html-type="submit"
                        :style="{ width: '100%' }"
                    >
                        Change password
                    </a-button>
                </a-form-item>
            </a-form>
        </div>
    </a-card>
</template>

<script>
import { mapActions } from 'vuex';
import useVuelidate from '@vuelidate/core';
import { StatusCodes as HTTP } from 'http-status-codes';
import { required, minLength, sameAs } from '@vuelidate/validators';

export default {
    setup() {
        return { v$: useVuelidate() };
    },

    data() {
        return {
            token: null,
            password: '',
            passwordConfirmation: '',
            passwordChanged: false,
            incorrectToken: false,
            serverErrors: []
        };
    },

    validations() {
        return {
            password: {
                required,
                minLength: minLength(6),
                containDigit: v => /\d/.test(v)
            },
            passwordConfirmation: {
                required,
                sameAsPassword: sameAs(this.password)
            }
        };
    },

    created() {
        this.token = this.$route.params.token;
        this.checkToken();
    },

    methods: {
        ...mapActions({
            checkPasswordResetToken: 'auth/checkPasswordResetToken',
            resetPassword: 'auth/resetPassword'
        }),

        async checkToken() {
            try {
                await this.checkPasswordResetToken(this.token);
            } catch (err) {
                console.error(err);
                this.incorrectToken = true;
            }
        },

        async tryToReset() {
            this.serverErrors = [];

            this.v$.$touch();

            if (this.v$.$invalid) {
                return;
            }

            try {
                await this.resetPassword({
                    token: this.token,
                    password: this.password,
                    passwordConfirmation: this.passwordConfirmation
                });

                this.passwordChanged = true;
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
