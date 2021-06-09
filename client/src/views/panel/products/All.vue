<template>
    <b-row>
        <b-col md="9" class="onp-panel-main products">
            <b-row>
                <b-col>
                    <b-row class="onp-panel-main_navbar">
                        <b-col md="1">
                            <div class="_navbar-add-invoice">
                                <b-button
                                    variant="transparent"
                                    class="p-0"
                                >
                                    <b-icon icon="file-earmark-plus"></b-icon>
                                </b-button>
                            </div>
                        </b-col>
                        <b-col md="1">
                            <div class="_navbar-add-invoice">
                                <b-button
                                    variant="transparent"
                                    class="p-0"
                                >
                                    <b-icon icon="file-earmark-plus"></b-icon>
                                </b-button>
                            </div>
                        </b-col>
                        <b-col md="3" class="pl-0">
                            <div class="onp-panel-main_navbar-cats">
                                <b-dropdown
                                    :text="categorySelected.text"
                                    class="_navbar-cats-dropdown"
                                >
                                    <CategoryView
                                        :categories="allCategories"
                                        :handle-values="handleCategoryValues"
                                        parent="all"
                                    ></CategoryView>
                                </b-dropdown>
                            </div>
                        </b-col>
                        <b-col md="2">
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
                        <b-col md="5">
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
                                        v-model="globalSearch.values"
                                    ></b-form-input>

                                    <b-input-group-append>
                                        <b-button
                                            v-if="globalSearch.values"
                                            @click="removeGlobalSearch"
                                        >
                                            <b-icon icon="x"></b-icon>
                                        </b-button>
                                    </b-input-group-append>

                                </b-input-group>
                            </div>
                        </b-col>
                    </b-row>
                    <b-row class="onp-panel-main_products">
                        <b-col>
                            <Table />
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
        </b-col>
        <b-col md="3" class="onp-panel-detail products">
            <b-row class="onp-panel-detail_actions">
                <b-col>
                    <b-button
                        v-if="newProduct.type"
                        class="_actions-button"
                        variant="outline-success"
                        size="sm"
                    >
                        <b-icon
                            icon="check"
                            @click="createNewProduct"
                        ></b-icon>
                    </b-button>
                </b-col>
                <b-col>
                    <b-button
                        class="_actions-button"
                        variant="outline-secondary"
                        size="sm"
                        @click="undoNewProduct()"
                    >
                        <b-icon icon="arrow-counterclockwise"></b-icon>
                    </b-button>
                </b-col>
                <b-col></b-col>
                <b-col></b-col>
                <b-col></b-col>
                <b-col>
                    <b-button
                        v-if="newProduct.type"
                        class="_actions-button"
                        variant="outline-danger"
                        size="sm"
                        @click="deleteProduct"
                    >
                        <b-icon icon="archive"></b-icon>
                    </b-button>
                </b-col>
            </b-row>
            <b-row class="onp-panel-detail_product">
                <b-col class="h-100">
                    <div
                        v-if="!newProduct.type"
                        class="_product-add-new"
                    >
                        <b-row>
                            <b-col>
                                <p>نوع محصول جدید را انتخاب کنید:</p>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col>
                                <b-button size="sm" variant="light" @click="addNewProduct('simple')">محصول ساده</b-button>
                            </b-col>
                            <b-col>
                                <b-button size="sm" variant="light" @click="addNewProduct('variable')">محصول متغیر</b-button>
                            </b-col>
                        </b-row>
                    </div>
                    <NewSimple v-if="newProduct.type === 'simple' || newProduct.type === 'editSimple'" :currentTab="currentTab" />
                    <NewVariable v-if="newProduct.type === 'variable' || newProduct.type === 'editVariable'" :currentTab="currentTab" />
                    <Variation v-if="newProduct.type === 'productVariation'" :currentTab="currentTab"/>
                </b-col>
            </b-row>
            <b-row class="onp-panel-detail_tabs">
                <b-button-group class="w-100" v-if="newProduct.type" size="lg">
                    <b-button :class="`_tabs-button ` + [currentTab === 'first' ? 'active' : '']" squared
                        @click="changeTabs('first')"
                    >
                        <b-icon icon="info-square"></b-icon>
                    </b-button>
                    <b-button :class="`_tabs-button ` + [currentTab === 'second' ? 'active' : '']" squared
                        @click="changeTabs('second')"
                    >
                        <b-icon icon="globe2"></b-icon>
                    </b-button>
                    <b-button
                        v-if="newProduct.type !== 'productVariation'"
                        :class="`_tabs-button ` + [currentTab === 'third' ? 'active' : '']"
                        squared
                        @click="changeTabs('third')"
                    >
                        <b-icon icon="tags"></b-icon>
                    </b-button>
                </b-button-group>
            </b-row>
        </b-col>
    </b-row>
</template>

<script>
import { mapState } from 'vuex'
import Table from '@/views/panel/products/Table'
import NewSimple from '@/views/panel/products/NewSimple'
import NewVariable from '@/views/panel/products/NewVariable'
import Variation from '@/views/panel/products/Variation'
import CategoryView from '@/views/panel/products/CategoryView'
export default {
    components: {
        NewSimple,
        NewVariable,
        Variation,
        Table,
        CategoryView
    },
    data () {
        return {
            showing: 'grid',
            categorySelected: {
                text: 'همه دسته بندی ها',
                id: []
            },
            categories: null,
            currentTab: 'first'
        }
    },
    created () {
        this.$store.dispatch('category/getAllCategories').then(() => {
            this.categories = this.$store.getters['category/getAllCategories']
        })
    },
    methods: {
        search (values) {
            values = values.toLowerCase().split(' ')
            this.$store.commit('product/globalSearch', values)
        },
        addNewProduct (type) {
            this.newProduct.type = type
        },
        undoNewProduct () {
            this.$store.commit('product/resetForm')
        },
        changeTabs (tab) {
            this.currentTab = tab
        },
        handleCategoryValues (id) {
            if (this.categorySelected.id.indexOf(id) === -1) {
                this.categorySelected.id.push(id)
            } else {
                this.categorySelected.id = this.categorySelected.id.filter((value) => {
                    return value !== id
                })
            }
        },
        createNewProduct () {
            this.$store.dispatch('product/createNewProduct').then(createProduct => {
                if (createProduct.type === 'simple') {
                    this.$store.commit('product/setNewProduct', createProduct)
                }
                if (createProduct.success) {
                    setTimeout(() => {
                        this.$store.dispatch('product/getOneProduct', createProduct.data.id)
                    }, 2000)
                }
            }).catch(err => console.log(err))
        },
        removeGlobalSearch () {
            this.globalSearch.values = null
        },
        deleteProduct () {
            this.$bvModal.msgBoxConfirm('مطمئنی میخوای این محصول رو حذف کنی؟', {
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
            })
                .then(response => {
                    if (response) {
                        this.$store.dispatch('product/deleteProduct')
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
    },
    computed: {
        allCategories () {
            return this.categories
        },
        selectedCategories () {
            return this.$store.getters['product/getGlobalSearch']
        },
        ...mapState({
            newProduct: state => state.product.newProduct,
            globalSearch: state => state.product.globalSearch,
            table: state => state.product.table
        })
    }
}
</script>

<style>

</style>
