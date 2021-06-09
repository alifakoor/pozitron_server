<template>
    <div>
        <b-table
            hover
            outlined
            fixed
            :items="categories"
            :fields="fields"
            :head-variant="headVariant"
            :busy="isBusy"
            :current-page="currentPage"
            :per-page="perPage"
        >
            <template v-slot:table-busy>
                <div class="text-center text-danger my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong> گر صبر کنی ... </strong>
                </div>
            </template>
        </b-table>
        <b-row>
            <b-col>
                <b-pagination
                    first-number
                    last-number
                    v-model="currentPage"
                    :per-page="perPage"
                    :total-rows="totalRows"
                ></b-pagination>
            </b-col>
        </b-row>
    </div>
</template>

<script>
export default {
    data () {
        return {
            currentPage: 1,
            totalRows: 1,
            perPage: 10,
            headVariant: 'dark',
            isBusy: true,
            fields: [
                {
                    key: 'id',
                    label: 'شناسه'
                },
                {
                    key: 'name',
                    label: 'نام'
                },
                {
                    key: 'slug',
                    label: 'نامک'
                },
                {
                    key: 'count',
                    label: 'اعضا'
                },
                {
                    key: 'termId',
                    label: 'پدر'
                },
                {
                    key: 'actions',
                    label: 'عملیات'
                }
            ],
            categories: []
        }
    },
    mounted () {
        this.$store.dispatch('category/getAllCategories').then(
            (res) => {
                console.log(res.data)
                this.categories = Object.values(res.data)
                this.totalRows = res.data.length
                this.isBusy = false
            }
        ).catch((err) => { console.log(err) })
    }
}
</script>

<style>
    table,
    .pagination{
        font-family: "Shabnam", Sans-Serif !important;
        text-align: center;
    }
</style>
