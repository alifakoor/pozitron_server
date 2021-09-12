<template>
    <b-row>
        <b-col md="9" class="onp-panel-main stations">
            <Customer v-if="!currentOrder.details && !inPaymentOrder.details" />
            <Products v-if="currentOrder.details && !inPaymentOrder.details" />
            <Payment v-if="inPaymentOrder.details" />
        </b-col>
        <b-col md="3" class="onp-panel-detail stations">
            <b-row class="onp-panel-detail_prev">
                <b-col class="p-0">
                    <div class="onp-panel-detail_prev-content">
                        <button
                            class="onp-panel-detail_add-button"
                            @click="saveCurrentOrder()"
                        >
                            <b-icon icon="bag-plus" variant="success"></b-icon>
                        </button>
                        <div
                            v-if="prevOrders.length"
                            class="onp-panel-detail_prev-carts"
                        >
                            <b-icon
                                icon="chevron-compact-right"
                                class="_prev-carts-right"
                            ></b-icon>
                            <div class="_prev-carts-content">
                                <b-button
                                    v-for="order in prevOrders"
                                    :key="order.id"
                                    class="_prev-carts bg-transparent"
                                    @click="loadOrder(order)"
                                >
                                    {{ order.customer.fullname }}
                                </b-button>
                            </div>
                            <b-icon
                                icon="chevron-compact-left"
                                class="_prev-carts-left"
                            ></b-icon>
                        </div>
                    </div>
                </b-col>
            </b-row>
            <b-row class="onp-panel-detail_customer">
                <b-col>
                    <div
                        v-if="currentCustomer.fullname"
                        class="onp-panel-detail_customer-current"
                    >
                        <p class="m-0">{{ this.currentCustomer.fullname }}</p>
                        <button
                            variant="danger"
                            class="onp-panel-detail_cart-remove"
                            @click="removeCurrentOrder(currentOrder)"
                        >
                            <b-icon icon="bag-x" variant="danger"></b-icon>
                        </button>
                    </div>
                </b-col>
            </b-row>
            <b-row class="onp-panel-detail_cart">
                <b-col>
                    <b-row class="onp-panel-detail_cart-content">
                        <b-col>
                            <b-row
                                v-for="item in currentOrder.items"
                                :key="item.id"
                                class="_cart-content pt-2"
                            >
                                <b-icon
                                    icon="x"
                                    variant="danger"
                                    class="_cart-content-remove"
                                    @click="removeFromCurrentOrder(item)"
                                ></b-icon>
                                <b-col
                                    md="3"
                                >
                                    <b-img
                                        :src="(item.image.length) ? config.api.server + item.image[0].url : 'https://www.aamindus.com/images/notfound.png'"
                                        class="_cart-content-image"
                                    ></b-img>
                                </b-col>
                                <b-col
                                    md="5"
                                    v-b-toggle="`discount_`+item.id"
                                    class="_cart-content-toggle-collapse"
                                >
                                    <p
                                        class="_cart-content-title"
                                    >
                                        {{ item.title }}
                                    </p>
                                </b-col>
                                <b-col
                                    md="4"
                                >
                                    <b-row>
                                        <b-icon
                                            icon="dash"
                                            variant="outline-secondary"
                                            class="_cart-content-stock-minus"
                                            @click="minusFromCurrentOrder(item)"
                                        >
                                        </b-icon>
                                        <b-input
                                            type="number"
                                            class="_cart-content-stock"
                                            :value="item.count"
                                        ></b-input>
                                        <b-icon
                                            icon="plus"
                                            variant="outline-secondary"
                                            class="_cart-content-stock-plus"
                                            @click="plusToCurrentOrder(item)"
                                        >
                                        </b-icon>
                                    </b-row>
                                    <b-row :class="[item.discount.amount !== 0 ? 'has-margin' : '']">
                                        <div :class="`_cart-content-price ` + [item.discount.amount !== 0 ? 'has-discount' : '']">
                                            <p class="m-0">
                                                {{ (item.price * item.count).toLocaleString() }}
                                                <span>تومان</span>
                                            </p>
                                            <p :class="`_cart-content-discount-amount ` + [item.discount.amount !== 0 ? 'show' : '']">
                                                <span v-if='item.discount.type === "percent"'>
                                                    {{ (((item.price * item.count) * item.discount.amount) / 100).toLocaleString() }}
                                                </span>
                                                <span v-else>
                                                    {{ (item.discount.amount * item.count * 1000).toLocaleString() }}
                                                </span>
                                                <span> - </span>
                                            </p>
                                            <p :class="`_cart-content-final-price ` + [item.discount.amount !== 0 ? 'show' : '']">
                                                <span v-if='item.discount.type === "percent"'>
                                                    {{ (item.count * (item.price - (item.price * item.discount.amount / 100))).toLocaleString() }}
                                                </span>
                                                <span v-else>
                                                    {{ (item.count * (item.price - (item.discount.amount * 1000))).toLocaleString() }}
                                                </span>
                                                <span>تومان</span>
                                            </p>
                                        </div>
                                    </b-row>
                                </b-col>
                                <b-collapse
                                    :id="`discount_`+item.id"
                                    class="_cart-content-discount"
                                >
                                    <b-form-input
                                        v-model.number="item.discount.amount"
                                        :formatter="toEnglish"
                                        @keyup="checkDiscountPerItem($event, item)"
                                        type="text"
                                        min="0"
                                        class="bg-secondary text-light border border-dark w-25 ml-2"
                                    ></b-form-input>
                                    <b-form-group>
                                        <b-form-radio-group
                                            id="btn-radios-2"
                                            v-model="item.discount.type"
                                            :options="discountPerItem.options"
                                            buttons
                                            button-variant="outline-secondary"
                                            name="radio-btn-outline"
                                        ></b-form-radio-group>
                                    </b-form-group>
                                </b-collapse>
                            </b-row>
                        </b-col>
                    </b-row>
                    <b-row class="onp-panel-detail_cart-plus">
                        <b-col>
                            <div
                                :class="`_cart-plus ` + [currentOrder.order_meta._addition ? 'has-cals':''] + [orderMeta.addition.open ? ' open-op':'']"
                            >
                                <b-button
                                    :pressed.sync="orderMeta.addition.open"
                                    :disabled="currentOrder.details == null"
                                >
                                    <b-icon
                                        icon="node-plus"
                                    ></b-icon>
                                </b-button>
                                <div
                                    @click="orderMeta.addition.open = true"
                                    class="_cart-plus-cash"
                                >
                                    <b-form-input
                                        type="text"
                                        class="_cart-plus-cash-input"
                                        min="0"
                                        v-model="currentOrder.order_meta._addition"
                                        :formatter="toEnglish"
                                    ></b-form-input>
                                    <span> هـ.ت</span>
                                </div>
                                <div class="_cart-plus-op additions">
                                    <b-icon
                                        icon="keyboard"
                                        variant="outline-secondary"
                                    >
                                    </b-icon>
                                </div>
                            </div>
                            <div
                                v-if="orderMeta.addition.open"
                                @click="orderMeta.addition.open = false"
                                class="onp-back-drop"
                            ></div>
                        </b-col>
                        <b-col>
                            <div
                                :class="`_cart-plus ` + [currentOrder.order_meta._discount ? 'has-cals':''] + [orderMeta.discount.open ? ' open-op':'']"
                            >
                                <b-button
                                    :pressed.sync="orderMeta.discount.open"
                                    :disabled="currentOrder.details == null"
                                >
                                    <b-icon icon="percent"></b-icon>
                                </b-button>
                                <div
                                    @click="orderMeta.discount.open = true"
                                    class="_cart-plus-cash"
                                >
                                    <b-form-input
                                        type="text"
                                        class="_cart-plus-cash-input"
                                        min="0"
                                        v-model="currentOrder.order_meta._discount"
                                        @keyup="checkTotalDiscount($event)"
                                        :formatter="toEnglish"
                                    ></b-form-input>
                                    <span> هـ.ت</span>
                                </div>
                                <div class="_cart-plus-op">
                                    <b-icon
                                        icon="dash"
                                        variant="outline-secondary"
                                        class="_cart-plus-op-minus"
                                        @click="minusDiscount()"
                                    >
                                    </b-icon>
                                    <span>%{{ totalPercentDiscount }}</span>
                                    <b-icon
                                        icon="plus"
                                        variant="outline-secondary"
                                        class="_cart-plus-op-plus"
                                        @click="plusDiscount()"
                                    >
                                    </b-icon>
                                </div>
                            </div>
                            <div
                                v-if="orderMeta.discount.open"
                                @click="orderMeta.discount.open = false"
                                class="onp-back-drop"
                            ></div>
                        </b-col>
                        <b-col>
                            <div
                                :class="`_cart-plus ` + [currentOrder.order_meta._shipping ? 'has-cals':''] + [orderMeta.shipping.open ? ' open-op':'']"
                            >
                                <b-button
                                    :pressed.sync="orderMeta.shipping.open"
                                    :disabled="currentOrder.details == null"
                                >
                                    <b-icon icon="truck"></b-icon>
                                </b-button>
                                <div
                                    @click="orderMeta.shipping.open = true"
                                    class="_cart-plus-cash"
                                >
                                    <b-form-input
                                        type="text"
                                        class="_cart-plus-cash-input"
                                        min="0"
                                        v-model="currentOrder.order_meta._shipping"
                                        @keyup="checkTotalShipping($event)"
                                        :formatter="toEnglish"
                                    ></b-form-input>
                                    <span> هـ.ت</span>
                                </div>
                                <div class="_cart-plus-op">
                                    <b-icon
                                        icon="dash"
                                        variant="outline-secondary"
                                        class="_cart-plus-op-minus"
                                        @click="minusShipping()"
                                    >
                                    </b-icon>
                                    <span>&plusmn;{{ orderMeta.shipping.step }}</span>
                                    <b-icon
                                        icon="plus"
                                        variant="outline-secondary"
                                        class="_cart-plus-op-plus"
                                        @click="plusShipping()"
                                    >
                                    </b-icon>
                                </div>
                            </div>
                            <div
                                v-if="orderMeta.shipping.open"
                                @click="orderMeta.shipping.open = false"
                                class="onp-back-drop"
                            ></div>
                        </b-col>
                    </b-row>
                    <b-row class="onp-panel-detail_cart-payment">
                        <b-col>
                            <b-button
                                variant="secondary"
                                :disabled="!activePaymentButton"
                                @click="paymentCurrentOrder(currentOrder)"
                            >
                                <span>پرداخت</span>
                                <span
                                    v-if="currentOrder.details"
                                >
                                    {{ totalPrice.toLocaleString() }}
                                </span>
                                <span>تومان</span>
                            </b-button>
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
        </b-col>
    </b-row>
</template>

<script>
import config from '@/config'
import Customer from './Customer.vue'
import Products from './Products.vue'
import Payment from './Payment.vue'
import { mapState } from 'vuex'

export default {
    components: {
        Customer,
        Products,
        Payment
    },
    data () {
        return {
            config: config,
            discountPerItem: {
                options: [
                    { text: '%', value: 'percent' },
                    { text: 'ه.ت', value: 'cash' }
                ]
            },
            orderMeta: {
                discount: {
                    open: false,
                    step: this.totalPercentDiscount || 0,
                    value: 0
                },
                shipping: {
                    open: false,
                    step: 5,
                    value: 0
                },
                addition: {
                    open: false,
                    value: 0
                }
            }
        }
    },
    created () {
        this.$store.dispatch('order/getPreviousOrders')
    },
    mounted () {
        const $ = window.$
        $('.onp-panel-detail_prev-content').on('click', '._prev-carts-right', function () {
            $(this).next().animate({
                scrollLeft: $(this).next().scrollLeft() - 75
            }, 500)
        })
        $('.onp-panel-detail_prev-content').on('click', '._prev-carts-left', function () {
            $(this).prev().animate({
                scrollLeft: $(this).prev().scrollLeft() + 75
            }, 500)
        })
        $('._cart-content-toggle-collapse').click(function () {
            $(this).parent().toggleClass('not-collapsed')
        })
        this.$root.$on('bv::collapse::state', (collapseId, isJustShown) => {
            if (isJustShown) {
                $('#' + collapseId).parent().addClass('not-collapsed')
            } else {
                $('#' + collapseId).parent().removeClass('not-collapsed')
            }
        })
    },
    methods: {
        getSpecialMeta (data, metaKey) {
            let result = null
            data.forEach(function (meta) {
                if (meta.meta_key === metaKey) {
                    if (metaKey === '_wc_images') {
                        result = { src: 'https://www.aamindus.com/images/notfound.png' }
                        const image = JSON.parse(meta.meta_value)
                        if (image.length > 0) {
                            result = image[0]
                        }
                    } else {
                        result = meta.meta_value
                    }
                }
            })
            return result
        },
        async removeFromCurrentOrder (item) {
            await this.updateProductStock(item.productId, item.count + item.total_stock)
            await this.$store.dispatch('order/deleteItemFromCurrentOrder', item)
            await this.$store.dispatch('order/saveCurrentOrder', this.currentOrder)
        },
        async updateProductStock (id, newStock) {
            const products = this.$store.getters['product/getAllProducts']
            const product = products.find((product) => {
                if (product.id === id) return product
            })
            const stock = JSON.parse(product.product_meta._stock)
            stock.value = newStock
            await this.$store.dispatch('product/updateProductStock', { id: id, stock: stock })
        },
        async plusToCurrentOrder (item) {
            if (item.total_stock > 0) {
                await this.updateProductStock(item.productId, item.total_stock - 1)
                await this.$store.commit('order/plusToCurrentOrder', item.id)
                await this.$store.dispatch('order/saveCurrentOrder', this.currentOrder)
            } else {
                this.outOfStockAlert('موجودی ناکافی', item.title, 'danger')
            }
        },
        async minusFromCurrentOrder (item) {
            await this.updateProductStock(item.productId, item.total_stock + 1)
            await this.$store.commit('order/minusFromCurrentOrder', item.id)
            await this.$store.dispatch('order/saveCurrentOrder', this.currentOrder)
            // this.$store.commit('order/minusFromCurrentOrder', id)
        },
        saveCurrentOrder () {
            this.$store.commit('order/nullCurrentOrder')
            this.$store.commit('order/nullCurrentCustomer')
        },
        removeCurrentOrder (order) {
            this.$bvModal.msgBoxConfirm('آیا مطمئن به حذف این فاکتور هستید؟', {
                title: 'اوه نه!',
                size: 'sm',
                buttonSize: 'lg',
                okVariant: 'danger',
                okTitle: 'آره',
                cancelTitle: 'بیخیال',
                bodyClass: 'onp-rtl',
                headerClass: 'onp-rtl text-justify',
                footerClass: 'p-2 d-flex flex-column-reverse align-items-stretch',
                hideHeaderClose: true,
                centered: true
            }).then(async response => {
                if (response) {
                    for (const item of order.items) {
                        await this.updateProductStock(item.productId, item.count + item.total_stock)
                    }
                    await this.$store.dispatch('order/deleteOrder', { id: order.details.id })
                }
            }).catch(err => {
                console.log(err)
            })
        },
        loadOrder (order) {
            this.$store.commit('order/setCustomer', order.customer)
            this.$store.commit('order/setCurrentOrder', order)
            order.items.forEach((item) => {
                const helper = {
                    id: item.order_items.id,
                    productId: item.order_items.productId,
                    orderId: item.order_items.orderId,
                    image: JSON.parse(item.product_meta._images),
                    title: item.title,
                    price: Number(item.product_meta._price),
                    total_stock: Number(JSON.parse(item.product_meta._stock).value),
                    count: Number(item.order_items.count),
                    discount: {
                        type: JSON.parse(item.order_items.discount).type,
                        amount: JSON.parse(item.order_items.discount).amount
                    },
                    type: item.order_items.type,
                    status: item.order_items.status
                }
                this.$store.commit('order/loadItemOfCurrentOrder', helper)
            })
        },
        paymentCurrentOrder (order) {
            this.$store.commit('order/inPaymentOrder', order)
        },
        outOfStockAlert (msg, title, variant) {
            this.$bvToast.toast(msg, {
                title: title,
                variant: variant,
                solid: true,
                autoHideDelay: 1500
            })
        },
        plusShipping () {
            if ((this.currentOrder.order_meta._shipping * 1000) < this.currentOrder.details.total_price) {
                this.currentOrder.order_meta._shipping += this.orderMeta.shipping.step
                // this.$store.commit('order/setShipping', this.orderMeta.shipping.value)
            }
        },
        minusShipping () {
            if (this.currentOrder.order_meta._shipping > 0) {
                this.currentOrder.order_meta._shipping -= this.orderMeta.shipping.step
                // this.$store.commit('order/setShipping', this.orderMeta.shipping.value)
            }
        },
        plusDiscount () {
            if (this.totalPercentDiscount < 100) this.totalPercentDiscount = ++this.orderMeta.discount.step
        },
        minusDiscount () {
            if (this.totalPercentDiscount > 0) this.totalPercentDiscount = --this.orderMeta.discount.step
        },
        setPluses (e, type) {
            let val = 0
            const regex = new RegExp(/^[a-zA-Z ]*$/)
            if (!isNaN(e.target.value) && !regex.test(e.target.value)) {
                val = parseInt(e.target.value)
            }
            switch (type) {
            case 'addition': {
                this.orderMeta.addition.value = val
                this.$store.commit('order/setAddition', this.orderMeta.addition.value)
                break
            }
            case 'discount': {
                const totalPrice = this.currentOrder.details.total_price
                this.orderMeta.discount.value = Math.round(((100000 * val) / totalPrice) * 100) / 100
                this.$store.commit('order/setDiscount', val)
                break
            }
            case 'shipping': {
                this.orderMeta.shipping.value = val
                this.$store.commit('order/setShipping', this.orderMeta.shipping.value)
                break
            }
            default:
                break
            }
        },
        toEnglish (value) {
            const persian = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
            const english = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
            let replaceNumber = value
            for (let i = 0; i < persian.length; i++) {
                const regex = new RegExp(persian[i], 'g')
                replaceNumber = replaceNumber.replace(regex, english[i])
            }
            for (const number of replaceNumber) {
                if (!english.includes(number)) {
                    return 0
                }
            }
            return Number(replaceNumber)
        },
        checkDiscountPerItem (value, item) {
            if (item.discount.type === 'percent') {
                if (item.discount.amount > 100) {
                    item.discount.amount = 100
                }
            }
            if (item.discount.type === 'cash') {
                if ((item.discount.amount * 1000) > item.price) {
                    item.discount.amount = (item.price / 1000)
                }
            }
        },
        checkTotalDiscount (e) {
            const value = Number(e.target.value)
            if ((value * 1000) > this.currentOrder.details.total_price) {
                this.currentOrder.order_meta._discount = this.currentOrder.details.total_price / 1000
            }
        },
        checkTotalShipping (e) {
            const value = Number(e.target.value)
            if ((value * 1000) > this.currentOrder.details.total_price) {
                this.currentOrder.order_meta._shipping = this.currentOrder.details.total_price / 1000
            }
        }
    },
    computed: {
        currentCustomer () {
            return this.$store.getters['order/getCustomer']
        },
        inPaymentOrder () {
            return this.$store.getters['order/getInPaymentOrder']
        },
        activePaymentButton () {
            return this.currentOrder.details != null
        },
        totalPrice () {
            const order = this.currentOrder
            if (!order.items || !order.items.length) return 0
            let totalPrice = 0
            order.items.forEach((item) => {
                if (item.discount.amount) {
                    if (item.discount.type === 'percent') {
                        totalPrice += (item.price - ((item.price * item.discount.amount) / 100)) * item.count
                    } else {
                        totalPrice += (item.price - item.discount.amount * 1000) * item.count
                    }
                } else {
                    totalPrice += item.price * item.count
                }
            })
            const shipping = Number(order.order_meta._shipping)
            const discount = Number(order.order_meta._discount)
            const addition = Number(order.order_meta._addition)
            return totalPrice + (shipping + addition - discount) * 1000
        },
        totalPercentDiscount: {
            get: function () {
                const totalPrice = (this.currentOrder.details) ? this.currentOrder.details.total_price : 0
                const totalAmountDiscount = Number(this.currentOrder.order_meta._discount)
                return (totalAmountDiscount !== 0 && totalPrice !== 0) ? (((totalAmountDiscount * 1000) / totalPrice) * 100).toFixed() : 0
            },
            set: function (value) {
                const totalPrice = (this.currentOrder.details) ? this.currentOrder.details.total_price : 0
                this.currentOrder.order_meta._discount = ((totalPrice * (value / 100)) / 1000).toFixed(2)
            }
        },
        ...mapState({
            prevOrders: state => state.order.prevOrders,
            currentOrder: state => state.order.currentOrder
        })
    },
    watch: {
        currentCustomer (customer) {
            return customer
        },
        currentOrder (order) {
            return order
        },
        totalPercentDiscount (value) {
            this.orderMeta.discount.step = value
        }
    }
}
</script>

<style>

</style>
