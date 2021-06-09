<template>
    <b-row>
        <b-col>
            <b-row class="onp-panel-main_navbar">
                <b-col md="4">
                    <div class="onp-panel-main_navbar-cats">
                        <b-dropdown
                            :text="categorySelected.text"
                            class="_navbar-cats-dropdown"
                        >
                            <b-dropdown-item @click="changeCategory(null, 'همه دسته بندی ها')">همه دسته بندی ها</b-dropdown-item>
                            <b-dropdown-item
                                v-for="category in allCategories"
                                :key="category.id"
                                :data-id="category.id"
                                @click="changeCategory(category.id, category.name)"
                            >{{ category.name }}</b-dropdown-item>
                        </b-dropdown>
                    </div>
                </b-col>
                <b-col md="2" class="p-0">
                    <div class="onp-panel-main_navbar-show">
                        <b-form-group
                            class="_navbar-show"
                        >
                            <b-form-radio
                                v-model="showing"
                                value="grid"
                                :class="[showing == 'grid' ? 'show': '']"
                            >
                                <b-icon icon="grid3x2-gap"></b-icon>
                            </b-form-radio>
                            <b-form-radio
                                v-model="showing"
                                value="list"
                                :class="[showing == 'list' ? 'show': '']"
                            >
                                <b-icon icon="list-ul"></b-icon>
                            </b-form-radio>
                        </b-form-group>
                    </div>
                </b-col>
                <b-col md="6">
                    <div class="onp-panel-main_navbar-search">
                        <b-input-group
                            class="_navbar-search"
                        >
                            <b-input-group-prepend>
                                <b-button variant="outline-info">
                                    <b-icon icon="search"></b-icon>
                                </b-button>
                            </b-input-group-prepend>

                            <b-form-input
                                type="text"
                                v-model="search"
                                @change="searchProduct()"
                                @keyup="searchProduct($event)"
                            ></b-form-input>

                        </b-input-group>
                    </div>
                </b-col>
            </b-row>
            <b-row class="onp-panel-main_products">
                <b-col>
                    <div class="_products-grid">
                        <div
                            v-for="(product, i) in allProducts"
                            :key="`${i}-${product.id}`"
                            @click="addToCart(product.id)"
                            class="_product"
                        >
                            <b-img
                                :src="(JSON.parse(product.product_meta._images).length > 0) ? config.api.server + JSON.parse(product.product_meta._images)[0].url : 'https://www.aamindus.com/images/notfound.png'"
                                class="h-100"
                                fluid
                            ></b-img>
                            <p
                                v-b-tooltip.hover.topleft :title="product.title"
                                class="_product-title"
                            >
                                {{ product.title }}
                            </p>
                            <p class="_product-price">
                                {{ Number(product.product_meta._price).toLocaleString() }}
                                <span>تومان</span>
                            </p>
                        </div>
                    </div>
                </b-col>
            </b-row>
        </b-col>
    </b-row>
</template>

<script>
import config from '@/config'
import { mapState } from 'vuex'
export default {
    data () {
        return {
            config: config,
            isLoading: false,
            categorySelected: {
                text: 'همه دسته بندی ها',
                id: null
            },
            showing: 'grid',
            filter: [],
            // products: null,
            categories: null,
            search: null,
            barcodeMode: false
        }
    },
    beforeCreate () {
        if (this.$store.state.auth.user.username !== this.$route.params.username) {
            this.$router.push('/panel')
        }
    },
    async created () {
        this.isLoading = true
        // this.$store.dispatch('category/getAllCategories').then(() => {
        //     this.categories = this.$store.getters['category/getAllCategories']
        // })
        await this.$store.dispatch('product/getAllProductsForCart')
        // this.products = this.$store.getters['product/getAllProducts']
        // console.log(this.products)
    },
    mounted () {
        const $ = window.$
        const component = this
        $.fn.scannerDetection = function (options) {
            if (typeof options === 'string') {
                this.each(function () {
                    this.scannerDetectionTest(options)
                })
                return this
            }
            if (options === false) {
                this.each(function () {
                    this.scannerDetectionOff()
                })
                return this
            }
            const defaults = {
                onComplete: false, // Callback after detection of a successfull scanning (scanned string in parameter)
                onError: false, // Callback after detection of a unsuccessfull scanning (scanned string in parameter)
                onReceive: false, // Callback after receiving and processing a char (scanned char in parameter)
                onKeyDetect: false, // Callback after detecting a keyDown (key char in parameter) - in contrast to onReceive, this fires for non-character keys like tab, arrows, etc. too!
                timeBeforeScanTest: 100, // Wait duration (ms) after keypress event to check if scanning is finished
                avgTimeByChar: 30, // Average time (ms) between 2 chars. Used to do difference between keyboard typing and scanning
                minLength: 2, // Minimum length for a scanning
                endChar: [9, 13], // Chars to remove and means end of scanning
                startChar: [], // Chars to remove and means start of scanning
                ignoreIfFocusOn: false, // do not handle scans if the currently focused element matches this selector
                scanButtonKeyCode: false, // Key code of the scanner hardware button (if the scanner button a acts as a key itself)
                scanButtonLongPressThreshold: 3, // How many times the hardware button should issue a pressed event before a barcode is read to detect a longpress
                onScanButtonLongPressed: false, // Callback after detection of a successfull scan while the scan button was pressed and held down
                stopPropagation: false, // Stop immediate propagation on keypress event
                preventDefault: false // Prevent default action on keypress event
            }
            if (typeof options === 'function') {
                options = {
                    onComplete: options
                }
            }
            if (typeof options !== 'object') {
                options = $.extend({}, defaults)
            } else {
                options = $.extend({}, defaults, options)
            }

            this.each(function () {
                const self = this
                const $self = $(self)
                let firstCharTime = 0
                let lastCharTime = 0
                let stringWriting = ''
                let callIsScanner = false
                let testTimer = false
                let scanButtonCounter = 0
                const initScannerDetection = function () {
                    firstCharTime = 0
                    stringWriting = ''
                    scanButtonCounter = 0
                }
                self.scannerDetectionOff = function () {
                    $self.unbind('keydown.scannerDetection')
                    $self.unbind('keypress.scannerDetection')
                }
                self.isFocusOnIgnoredElement = function () {
                    if (!options.ignoreIfFocusOn) return false
                    if (typeof options.ignoreIfFocusOn === 'string') return $(':focus').is(options.ignoreIfFocusOn)
                    if (typeof options.ignoreIfFocusOn === 'object' && options.ignoreIfFocusOn.length) {
                        var focused = $(':focus')
                        for (var i = 0; i < options.ignoreIfFocusOn.length; i++) {
                            if (focused.is(options.ignoreIfFocusOn[i])) {
                                return true
                            }
                        }
                    }
                    return false
                }
                self.scannerDetectionTest = function (s) {
                    // If string is given, test it
                    if (s) {
                        firstCharTime = lastCharTime = 0
                        stringWriting = s
                    }

                    if (!scanButtonCounter) {
                        scanButtonCounter = 1
                    }

                    // If all condition are good (length, time...), call the callback and re-initialize the plugin for next scanning
                    // Else, just re-initialize
                    if (stringWriting.length >= options.minLength && lastCharTime - firstCharTime < stringWriting.length * options.avgTimeByChar) {
                        if (options.onScanButtonLongPressed && scanButtonCounter > options.scanButtonLongPressThreshold) options.onScanButtonLongPressed.call(self, stringWriting, scanButtonCounter)
                        else if (options.onComplete) options.onComplete.call(self, stringWriting, scanButtonCounter)
                        $self.trigger('scannerDetectionComplete', {
                            string: stringWriting
                        })
                        initScannerDetection()
                        return true
                    } else {
                        if (options.onError) options.onError.call(self, stringWriting)
                        $self.trigger('scannerDetectionError', {
                            string: stringWriting
                        })
                        initScannerDetection()
                        return false
                    }
                }
                $self.data('scannerDetection', {
                    options: options
                }).unbind('.scannerDetection').bind('keydown.scannerDetection', function (e) {
                    if (options.scanButtonKeyCode !== false && e.which === options.scanButtonKeyCode) {
                        scanButtonCounter++
                        e.preventDefault()
                        e.stopImmediatePropagation()
                    } else if ((firstCharTime && options.endChar.indexOf(e.which) !== -1) ||
                        (!firstCharTime && options.startChar.indexOf(e.which) !== -1)) {
                        const e2 = $.Event('keypress', e)
                        e2.type = 'keypress.scannerDetection'
                        $self.triggerHandler(e2)
                        e.preventDefault()
                        e.stopImmediatePropagation()
                    }
                    if (options.onKeyDetect) options.onKeyDetect.call(self, e)
                    $self.trigger('scannerDetectionKeyDetect', {
                        evt: e
                    })
                }).bind('keypress.scannerDetection', function (e) {
                    if (this.isFocusOnIgnoredElement()) return
                    if (options.stopPropagation) e.stopImmediatePropagation()
                    if (options.preventDefault) e.preventDefault()

                    if (firstCharTime && options.endChar.indexOf(e.which) !== -1) {
                        e.preventDefault()
                        e.stopImmediatePropagation()
                        callIsScanner = true
                    } else if (!firstCharTime && options.startChar.indexOf(e.which) !== -1) {
                        e.preventDefault()
                        e.stopImmediatePropagation()
                        callIsScanner = false
                    } else {
                        if (typeof e.which !== 'undefined') {
                            stringWriting += String.fromCharCode(e.which)
                        }
                        callIsScanner = false
                    }

                    if (!firstCharTime) {
                        firstCharTime = Date.now()
                    }
                    lastCharTime = Date.now()

                    if (testTimer) clearTimeout(testTimer)
                    if (callIsScanner) {
                        self.scannerDetectionTest()
                        testTimer = false
                    } else {
                        testTimer = setTimeout(self.scannerDetectionTest, options.timeBeforeScanTest)
                    }

                    if (options.onReceive) options.onReceive.call(self, e)
                    $self.trigger('scannerDetectionReceive', {
                        evt: e
                    })
                })
            })
            return this
        }
        $(document).scannerDetection({
            timeBeforeScanTest: 200,
            startChar: [120],
            endChar: [13],
            avgTimeByChar: 40,
            onComplete: function (barcode, qty) { component.scanBarcode(barcode) }
        })
    },
    methods: {
        getSpecialMeta (data, metaKey) {
            let result = null
            data.forEach(function (meta) {
                if (meta.meta_key === metaKey) {
                    if (metaKey === '_images') {
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
        searchProduct (e) {
            this.filter = e.target.value.toLowerCase().split(' ')
        },
        changeCategory (id, name) {
            this.categorySelected.text = name
            if (id) {
                this.categories.find((category) => {
                    if (category.id === id) {
                        this.categorySelected.id = category.id
                    }
                })
            } else {
                this.categorySelected.id = null
            }
        },
        async addToCart (id) {
            const product = this.products.find((product) => {
                if (product.id === id) {
                    return product
                }
            })

            const productPrice = Number(product.product_meta._price)
            if (productPrice === 0 || isNaN(productPrice)) {
                this.outOfStockAlert('قیمت محصول نامشخص است، لطفا محصول را ویرایش نمایید.', 'قیمت محصول نامشخص', 'danger')
                return
            }

            const stock = JSON.parse(product.product_meta._stock)
            if (stock.value !== 0) {
                stock.value = (Number(stock.value) - 1)

                await this.$store.dispatch('product/updateProductStock', { id: id, stock: stock })

                const item = {
                    productId: product.id,
                    orderId: this.currentOrder.details.id,
                    image: (JSON.parse(product.product_meta._images).length > 0) ? JSON.parse(product.product_meta._images) : 'https://www.aamindus.com/images/notfound.png',
                    title: product.title,
                    price: Number(product.product_meta._price),
                    total_stock: Number(JSON.parse(product.product_meta._stock).value),
                    count: 1,
                    discount: {
                        type: 'percent',
                        amount: 0
                    },
                    type: 'type_1',
                    status: 'active'
                }
                this.$store.commit('order/addToCurrentOrder', item)

                await this.$store.dispatch('order/saveCurrentOrder', this.currentOrder)
            } else {
                this.outOfStockAlert('موجودی ناکافی', product.title, 'danger')
            }
        },
        outOfStockAlert (msg, title, variant) {
            this.$bvToast.toast(msg, {
                title: title,
                variant: variant,
                solid: true,
                autoHideDelay: 1500
            })
        },
        scanBarcode (barcode) {
            const product = this.products.find(product => {
                if (product.sku === barcode) {
                    return product
                } else {
                    return false
                }
            })
            if (product) {
                this.addToCart(product.id)
            } else {
                this.outOfStockAlert('این محصول موجود نمی باشد.', 'عدم وجود محصول', 'danger')
            }
        }
    },
    computed: {
        allProducts () {
            let products = this.products
            if (products) {
                products = products.filter(product => {
                    return Number(product.product_meta._price) !== 0
                })
                const items = products.slice()

                if (this.categorySelected.id) {
                    const cats = items.filter(item => {
                        let result = null
                        item.terms.forEach((term) => {
                            if (term.id === this.categorySelected.id) {
                                result = item
                            }
                        })
                        if (result) {
                            return result
                        }
                    })
                    if (this.filter) {
                        const titles = cats.filter(item => {
                            return item.title.toLowerCase().indexOf(this.filter) !== -1
                        })
                        const sku = cats.filter(item => {
                            return item.sku.toLowerCase().indexOf(this.filter) !== -1
                        })
                        return titles.concat(sku)
                    }
                    return cats
                }

                if (this.filter.length && this.filter[0].length) {
                    let result = []
                    let titles = []
                    let sku = []
                    this.filter.forEach((filter) => {
                        if (filter.length) {
                            if (!result.length) {
                                titles = items.filter(item => {
                                    return item.title.toLowerCase().indexOf(filter) !== -1
                                })
                                sku = items.filter(item => {
                                    return item.sku.toLowerCase().indexOf(filter) !== -1
                                })
                            } else {
                                titles = result.filter(item => {
                                    return item.title.toLowerCase().indexOf(filter) !== -1
                                })
                                sku = result.filter(item => {
                                    return item.sku.toLowerCase().indexOf(filter) !== -1
                                })
                            }
                            if (titles.length) {
                                result = titles
                            } else {
                                result = sku
                            }
                            if (titles.length && sku.length) {
                                titles.concat(sku)
                                result.concat(titles)
                            }
                        }
                    })
                    return result
                }
                return items
            }
            return products
        },
        allCategories () {
            return this.categories
        },
        ...mapState({
            currentOrder: state => state.order.currentOrder,
            previousOrders: state => state.order.prevOrders,
            products: state => state.product.products
        })
    }
}
</script>

<style>

</style>
