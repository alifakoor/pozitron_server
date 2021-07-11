<template>
    <div class="onp-settings">
        <b-row class="mt-3">
            <b-col>
                <b-card
                    border-variant="properties"
                    header="مشخصات فردی"
                    header-border-variant="properties"
                    align="right"
                >
                    <b-row>
                        <b-col>
                            <span class="font-weight-bold">نام و نام‌خانوادگی:</span>
                        </b-col>
                        <b-col>
                            <b-form-input type="text" v-model="user.fullname"></b-form-input>
                        </b-col>
                    </b-row>
                    <b-row class="mt-3">
                        <b-col>
                            <span class="font-weight-bold">نام کاربری:</span>
                        </b-col>
                        <b-col>
                            <b-form-input type="text" v-model="user.username"></b-form-input>
                        </b-col>
                    </b-row>
                    <b-row class="mt-3">
                        <b-col>
                            <span class="font-weight-bold">شماره تلفن:</span>
                        </b-col>
                        <b-col>
                            <b-form-input type="text" v-model="user.phone"></b-form-input>
                        </b-col>
                    </b-row>
                    <b-row class="mt-3">
                        <b-col>
                            <span class="font-weight-bold">ایمیل:</span>
                        </b-col>
                        <b-col>
                            <b-form-input type="text" v-model="user.email"></b-form-input>
                        </b-col>
                    </b-row>
                    <b-row class="mt-3">
                        <b-col>
                            <b-button variant="primary">ذخیره</b-button>
                        </b-col>
                    </b-row>
                </b-card>
            </b-col>
            <b-col>
                <b-card
                    border-variant="api_keys"
                    header="مشخصات وب سایت"
                    header-border-variant="api_keys"
                    align="right"
                >
                    <b-row>
                        <b-col md="3">
                            <span class="font-weight-bold">آدرس سایت:</span>
                        </b-col>
                        <b-col md="9">
                            <b-form-input type="text" v-model="userWebsite._address" placeholder="بدون //:http و .www"></b-form-input>
                        </b-col>
                    </b-row>
                    <b-row class="mt-3">
                        <b-col md="3">
                            <span class="font-weight-bold">کلید مصرف‌کننده:</span>
                        </b-col>
                        <b-col md="9">
                            <b-form-input type="text" v-model="userWebsite._consumer_key" placeholder="public key"></b-form-input>
                        </b-col>
                    </b-row>
                    <b-row class="mt-3">
                        <b-col md="3">
                            <span class="font-weight-bold">رمز مصرف‌کننده:</span>
                        </b-col>
                        <b-col md="9">
                            <b-form-input type="text" v-model="userWebsite._consumer_secret" placeholder="private key"></b-form-input>
                        </b-col>
                    </b-row>
                    <b-row class="mt-3">
                        <b-col>
                            <b-button variant="primary" @click="saveUserWebsiteData">ذخیره</b-button>
                        </b-col>
                    </b-row>
                </b-card>
            </b-col>
        </b-row>
        <b-row class="mt-3">
            <b-col>
                <b-overlay :show="loading">
                    <b-card
                        border-variant="sync"
                        header="همگام‌سازی"
                        header-border-variant="sync"
                        align="center"
                    >
                        <b-row>
                            <b-col>
                                <b-button variant="primary" @click="sync">شروع کن</b-button>
                            </b-col>
                        </b-row>
                    </b-card>
                </b-overlay>
            </b-col>
        </b-row>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'Settings',
    data () {
        return {
            loading: false
        }
    },
    beforeMount () {
        this.$store.dispatch('settings/getUserWebsiteData', this.user.id)
    },
    methods: {
        saveUserWebsiteData () {
            this.$store.dispatch('settings/setUserWebsiteData', this.userWebsite)
        },
        async sync () {
            await this.$store.dispatch('settings/syncCategories')
            await this.$store.dispatch('settings/syncProducts')
            await this.$store.dispatch('settings/syncProductVariations')
            await this.$store.dispatch('settings/syncOrders')
        }
    },
    computed: {
        ...mapState({
            user: state => state.auth.user,
            userWebsite: state => state.settings.userWebsite
        })
    }
}
</script>

<style scoped>

</style>
