<template>
    <b-row>
        <b-col md="9" class="onp-panel-main stations">
            <b-row class="onp-panel-main_customer">
                <b-col>
                    <div class="onp-panel-main_customer-information">
                        <b-row class="_customer-information-main">
                            <b-col md="9">
                                <b-row class="mb-3">
                                    <b-col md="4"
                                           class="_customer-information-main-label"
                                    >
                                        <label
                                            for="_customer-information-main-input-mobile"
                                        >شماره موبایل
                                            <span
                                                class="_customer-information-main-required"
                                            >*</span>
                                            :
                                        </label>
                                    </b-col>
                                    <b-col md="8">
                                        <b-form-input
                                            id="_customer-information-main-input-mobile"
                                            class="_customer-information-main-input"
                                            v-model="customer.phone"
                                            @keyup="checkInput($event)"
                                            :state="requiredPass"
                                        ></b-form-input>
                                    </b-col>
                                </b-row>
                                <b-row class="mb-3">
                                    <b-col md="4"
                                           class="_customer-information-main-label"
                                    >
                                        <label
                                            for="_customer-information-main-input-name"
                                        >نام و نام خانوادگی:</label>
                                    </b-col>
                                    <b-col md="8">
                                        <b-form-input
                                            id="_customer-information-main-input-name"
                                            class="_customer-information-main-input"
                                            v-model="customer.name"
                                        ></b-form-input>
                                    </b-col>
                                </b-row>
                            </b-col>
                            <b-col md="3">
                                <div class="_customer-information-main-edit">
                                    <b-button
                                        @click="createOrder()"
                                        :disabled="!createBtn"
                                    >
                                        <b-icon icon="pencil-square" variant="success"></b-icon>
                                    </b-button>
                                </div>
                            </b-col>
                        </b-row>
                        <b-collapse
                            id="_customer-information-plus"
                        >
                            <b-row
                                class="_customer-information-plus"
                            >
                                <b-col md="12">
                                    <b-row class="mb-3">
                                        <b-col md="3"
                                               class="_customer-information-main-label"
                                        >
                                            <label
                                                for="_customer-information-main-input-city"
                                            >شهر:
                                            </label>
                                        </b-col>
                                        <b-col md="6">
                                            <b-form-input
                                                id="_customer-information-main-input-city"
                                                class="_customer-information-main-input"
                                            ></b-form-input>
                                        </b-col>
                                    </b-row>
                                    <b-row class="mb-3">
                                        <b-col md="3"
                                               class="_customer-information-main-label"
                                        >
                                            <label
                                                for="_customer-information-main-input-postal"
                                            >کدپستی:</label>
                                        </b-col>
                                        <b-col md="6">
                                            <b-form-input
                                                id="_customer-information-main-input-postal"
                                                class="_customer-information-main-input"
                                            ></b-form-input>
                                        </b-col>
                                    </b-row>
                                    <b-row class="mb-3">
                                        <b-col md="3"
                                               class="_customer-information-main-label"
                                        >
                                            <label
                                                for="_customer-information-main-input-address"
                                            >آدرس:
                                            </label>
                                        </b-col>
                                        <b-col md="9">
                                            <b-form-textarea
                                                id="_customer-information-main-input-address"
                                                class="_customer-information-main-input"
                                            ></b-form-textarea>
                                        </b-col>
                                    </b-row>
                                </b-col>

                            </b-row>
                        </b-collapse>
                        <div class="_customer-information-plus-btn">
                            <b-icon
                                icon="chevron-compact-down"
                                v-b-toggle._customer-information-plus
                            ></b-icon>
                        </div>
                    </div>
                </b-col>
            </b-row>
        </b-col>
        <b-col md="3" class="onp-panel-detail stations">
            <b-row class="onp-panel-detail_add">
                <b-col></b-col>
            </b-row>
            <b-row class="onp-panel-detail_customer">
                <b-col></b-col>
            </b-row>
            <b-row class="onp-panel-detail_cart">
                <b-col>
                    <b-row class="onp-panel-detail_cart-content">
                        <b-col></b-col>
                    </b-row>
                    <b-row class="onp-panel-detail_cart-payment">
                        <b-col>
                            <b-button variant="secondary" disabled>
                                <span>پرداخت</span>
                                <span>0 تومان</span>
                            </b-button>
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
        </b-col>
    </b-row>
</template>

<script>
export default {
    data () {
        return {
            customer: {
                phone: null,
                name: null
            },
            requiredPass: null,
            createBtn: false
        }
    },
    methods: {
        toast (message, title, variant) {
            this.$bvToast.toast(message, {
                title: title,
                variant: variant,
                solid: true,
                autoHideDelay: 1500
            })
        },
        checkInput (e) {
            const pattern = new RegExp('^(\\+98|0)?9\\d{9}$')
            this.createBtn = pattern.test(e.target.value)
            this.requiredPass = pattern.test(e.target.value)
            if (this.requiredPass) {
                this.getCustomer()
            }
        },
        getCustomer () {
            this.$store.dispatch('order/getCustomer', this.customer.phone).then(() => {
                if (!this.currentCustomer) {
                    this.toast('مشتری یافت نشد.', 'ناموفق', 'danger')
                    this.customer.name = null
                } else {
                    this.customer.name = this.currentCustomer.fullname
                }
            }).catch((err) => {
                console.log(`error: ${err}`)
            })
        },
        createOrder () {
            if (this.currentCustomer) {
                this.$store.dispatch('order/createOrder', this.currentCustomer)
            } else {
                this.$store.dispatch('order/createOrder', { customer: this.customer, userId: this.$store.state.auth.user.id })
            }
        }
    },
    computed: {
        currentCustomer () {
            return this.$store.getters['order/getCustomer']
        },
        currentOrder () {
            return this.$store.getters['order/getCurrentOrder']
        }
    }
}
</script>

<style>

</style>
