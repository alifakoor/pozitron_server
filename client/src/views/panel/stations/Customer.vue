<template>
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
                                    v-model="currentCustomer.phone"
                                    :formatter="toEnglish"
                                    @keyup="checkInput($event, 'phone')"
                                    :state="requiredPass.phone"
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
                                    v-model="currentCustomer.fullname"
                                    @keyup="checkInput($event, 'name')"
                                    :state="requiredPass.name"
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
                                        for="_customer-information-main-input-email"
                                    >ایمیل:
                                    </label>
                                </b-col>
                                <b-col md="6">
                                    <b-form-input
                                        id="_customer-information-main-input-email"
                                        class="_customer-information-main-input"
                                        type="email"
                                        v-model="currentCustomer.customer_meta._email"
                                    ></b-form-input>
                                </b-col>
                            </b-row>
                            <b-row class="mb-3">
                                <b-col md="3"
                                       class="_customer-information-main-label"
                                >
                                    <label
                                        for="_customer-information-main-input-address"
                                    >آدرس:</label>
                                </b-col>
                                <b-col md="9">
                                    <b-form-input
                                        id="_customer-information-main-input-address"
                                        class="_customer-information-main-input"
                                        type="text"
                                        v-model="currentCustomer.customer_meta._address"
                                    ></b-form-input>
                                </b-col>
                            </b-row>
                            <b-row class="mb-3">
                                <b-col md="3"
                                       class="_customer-information-main-label"
                                >
                                    <label
                                        for="_customer-information-main-input-desc"
                                    >توضیحات:
                                    </label>
                                </b-col>
                                <b-col md="9">
                                    <b-form-textarea
                                        id="_customer-information-main-input-desc"
                                        class="_customer-information-main-input"
                                        v-model="currentCustomer.customer_meta._description"
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
</template>

<script>
import { mapState } from 'vuex'
export default {
    data () {
        return {
            customer: {
                phone: null,
                name: null,
                email: null,
                address: null,
                description: null
            },
            // requiredPass: {
            //     phone: null,
            //     name: null
            // },
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
        checkInput (e, type) {
            if (type === 'phone') {
                this.checkPhoneInput(e.target.value)
                if (this.requiredPass.phone) {
                    this.getCustomer()
                }
            } else if (type === 'name') {
                console.log(e.target)
                this.checkNameInput(e.target.value)
                this.createBtn = !!(this.requiredPass.phone && this.requiredPass.name)
            }
        },
        checkPhoneInput (value) {
            const pattern = new RegExp('^(\\+98|0)?9\\d{9}$')
            this.requiredPass.phone = pattern.test(value)
        },
        checkNameInput (value) {
            if (value) {
                this.requiredPass.name = value.length > 0
            }
        },
        getCustomer () {
            this.currentCustomer.userId = this.currentUser.id
            this.$store.dispatch('order/getCustomer', this.currentCustomer).then(isNewCustomer => {
                if (isNewCustomer) {
                    this.toast('شماره وارد شده در لیست مشتریان موجود نمی باشد، لطفا نام مشتری را وارد نمایید.', 'مشتری جدید', 'success')
                }
            }).catch((err) => {
                console.log(`error: ${err}`)
            })
        },
        createOrder () {
            this.$store.dispatch('order/createOrder', this.currentCustomer)
        },
        toEnglish (value) {
            const persian = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
            const english = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
            let replaceNumber = value
            for (let i = 0; i < persian.length; i++) {
                const regex = new RegExp(persian[i], 'g')
                replaceNumber = replaceNumber.replace(regex, english[i])
            }
            return Number(replaceNumber)
        }
    },
    computed: {
        currentOrder () {
            return this.$store.getters['order/getCurrentOrder']
        },
        ...mapState({
            requiredPass: state => state.order.requiredPass,
            currentUser: state => state.auth.user,
            currentCustomer: state => state.order.customer
        })
    },
    watch: {
        currentCustomer: {
            handler (newValue, oldValue) {
                if (newValue.fullname) {
                    // this.checkPhoneInput(newValue.phone)
                    this.checkNameInput(newValue.fullname)
                } else {
                    // this.requiredPass.phone = false
                    this.requiredPass.name = false
                }
                this.createBtn = !!(this.requiredPass.phone && this.requiredPass.name)
            },
            deep: true
        }
    }
}
</script>

<style>

</style>
