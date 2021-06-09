<template>
    <b-row class="justify-content-md-center">
        <b-col cols="12" md="4">
            <div id="onp-login-form">
                <h4 class="text-center mb-3">وارد شوید</h4>
                <b-form @submit="onSubmit" v-if="show">
                    <b-form-group label="نام کاربری:" label-for="onp-login-username">
                        <b-form-input
                                id="onp-login-username"
                                v-model="form.username"
                                type="text"
                                required
                        ></b-form-input>
                    </b-form-group>

                    <b-form-group label="رمز عبور:" label-for="onp-login-pass">
                        <b-form-input
                                id="onp-login-pass"
                                v-model="form.password"
                                type="password"
                                required
                        ></b-form-input>
                    </b-form-group>

                    <b-button type="submit" variant="primary">ورود</b-button>
                    <b-form-group id="onp-login-register-link">
                        <b-form-text id="input-live-help">
                            حساب کاربری ندارید؟
                            <router-link to="/register">ثبت نام</router-link>
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
                password: ''
            },
            message: '',
            successful: false,
            show: true
        }
    },
    computed: {
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
        onSubmit (e) {
            e.preventDefault()
            if (this.form.username && this.form.password) {
                this.$store.dispatch('auth/login', this.form).then(
                    data => {
                        if (data.id) {
                            this.message = data.message
                            this.successful = true
                            setTimeout(() => { this.$router.push('/panel') }, 1000)
                        }
                    },
                    error => {
                        this.message =
                            (error.response && error.response.data) ||
                            error.message ||
                            error.toString()
                        this.successful = true
                    }
                )
            }
        }
    }
}
</script>

<style>
    #onp-login-form {
        background-color: white;
        padding: 5%;
        margin-top: 10vh;
        border-radius: 5px;
        direction: rtl;
        text-align: right;
        box-shadow: 0 0 1px rgba(0,0,0,.125), 0 1px 3px rgba(0,0,0,.2);
    }
    #onp-login-register-link{
        text-align: left;
    }
</style>
