<template>
    <b-card
        header="همگام سازی محصولات"
        align="right"
    >
        <b-alert
            :show="alertCountDown"
            dismissible
            variant="success"
            @dismissed="alertCountDown=0"
            @dismiss-count-down="countDownChanged"
        >
            همگام سازی با موفقیت انجام شد، شما تا {{ alertCountDown }} دیگر به صفحه محصولات منتقل می شوید.
        </b-alert>
        <b-form @submit="onSubmit">
            <b-button type="submit" variant="primary">
                <p v-show="!isLoading" class="m-0">همگام سازی</p>
                <b-spinner v-show="isLoading"></b-spinner>
            </b-button>
        </b-form>
    </b-card>
</template>

<script>
export default {
    data () {
        return {
            alertSeconds: 3,
            alertCountDown: 0,
            isLoading: false,
            consumer: {
                key: null,
                secret: null
            }
        }
    },
    methods: {
        onSubmit (e) {
            e.preventDefault()
            this.isLoading = true
            this.$store.dispatch('product/syncProducts').then(
                (res) => {
                    if (res.status === 200) {
                        this.isLoading = false
                        this.showAlert()
                        setTimeout(() => {
                            this.$router.push('/panel/products')
                        }, 3000)
                    }
                }
            ).catch((err) => { console.log(err) })
        },
        countDownChanged (alertCountDown) {
            this.alertCountDown = alertCountDown
        },
        showAlert (e) {
            e.preventDefault()
            this.alertCountDown = this.alertSeconds
        }
    }
}
</script>

<style>

</style>
