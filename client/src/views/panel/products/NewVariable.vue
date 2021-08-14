<template>
    <div class="_new-product variable">
        <div
            v-if="currentTab === 'first'"
            class="_tab-first"
        >
            <b-row class="mt-3 mb-2">
                <b-col md="4 pl-0">
                    <div class="__images">
                        <div
                            v-for="(img, index) in form.images"
                            :key="index"
                            class="__img"
                        >
                            <b-img
                                :src="config.api.server + img.url"
                                @mousedown="showConfirmBox(img.url)"
                                @mouseup="clearTimeForModal"
                                @click="showImageInIndexBox(img)"
                                :class="(form.big_image.url === img.url) ? '__big-img' : ''"
                                fluid
                            ></b-img>
                        </div>
                        <div
                            v-if="form.images.length"
                            class="__img"
                        >
                            <b-icon icon="plus-square" @click="$refs.file.$el.click()"></b-icon>
                        </div>
                    </div>
                </b-col>
                <b-col md="8">
                    <div
                        v-if="form.images.length"
                        class="__index-img"
                    >
                        <b-img
                            :src="config.api.server + form.big_image.url"
                            fluid
                        ></b-img>
                        <b-icon
                            :variant="(form.big_image.url === form.index_image.url) ? 'danger' : ''"
                            @click="changeIndexImage(form.big_image)"
                            icon="bookmark-star"
                        ></b-icon>
                    </div>
                    <div
                        v-if="!form.images.length"
                        class="__add-img"
                    >
                        <b-icon icon="plus-square" @click="$refs.file.$el.click()"></b-icon>
                        <b-icon icon="image"></b-icon>
                    </div>
                    <b-form-file
                        v-model="form.images.file"
                        class="mt-3 d-none"
                        ref="file"
                        accept=".jpg, .png, .jpeg"
                        plain
                        @change="uploadImg($event)"
                    ></b-form-file>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <b-form-group
                        id="fieldset-barcode"
                        label-cols="4"
                        content-cols="8"
                        label-size="sm"
                        label-align="right"
                        label="شناسه:"
                        label-for="input-barcode"
                        class="mb-1"
                    >
                        <b-form-input id="input-barcode" v-model="form.barcode"></b-form-input>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <b-form-group
                        id="fieldset-name"
                        label-cols="4"
                        content-cols="8"
                        label-size="sm"
                        label-align="right"
                        label="نام:"
                        label-for="input-name"
                        class="mb-1"
                    >
                        <b-form-input id="input-name" v-model="form.name"></b-form-input>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <b-form-group
                        id="fieldset-variation"
                        label-cols="4"
                        content-cols="8"
                        label-size="sm"
                        label-align="right"
                        label="متغیر:"
                        label-for="input-price"
                        class="mb-1"
                    >
                        <b-form-select
                            v-model="attributes.selected"
                            :options="attributes.options"
                            plain
                        ></b-form-select>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col md="2" class="pl-0">
                    <div class="__table-variations-actions">
                        <label class="col-form-label-sm">تنوعها:</label>
                        <b-icon
                            icon="plus-square"
                            @click="addNewVariations()"
                        ></b-icon>
                        <b-icon
                            icon="x-square"
                            variant="danger"
                            @click="removeSelectedVariations()"
                        ></b-icon>
                    </div>
                </b-col>
                <b-col md="10">
                    <div class="__table-variations">
                        <b-table
                            :items="form.variations.items"
                            :fields="form.variations.fields"
                            small
                            striped
                            hover
                        >
                            <template #head(select)="">
                                <b-form-checkbox
                                    switch
                                    v-model="selectedAllVariations"
                                    @input="toggleAllChildrenSelected"
                                ></b-form-checkbox>
                            </template>
                            <template #cell(select)="data">
                                <b-form-checkbox
                                    switch
                                    v-model="data.item.selected_for_remove"
                                ></b-form-checkbox>
                            </template>
                            <template #cell(variation)="data">
                                <b-form-select
                                    v-model="data.item.selected"
                                    :options="data.item.options"
                                    @input="attributeSelectForVariation(data.item.barcode)"
                                    size="sm"
                                    plain
                                ></b-form-select>
                            </template>
                        </b-table>
                    </div>
                </b-col>
            </b-row>
        </div>
        <div
            v-if="currentTab === 'second'"
            class="_tab-second"
        >
            <b-row class="mt-3">
                <b-col>
                    <b-form-group
                        label-cols="4"
                        content-cols="8"
                        label-size="sm"
                        label-align="right"
                        label-for="input-discount"
                        class="mb-1"
                    >
                        <b-row>
                            <b-col></b-col>
                            <b-col md="6" class="pr-0">
                                <b-form-input
                                    id="input-online-stock"
                                    placeholder="% لینک"
                                    v-model="form.permalink"
                                ></b-form-input>
                            </b-col>
                        </b-row>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <b-form-group
                        id="online-tab-desc"
                        label="توضیح کوتاه:"
                        label-size="sm"
                        label-align="right"
                        label-for="online-desc"
                    >
                        <b-form-textarea
                            id="online-desc"
                            rows="16"
                            trim
                            no-resize
                            v-model="form.description"
                        ></b-form-textarea>
                    </b-form-group>
                </b-col>
            </b-row>
        </div>
        <div
            v-if="currentTab === 'third'"
            class="_tab-third"
        >
            <b-row class="mt-3">
                <b-col class="h-100">
                    <b-card
                        header="دسته بندی ها"
                        header-tag="header"
                        header-border-variant="white"
                        header-text-variant="white"
                        align="right"
                    >
                        <div
                            class="__categories"
                        >
                            <b-row>
                                <b-col>
                                    <CategoryView
                                        :categories="allCategories"
                                        :product-categories="form.categories"
                                        :handle-values="handleCategoryValues"
                                        parent="newSimple"
                                    ></CategoryView>
                                </b-col>
                            </b-row>
                        </div>
                    </b-card>
                </b-col>
            </b-row>
            <b-row class="mt-3 mb-3">
                <b-col>
                    <b-card
                        class="__tags"
                        header="برچسب ها"
                        header-tag="header"
                        header-border-variant="white"
                        header-text-variant="white"
                        align="right"
                    >
                        <b-form-tags
                            input-id="tags-pills"
                            v-model="form.tags"
                            tag-variant="success"
                            remove-on-delete
                            placeholder="برچسب را بنویسید و Enter را بزنید."
                            duplicateTagText="این برچسب را قبلا اضافه کرده اید."
                        ></b-form-tags>
                    </b-card>
                </b-col>
            </b-row>
        </div>
    </div>
</template>

<script>
import config from '@/config'
import { mapState } from 'vuex'
import CategoryView from '@/views/panel/products/CategoryView'
export default {
    name: 'NewVariable',
    props: {
        currentTab: String
    },
    components: {
        CategoryView
    },
    data () {
        return {
            config: config,
            images: {
                file: null
            },
            timesForModal: null,
            selectedAllVariations: false
        }
    },
    methods: {
        uploadImg (e) {
            const formData = new FormData()
            formData.append('fileToUpload', e.target.files[0])
            this.$store.dispatch('product/uploadImg', formData)
        },
        handleCategoryValues (id) {
            if (this.form.categories.indexOf(id) === -1) {
                this.form.categories.push(id)
            } else {
                this.form.categories = this.form.categories.filter((value) => {
                    return value !== id
                })
            }
        },
        addNewVariations () {
            if (!this.form.barcode || !this.attributes.selected) {
                this.$bvToast.toast('بارکد یا متغیر نامشخص است.', {
                    title: 'هشدار',
                    variant: 'danger',
                    solid: true
                })
                return
            }
            const selectedAtt = this.attributes.options.find(option => option.value === this.attributes.selected)
            this.form.attributes.name = selectedAtt.text
            this.form.attributes.value = selectedAtt.value
            const variation = {
                barcode: this.form.barcode + '0' + (this.form.variations.items.length + 1),
                stock: {
                    value: 0,
                    selected: 'number',
                    options: [
                        { text: '∞', value: 'infinity' },
                        { text: 'عـدد', value: 'number' }
                    ]
                },
                discount: {
                    value: 0,
                    selected: 'cash',
                    options: [
                        { text: '%', value: 'percent' },
                        { text: 'هـ.ت', value: 'cash' }
                    ]
                },
                size: {
                    length: null,
                    width: null,
                    height: null
                },
                online_discount: {
                    value: 0,
                    selected: 'cash',
                    options: [
                        { text: '%', value: 'percent' },
                        { text: 'هـ.ت', value: 'cash' }
                    ]
                },
                options: selectedAtt.items,
                selected: null,
                created_before: false
            }
            this.form.variations.items.push(variation)
        },
        attributeSelectForVariation () {
            this.form.attributes.options = []
            this.form.variations.items.forEach((item) => {
                const optionSelected = item.options.find((option) => {
                    return option.value === item.selected
                })
                this.form.attributes.options.push(optionSelected.text)
            })
        },
        showConfirmBox (url) {
            const self = this
            self.timesForModal = setTimeout(() => {
                self.$bvModal.msgBoxConfirm('آیا از حذف عکس مورد نظر مطمئن هستید؟', {
                    size: 'sm',
                    bodyClass: 'text-center',
                    buttonSize: 'lg',
                    okVariant: 'success',
                    okTitle: 'بله',
                    cancelTitle: 'خیر',
                    footerClass: 'p-2 justify-content-around',
                    centered: true
                })
                    .then(value => {
                        if (value) {
                            self.form.images = self.form.images.filter((image) => {
                                return image.url !== url
                            })
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }, 1000)
        },
        clearTimeForModal () {
            clearTimeout(this.timesForModal)
        },
        showImageInIndexBox (img) {
            this.form.big_image = img
        },
        changeIndexImage (img) {
            this.form.index_image = img
        },
        removeSelectedVariations () {
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
            }).then(response => {
                if (response) {
                    const barcodes = []
                    this.form.variations.items.map(item => {
                        if (item.selected_for_remove) {
                            barcodes.push(item.barcode)
                        }
                    })
                    this.form.variations.items = this.form.variations.items.filter(item => {
                        return !barcodes.includes(item.barcode)
                    })
                    this.$store.dispatch('product/deleteProductVariation', barcodes)
                }
            }).catch(err => {
                console.log(err)
            })
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
        },
        toggleAllChildrenSelected (value) {
            this.form.variations.items.map(item => {
                item.selected_for_remove = value
            })
        }
    },
    computed: {
        getUploadedImages () {
            return this.$store.getters['product/getUploaded']
        },
        allCategories () {
            return this.$store.getters['category/getAllCategories']
        },
        ...mapState({
            form: state => state.product.newProduct.variable,
            attributes: state => state.product.attributes
        })
    },
    watch: {
        form (newValue, oldValue) {
            if (newValue.barcode !== oldValue.barcode) this.selectedAllVariations = false
        }
    }
}
</script>

<style scoped>

</style>
