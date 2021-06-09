<template>
    <b-row class="justify-content-md-center">
        <b-col cols="12" md="4">
            <div id="onp-register-form">
                <h4 class="text-center mb-3">ثبت نام کنید</h4>
                <b-form @submit="onSubmit" v-if="show">
                    <b-form-group label="نام کاربری:" label-for="onp-register-username">
                        <b-form-input
                                id="onp-register-username"
                                v-model="form.username"
                                :state="usernameCheck"
                                @keyup="onKeyupUsername"
                                aria-describedby="input-live-help input-live-username-feedback"
                                type="text"
                                required
                        ></b-form-input>
                        <b-form-invalid-feedback id="input-live-username-feedback">
                            نام کاربری باید حداقل 5 حرف باشد.
                        </b-form-invalid-feedback>
                    </b-form-group>

                    <b-form-group label="شماره تماس:" label-for="onp-register-phone">
                        <b-form-input
                                id="onp-register-phone"
                                v-model="form.phone"
                                type="number"
                                required
                        ></b-form-input>
                    </b-form-group>

                    <b-form-group label="رمز عبور:" label-for="onp-register-pass">
                        <b-form-input
                                id="onp-register-pass"
                                v-model="form.password"
                                type="password"
                                required
                        ></b-form-input>
                    </b-form-group>

                    <b-form-group label="تایید رمز عبور:" label-for="onp-register-confirm-pass">
                        <b-form-input
                                id="onp-register-confirm-pass"
                                v-model="form.confirm_password"
                                type="password"
                                :state="confirmPassCheck"
                                @keyup="onKeyupConfirmPass"
                                aria-describedby="input-live-help input-live-pass-feedback"
                                required
                        ></b-form-input>
                        <b-form-invalid-feedback id="input-live-pass-feedback">
                           رمز عبور مطابقت ندارد.
                        </b-form-invalid-feedback>
                    </b-form-group>

                    <b-button type="submit" variant="primary">ثبت نام</b-button>
                    <b-form-group id="onp-register-login-link">
                        <b-form-text>
                            قبلا ثبت نام کردی؟
                            <router-link to="/login">ورود</router-link>
                        </b-form-text>
                    </b-form-group>
                    <b-form-group>
                        <b-form-text
                                v-if="successful"
                        >
                            {{ message }}
                        </b-form-text>
                    </b-form-group>
                </b-form>
            </div>
        </b-col>
    </b-row>
</template>

<script>
export default {
    data () {
        return {
            form: {
                username: '',
                phone: '',
                password: '',
                confirm_password: ''
            },
            message: '',
            successful: false,
            usernameInter: false,
            confirmPassInter: false,
            show: true
        }
    },
    computed: {
        usernameCheck () {
            if (this.usernameInter) { return this.form.username.length > 4 }
            return null
        },
        confirmPassCheck () {
            if (this.confirmPassInter) { return this.form.password === this.form.confirm_password }
            return null
        },
        validation () {
            if (this.usernameCheck && this.confirmPassCheck) { return true }
            return false
        },
        loggedIn () {
            return this.$store.state.auth.status.loggedIn
        }
    },
    mounted () {
        if (this.loggedIn) {
            this.$router.push('/panel')
        }
    },
    methods: {
        onKeyupUsername () {
            this.usernameInter = true
        },
        onKeyupConfirmPass () {
            this.confirmPassInter = true
        },
        onSubmit (e) {
            e.preventDefault()
            if (this.validation) {
                this.$store.dispatch('auth/register', this.form).then(
                    data => {
                        if (data.success) {
                            this.successful = true
                            this.message = data.message
                            setTimeout(() => { this.$router.push('/login') }, 1000)
                        }
                    },
                    error => {
                        this.message =
                                (error.response && error.response.data) ||
                                error.message ||
                                error.toString()
                        this.successful = false
                    }
                )
            }
        }
    }
}
</script>

<style>
    #onp-register-form {
        background-color: white;
        padding: 5%;
        margin-top: 10vh;
        border-radius: 5px;
        direction: rtl;
        text-align: right;
        box-shadow: 0 0 1px rgba(0,0,0,.125), 0 1px 3px rgba(0,0,0,.2);
    }
    #onp-register-login-link{
        text-align: left;
    }
</style>
