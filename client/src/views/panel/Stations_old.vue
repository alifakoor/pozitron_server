<template>
    <b-card
        header="صندوق ها"
        align="right"
    >
        <router-link :to='stationUrl' target="_blank">
            <b-button type="button" variant="primary">
                ایجاد صندوق
            </b-button>
        </router-link>
    </b-card>
</template>

<script>
export default {
    data () {
        return {
            stationUrl: null
        }
    },
    mounted () {
        this.stationUrl = `/station/${this.$store.state.auth.user.username}`
    },
    methods: {
        onClick () {
            console.log('hi')
        }
    }
}
</script>

<style>

</style>
