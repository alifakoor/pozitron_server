<template>
    <div class="_new-product simple">
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
                        >
                        </b-img>
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
                        v-model="images.file"
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
                        id="fieldset-sku"
                        label-cols="4"
                        content-cols="8"
                        label-size="sm"
                        label-align="right"
                        label="شناسه محصول:"
                        label-for="input-sku"
                        class="mb-1"
                    >
                        <b-form-input id="input-sku" v-model="form.sku"></b-form-input>
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
                        id="fieldset-price"
                        label-cols="4"
                        content-cols="8"
                        label-size="sm"
                        label-align="right"
                        label="قیمت(تومان):"
                        label-for="input-price"
                        class="mb-1"
                    >
                        <b-form-input id="input-price" v-model="form.price" :formatter="toEnglish"></b-form-input>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <b-form-group
                        id="fieldset-discount"
                        label-cols="4"
                        content-cols="8"
                        label-size="sm"
                        label-align="right"
                        label="تخفیف:"
                        label-for="input-discount"
                        class="mb-1"
                    >
                        <b-row>
                            <b-col md="6">
                                <b-form-input id="input-discount" v-model="form.discount.value" :formatter="toEnglish"></b-form-input>
                            </b-col>
                            <b-col md="6">
                                <b-form-group v-slot="{ ariaDescribedby }" class="onp-ltr m-0">
                                    <b-form-radio-group
                                        v-model="form.discount.selected"
                                        :options="form.discount.options"
                                        :aria-describedby="ariaDescribedby"
                                        name="radios-btn-default"
                                        button-variant="outline-secondary"
                                        buttons
                                    ></b-form-radio-group>
                                </b-form-group>
                            </b-col>
                        </b-row>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <b-form-group
                        id="fieldset-stock"
                        label-cols="4"
                        content-cols="8"
                        label-size="sm"
                        label-align="right"
                        label="موجودی:"
                        label-for="input-stock"
                        class="mb-1"
                    >
                        <b-row>
                            <b-col md="6">
                                <b-form-input
                                    id="input-stock"
                                    v-model="form.stock.value"
                                    :formatter="toEnglish"
                                    :disabled="(form.stock.selected === 'infinity')"
                                ></b-form-input>
                            </b-col>
                            <b-col md="6">
                                <b-form-group v-slot="{ ariaDescribedby }" class="onp-ltr m-0">
                                    <b-form-radio-group
                                        v-model="form.stock.selected"
                                        :options="form.stock.options"
                                        @input="checkInfinity($event)"
                                        :aria-describedby="ariaDescribedby"
                                        name="radios-btn-default"
                                        button-variant="outline-secondary"
                                        buttons
                                    ></b-form-radio-group>
                                </b-form-group>
                            </b-col>
                        </b-row>
                    </b-form-group>
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
                        label="بارکد:"
                        label-for="input-barcode"
                        class="mb-1"
                    >
                        <b-form-input id="input-barcode" v-model="form.sku"></b-form-input>
                    </b-form-group>
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
                        id="online-tab-size"
                        label-cols="4"
                        content-cols="8"
                        label-size="sm"
                        label-align="right"
                        label="ابعاد(واحد):"
                        label-for="input-length"
                        class="mb-1"
                    >
                        <b-row>
                            <b-col md="4" class="pr-0">
                                <b-form-input id="input-length" placeholder="طول" v-model="form.size.length" :formatter="toEnglish"></b-form-input>
                            </b-col>
                            <b-col md="4" class="pr-0">
                                <b-form-input id="input-width" placeholder="عرض" v-model="form.size.width" :formatter="toEnglish"></b-form-input>
                            </b-col>
                            <b-col md="4" class="pr-0">
                                <b-form-input id="input-height" placeholder="ارتفاع" v-model="form.size.height" :formatter="toEnglish"></b-form-input>
                            </b-col>
                        </b-row>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col md="6" class="pl-0">
                    <b-form-group
                        label-cols="6"
                        content-cols="6"
                        label-size="sm"
                        label-align="right"
                        label="وزن(واحد):"
                        label-for="input-discount"
                        class="mb-1"
                    >
                        <div class="mr-2">
                            <b-form-input id="input-discount" v-model="form.weight" :formatter="toEnglish"></b-form-input>
                        </div>
                    </b-form-group>
                </b-col>
                <b-col md="6">
                    <b-form-group
                        label-cols="4"
                        content-cols="8"
                        label-align="right"
                        label="فروش:"
                        label-for="input-discount"
                        class="mb-1"
                    >
                        <div class="d-flex justify-content-center">
                            <b-form-checkbox size="lg" v-model="form.online_sell" switch></b-form-checkbox>
                        </div>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <b-form-group
                        id="online-tab-price"
                        label-cols="4"
                        content-cols="8"
                        label-size="sm"
                        label-align="right"
                        label="قیمت آنلاین:"
                        label-for="input-sku"
                        class="mb-1"
                    >
                        <b-row>
                            <b-col class="pr-0">
                                <b-form-input id="input-online-price" v-model="form.online_price" :formatter="toEnglish"></b-form-input>
                            </b-col>
                        </b-row>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <b-form-group
                        id="online-tab-discount"
                        label-cols="4"
                        content-cols="8"
                        label-size="sm"
                        label-align="right"
                        label="تخفیف:"
                        label-for="input-discount"
                        class="mb-1"
                    >
                        <b-row>
                            <b-col md="6" class="pr-0">
                                <b-form-input id="input-online-discount" v-model="form.online_discount.value" :formatter="toEnglish"></b-form-input>
                            </b-col>
                            <b-col md="6">
                                <b-form-group v-slot="{ ariaDescribedby }" class="onp-ltr m-0">
                                    <b-form-radio-group
                                        v-model="form.online_discount.selected"
                                        :options="form.online_discount.options"
                                        :aria-describedby="ariaDescribedby"
                                        name="radios-btn-default"
                                        button-variant="outline-secondary"
                                        buttons
                                    ></b-form-radio-group>
                                </b-form-group>
                            </b-col>
                        </b-row>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <b-form-group
                        label-cols="4"
                        content-cols="8"
                        label-size="sm"
                        label-align="right"
                        label="آستانه ناموجودی:"
                        label-for="input-discount"
                        class="mb-1"
                    >
                        <b-row>
                            <b-col md="6" class="pr-0">
                                <b-form-input id="input-online-stock" v-model="form.online_stock" :formatter="toEnglish"></b-form-input>
                            </b-col>
                            <b-col md="6" class="pr-0">
                                <b-form-input id="input-online-stock" v-model="form.permalink" placeholder="% لینک"></b-form-input>
                            </b-col>
                        </b-row>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row class="mt-3">
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
                            v-model="form.description"
                            rows="8"
                            trim
                            no-resize
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
    name: 'NewSimple',
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
            timesForModal: null
        }
    },
    methods: {
        uploadImg (e) {
            const formData = new FormData()
            formData.append('fileToUpload', e.target.files[0])
            this.$store.dispatch('product/uploadImg', formData)
        },
        handleCategoryValues (id) {
            console.log(id, this.form.categories)
            if (this.form.categories.indexOf(id) === -1) {
                this.form.categories.push(id)
            } else {
                this.form.categories = this.form.categories.filter((value) => {
                    return value !== id
                })
            }
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
        checkInfinity (value) {
            if (value === 'infinity') {
                this.form.stock.value = 0
            }
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
            form: state => state.product.newProduct.simple
        })
    }
}
</script>

<style scoped>

</style>
