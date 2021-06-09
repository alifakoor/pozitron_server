<template>
    <b-card
        header="همگام سازی دسته بندی ها"
        align="right"
    >
        <b-form @submit="onSubmit">
            <b-button type="submit" variant="primary">همگام سازی</b-button>
        </b-form>
    </b-card>
</template>

<script>
export default {
    data () {
        return {
            loading: false
        }
    },
    methods: {
        onSubmit (e) {
            e.preventDefault()
            this.$store.dispatch('category/syncCategories').then(
                res => {
                    console.log(res.data)
                    this.$router.push('/panel/categories')
                }
            ).catch((err) => { console.log(err) })
        }
    }
}
</script>

<style>

</style>
