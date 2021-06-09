<template>
    <b-row class="onp-panel-main_customer">
        <b-col>
            <div class="onp-panel-main_customer-information">
                <div
                    v-if="!inPaymentOrder.done"
                >
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
                                    ></b-form-input>
                                </b-col>
                            </b-row>
                        </b-col>
                        <b-col md="3"
                               class="position-static"
                        >
                            <div class="_customer-information-main-payment-edit back-to-order">
                                <b-button
                                    @click="backToOrder()"
                                >
                                    <b-icon icon="arrow-left-square" variant="light"></b-icon>
                                </b-button>
                            </div>
                            <div class="_customer-information-main-payment-edit pay-order">
                                <b-button
                                    @click="payOrder(currentOrder)"
                                >
                                    <b-icon icon="check2-square" variant="success"></b-icon>
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
                                            for="_customer-information-main-input-email"
                                        >تاریخ ارسال:
                                        </label>
                                    </b-col>
                                    <b-col md="6">
                                        <date-picker
                                            id="_customer-information-main-input-delivery-date"
                                            class="_customer-information-main-input"
                                            v-model="delivery.date"
                                            format=YYYY/MM/DD
                                            :not-before="today"
                                            :editable=false
                                            ref="deliveryDate"
                                            @change="setDeliveryTime"
                                        ></date-picker>
                                    </b-col>
                                </b-row>
                                <b-row class="mb-3">
                                    <b-col md="3"
                                           class="_customer-information-main-label"
                                    >
                                        <label
                                            for="_customer-information-main-input-delivery-time"
                                        >زمان ارسال:
                                        </label>
                                    </b-col>
                                    <b-col md="6">
                                        <b-form-select
                                            id="_customer-information-main-input-delivery-time"
                                            class="_customer-information-main-input"
                                            v-model="delivery.time.selected"
                                            :options="delivery.time.options"
                                            ref="deliveryTime"
                                            @change="setDeliveryTime"
                                        ></b-form-select>
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
                                    <b-col md="8">
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
                                    <b-col md="8">
                                        <b-form-textarea
                                            id="_customer-information-main-input-desc"
                                            class="_customer-information-main-input"
                                        >{{ currentCustomer.customer_meta._description }}</b-form-textarea>
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
                <b-row
                    v-if="inPaymentOrder.done"
                    class="_customer-information-main"
                >
                    <b-col md="9">
                        <b-row class="mb-3">
                            <b-col md="2"></b-col>
                            <b-col md="10">
                                <span> فاکتور </span>
                                <b-form-input
                                    class="_customer-information-main-input d-inline w-auto"
                                    v-model="currentCustomer.fullname"
                                ></b-form-input>
                                <span> پرداخت شد. </span>
                            </b-col>
                        </b-row>
                    </b-col>
                    <b-col md="3">
                        <b-row>
                            <b-col>
                                <div class="_customer-information-main-edit">
                                    <b-button

                                    >
                                        <b-icon icon="printer" variant="dark"></b-icon>
                                    </b-button>
                                </div>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col>
                                <div class="_customer-information-main-edit">
                                    <b-button
                                        @click="newOrder()"
                                    >
                                        <b-icon icon="bag-plus" variant="success"></b-icon>
                                    </b-button>
                                </div>
                            </b-col>
                        </b-row>
                    </b-col>
                </b-row>
            </div>
        </b-col>
    </b-row>
</template>

<script>
import { mapState } from 'vuex'
import jm from 'jalali-moment'
import DatePicker from 'vue-datepicker-persian'
export default {
    components: {
        DatePicker
    },
    data () {
        return {
            delivery: {
                date: null,
                time: {
                    selected: null,
                    options: [
                        { value: '9-14', text: '9-14' },
                        { value: '14-19', text: '14-19' }
                    ]
                }
            },
            today: new Date()
        }
    },
    methods: {
        backToOrder () {
            this.$store.commit('order/backToOrder')
        },
        payOrder (order) {
            this.$store.dispatch('order/payOrder', order)
        },
        newOrder () {
            this.$store.commit('order/newOrderAfterPay')
        },
        setDeliveryTime () {
            if (!this.delivery.time.selected) {
                this.$refs.deliveryTime.focus()
            } else if (!this.delivery.date) {
                this.$refs.deliveryDate.focus()
            } else {
                const date = this.delivery.date.year + '/' + this.delivery.date.month + '/' + this.delivery.date.day
                this.currentOrder.meta.delivery = JSON.stringify({
                    date: jm(date, 'jYYYY/jMM/jDD').unix(),
                    time: this.delivery.time.selected
                })
            }
        }
    },
    computed: {
        // currentCustomer () {
        //     return this.$store.getters['order/getCustomer']
        // },
        // currentOrder () {
        //     return this.$store.getters['order/getCurrentOrder']
        // },
        inPaymentOrder () {
            return this.$store.getters['order/getInPaymentOrder']
        },
        ...mapState({
            currentCustomer: state => state.order.customer,
            currentOrder: state => state.order.currentOrder
        })
    }
}
</script>

<style>
#_customer-information-main-input-delivery-date{
    display: block !important;
    width: unset !important;
    font-size: unset !important;
}
#_customer-information-main-input-delivery-date .mx-input{
    display: block !important;
    height: unset !important;
    font-size: unset !important;
    border-radius: 8px !important;
    text-align: center;
}
</style>
