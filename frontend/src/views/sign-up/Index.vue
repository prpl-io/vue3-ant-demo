<template>
    <a-card title="Sign Up" :style="{ textAlign: 'center' }">
        <div v-if="dataSent">
            <p>
                An email has been sent. Click on the link included to set your
                password. You will also need to wait until an admin approves
                your account.
            </p>
            <router-link to="/login">
                <span> Back to login </span>
            </router-link>
        </div>

        <div v-else>
            <a-form
                :label-col="{ span: 7 }"
                :wrapper-col="{ span: 17 }"
                @submit.prevent="tryToSignUp"
            >
                <a-form-item
                    label="First name"
                    has-feedback
                    :validate-status="getError('firstName') && 'error'"
                    :help="getError('firstName')"
                >
                    <a-input
                        id="firstName"
                        v-model:value="firstName"
                        required
                        placeholder="Enter first name"
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
                        v-model:value="lastName"
                        required
                        placeholder="Enter last name"
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
                        v-model:value="email"
                        type="email"
                        required
                        placeholder="Enter email"
                    />
                </a-form-item>

                <a-form-item :wrapper-col="{ span: 24 }">
                    <a-button
                        type="primary"
                        html-type="submit"
                        :style="{ width: '100%' }"
                    >
                        Submit
                    </a-button>
                </a-form-item>

                <p>
                    Already have account?
                    <router-link to="/login">
                        <span> Log In </span>
                    </router-link>
                </p>
            </a-form>
        </div>
    </a-card>
</template>

<script>
import { mapActions } from 'vuex';
import useVuelidate from '@vuelidate/core';
import { StatusCodes as HTTP } from 'http-status-codes';
import { required, email, minLength } from '@vuelidate/validators';

export default {
    setup() {
        return { v$: useVuelidate() };
    },

    validations() {
        return {
            firstName: {
                required,
                minLength: minLength(2)
            },
            lastName: {
                required,
                minLength: minLength(2)
            },
            email: {
                required,
                email
            }
        };
    },

    data() {
        return {
            firstName: '',
            lastName: '',
            email: '',
            dataSent: false,
            serverErrors: []
        };
    },

    methods: {
        ...mapActions({
            signUp: 'auth/signUp'
        }),

        async tryToSignUp() {
            try {
                this.serverErrors = [];

                this.v$.$touch();

                if (this.v$.$invalid) {
                    return;
                }

                await this.signUp({
                    firstName: this.firstName,
                    lastName: this.lastName,
                    email: this.email,
                    companyName: this.companyName
                });

                this.dataSent = true;
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
