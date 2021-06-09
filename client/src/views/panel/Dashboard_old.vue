<template>
    <b-card-group deck>
        <b-card bg-variant="primary" text-variant="white" class="onp-panel-dash-widget">
            <b-icon icon="person-fill"></b-icon>
            <h3>150</h3>
            <b-card-text>
                کاربران ثبت شده
            </b-card-text>
            <template v-slot:footer>
                <router-link to="/more_information">اطلاعات بیشتر</router-link>
            </template>
        </b-card>

        <b-card bg-variant="secondary" text-variant="white" class="onp-panel-dash-widget">
            <b-icon icon="person-fill"></b-icon>
            <h3>150</h3>
            <b-card-text>
                محصولات ثبت شده
            </b-card-text>
            <template v-slot:footer>
                <router-link to="/more_information">اطلاعات بیشتر</router-link>
            </template>
        </b-card>

        <b-card bg-variant="success" text-variant="white" class="onp-panel-dash-widget">
            <b-icon icon="person-fill"></b-icon>
            <h3>150</h3>
            <b-card-text>
                سفارشات ثبت شده
            </b-card-text>
            <template v-slot:footer>
                <router-link to="/more_information">اطلاعات بیشتر</router-link>
            </template>
        </b-card>
    </b-card-group>
</template>

<script>

</script>

<style>

</style>
