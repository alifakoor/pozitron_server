<template>
    <div>
        <b-form-group v-for="category in categories" :key="category.id">
            <template #label>
                <div class="d-flex justify-content-end">
                    <label :for="`checkbox-` + category.id" class="mr-1 mb-0">{{ category.name }}</label>
                    <b-form-checkbox
                        v-model="terms"
                        :value="category.id"
                        :id="parent + `-checkbox-` + category.id"
                        @change="handleValues(category.id)"
                    >
                    </b-form-checkbox>
                </div>
            </template>
            <template v-if="category.children.length">
                <CategoryView
                    :categories="category.children"
                    :handle-values="handleValues"
                    :parent="parent"
                    class="mr-3"></CategoryView>
            </template>
        </b-form-group>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'CategoryView',
    props: {
        handleValues: Function,
        productCategories: Array,
        categories: Array,
        parent: String
    },
    data () {
        return {
            selected: []
        }
    },
    beforeCreate () {
        this.selected = this.terms
    },
    computed: {
        ...mapState({
            terms (state) {
                if (state.product.newProduct.type !== null) {
                    if (state.product.newProduct.type === 'editSimple') {
                        return state.product.newProduct.simple.categories
                    }
                    if (state.product.newProduct.type === 'editVariable') {
                        return state.product.newProduct.variable.categories
                    }
                }
                return null
            }
        })
    }
}
</script>

<style scoped>

</style>
