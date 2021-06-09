<template>
    <div class="onp-station-cart">
        <b-row>
            <b-col col sm="12" md="12" class="onp-station-cart-navbar">
                <b-navbar toggleable="lg" type="light" variant="light">
                    <b-navbar-brand href="#">آنلاین نو پوز</b-navbar-brand>

                    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

                    <b-collapse id="nav-collapse" is-nav>
                        <!-- Right aligned nav items -->
                        <b-navbar-nav class="mr-auto w-100">
                            <b-nav-form class="w-50 m-auto">
                                <b-form-input
                                    @keyup="searchProducts($event)"
                                    class="w-75"
                                >
                                </b-form-input>
                                <b-button class="my-2 my-sm-0 ml-sm-2" type="submit">جستجو</b-button>
                            </b-nav-form>

                            <b-nav-item-dropdown left>
                                <!-- Using 'button-content' slot -->
                                <template v-slot:button-content>
                                    <em>کاربر</em>
                                </template>
                                <b-dropdown-item to="/panel">پنل</b-dropdown-item>
                                <b-dropdown-item @click="logout">خروج</b-dropdown-item>
                            </b-nav-item-dropdown>
                        </b-navbar-nav>
                    </b-collapse>
                </b-navbar>
            </b-col>
        </b-row>
        <b-row>
            <b-col sm="12" md="8">
                <b-row>
                    <b-col>
                        <b-pagination
                            v-model="currentPage"
                            :total-rows="rows"
                            :per-page="perPage"
                            aria-controls="station-cart-products"
                            align="center"
                            first-number
                            last-number
                        ></b-pagination>
                    </b-col>
                </b-row>

                <b-skeleton-wrapper :loading="isLoading">
                    <template v-slot:loading>
                        <b-row>
                            <b-col>
                                <b-card img-top>
                                    <b-skeleton-img></b-skeleton-img>
                                    <b-card-body>
                                        <b-skeleton></b-skeleton>
                                        <b-skeleton type="button"></b-skeleton>
                                    </b-card-body>
                                </b-card>
                            </b-col>

                            <b-col>
                                <b-card img-top>
                                    <b-skeleton-img></b-skeleton-img>
                                    <b-card-body>
                                        <b-skeleton></b-skeleton>
                                        <b-skeleton type="button"></b-skeleton>
                                    </b-card-body>
                                </b-card>
                            </b-col>

                            <b-col>
                                <b-card img-top>
                                    <b-skeleton-img></b-skeleton-img>
                                    <b-card-body>
                                        <b-skeleton></b-skeleton>
                                        <b-skeleton type="button"></b-skeleton>
                                    </b-card-body>
                                </b-card>
                            </b-col>
                        </b-row>
                    </template>

                </b-skeleton-wrapper>

                <b-card-group
                    id="station-cart-products"
                    v-show="!isLoading"
                    columns>
                    <b-card
                        v-for="product in computedItems.slice((currentPage - 1)*perPage, (currentPage - 1)*perPage + perPage)"
                        :key="product.slug"
                        :title="product.title"
                        :img-src="product.productmeta.images"
                        img-alt="Image"
                        img-top
                        tag="article"
                        class="m-2 text-right"
                        sm="12"
                    >
                        <b-button type="button" variant="primary" @click="addToCart(product.id)">افزودن به سبد خرید</b-button>
                    </b-card>
                </b-card-group>
            </b-col>
            <b-col sm="12" md="4" class="border-left onp-station-cart-bill">
                <b-skeleton-wrapper :loading="isLoading">

                    <template v-slot:loading>
                        <b-card>
                            <b-skeleton width="50%%"></b-skeleton>
                            <b-skeleton width="100%"></b-skeleton>
                            <b-skeleton width="50%"></b-skeleton>
                        </b-card>
                    </template>

                    <div v-show="prevCarts.length" v-for="prevCart in prevCarts" :key="prevCart.id">
                        <p>
                            <b-button v-b-toggle="'collapse-'+prevCart.id" variant="info">{{ prevCart.order_key +'_'+ prevCart.id }}</b-button>
                        </p>
                        <b-collapse
                            :id="'collapse-'+prevCart.id"
                        >
                            <b-card
                                no-body
                                header="صورت حساب"
                                align="right"
                                class="h-100"
                            >
                                <b-card-body class="h-75">
                                    <b-alert variant="warning" :show="!prevCart.order_items.length">شما هنوز محصولی به سبد خرید اضافه نکرده اید.</b-alert>
                                    <b-table
                                        v-show="prevCart.order_items.length"
                                        hover
                                        :items="prevCart.order_items"
                                        :fields="prevCartsItemsFields"
                                    >
                                        <template v-slot:cell(count)="row">
                                            <b-button size="sm" variant="success" class="ml-2" @click="prevCartPlusCount(prevCart.id, row.item.id)">
                                                +
                                            </b-button>
                                            {{ row.item.count }}
                                            <b-button size="sm" variant="danger" class="mr-2" @click="prevCartMinusCount(prevCart.id, row.item.id)">
                                                -
                                            </b-button>
                                        </template>
                                    </b-table>

                                    <b-card
                                        title="مشخصات مشتری"
                                    >
                                        <b-form-group>
                                            <b-form-input
                                                :value="prevCart.ordermeta[0].meta_value"
                                                type="text"
                                                placeholder="نام مشتری"
                                            >
                                            </b-form-input>
                                        </b-form-group>
                                        <b-form-group>
                                            <b-form-input
                                                :value="prevCart.ordermeta[1].meta_value"
                                                type="number"
                                                placeholder="شماره تماس"
                                            >
                                            </b-form-input>
                                        </b-form-group>
                                        <b-form-group>
                                            <b-form-textarea
                                                :value="prevCart.ordermeta[2].meta_value"
                                                placeholder="آدرس"
                                            >
                                            </b-form-textarea>
                                        </b-form-group>
                                    </b-card>

                                </b-card-body>
                                <b-card-footer>
                                    <b-button type="button" variant="primary" @click="removeCart">حذف</b-button>
                                    <b-button type="button" variant="primary" @click="completeCart(prevCart.id)">تکمیل</b-button>
                                    <p class="float-left">
                                        <span>مبلغ کل: </span>
                                        <span class="onp-station-cart-total-price">{{ prevCart.total_price.toLocaleString() }} </span>
                                        <b-badge variant="info">تومان</b-badge>
                                    </p>
                                </b-card-footer>

                            </b-card>
                        </b-collapse>
                    </div>

                    <b-card
                        no-body
                        header="صورت حساب"
                        align="right"
                    >
                        <b-card-body class="h-75">
                            <b-alert variant="warning" :show="!cartItems.length">شما هنوز محصولی به سبد خرید اضافه نکرده اید.</b-alert>
                            <b-table
                                v-show="cartItems.length"
                                hover
                                :items="cartItems"
                                :fields="cartItemsFields"
                            >
                                <template v-slot:cell(count)="row">
                                    <b-button size="sm" variant="success" class="ml-2" @click="plusCount(row.item.id)">
                                        +
                                    </b-button>
                                    {{ row.item.count }}
                                    <b-button size="sm" variant="danger" class="mr-2" @click="minusCount(row.item.id)">
                                        -
                                    </b-button>
                                </template>
                            </b-table>

                            <b-card
                                title="مشخصات مشتری"
                            >
                                <b-form-group>
                                    <b-form-input
                                        v-model="customer.name"
                                        type="text"
                                        placeholder="نام مشتری"
                                    >
                                    </b-form-input>
                                </b-form-group>
                                <b-form-group>
                                    <b-form-input
                                        v-model="customer.phone"
                                        type="number"
                                        placeholder="شماره تماس"
                                    >
                                    </b-form-input>
                                </b-form-group>
                                <b-form-group>
                                    <b-form-textarea
                                        v-model="customer.address"
                                        placeholder="آدرس"
                                    >
                                    </b-form-textarea>
                                </b-form-group>
                            </b-card>

                        </b-card-body>
                        <b-card-footer>
                            <b-button type="button" variant="primary" @click="saveCart">ذخیره</b-button>
                            <p class="float-left">
                                <span>مبلغ کل: </span>
                                <span class="onp-station-cart-total-price">{{ totalCartPrice.toLocaleString() }} </span>
                                <b-badge variant="info">تومان</b-badge>
                            </p>
                        </b-card-footer>

                    </b-card>

                </b-skeleton-wrapper>
            </b-col>
        </b-row>
    </div>
</template>

<script>
export default {
    data () {
        return {
            isLoading: true,
            currentPage: 1,
            perPage: 10,
            rows: 0,
            products: [],
            cartItems: [],
            cartItemsFields: [
                {
                    key: 'title',
                    label: 'عنوان'
                },
                {
                    key: 'price',
                    label: 'قیمت'
                },
                {
                    key: 'count',
                    label: 'تعداد'
                }
            ],
            filter: null,
            prevCarts: [],
            prevCartsItemsFields: [
                {
                    key: 'product.title',
                    label: 'عنوان'
                },
                {
                    key: 'price',
                    label: 'قیمت'
                },
                {
                    key: 'count',
                    label: 'تعداد'
                }
            ],
            customer: {
                name: null,
                phone: null,
                address: null
            }
        }
    },
    beforeCreate () {
        if (this.$store.state.auth.user.username !== this.$route.params.username) {
            this.$router.push('/panel')
        }
    },
    created () {
        this.isLoading = true
        this.$store.dispatch('product/getAllProductsForCart').then((res) => {
            this.products = res.data
            this.rows = this.products.length
            for (let i = 0; i < res.data.length; i++) {
                const image = JSON.parse(res.data[i].productmeta[4].meta_value)
                if (image.length > 0) {
                    this.products[i].productmeta.images = image[0].src
                }
            }
            this.$store.dispatch('order/getPrevCarts').then((prevCarts) => {
                this.prevCarts = prevCarts.data
                this.isLoading = false
            }).catch((err) => { console.log(err) })
        }).catch((err) => { console.log(err) })
    },
    methods: {
        logout () {
            this.$store.dispatch('auth/logout').then(() => {
                this.$router.push('/login')
            })
        },
        searchProducts (e) {
            this.filter = e.target.value
        },
        manageStock (id, count) {
            this.$store.dispatch('product/manageStock', { id: id, count: count }).then((res) => {
                console.log(res)
                this.stockAlert(res.data, 'موفقیت آمیز', 'success')
            }).catch((err) => { this.stockAlert(err) })
        },
        checkStock (id, num) {
            console.log(id, num)
            const product = this.products.find((product) => {
                if (product.id === id) {
                    return product
                }
            })
            for (let i = 0; i < product.productmeta.length; i++) {
                if (product.productmeta[i].meta_key === '_wc_stock_quantity') {
                    return product.productmeta[i].meta_value > num
                }
            }
        },
        stockAlert (msg, title, variant) {
            this.$bvToast.toast(msg, {
                title: title,
                variant: variant,
                solid: true,
                autoHideDelay: 1500
            })
        },
        addToCart (id) {
            const findItem = this.cartItems.find((item) => {
                if (item.id === id) {
                    if (this.checkStock(item.id, item.count)) {
                        item.price = (item.price / item.count) + item.price
                        item.count++
                    } else {
                        this.stockAlert('موجودی این محصول کافی نیست.', 'هشدار', 'danger')
                    }
                    return true
                }
                return false
            })
            if (!findItem) {
                const product = this.products.find((element) => {
                    if (element.id === id) {
                        return element
                    }
                    return false
                })
                const arr = {
                    id: product.id,
                    title: product.title,
                    price: parseInt(product.productmeta[6].meta_value),
                    count: 1
                }
                this.cartItems.push(arr)
            }
        },
        plusCount (id) {
            this.cartItems.find((item) => {
                if (item.id === id) {
                    if (this.checkStock(item.id, item.count)) {
                        item.price = (item.price / item.count) + item.price
                        item.count++
                    } else {
                        this.stockAlert('موجودی این محصول کافی نیست.', 'هشدار', 'danger')
                    }
                }
                return false
            })
        },
        minusCount (id) {
            this.cartItems.find((item) => {
                if (item.id === id) {
                    if (item.count > 1) {
                        item.price = item.price - (item.price / item.count)
                        item.count--
                    } else if (item.count === 1) {
                        this.cartItems = this.cartItems.filter((element) => {
                            return element.id !== item.id
                        })
                    } else {
                        this.stockAlert()
                    }
                }
                return false
            })
        },
        prevCartPlusCount (cartId, id) {
            const prevCart = this.prevCarts.find((cart) => {
                if (cart.id === cartId) {
                    return cart
                }
            })
            prevCart.order_items.find((item) => {
                if (item.id === id) {
                    if (this.checkStock(item.productId, item.count)) {
                        item.price = (item.price / item.count) + item.price
                        item.count++
                    } else {
                        this.stockAlert('موجودی این محصول کافی نیست.', 'هشدار', 'danger')
                    }
                }
                return false
            })
        },
        prevCartMinusCount (cartId, id) {
            const prevCart = this.prevCarts.find((cart) => {
                if (cart.id === cartId) {
                    return cart
                }
            })
            prevCart.order_items.find((item) => {
                if (item.id === id) {
                    if (item.count > 1) {
                        item.price = item.price - (item.price / item.count)
                        item.count--
                    } else if (item.count === 1) {
                        this.cartItems = this.cartItems.filter((element) => {
                            return element.id !== item.id
                        })
                    } else {
                        this.stockAlert()
                    }
                }
                return false
            })
        },
        saveCart () {
            this.$store.dispatch('order/saveCart', {
                customer: this.customer,
                totalPrice: this.totalCartPrice,
                items: this.cartItems
            }).then((res) => {
                if (res.status === 200) {
                    this.$store.dispatch('order/getPrevCarts').then((prevCarts) => {
                        this.prevCarts = prevCarts.data
                    }).catch((err) => { console.log(err) })
                    this.cartItems = []
                    this.customer.name = null
                    this.customer.phone = null
                    this.customer.address = null
                    this.stockAlert(res.data.message, 'موفقیت آمیز', 'success')
                }
            }).catch((err) => { console.log(err) })
        },
        completeCart (orderId) {
            this.$store.dispatch('order/completeCart', {
                order_id: orderId
            }).then((res) => {
                if (res.status === 200) {
                    this.$store.dispatch('order/getPrevCarts').then((prevCarts) => {
                        this.prevCarts = prevCarts.data
                    }).catch((err) => { console.log(err) })
                    this.stockAlert(res.data.message, 'موفقیت آمیز', 'success')
                }
            }).catch((err) => { console.log(err) })
        },
        removeCart () {
            console.log(this.prevCarts)
        }
    },
    computed: {
        computedItems () {
            const items = this.products.slice()
            if (this.filter) {
                const titles = items.filter(item => {
                    return item.title.toLowerCase().indexOf(this.filter) !== -1
                })
                const sku = items.filter(item => {
                    return item.sku.toLowerCase().indexOf(this.filter) !== -1
                })
                return titles.concat(sku)
            }
            return items
        },
        totalCartPrice () {
            let totalPrice = 0
            this.cartItems.forEach((product) => {
                totalPrice += product.price
            })
            return totalPrice
        }
    },
    watch: {
        computedItems: function (items) {
            this.rows = items.length
            this.currentPage = 1
        }
    }
}
</script>

<style>
    /* station cart */
    .onp-station-cart{
        direction: rtl;
    }
    /* station cart - navbar */
    .onp-station-cart-navbar{
        text-align: left;
    }
    .onp-station-cart-navbar .navbar{
        box-shadow: 0 0 1px rgba(0,0,0,.125), 0 1px 3px rgba(0,0,0,.2);
        border-radius: 5px;
    }
    .onp-station-cart-navbar form.form-inline{
        width: 100%;
    }
    .onp-station-cart .b-aspect-content{
        margin-left: unset !important;
        margin-right: -100% !important;
    }
    /* station cart - products */
    #station-cart-products,
    .onp-station-cart-bill{
        height: 80vh;
        overflow-y: scroll;
        column-count: unset;
    }
    #station-cart-products .card{
        width: 31.333%;
    }
    /* station cart - toaster */
    .b-toaster{
        text-align: right;
        direction: rtl;
    }
    .b-toaster .toast-header button{
        margin-left: unset !important;
        margin-right: auto !important;
    }
    /* station cart - total price */
    .onp-station-cart-total-price{
        font-family: "Shabnam", Sans-Serif;
    }
    /* station cart - bill */
    .onp-station-cart-bill{

    }
</style>
