<template>
    <div class="onp-panel">
        <b-row>
            <b-col col sm="12" md="2" class="onp-panel-sidebar">
                <b-nav vertical class="p-0 mt-2 text-right">

                    <b-link class="onp-panel-main-link d-block">
                        <router-link class="d-block p-3 mb-3 text-white border-bottom text-right" to="/panel"> پنل مدیریت</router-link>
                    </b-link>

                    <b-nav-item to ="/panel">
                            داشبورد
                    </b-nav-item>

                    <b-nav-item v-b-toggle.onp-panel-product-toggle>
                            محصولات
                        <b-icon-chevron-left class="float-left"></b-icon-chevron-left>
                    </b-nav-item>
                    <b-collapse id="onp-panel-product-toggle">
                        <b-nav vertical class="pr-3">
                            <b-nav-item to="/panel/products">محصولات</b-nav-item>
                            <b-nav-item to="/panel/products/sync">همگام سازی</b-nav-item>
                        </b-nav>
                    </b-collapse>

                    <b-nav-item v-b-toggle.onp-panel-categories-toggle>
                        دسته بندی ها
                        <b-icon-chevron-left class="float-left"></b-icon-chevron-left>
                    </b-nav-item>
                    <b-collapse id="onp-panel-categories-toggle">
                        <b-nav vertical class="pr-3">
                            <b-nav-item to="/panel/categories">دسته بندی ها</b-nav-item>
                            <b-nav-item to="/panel/categories/sync">همگام سازی</b-nav-item>
                        </b-nav>
                    </b-collapse>

                    <b-nav-item to="/panel/stations">
                        صندوق ها
                    </b-nav-item>

                    <b-nav-item to="/">
                            سفارشات
                    </b-nav-item>

                    <b-nav-item to="/">
                            کاربران
                    </b-nav-item>
                </b-nav>
            </b-col>
            <b-col col sm="12" md="10" class="onp-panel-navbar">
                <b-navbar toggleable="lg" type="light" variant="light">
                    <b-navbar-brand href="#">آنلاین نو پوز</b-navbar-brand>

                    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

                    <b-collapse id="nav-collapse" is-nav>
                        <!-- Right aligned nav items -->
                        <b-navbar-nav class="mr-auto">
                            <b-nav-form>
                                <b-form-input size="sm"></b-form-input>
                                <b-button size="sm" class="my-2 my-sm-0 ml-sm-2" type="submit">جستجو</b-button>
                            </b-nav-form>

                            <b-nav-item-dropdown left>
                                <!-- Using 'button-content' slot -->
                                <template v-slot:button-content>
                                    <em>کاربر</em>
                                </template>
                                <b-dropdown-item href="#">پروفایل</b-dropdown-item>
                                <b-dropdown-item href="#">خروج</b-dropdown-item>
                            </b-nav-item-dropdown>
                        </b-navbar-nav>
                    </b-collapse>
                </b-navbar>
                <b-row class="mt-3">
                    <b-col>
                        <router-view></router-view>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
    </div>
</template>

<script>

</script>

<style>
    /* panel */
    .onp-panel{
        direction: rtl;
    }
    /* panel - sidbar */
    .onp-panel-sidebar{
        background-color: #343a40;
        box-shadow: 0 14px 28px rgba(0,0,0,.25), 0 10px 10px rgba(0,0,0,.22);
        min-height: 100vh;
    }
    .onp-panel-sidebar .nav{

    }
    .onp-panel-sidebar .nav .nav-item:hover a{
        background-color: rgba(255,255,255,.1);
        border-radius: 5px;
        color: #fff;
    }
    .onp-panel-sidebar .nav .nav-item a{
        width: 100%;
        color: #c2c7d0;
        padding-left: 0;
        display: flex;
        align-items: center;
        position: relative;
        text-decoration: none;
    }
    .onp-panel-sidebar .nav .nav-item a.active{
        background-color: #007bff;
        border-radius: 5px;
        color: #fff;
    }
    .onp-panel-sidebar .nav .nav-item svg{
        font-size: 80%;
        margin-left: 5px;
        position: absolute;
        left: 0;
    }
    .onp-panel-sidebar .nav .nav-item.collapsed svg{
        transform: rotateZ(0deg);
        transition: transform .5s;
    }
    .onp-panel-sidebar .nav .nav-item.not-collapsed svg{
        transform: rotateZ(-90deg);
        transition: transform .5s;
    }
    /* panel - sidebar - main link*/
    .onp-panel-main-link{

    }
    /* panel - navbar */
    .onp-panel-navbar{
        text-align: left;
    }
    .onp-panel-navbar .navbar{
        box-shadow: 0 0 1px rgba(0,0,0,.125), 0 1px 3px rgba(0,0,0,.2);
        border-radius: 5px;
    }
    /* panel - dashboard */
    .onp-panel-dash-widget{
        position: relative;
        text-align: right;
        font-family: "Shabnam", Sans-Serif;
    }
    .onp-panel-dash-widget svg{
        position: absolute;
        left: 0;
        margin-left: 5%;
        font-size: 3.5rem;
        color: rgba(0,0,0,.15);
    }
    .onp-panel-dash-widget .card-footer a{
        color: #c2c7d0;
        text-decoration: none;
    }
    .onp-panel-dash-widget .card-footer a:hover{
        color: #fff
    }
</style>
