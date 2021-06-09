<template>
    <div class="onp-panel ali">
        <b-row>
            <b-col md="1" class="onp-panel-menu">
                <div class="onp-panel-menu_content">
                    <div class="onp-panel-menu_content-title">
                        <router-link to="/panel">
                            <p>Onlinenow</p>
                            <p>POS</p>
                        </router-link>
                    </div>
                    <div class="onp-panel-menu_content-ul">
                        <b-list-group>
                            <b-list-group-item :to="`/panel/station/` + currentUser.username">
                                <b-icon icon="bag-plus"></b-icon>
                                <p>فاکتور فروش</p>
                            </b-list-group-item>
                            <b-list-group-item :to="`/panel/products`">
                                <b-icon icon="view-list"></b-icon>
                                <p>محصولات</p>
                            </b-list-group-item>
                            <b-list-group-item :to="`/panel/invoices`">
                                <b-icon icon="journal-text"></b-icon>
                                <p>فاکتورها</p>
                            </b-list-group-item>
                            <b-list-group-item href="#foobar">
                                <b-icon icon="people"></b-icon>
                                <p>مشتریان</p>
                            </b-list-group-item>
                            <b-list-group-item :to="`/panel/settings`">
                                <b-icon icon="gear"></b-icon>
                                <p>تنظیمات</p>
                            </b-list-group-item>
                        </b-list-group>
                    </div>
                </div>
            </b-col>
            <b-col md="11">
                <router-view></router-view>
            </b-col>
        </b-row>
    </div>
</template>

<script>
export default {
    data () {
        return {

        }
    },
    computed: {
        currentUser () {
            return this.$store.getters['auth/currentUser']
        }
    }
}
</script>

<style>
@import "../../assets/css/panel.css";
</style>
