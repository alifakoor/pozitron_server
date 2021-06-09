<template>
    <div>
        <div class="_products-table">
            <table class="table table-sm" :busy="true">
                <thead>
                <tr>
                    <th
                        class="__sortable"
                    >
                        <div
                            :class="`__sortable-commander` + [colFilter.sku.value ? ' has-command':'']"
                            @mousedown="showFilterForSortable('sku')"
                            @mouseleave="clearTimerForSortable()"
                            @mouseup="clearTimerForSortable()"
                            @click="changeSort('sku')"
                        >
                            <span
                                v-if="!colFilter.sku.value"
                            >شناسه محصول</span>
                            <span
                                v-if="colFilter.sku.value"
                            >{{ colFilter.sku.value }}</span>
                            <b-icon
                                v-if="sortables.value === 'sku' && sortables.asc"
                                icon="caret-up-fill"
                            ></b-icon>
                            <b-icon
                                v-if="sortables.value === 'sku' && !sortables.asc"
                                icon="caret-down-fill"
                            ></b-icon>
                        </div>
                        <div v-if="colFilter.sku.show">
                            <div class="onp-back-drop" @click="hideFilterForSortable()"></div>
                            <div class="__sortable-input">
                                <input type="text" v-model="colFilter.sku.value">
                            </div>
                        </div>
                    </th>
                    <th
                        class="__unsortable source"
                    >
                        <div
                            :class="`__unsortable-commander` + [colFilter.name.value ? ' has-command':'']"
                            @click="showFilterForUnsortable('name')"
                        >
                            <span v-if="!colFilter.name.value">نام محصول</span>
                            <span
                                v-if="colFilter.name.value"
                                class="__unsortable-filtered"
                            >{{ colFilter.name.value }}</span>
                        </div>
                        <div v-if="colFilter.name.show">
                            <div class="onp-back-drop" @click="showFilterForUnsortable('name')"></div>
                            <div class="__sortable-input">
                                <input type="text" v-model="colFilter.name.value">
                            </div>
                        </div>
                    </th>
                    <th
                        class="__sortable"
                    >
                        <div @click="changeSort('stock')">
                            <span>موجودی</span>
                            <b-icon
                                v-if="sortables.value === 'stock' && sortables.asc"
                                icon="caret-up-fill"
                            ></b-icon>
                            <b-icon
                                v-if="sortables.value === 'stock' && !sortables.asc"
                                icon="caret-down-fill"
                            ></b-icon>
                        </div>
                    </th>
                    <th
                        class="__sortable"
                    >
                        <div @click="changeSort('regular_price')">
                            <span>قیمت</span>
                            <b-icon
                                v-if="sortables.value === 'regular_price' && sortables.asc"
                                icon="caret-up-fill"
                            ></b-icon>
                            <b-icon
                                v-if="sortables.value === 'regular_price' && !sortables.asc"
                                icon="caret-down-fill"
                            ></b-icon>
                        </div>
                    </th>
                    <th
                        class="__unsortable"
                    >
                        <div
                            :class="`__unsortable-commander` + [colFilter.attribute.selected.length ? ' has-command':'']"
                        >
                            <span @click="showFilterForUnsortable('attribute')">متغیر
                                <b-icon
                                    v-if="colFilter.attribute.selected.length"
                                    icon="filter"
                                ></b-icon>
                            </span>
                        </div>
                        <div v-if="colFilter.attribute.show">
                            <div class="onp-back-drop" @click="showFilterForUnsortable('attribute')"></div>
                            <div
                                class="__unsortable-options"
                            >
                                <b-form-group class="m-0">
                                    <b-form-checkbox-group
                                        v-model="colFilter.attribute.selected"
                                        class="__unsortable-options-checkbox"
                                    >
                                        <b-row
                                            v-for="option in colFilter.attribute.options"
                                            :key="option.id"
                                            class="m-0 mb-1"
                                        >
                                            <b-col class="p-0">
                                                <b-form-checkbox
                                                    :value="option.value"
                                                >
                                                    {{ option.text }}
                                                </b-form-checkbox>
                                            </b-col>
                                        </b-row>
                                    </b-form-checkbox-group>
                                </b-form-group>
                            </div>
                        </div>
                    </th>
                    <th
                        class="__sortable"
                    >
                        <div @click="changeSort('online_price')">
                            <span>قیمت</span>
                            <b-icon
                                v-if="sortables.value === 'online_price' && sortables.asc"
                                icon="caret-up-fill"
                            ></b-icon>
                            <b-icon
                                v-if="sortables.value === 'online_price' && !sortables.asc"
                                icon="caret-down-fill"
                            ></b-icon>
                        </div>
                    </th>
                    <th
                        class="__sortable"
                    >
                        <div @click="changeSort('online_stock')">
                            <span>آستانه</span>
                            <b-icon
                                v-if="sortables.value === 'online_stock' && sortables.asc"
                                icon="caret-up-fill"
                            ></b-icon>
                            <b-icon
                                v-if="sortables.value === 'online_stock' && !sortables.asc"
                                icon="caret-down-fill"
                            ></b-icon>
                        </div>
                    </th>
                    <th
                        class="__unsortable"
                    >
                        <div
                            :class="`__unsortable-commander` + [colFilter.online_sell.selected.length ? ' has-command':'']"
                        >
                            <span @click="showFilterForUnsortable('online_sell')">فروش
                                <b-icon
                                    v-if="colFilter.online_sell.selected.length"
                                    icon="filter"
                                ></b-icon>
                            </span>
                        </div>
                        <div v-if="colFilter.online_sell.show">
                            <div class="onp-back-drop" @click="showFilterForUnsortable('online_sell')"></div>
                            <div
                                class="__unsortable-options"
                            >
                                <b-form-group class="m-0">
                                    <b-form-checkbox-group
                                        v-model="colFilter.online_sell.selected"
                                        class="__unsortable-options-checkbox"
                                    >
                                        <b-row
                                            v-for="option in colFilter.online_sell.options"
                                            :key="option.id"
                                            class="m-0 mb-1"
                                        >
                                            <b-col class="p-0">
                                                <b-form-checkbox
                                                    :value="option.value"
                                                >
                                                    {{ option.text }}
                                                </b-form-checkbox>
                                            </b-col>
                                        </b-row>
                                    </b-form-checkbox-group>
                                </b-form-group>
                            </div>
                        </div>
                    </th>
                </tr>
                </thead>
                <template
                    v-for="product in allProducts"
                >
                    <template v-if="product.type === 'variable' && !table.busy">
                        <tbody :key="product.id">
                            <tr @click="loadProduct($event, product)">
                                <td
                                    class="__table-sku"
                                >{{ product.sku }}</td>
                                <td>{{ product.title }}</td>
                                <td>{{ product.product_meta | getMetaData | getStock }}</td>
                                <td>{{ product.product_meta | getMetaData | getPrice }}</td>
                                <td>{{ product.product_meta | getMetaData | getAtt('parent') }}</td>
                                <td>{{ product.product_meta | getMetaData | getPrice }}</td>
                                <td>-</td>
                                <td>
                                    <b-form-checkbox
                                        :checked="product.product_meta | getMetaData | getOnlineSell"
                                        size="lg"
                                        switch
                                        @change="manageOnlineSale($event, product.id)"
                                    ></b-form-checkbox>
                                </td>
                            </tr>
                            <tr
                                v-for="child in product.Children"
                                :key="child.id"
                                @click="loadProduct($event, child)"
                                class="__table-variations"
                            >
                                <td>
                                    <div class="__table-sku __table-variation-caret-left">
                                        <b-icon icon="caret-left-fill"></b-icon>
                                        {{ child.sku }}
                                    </div>
                                </td>
                                <td></td>
                                <td>{{ child.product_meta | getMetaData | getStock }}</td>
                                <td>{{ child.product_meta | getMetaData | getPrice }}</td>
                                <td>{{ child.product_meta | getMetaData | getAtt('child') }}</td>
                                <td>{{ child.product_meta | getMetaData | getOnlinePrice }}</td>
                                <td>-</td>
                                <td>
                                    <b-form-checkbox
                                        :checked="child.product_meta | getMetaData | getOnlineSell"
                                        size="lg"
                                        switch
                                        @change="manageOnlineSale($event, child.id)"
                                    ></b-form-checkbox>
                                </td>
                            </tr>
                        </tbody>
                    </template>
                    <template v-if="product.type === 'simple' && !table.busy">
                        <tbody :key="product.id">
                            <tr @click="loadProduct($event, product)">
                                <td
                                    class="__table-sku"
                                >{{ product.sku }}</td>
                                <td>{{ product.title }}</td>
                                <td>{{ product.product_meta | getMetaData | getStock }}</td>
                                <td>{{ product.product_meta | getMetaData | getPrice }}</td>
                                <td>-</td>
                                <td>{{ product.product_meta | getMetaData | getOnlinePrice }}</td>
                                <td>{{ product.product_meta | getMetaData | getOnlineStock }}</td>
                                <td>
                                    <b-form-checkbox
                                        :checked="product.product_meta | getMetaData | getOnlineSell"
                                        class="_products-table_online-sale"
                                        size="lg"
                                        switch
                                        @change="manageOnlineSale($event, product.id)"
                                    ></b-form-checkbox>
                                </td>
                            </tr>
                        </tbody>
                    </template>
                </template>
                <template v-if="table.busy">
                    <tr>
                        <td colspan="8">
                            <div class="d-flex justify-content-center">
                                <b-spinner label="Loading..."></b-spinner>
                            </div>
                        </td>
                    </tr>
                </template>
            </table>
        </div>
        <b-row class="mt-3">
            <b-col>
                <b-pagination
                    v-model="currentPage"
                    :total-rows="rows"
                    :per-page="perPage"
                    first-number
                    last-number
                    prev-text="قبلی"
                    next-text="بعدی"
                    pills
                    align="center"
                ></b-pagination>
            </b-col>
        </b-row>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'Table',
    data () {
        return {
            rows: 0,
            perPage: 20,
            currentPage: 1,
            sortables: {
                value: 'sku',
                asc: true
            },
            colFilter: {
                sku: {
                    show: false,
                    type: 'text',
                    value: null
                },
                name: {
                    show: false,
                    type: 'text',
                    value: null
                },
                stock: {
                    show: false,
                    type: 'text',
                    value: null
                },
                regular_price: {
                    show: false,
                    type: 'text',
                    value: null
                },
                attribute: {
                    show: false,
                    type: 'select',
                    selected: [],
                    options: [
                        { text: 'ساده', value: 'simple' },
                        { text: 'فقط والد', value: 'variable' }
                    ]
                },
                online_price: {
                    show: false,
                    type: 'text',
                    value: null
                },
                online_stock: {
                    show: false,
                    type: 'text',
                    value: null
                },
                online_sell: {
                    show: false,
                    type: 'select',
                    selected: [],
                    options: [
                        { text: 'همه', value: 'all' },
                        { text: 'آنلاین', value: 1 },
                        { text: 'آفلاین', value: 0 }
                    ]
                }
            },
            timerForSortable: null
        }
    },
    created () {
        this.$store.dispatch('product/getAllProducts')
    },
    methods: {
        paginate (products) {
            if (!products) return
            this.rows = products.length
            const page = this.currentPage
            const perPage = this.perPage
            const from = (page * perPage) - perPage
            const to = (page * perPage)
            return products.slice(from, to)
        },
        getProductChildrenSku (product) {
            if (product.type === 'simple') {
                return product.sku.toLowerCase()
            } else {
                let sku = ''
                product.Children.forEach(child => {
                    sku = sku + child.sku
                })
                return sku
            }
        },
        getProductPrice (product) {
            if (product.type === 'simple') {
                return product.product_meta._price
            } else if (product.type === 'variable') {
                let childrenPrice = ''
                product.Children.forEach((child) => {
                    if (child.product_meta._price) {
                        childrenPrice = childrenPrice + child.product_meta._price
                    }
                })
                return childrenPrice
            }
        },
        getProductAttributes (product) {
            if (product.type === 'simple') {
                return product.product_meta._attributes
            } else if (product.type === 'variable') {
                let childrenAttr = ''
                product.Children.forEach((child) => {
                    const attr = JSON.parse(child.product_meta._attributes).text
                    if (attr) {
                        childrenAttr = childrenAttr + attr
                    }
                })
                return childrenAttr
            }
        },
        showStatesForCurrent () {
            this.current.states.show = !this.current.states.show
        },
        showFilterForUnsortable (col) {
            switch (col) {
            case 'name':
                this.colFilter.name.show = !this.colFilter.name.show
                break
            case 'attribute':
                this.colFilter.attribute.show = !this.colFilter.attribute.show
                break
            case 'online_sell':
                this.colFilter.online_sell.show = !this.colFilter.online_sell.show
                break
            default:
                // do nothing
            }
        },
        showFilterForSortable (col) {
            const self = this
            self.timerForSortable = setTimeout(() => {
                switch (col) {
                case 'sku':
                    self.colFilter.sku.show = true
                    break
                case 'name':
                    self.colFilter.name.show = true
                    break
                case 'price':
                    self.colFilter.price.show = true
                    break
                case 'date':
                    self.colFilter.date.show = true
                    break
                case 'delivery':
                    self.colFilter.delivery.show = true
                    break
                default:
                    // do nothing
                }
            }, 1000)
        },
        clearTimerForSortable () {
            clearTimeout(this.timerForSortable)
        },
        hideFilterForSortable () {
            this.colFilter.sku.show = false
            this.colFilter.name.show = false
            this.colFilter.stock.show = false
            this.colFilter.regular_price.show = false
            this.colFilter.attribute.show = false
            this.colFilter.online_price.show = false
            this.colFilter.online_stock.show = false
            this.colFilter.online_sell.show = false
        },
        changeSort (col) {
            this.sortables.value = col
            this.sortables.asc = !this.sortables.asc
        },
        sortRowsForSortable (col, items) {
            let result = []
            switch (col) {
            case 'sku':
                result = items.sort((a, b) => {
                    return (this.sortables.asc) ? a.sku.localeCompare(b.sku) : b.sku.localeCompare(a.sku)
                })
                break
            case 'name':
                result = items.sort((a, b) => {
                    return (this.sortables.asc) ? a.customer.fullname.localeCompare(b.customer.fullname) : b.customer.fullname.localeCompare(a.customer.fullname)
                })
                break
            case 'stock':
                result = items.sort((a, b) => {
                    // console.log(a.title)
                    // console.log(b.title)
                    // console.log('******************')
                    let aStock
                    let bStock
                    if (a.type === 'variable') {
                        const childStocks = []
                        a.Children.map(child => {
                            childStocks.push(JSON.parse(child.product_meta._stock).value)
                        })
                        aStock = Math.max(...childStocks)
                    } else {
                        aStock = Number(JSON.parse(a.product_meta._stock).value)
                    }
                    if (b.type === 'variable') {
                        const childStocks = []
                        b.Children.map(child => {
                            childStocks.push(JSON.parse(child.product_meta._stock).value)
                        })
                        bStock = Math.max(...childStocks)
                    } else {
                        bStock = Number(JSON.parse(b.product_meta._stock).value)
                    }
                    if (!aStock) aStock = 0
                    if (!bStock) bStock = 0
                    return (this.sortables.asc) ? aStock - bStock : bStock - aStock
                })
                break
            case 'regular_price':
                result = items.sort((a, b) => {
                    let aPrice = parseInt(this.$options.filters.getMetaData(a.product_meta)._price)
                    let bPrice = parseInt(this.$options.filters.getMetaData(b.product_meta)._price)
                    if (!aPrice) aPrice = 0
                    if (!bPrice) bPrice = 0
                    return (this.sortables.asc) ? aPrice - bPrice : bPrice - aPrice
                })
                break
            case 'online_price':
                result = items.sort((a, b) => {
                    let aPrice = parseInt(this.$options.filters.getMetaData(a.product_meta)._price)
                    let bPrice = parseInt(this.$options.filters.getMetaData(b.product_meta)._price)
                    if (!aPrice) aPrice = 0
                    if (!bPrice) bPrice = 0
                    return (this.sortables.asc) ? aPrice - bPrice : bPrice - aPrice
                })
                break
            case 'online_stock':
                result = items.sort((a, b) => {
                    return (this.sortables.asc) ? a - b : b - a
                })
                break
            default:
                result = []
            }
            return result
        },
        _forSelect (col, selected, items) {
            let result = []
            switch (col) {
            case 'attribute':
                selected.forEach((attr) => {
                    const helper = items.filter(item => {
                        return item.type === attr
                    })
                    result.push(...helper)
                })
                break
            case 'online_sell':
                selected.forEach((status) => {
                    console.log(status)
                    if (status === 'all') {
                        result.push(...items)
                    } else {
                        const helper = items.filter(item => {
                            return Number(item.product_meta._online_sell) === status
                        })
                        result.push(...helper)
                    }
                })
                break
            default:
                result = []
            }
            return result
        },
        _forText (col, value, items) {
            let result = []
            let helper
            switch (col) {
            case 'sku':
                helper = items.filter(item => {
                    return item.sku.toLowerCase().indexOf(value) !== -1
                })
                result.push(...helper)
                break
            case 'name':
                helper = items.filter(item => {
                    return item.title.toLowerCase().indexOf(value) !== -1
                })
                result.push(...helper)
                break
            case 'stock':
                helper = items.filter(item => {
                    return (item.total_price + '').indexOf(value) !== -1
                })
                result.push(...helper)
                break
            case 'regular_price':
                break
            case 'online_price':
                break
            case 'online_stock':
                break
            default:
                result = []
            }
            return result
        },
        getProductCategory (terms) {
            terms = Object.values(terms)
        },
        loadProduct (e, product) {
            if (e.target.className === 'custom-control-label' || e.target.className === 'custom-control-input') return
            const meta = this.$options.filters.getMetaData(product.product_meta)
            if (product.type === 'simple') {
                const data = {
                    images: JSON.parse(meta._images),
                    index_image: JSON.parse(meta._images)[0],
                    big_image: JSON.parse(meta._images)[0],
                    sku: product.sku,
                    name: product.title,
                    price: parseInt(meta._price),
                    barcode: meta._barcode,
                    discount: JSON.parse(meta._discount),
                    stock: JSON.parse(meta._stock),
                    size: JSON.parse(meta._dimensions),
                    weight: parseInt(meta._weight),
                    online_sell: !!(parseInt(meta._online_sell)),
                    online_price: parseInt(meta._online_price),
                    online_discount: JSON.parse(meta._online_discount),
                    online_stock: parseInt(meta._online_stock),
                    permalink: meta._links,
                    description: product.description,
                    categories: Object.values(product.terms).filter((term) => {
                        return term.type === 'category'
                    }).map(term => term.id),
                    tags: Object.values(product.terms).filter((term) => {
                        return term.type === 'tag'
                    }).map(term => term.name)
                }
                this.$store.commit('product/setSimpleProduct', data)
            }
            if (product.type === 'variable') {
                const variations = []
                product.Children.forEach((child) => {
                    const metaHelper = this.$options.filters.getMetaData(child.product_meta)
                    const helper = {
                        id: child.id,
                        images: JSON.parse(metaHelper._images),
                        index_image: JSON.parse(metaHelper._images)[0],
                        big_image: JSON.parse(metaHelper._images)[0],
                        sku: child.sku,
                        name: child.title,
                        price: parseInt(metaHelper._price),
                        barcode: metaHelper._barcode,
                        discount: JSON.parse(metaHelper._discount),
                        stock: JSON.parse(metaHelper._stock),
                        size: JSON.parse(metaHelper._dimensions),
                        weight: parseInt(metaHelper._weight),
                        online_sell: !!(parseInt(metaHelper._online_sell)),
                        online_price: parseInt(metaHelper._online_price),
                        online_discount: JSON.parse(metaHelper._online_discount),
                        online_stock: parseInt(metaHelper._online_stock),
                        permalink: JSON.parse(metaHelper._links),
                        description: child.description,
                        options: this.$options.filters.getItemsOfVariations(meta._attributes, this.attributes),
                        selected: JSON.parse(metaHelper._attributes).option,
                        selected_for_remove: false,
                        created_before: true
                    }
                    variations.push(helper)
                })
                const data = {
                    id: product.id,
                    images: JSON.parse(meta._images),
                    index_image: JSON.parse(meta._images)[0],
                    big_image: JSON.parse(meta._images)[0],
                    sku: product.sku,
                    name: product.title,
                    permalink: JSON.parse(meta._links),
                    description: product.description,
                    categories: Object.values(product.terms).filter((term) => {
                        return term.type === 'category'
                    }).map(term => term.id),
                    tags: Object.values(product.terms).filter((term) => {
                        return term.type === 'tag'
                    }).map(term => term.name),
                    attributes: JSON.parse(meta._attributes),
                    variations: {
                        fields: [
                            { key: 'sku', label: 'شناسه' },
                            { key: 'variation', label: 'متغیر' },
                            { key: 'select' }
                        ],
                        items: variations
                    }
                }
                this.$store.commit('product/setVariableProduct', data)
            }
            if (product.type === 'product_variation') {
                const data = {
                    images: JSON.parse(meta._images),
                    index_image: JSON.parse(meta._images)[0],
                    big_image: JSON.parse(meta._images)[0],
                    sku: product.sku,
                    name: product.title,
                    parentId: product.parent_id,
                    price: parseInt(meta._price),
                    barcode: meta._barcode,
                    discount: JSON.parse(meta._discount),
                    stock: JSON.parse(meta._stock),
                    size: JSON.parse(meta._dimensions),
                    weight: parseInt(meta._weight),
                    online_sell: !!(parseInt(meta._online_sell)),
                    online_price: parseInt(meta._online_price),
                    online_discount: JSON.parse(meta._online_discount),
                    online_stock: parseInt(meta._online_stock),
                    permalink: meta._links
                }
                this.$store.commit('product/setProductVariation', data)
            }
        },
        manageOnlineSale (value, productId) {
            this.allProducts.map(product => {
                if (product.id === productId) {
                    product.product_meta._online_sell = Number(value)
                }
            })
            this.$store.dispatch('product/manageOnlineSale', { value: Number(value), productId: productId })
        }
    },
    computed: {
        allProducts () {
            let products = this.$store.getters['product/getAllProducts']
            if (products) {
                if (this.globalSearch.values !== null && this.globalSearch.values.length > 0) {
                    let filteredRows = []
                    const result = []
                    let sku = []
                    let titles = []
                    let prices = []
                    let attributes = []
                    const globalSearchValues = this.globalSearch.values.toLowerCase().split(' ')
                    globalSearchValues.forEach((filter) => {
                        if (!filteredRows.length) {
                            sku = products.filter(product => {
                                const sku = this.getProductChildrenSku(product)
                                if (sku.indexOf(filter) !== -1) return product
                            })
                            titles = products.filter(product => {
                                return product.title.toLowerCase().indexOf(filter) !== -1
                            })
                            prices = products.filter(product => {
                                const price = this.getProductPrice(product)
                                if (price.indexOf(filter) !== -1) {
                                    return product
                                }
                            })
                            attributes = products.filter(product => {
                                const attr = this.getProductAttributes(product)
                                if (attr.indexOf(filter) !== -1) return product
                            })
                        } else {
                            sku = filteredRows.filter(product => {
                                const sku = this.getProductChildrenSku(product)
                                if (sku.indexOf(filter) !== -1) return product
                            })
                            titles = filteredRows.filter(product => {
                                return product.title.toLowerCase().indexOf(filter) !== -1
                            })
                            prices = filteredRows.filter(product => {
                                const price = this.getProductPrice(product)
                                if (price.indexOf(filter) !== -1) {
                                    return product
                                }
                            })
                            attributes = filteredRows.filter(product => {
                                const attr = this.getProductAttributes(product)
                                if (attr.indexOf(filter) !== -1) return product
                            })
                        }
                        filteredRows = []
                        filteredRows.push(...sku)
                        filteredRows.push(...titles)
                        filteredRows.push(...prices)
                        filteredRows.push(...attributes)
                    })
                    const uniqueIds = []
                    filteredRows.forEach(row => {
                        if (!uniqueIds.includes(row.id)) {
                            uniqueIds.push(row.id)
                            result.push(row)
                        }
                    })
                    products = result
                }
                let colFilteredRows = []
                if (this.hasColFilters) {
                    const colFilter = this.colFilter
                    let pointer
                    for (const col in colFilter) {
                        const filter = colFilter[col]
                        if (colFilteredRows.length) {
                            pointer = colFilteredRows
                        } else {
                            pointer = products
                        }
                        switch (filter.type) {
                        case 'select':
                            if (filter.selected.length) {
                                colFilteredRows = this._forSelect(col, filter.selected, pointer)
                            }
                            break
                        case 'text':
                            if (filter.value) {
                                colFilteredRows = this._forText(col, filter.value, pointer)
                            }
                            break
                        default:
                            return
                        }
                    }
                    products = colFilteredRows
                }
                products = this.sortRowsForSortable(this.sortables.value, products)
            }
            return this.paginate(products)
        },
        hasColFilters () {
            const colFilter = this.colFilter
            return !!(colFilter.sku.value || colFilter.name.value || colFilter.stock.value || colFilter.regular_price.value || colFilter.attribute.selected.length || colFilter.online_price.value || colFilter.online_stock.value || colFilter.online_sell.selected.length)
        },
        ...mapState({
            table: state => state.product.table,
            attributes: state => state.product.attributes,
            globalSearch: state => state.product.globalSearch
        })
    },
    filters: {
        getMetaData (meta) {
            // const result = {}
            // meta.map((data) => {
            //     result[data.meta_key] = data.meta_value
            // })
            return meta
        },
        getStock (meta) {
            if (!meta._stock) return '-'
            const stock = JSON.parse(meta._stock)
            return (stock.selected === 'number') ? stock.value : '-'
        },
        getPrice (meta) {
            return (meta._price) ? parseInt(meta._price).toLocaleString() : '-'
        },
        getOnlinePrice (meta) {
            return (meta._online_price) ? parseInt(meta._online_price).toLocaleString() : '-'
        },
        getOnlineStock (meta) {
            return (meta._online_stock) ? meta._online_stock : '-'
        },
        getOnlineSell (meta) {
            return !!(parseInt(meta._online_sell))
        },
        getAtt (meta, type) {
            if (type === 'parent') {
                return (meta._attributes) ? JSON.parse(meta._attributes).name : '-'
            } else {
                return (meta._attributes) ? JSON.parse(meta._attributes).text : '-'
            }
        },
        getItemsOfVariations (meta, attributes) {
            const option = attributes.options.find((op) => {
                return op.value === JSON.parse(meta).value
            })
            return option.items
        }
    }
}
</script>

<style scoped>

</style>
