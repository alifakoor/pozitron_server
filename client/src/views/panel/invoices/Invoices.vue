<template>
    <b-row>
        <b-col md="9" class="onp-panel-main invoices">
            <b-row>
                <b-col>
                    <b-row class="onp-panel-main_navbar">
                        <b-col md="2"
                               class="pl-0"
                        >
                            <div
                                :class="`_navbar-sale-invoice` + [ list.view.sale ? ' active':'']"
                                @click="changeViewToSale()"
                            >
                                <b-icon icon="box-arrow-up-right"></b-icon>
                                <span class="mr-1">
                                    فاکتور فروش
                                </span>
                            </div>
                        </b-col>
                        <b-col md="2"
                               class="pl-0"
                        >
                            <div
                                :class="`_navbar-buy-invoice` + [ list.view.buy ? ' active':'']"
                                @click="changeViewToBuy()"
                            >
                                <b-icon icon="box-arrow-in-down-left"></b-icon>
                                <span class="mr-1">
                                    فاکتور خرید
                                </span>
                            </div>
                        </b-col>
                        <b-col md="1">
                            <div class="_navbar-add-invoice">
                                <b-button
                                    variant="transparent"
                                    class="p-0"
                                >
                                    <b-icon icon="file-earmark-plus"></b-icon>
                                </b-button>
                            </div>
                        </b-col>
                        <b-col md="7">
                            <div class="onp-panel-main_navbar-search">
                                <b-input-group
                                    class="_navbar-search"
                                >
                                    <b-input-group-prepend>
                                        <b-button variant="outline-info">
                                            <b-icon icon="search"></b-icon>
                                        </b-button>
                                    </b-input-group-prepend>

                                    <b-form-input
                                        type="text"
                                        @keyup="search($event)"
                                    ></b-form-input>

                                </b-input-group>
                            </div>
                        </b-col>
                    </b-row>
                    <b-row class="onp-panel-main_invoices">
                        <b-col>
                            <div class="_invoices-table">
                                <b-icon icon="circle-fill" variant="warning" class="selected-all"></b-icon>
                                <b-icon icon="circle" variant="warning" class="selected-some"></b-icon>
                                <table class="table table-striped table-sm">
                                    <thead>
                                        <tr>
                                            <th
                                                class="__unsortable source"
                                            >
                                                <div
                                                    :class="`__unsortable-commander` + [colFilter.source.selected.length ? ' has-command':'']"
                                                    @click="showFilterForUnsortable('source')"
                                                >
                                                    <span
                                                        v-if="!colFilter.source.selected.length"
                                                    >مرجع</span>
                                                    <span
                                                        v-if="colFilter.source.selected.length"
                                                        class="__unsortable-filtered"
                                                    >
                                                        <b-icon v-if="colFilter.source.selected.includes('1')" icon="globe2"></b-icon>
                                                        <b-icon v-if="colFilter.source.selected.includes('0')" icon="shop"></b-icon>
                                                    </span>
                                                </div>
                                                <div v-if="colFilter.source.show">
                                                    <div class="onp-back-drop" @click="showFilterForUnsortable('source')"></div>
                                                    <div
                                                        class="__unsortable-options"
                                                    >
                                                        <b-form-group class="m-0">
                                                            <b-form-checkbox-group
                                                                v-model="colFilter.source.selected"
                                                                class="__unsortable-options-checkbox"
                                                            >
                                                                <b-row class="m-0 mb-1">
                                                                    <b-col md="8" class="p-0">
                                                                        <b-form-checkbox
                                                                            value="1"
                                                                        >
                                                                            آنلاین
                                                                        </b-form-checkbox>
                                                                    </b-col>
                                                                    <b-col md="4">
                                                                        <b-icon icon="globe2"></b-icon>
                                                                    </b-col>
                                                                </b-row>
                                                                <b-row class="m-0">
                                                                    <b-col md="8" class="p-0">
                                                                        <b-form-checkbox
                                                                            value="0"
                                                                        >
                                                                            حضوری
                                                                        </b-form-checkbox>
                                                                    </b-col>
                                                                    <b-col md="4">
                                                                        <b-icon icon="shop"></b-icon>
                                                                    </b-col>
                                                                </b-row>
                                                            </b-form-checkbox-group>
                                                        </b-form-group>
                                                    </div>
                                                </div>
                                            </th>
                                            <th
                                                class="__sortable"
                                            >
                                                <div
                                                    :class="`__sortable-commander` + [colFilter.id.value ? ' has-command':'']"
                                                    @mousedown="showFilterForSortable('id')"
                                                    @mouseleave="clearTimerForSortable()"
                                                    @mouseup="clearTimerForSortable()"
                                                    @click="changeSort('id')"
                                                >
                                                    <span
                                                        v-if="!colFilter.id.value"
                                                    >شماره فاکتور</span>
                                                    <span
                                                        v-if="colFilter.id.value"
                                                    >{{ colFilter.id.value }}</span>
                                                    <b-icon
                                                        v-if="sortables.value === 'id' && sortables.asc"
                                                        icon="caret-up-fill"
                                                    ></b-icon>
                                                    <b-icon
                                                        v-if="sortables.value === 'id' && !sortables.asc"
                                                        icon="caret-down-fill"
                                                    ></b-icon>
                                                </div>
                                                <div v-if="colFilter.id.show">
                                                    <div class="onp-back-drop" @click="hideFilterForSortable()"></div>
                                                    <div class="__sortable-input">
                                                        <input type="text" v-model="colFilter.id.value">
                                                    </div>
                                                </div>
                                            </th>
                                            <th
                                                class="__sortable"
                                            >
                                                <div
                                                    :class="`__sortable-commander` + [colFilter.name.value ? ' has-command':'']"
                                                    @mousedown="showFilterForSortable('name')"
                                                    @mouseleave="clearTimerForSortable()"
                                                    @mouseup="clearTimerForSortable()"
                                                    @click="changeSort('name')"
                                                >
                                                    <span
                                                        v-if="!colFilter.name.value"
                                                    >نام و نام خانوادگی</span>
                                                    <span
                                                        v-if="colFilter.name.value"
                                                    >{{ colFilter.name.value }}</span>
                                                    <b-icon
                                                        v-if="sortables.value === 'name' && sortables.asc"
                                                        icon="caret-up-fill"
                                                    ></b-icon>
                                                    <b-icon
                                                        v-if="sortables.value === 'name' && !sortables.asc"
                                                        icon="caret-down-fill"
                                                    ></b-icon>
                                                </div>
                                                <div v-if="colFilter.name.show">
                                                    <div class="onp-back-drop" @click="hideFilterForSortable()"></div>
                                                    <div class="__sortable-input">
                                                        <input type="text" v-model="colFilter.name.value">
                                                    </div>
                                                </div>
                                            </th>
                                            <th
                                                class="__sortable"
                                            >
                                                <div
                                                    :class="`__sortable-commander` + [colFilter.date.value ? ' has-command':'']"
                                                    @mousedown="showFilterForSortable('date')"
                                                    @mouseleave="clearTimerForSortable()"
                                                    @mouseup="clearTimerForSortable()"
                                                    @click="changeSort('date')"
                                                >
                                                    <span
                                                        v-if="!colFilter.date.value"
                                                    >تاریخ</span>
                                                    <b-icon
                                                        v-if="colFilter.date.value"
                                                        icon="x"
                                                        @click="clearDateRange('date')"
                                                    ></b-icon>
                                                    <span
                                                        v-if="colFilter.date.value"
                                                    >
                                                        {{ colFilter.date.value[0].month + '/' + colFilter.date.value[0].day }}
                                                        =>
                                                        {{ colFilter.date.value[1].month + '/' + colFilter.date.value[1].day }}
                                                    </span>
                                                    <b-icon
                                                        v-if="sortables.value === 'date' && sortables.asc"
                                                        icon="caret-up-fill"
                                                    ></b-icon>
                                                    <b-icon
                                                        v-if="sortables.value === 'date' && !sortables.asc"
                                                        icon="caret-down-fill"
                                                    ></b-icon>
                                                </div>
                                                <div v-if="colFilter.date.show">
                                                    <div class="onp-back-drop" @click="hideFilterForSortable()"></div>
                                                    <div class="__sortable-input">
                                                        <date-picker
                                                            v-model="colFilter.date.value"
                                                            :range=true
                                                            format=MM/DD
                                                            :editable=false
                                                        ></date-picker>
                                                    </div>
                                                </div>
                                            </th>
                                            <th
                                                class="__sortable"
                                            >
                                                <div
                                                    :class="`__sortable-commander` + [colFilter.price.value ? ' has-command':'']"
                                                    @mousedown="showFilterForSortable('price')"
                                                    @mouseleave="clearTimerForSortable()"
                                                    @mouseup="clearTimerForSortable()"
                                                    @click="changeSort('price')"
                                                >
                                                    <span
                                                        v-if="!colFilter.price.value"
                                                    >جمع کل</span>
                                                    <span
                                                        v-if="colFilter.price.value"
                                                    >{{ colFilter.price.value }}</span>
                                                    <b-icon
                                                        v-if="sortables.value === 'price' && sortables.asc"
                                                        icon="caret-up-fill"
                                                    ></b-icon>
                                                    <b-icon
                                                        v-if="sortables.value === 'price' && !sortables.asc"
                                                        icon="caret-down-fill"
                                                    ></b-icon>
                                                </div>
                                                <div v-if="colFilter.price.show">
                                                    <div class="onp-back-drop" @click="hideFilterForSortable()"></div>
                                                    <div class="__sortable-input">
                                                        <input type="text" v-model="colFilter.price.value">
                                                    </div>
                                                </div>
                                            </th>
                                            <th
                                                class="__unsortable status"
                                            >
                                                <div
                                                    :class="`__unsortable-commander` + [colFilter.status.selected.length ? ' has-command':'']"
                                                >
                                                    <span @click="showFilterForUnsortable('status')">وضعیت
                                                        <b-icon
                                                            v-if="colFilter.status.selected.length"
                                                            icon="filter"
                                                        ></b-icon>
                                                    </span>
                                                </div>
                                                <div v-if="colFilter.status.show">
                                                    <div class="onp-back-drop" @click="showFilterForUnsortable('status')"></div>
                                                    <div
                                                        class="__unsortable-options"
                                                    >
                                                        <b-form-group class="m-0">
                                                            <b-form-checkbox-group
                                                                v-model="colFilter.status.selected"
                                                                class="__unsortable-options-checkbox"
                                                            >
                                                                <b-row class="m-0 mb-1">
                                                                    <b-col class="p-0">
                                                                        <b-form-checkbox
                                                                            value="لغو شده"
                                                                        >
                                                                            لغو شده
                                                                        </b-form-checkbox>
                                                                    </b-col>
                                                                </b-row>
                                                                <b-row class="m-0 mb-1">
                                                                    <b-col class="p-0">
                                                                        <b-form-checkbox
                                                                            value="در انتظار پرداخت"
                                                                        >
                                                                            در انتظار پرداخت
                                                                        </b-form-checkbox>
                                                                    </b-col>
                                                                </b-row>
                                                                <b-row class="m-0 mb-1">
                                                                    <b-col class="p-0">
                                                                        <b-form-checkbox
                                                                            value="در حال انجام"
                                                                        >
                                                                            در حال انجام
                                                                        </b-form-checkbox>
                                                                    </b-col>
                                                                </b-row>
                                                                <b-row class="m-0 mb-1">
                                                                    <b-col class="p-0">
                                                                        <b-form-checkbox
                                                                            value="در حال ارسال"
                                                                        >
                                                                            در حال ارسال
                                                                        </b-form-checkbox>
                                                                    </b-col>
                                                                </b-row>
                                                                <b-row class="m-0">
                                                                    <b-col class="p-0">
                                                                        <b-form-checkbox
                                                                            value="تکمیل شده"
                                                                        >
                                                                            تکمیل شده
                                                                        </b-form-checkbox>
                                                                    </b-col>
                                                                </b-row>
                                                            </b-form-checkbox-group>
                                                        </b-form-group>
                                                    </div>
                                                </div>
                                            </th>
                                            <th
                                                class="__sortable delivery"
                                            >
                                                <div
                                                    :class="`__sortable-commander` + [(colFilter.delivery.value || colFilter.delivery.selected.length) ? ' has-command':'']"
                                                    @mousedown="showFilterForSortable('delivery')"
                                                    @mouseleave="clearTimerForSortable()"
                                                    @mouseup="clearTimerForSortable()"
                                                    @click="changeSort('delivery')"
                                                >
                                                    <span
                                                        v-if="!colFilter.delivery.value && !colFilter.delivery.selected.length"
                                                    >زمان ارسال</span>
                                                    <b-icon
                                                        v-if="colFilter.delivery.value"
                                                        icon="x"
                                                        @click="clearDateRange('delivery')"
                                                    ></b-icon>
                                                    <span
                                                        v-if="colFilter.delivery.value || colFilter.delivery.selected.length"
                                                    >
                                                        {{
                                                            (colFilter.delivery.value) ?
                                                            colFilter.delivery.value[0].month + '/' + colFilter.delivery.value[0].day + '=>' +
                                                            colFilter.delivery.value[1].month + '/' + colFilter.delivery.value[1].day : ''
                                                        }}
                                                        {{ colFilter.delivery.selected[0] }}
                                                        {{ colFilter.delivery.selected[1] }}
                                                    </span>
                                                    <b-icon
                                                        v-if="sortables.value === 'delivery' && sortables.asc"
                                                        icon="caret-up-fill"
                                                    ></b-icon>
                                                    <b-icon
                                                        v-if="sortables.value === 'delivery' && !sortables.asc"
                                                        icon="caret-down-fill"
                                                    ></b-icon>
                                                </div>
                                                <div v-if="colFilter.delivery.show">
                                                    <div class="onp-back-drop" @click="hideFilterForSortable()"></div>
                                                    <div class="__sortable-input">
                                                        <date-picker
                                                            v-model="colFilter.delivery.value"
                                                            :range=true
                                                            format=MM/DD
                                                            :editable=false
                                                        >
                                                        </date-picker>
                                                    </div>
                                                    <div class="__sortable-input range-time">
                                                        <b-form-group class="m-0">
                                                            <b-form-checkbox-group
                                                                v-model="colFilter.delivery.selected"
                                                                class="__sortable-options-checkbox"
                                                            >
                                                                <b-row class="m-0 mb-1">
                                                                    <b-col class="p-0">
                                                                        <b-form-checkbox
                                                                            value="9-12"
                                                                        >
                                                                            9 الی 12
                                                                        </b-form-checkbox>
                                                                    </b-col>
                                                                </b-row>
                                                                <b-row class="m-0">
                                                                    <b-col class="p-0">
                                                                        <b-form-checkbox
                                                                            value="15-18"
                                                                        >
                                                                            15 الی 18
                                                                        </b-form-checkbox>
                                                                    </b-col>
                                                                </b-row>
                                                            </b-form-checkbox-group>
                                                        </b-form-group>
                                                    </div>
                                                </div>
                                            </th>
                                            <th
                                                class="__unsortable"
                                            >
                                                <div
                                                    :class="`__unsortable-commander` + [colFilter.user.selected.length ? ' has-command':'']"
                                                >
                                                    <span @click="showFilterForUnsortable('user')">کاربر
                                                        <b-icon
                                                            v-if="colFilter.user.selected.length"
                                                            icon="filter"
                                                        ></b-icon>
                                                    </span>
                                                </div>
                                                <div v-if="colFilter.user.show">
                                                    <div class="onp-back-drop" @click="showFilterForUnsortable('user')"></div>
                                                    <div
                                                        class="__unsortable-options"
                                                    >
                                                        <b-form-group class="m-0">
                                                            <b-form-checkbox-group
                                                                v-model="colFilter.user.selected"
                                                                class="__unsortable-options-checkbox"
                                                            >
                                                                <b-row
                                                                    v-for="user in users"
                                                                    :key="user.id"
                                                                    class="m-0 mb-1"
                                                                >
                                                                    <b-col class="p-0">
                                                                        <b-form-checkbox
                                                                            :value="user.id"
                                                                        >
                                                                            {{ user.username }}
                                                                        </b-form-checkbox>
                                                                    </b-col>
                                                                </b-row>
                                                            </b-form-checkbox-group>
                                                        </b-form-group>
                                                    </div>
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr
                                            v-for="invoice in allInvoices"
                                            :key="invoice.id"
                                            class="_invoices-table-row"
                                            @click="loadInvoice(invoice)"
                                        >
                                            <td>
                                                <b-icon v-if="invoice.source" icon="globe2"></b-icon>
                                                <b-icon v-if="!invoice.source" icon="shop"></b-icon>
                                            </td>
                                            <td>{{ invoice.id }}</td>
                                            <td>{{ (invoice.customer) ? invoice.customer.fullname : 'نامشخص' }}</td>
                                            <td>{{ invoice.createdAt | moment('jYY/jMM/jDD')}}</td>
                                            <td>{{ invoice.total_price.toLocaleString()}}</td>
                                            <td>
                                                <b-badge :variant="(invoice.status === 'completed')?'success':'warning'">
                                                    {{ invoice.status | translateStatus }}
                                                </b-badge>
                                            </td>
                                            <td>{{ (invoice.order_meta._delivery) ? (invoice.order_meta._delivery) : '-' }}</td>
                                            <td>{{ invoice.user.username }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
        </b-col>
        <b-col md="3" class="onp-panel-detail invoices">
            <b-row
                v-if="currentInvoice && !selectedList.length"
                class="_current-invoice"
            >
                <div class="_current-invoice-title">
                    <span>شماره فاکتور: </span>
                    <span>{{ currentInvoice.id }} - {{ currentInvoice.status }}</span>
                    <span>{{ (currentInvoice.customer) ? currentInvoice.customer.fullname : 'نامشخص' }}</span>
                </div>
                <div class="_current-invoice-content">
                    <b-row class="_current-invoice-content__items">
                        <b-col>
                            <b-row class="__items items">
                                <div
                                    v-for="item in currentInvoice.items"
                                    :key="item.id"
                                >
                                    <b-col md="5" class="p-0 text-right">
                                        <p>{{ item.title }}</p>
                                    </b-col>
                                    <b-col md="2">
                                        <p>{{ item.order_items.count }}</p>
                                    </b-col>
                                    <b-col md="5" class="p-0">
                                        <p :class="`m-0` + [JSON.parse(item.order_items.discount).amount !== 0 ? ' has-discount text-danger' : '']">
                                            {{ item.order_items.price.toLocaleString() }} تومان
                                        </p>
                                        <p v-if="JSON.parse(item.order_items.discount).amount !== 0">
                                            {{ ((JSON.parse(item.order_items.discount).type === 'percent') ? ((item.order_items.price - (JSON.parse(item.order_items.discount).amount / 100) * item.order_items.price)) : (item.order_items.price - (JSON.parse(item.order_items.discount).amount * 1000 ))).toLocaleString()
                                            }} تومان
                                        </p>
                                    </b-col>
                                </div>
                            </b-row>
                            <b-row class="__items pluses">
                                <div class="pluses-addition">
                                    <b-col class="text-right p-0">
                                        <p>اضافات: </p>
                                    </b-col>
                                    <b-col class="p-0">
                                        <p>{{ Number(currentInvoice.order_meta._addition).toLocaleString() }} تومان</p>
                                    </b-col>
                                </div>
                                <div class="pluses-discount">
                                    <b-col class="text-right p-0">
                                        <p>تخفیف ها: </p>
                                    </b-col>
                                    <b-col class="text-danger p-0">
                                        <p>{{ Number(currentInvoice.order_meta._discount).toLocaleString() }} تومان</p>
                                    </b-col>
                                </div>
                                <div class="pluses-shipping">
                                    <b-col class="text-right p-0">
                                        <p>حمل و نقل: </p>
                                    </b-col>
                                    <b-col class="p-0">
                                        <p>{{ Number(currentInvoice.order_meta._shipping).toLocaleString() }} تومان</p>
                                    </b-col>
                                </div>
                            </b-row>
                            <b-row class="__items total">
                                <div>
                                <b-col class="text-right p-0">
                                    <p class="m-0">جمع کل: </p>
                                </b-col>
                                <b-col class="p-0">
                                    <p class="m-0">{{ totalPrice }} تومان</p>
                                </b-col>
                                </div>
                            </b-row>
                        </b-col>
                    </b-row>
                    <b-row class="_current-invoice-content__details text-right">
                        <b-col class="p-0">
                            <b-row class="__details phone">
                                <b-col md="4" class="p-0">
                                    <p>شماره موبایل: </p>
                                </b-col>
                                <b-col md="8" class="p-0">
                                    <p>{{ (currentInvoice.customer) ? currentInvoice.customer.phone : 'نامشخص' }}</p>
                                </b-col>
                            </b-row>
                            <b-row class="__details created_date">
                                <b-col md="4" class="p-0">
                                    <p>تاریخ فاکتور: </p>
                                </b-col>
                                <b-col md="8" class="p-0">
                                    <p>{{ currentInvoice.createdAt | moment('jYY/jMM/jDD')}}</p>
                                </b-col>
                            </b-row>
                            <b-row class="__details delivery">
                                <b-col md="4" class="p-0">
                                    <p>تاریخ ارسال: </p>
                                </b-col>
                                <b-col md="8" class="p-0">
                                    <date-picker
                                        v-model="testTime"
                                        :placeholder="testTime"
                                    ></date-picker>
                                </b-col>
                            </b-row>
                            <b-row class="__details address">
                                <b-col md="4" class="p-0">
                                    <p>آدرس: </p>
                                </b-col>
                                <b-col md="8" class="p-0">
                                    <p contenteditable="true"></p>
                                </b-col>
                            </b-row>
                            <b-row class="__details description">
                                <b-col md="4" class="p-0">
                                    <p>توضیحات: </p>
                                </b-col>
                                <b-col md="8" class="p-0">
                                    <p contenteditable="true"></p>
                                </b-col>
                            </b-row>
                        </b-col>
                    </b-row>
                </div>
                <div class="_current-invoice-actions">
                    <b-row>
                        <b-col>
                            <b-button
                                variant="light"
                                class="w-100"
                                @click="showStatesForCurrent()"
                            >
                                <b-icon icon="ui-checks-grid"></b-icon>
                            </b-button>
                            <div v-if="current.states.show">
                                <div class="onp-back-drop" @click="showStatesForCurrent()"></div>
                                <div class="__states">
                                    <div class="__states-content">
                                        <b-form-group class="m-0">
                                            <b-row class="m-0 mb-1">
                                                <b-col class="p-0">
                                                    <b-form-radio v-model="current.states.selected" name="__states-content-radios" value="لغو شده">لغو شده</b-form-radio>
                                                </b-col>
                                            </b-row>
                                            <b-row class="m-0 mb-1">
                                                <b-col class="p-0">
                                                    <b-form-radio v-model="current.states.selected" name="__states-content-radios" value="در انتظار پرداخت">در انتظار پرداخت</b-form-radio>
                                                </b-col>
                                            </b-row>
                                            <b-row class="m-0 mb-1">
                                                <b-col class="p-0">
                                                    <b-form-radio v-model="current.states.selected" name="__states-content-radios" value="در حال تکمیل">در حال انجام</b-form-radio>
                                                </b-col>
                                            </b-row>
                                            <b-row class="m-0 mb-1">
                                                <b-col class="p-0">
                                                    <b-form-radio v-model="current.states.selected" name="__states-content-radios" value="در حال ارسال">در حال ارسال</b-form-radio>
                                                </b-col>
                                            </b-row>
                                            <b-row class="m-0">
                                                <b-col class="p-0">
                                                    <b-form-radio v-model="current.states.selected" name="__states-content-radios" value="تکمیل شده">تکمیل شده</b-form-radio>
                                                </b-col>
                                            </b-row>
                                        </b-form-group>
                                    </div>
                                </div>
                            </div>
                        </b-col>
                        <b-col>
                            <b-button
                                variant="light"
                                class="w-100"
                            >
                                <b-icon icon="printer"></b-icon>
                            </b-button>
                        </b-col>
                        <b-col>
                            <b-button
                                variant="light"
                                class="w-100"
                            >
                                <b-icon icon="sliders"></b-icon>
                            </b-button>
                        </b-col>
                    </b-row>
                </div>
            </b-row>
            <b-row
                v-if="selectedList.length"
                class="_current-invoice"
            >
                <div class="_current-invoice-title">
                    <b-icon
                        class="unselected-all"
                        icon="x"
                        variant="danger"
                        @click="emptySelectedList()"
                    ></b-icon>
                </div>
                <div class="_current-invoice-content w-100">
                    <div
                        v-for="invoice in selectedList"
                        :key="invoice.id"
                        class="__selected-list rounded"
                    >
                        <span>شماره فاکتور: </span>
                        <span>{{ invoice.id }} - {{ invoice.status }}</span>
                        <span class="mr-auto">{{ invoice.customer.fullname }}</span>
                    </div>
                </div>
                <div class="_current-invoice-actions">
                    <b-row>
                        <b-col>
                            <b-button
                                variant="light"
                                class="w-100"
                            >
                                <b-icon icon="ui-checks-grid"></b-icon>
                            </b-button>
                        </b-col>
                        <b-col>
                            <b-button
                                variant="light"
                                class="w-100"
                            >
                                <b-icon icon="printer"></b-icon>
                            </b-button>
                        </b-col>
                        <b-col>
                            <b-button
                                variant="light"
                                class="w-100"
                            >
                                <b-icon icon="sliders"></b-icon>
                            </b-button>
                        </b-col>
                    </b-row>
                </div>
            </b-row>
        </b-col>
    </b-row>
</template>

<script>
import jm from 'jalali-moment'
import DatePicker from 'vue-datepicker-persian'
export default {
    components: {
        DatePicker
    },
    data () {
        return {
            filter: [],
            list: {
                view: {
                    sale: true,
                    buy: false
                }
            },
            colFilter: {
                source: {
                    show: false,
                    type: 'select',
                    selected: [],
                    options: [
                        { text: 'آنلاین', value: 1 },
                        { text: 'حضوری', value: 0 }
                    ]
                },
                id: {
                    show: false,
                    type: 'text',
                    value: null
                },
                name: {
                    show: false,
                    type: 'text',
                    value: null
                },
                date: {
                    show: false,
                    type: 'range',
                    value: null
                },
                price: {
                    show: false,
                    type: 'text',
                    value: null
                },
                status: {
                    show: false,
                    type: 'select',
                    selected: [],
                    options: [
                        { text: 'لغو شده', value: 'canceled' },
                        { text: 'در انتظار پرداخت', value: 'pending-payment' },
                        { text: 'در حال انجام', value: 'on-hold' },
                        { text: 'در حال ارسال', value: 'processing' },
                        { text: 'تکمیل شده', value: 'completed' }
                    ]
                },
                delivery: {
                    show: false,
                    type: 'range-select',
                    value: null,
                    selected: []
                },
                user: {
                    show: false,
                    type: 'select',
                    selected: [],
                    options: []
                }
            },
            current: {
                states: {
                    selected: '',
                    show: false
                }
            },
            selectionMode: false,
            sortables: {
                value: 'id',
                asc: true
            },
            timerForSortable: null,
            testTime: '1399/05/12'
        }
    },
    created () {
        this.$store.dispatch('invoice/getAllInvoices')

        const body = document.getElementsByTagName('body')
        body[0].addEventListener('touchstart', (e) => {
            console.log(e)
        }, false)
    },
    mounted () {
        const $ = window.$
        const self = this
        let pressTimer

        $('._invoices-table').on('mouseup', '._invoices-table-row', function () {
            clearTimeout(pressTimer)
            return false
        }).on('mousedown', '._invoices-table-row', function () {
            // let self = $(this)
            if (self.selectionMode) {
                $(this).addClass('select')
            } else {
                pressTimer = setTimeout(() => {
                    self.selectionMode = true
                    $(this).addClass('select')
                    $('._invoices-table').addClass('has-selected-some')
                }, 1000)
            }
            return false
        })
        $('._invoices-table .selected-some').click(() => {
            $('._invoices-table').removeClass('has-selected-some').addClass('has-selected-all')
            $('._invoices-table').find('._invoices-table-row').addClass('select')
        })
        $('._invoices-table .selected-all').click(() => {
            self.unselectedAll()
        })
    },
    methods: {
        changeViewToSale () {
            this.list.view.sale = true
            this.list.view.buy = false
        },
        changeViewToBuy () {
            this.list.view.sale = false
            this.list.view.buy = true
        },
        search (e) {
            this.filter = e.target.value.toLowerCase().split(' ')
        },
        loadInvoice (invoice) {
            if (this.selectionMode) {
                this.$store.commit('invoice/setSelectedList', invoice)
            } else {
                this.current.states.selected = invoice.status
                this.$store.commit('invoice/setCurrentInvoice', invoice)
            }
        },
        unselectedAll () {
            const $ = window.$
            this.selectionMode = false
            $('._invoices-table').removeClass('has-selected-all').removeClass('has-selected-some').find('._invoices-table-row').removeClass('select')
        },
        emptySelectedList () {
            this.unselectedAll()
            this.$store.commit('invoice/emptySelectedList')
        },
        showStatesForCurrent () {
            this.current.states.show = !this.current.states.show
        },
        showFilterForUnsortable (col) {
            switch (col) {
            case 'source':
                this.colFilter.source.show = !this.colFilter.source.show
                break
            case 'status':
                this.colFilter.status.show = !this.colFilter.status.show
                break
            case 'user':
                this.colFilter.user.show = !this.colFilter.user.show
                break
            default:
                // do nothing
            }
        },
        showFilterForSortable (col) {
            const self = this
            self.timerForSortable = setTimeout(() => {
                switch (col) {
                case 'id':
                    self.colFilter.id.show = true
                    break
                case 'name':
                    self.colFilter.name.show = true
                    break
                case 'price':
                    self.colFilter.price.show = true
                    break
                case 'date':
                    self.colFilter.date.show = true
                    break
                case 'delivery':
                    self.colFilter.delivery.show = true
                    break
                default:
                    // do nothing
                }
            }, 1000)
        },
        clearTimerForSortable () {
            clearTimeout(this.timerForSortable)
        },
        hideFilterForSortable () {
            this.colFilter.id.show = false
            this.colFilter.name.show = false
            this.colFilter.price.show = false
            this.colFilter.user.show = false
            this.colFilter.date.show = false
            this.colFilter.delivery.show = false
        },
        _forSelect (col, selected, items) {
            let result = []
            switch (col) {
            case 'source':
                selected.forEach((source) => {
                    const helper = items.filter(item => {
                        return item.source === parseInt(source)
                    })
                    result.push(...helper)
                })
                break
            case 'status':
                selected.forEach((status) => {
                    const helper = items.filter(item => {
                        return item.status === status
                    })
                    result.push(...helper)
                })
                break
            case 'user':
                selected.forEach((user) => {
                    const helper = items.filter(item => {
                        return item.userId === user
                    })
                    result.push(...helper)
                })
                break
            default:
                result = []
            }
            return result
        },
        _forText (col, value, items) {
            let result = []
            let helper
            switch (col) {
            case 'id':
                helper = items.filter(item => {
                    return (item.id + '').indexOf(value) !== -1
                })
                result.push(...helper)
                break
            case 'name':
                helper = items.filter(item => {
                    return item.customer.fullname.toLowerCase().indexOf(value) !== -1
                })
                result.push(...helper)
                break
            case 'price':
                helper = items.filter(item => {
                    return (item.total_price + '').indexOf(value) !== -1
                })
                result.push(...helper)
                break
            default:
                result = []
            }
            return result
        },
        _forRange (col, value, items) {
            let result = []
            let helper
            switch (col) {
            case 'date':
                helper = items.filter(item => {
                    const year = parseInt(jm(item.createdAt, 'YYYY/M/D').format('jYYYY'))
                    const month = parseInt(jm(item.createdAt, 'YYYY/M/D').format('jMM'))
                    const day = parseInt(jm(item.createdAt, 'YYYY/M/D').format('jDD'))
                    if (year >= value[0].year && year <= value[1].year) {
                        if (month >= value[0].month && month <= value[1].month) {
                            if (day >= value[0].day && day <= value[1].day) {
                                return item
                            }
                        }
                    }
                })
                result.push(...helper)
                break
            default:
                result = []
            }
            return result
        },
        _forRangeSelect (col, filter, items) {
            let result = []
            let helper
            switch (col) {
            case 'delivery':
                helper = items.filter(item => {
                    const delivery = JSON.parse(item.order_meta._delivery)
                    if (delivery) {
                        if (filter.value) {
                            const year = parseInt(jm.unix(delivery.date).format('jYYYY'))
                            const month = parseInt(jm.unix(delivery.date).format('jMM'))
                            const day = parseInt(jm.unix(delivery.date).format('jDD'))
                            if (year >= filter.value[0].year && year <= filter.value[1].year) {
                                if (month >= filter.value[0].month && month <= filter.value[1].month) {
                                    if (day >= filter.value[0].day && day <= filter.value[1].day) {
                                        if (filter.selected.length) {
                                            if (filter.selected.includes(delivery.time)) {
                                                return item
                                            }
                                        } else {
                                            return item
                                        }
                                    }
                                }
                            }
                        }
                        if (filter.selected.length && !filter.value) {
                            if (filter.selected.includes(delivery.time)) {
                                return item
                            }
                        }
                    }
                })
                result.push(...helper)
                break
            default:
                result = []
            }
            return result
        },
        changeSort (col) {
            this.sortables.value = col
            this.sortables.asc = !this.sortables.asc
        },
        sortRowsForSortable (col, items) {
            let result = []
            switch (col) {
            case 'id':
                result = items.sort((a, b) => {
                    return (this.sortables.asc) ? a.id - b.id : b.id - a.id
                })
                break
            case 'name':
                result = items.sort((a, b) => {
                    return (this.sortables.asc) ? a.customer.fullname.localeCompare(b.customer.fullname) : b.customer.fullname.localeCompare(a.customer.fullname)
                })
                break
            case 'price':
                result = items.sort((a, b) => {
                    return (this.sortables.asc) ? a.total_price - b.total_price : b.total_price - a.total_price
                })
                break
            case 'date':
                result = items.sort((a, b) => {
                    const aDate = jm(a.createdAt, 'YYYY/M/D hh:mm:ss').format('x')
                    const bDate = jm(b.createdAt, 'YYYY/M/D hh:mm:ss').format('x')
                    return (this.sortables.asc) ? aDate - bDate : bDate - aDate
                })
                break
            case 'delivery':
                result = items.sort((a, b) => {
                    const aDelivery = JSON.parse(a.order_meta._delivery)
                    const bDelivery = JSON.parse(b.order_meta._delivery)
                    if (aDelivery && bDelivery) {
                        return (this.sortables.asc) ? aDelivery.date - bDelivery.date : bDelivery.date - aDelivery.date
                    }
                })
                break
            default:
                result = []
            }
            return result
        },
        clearDateRange (col) {
            switch (col) {
            case 'date':
                this.colFilter.date.value = null
                break
            case 'delivery':
                this.colFilter.delivery.value = null
                this.colFilter.delivery.selected = []
                break
            }
        }
    },
    computed: {
        allInvoices () {
            // console.log(jm("2020-11-02T09:26:49.000Z", "YYYY/M/D hh:mm:ss Z").format("jYYYY-jMM-jDD hh:mm:ss"))
            const invoices = this.$store.getters['invoice/getAllInvoices']
            if (invoices) {
                let items = invoices.slice()
                if (this.filter.length && this.filter[0].length) {
                    let filteredRows = []
                    const result = []
                    let ids = []
                    let names = []
                    let date = []
                    let prices = []
                    let status = []
                    const delivery = []
                    let users = []
                    this.filter.forEach((filter) => {
                        if (filter.length) {
                            if (!filteredRows.length) {
                                ids = items.filter(item => {
                                    return (item.id + '').indexOf(filter) !== -1
                                })
                                names = items.filter(item => {
                                    return item.customer.fullname.toLowerCase().indexOf(filter) !== -1
                                })
                                date = items.filter((item) => {
                                    if (jm(item.createdAt, 'YYYY/M/D').format('jYYYY-jMM-jDD').indexOf(filter) !== -1) {
                                        return item
                                    }
                                })
                                prices = items.filter(item => {
                                    return (item.total_price + '').indexOf(filter) !== -1
                                })
                                status = items.filter(item => {
                                    return item.status.toLowerCase().indexOf(filter) !== -1
                                })
                                users = items.filter(item => {
                                    return item.user.username.toLowerCase().indexOf(filter) !== -1
                                })
                            } else {
                                ids = filteredRows.filter(item => {
                                    return (item.id + '').indexOf(filter) !== -1
                                })
                                names = filteredRows.filter(item => {
                                    return item.customer.fullname.toLowerCase().indexOf(filter) !== -1
                                })
                                date = filteredRows.filter(item => {
                                    if (jm(item.createdAt, 'YYYY/M/D').format('jYYYY-jMM-jDD').indexOf(filter) !== -1) {
                                        return item
                                    }
                                })
                                prices = filteredRows.filter(item => {
                                    return (item.total_price + '').indexOf(filter) !== -1
                                })
                                status = filteredRows.filter(item => {
                                    return item.status.toLowerCase().indexOf(filter) !== -1
                                })
                                users = filteredRows.filter(item => {
                                    return item.user.username.toLowerCase().indexOf(filter) !== -1
                                })
                            }
                            filteredRows = []
                            filteredRows.push(...ids)
                            filteredRows.push(...names)
                            filteredRows.push(...date)
                            filteredRows.push(...prices)
                            filteredRows.push(...status)
                            filteredRows.push(...delivery)
                            filteredRows.push(...users)
                        }
                    })
                    const uniqueIds = []
                    filteredRows.forEach(row => {
                        if (!uniqueIds.includes(row.id)) {
                            uniqueIds.push(row.id)
                            result.push(row)
                        }
                    })
                    return result
                }
                let colFilteredRows = []
                if (this.hasColFilters) {
                    const colFilter = this.colFilter
                    let pointer
                    for (const col in colFilter) {
                        const filter = colFilter[col]
                        if (colFilteredRows.length) {
                            pointer = colFilteredRows
                        } else {
                            pointer = items
                        }
                        switch (filter.type) {
                        case 'select':
                            if (filter.selected.length) {
                                colFilteredRows = this._forSelect(col, filter.selected, pointer)
                            }
                            break
                        case 'text':
                            if (filter.value) {
                                colFilteredRows = this._forText(col, filter.value, pointer)
                            }
                            break
                        case 'range':
                            if (filter.value) {
                                colFilteredRows = this._forRange(col, filter.value, pointer)
                            }
                            break
                        case 'range-select':
                            if (filter.value || filter.selected.length) {
                                colFilteredRows = this._forRangeSelect(col, filter, pointer)
                            }
                            break
                        default:
                            return
                        }
                    }
                    items = colFilteredRows
                }
                items = this.sortRowsForSortable(this.sortables.value, items)
                return items
            }
            return invoices
        },
        currentInvoice () {
            return this.$store.getters['invoice/getCurrentInvoice']
        },
        selectedList () {
            return this.$store.getters['invoice/getSelectedList']
        },
        hasColFilters () {
            const colFilter = this.colFilter
            return !!(colFilter.source.selected.length || colFilter.id.value || colFilter.name.value || colFilter.date.value || colFilter.price.value || colFilter.status.selected.length || colFilter.delivery.value || colFilter.delivery.selected.length || colFilter.user.selected.length)
        },
        users () {
            return this.$store.getters['invoice/getUsers']
        },
        totalPrice () {
            const invoice = this.currentInvoice
            if (!invoice.products) return
            let totalPrice = 0
            invoice.products.forEach((item) => {
                const discount = JSON.parse(item.order_items.discount)
                if (discount.amount) {
                    if (discount.type === 'percent') {
                        totalPrice += (item.price - ((item.price * discount.amount) / 100)) * item.stock
                    } else {
                        totalPrice += (item.price - discount.amount * 1000) * item.stock
                    }
                } else {
                    totalPrice += item.price * item.stock
                }
            })
            const shipping = (invoice.order_meta._shipping) ? invoice.order_meta._shipping * 1000 : 0
            const discount = (invoice.order_meta._discount) ? invoice.order_meta._discount * 1000 : 0
            const addition = (invoice.order_meta._addition) ? invoice.order_meta._addition * 1000 : 0
            return totalPrice + (shipping + addition - discount)
        }
    },
    watch: {
        // allInvoices (invoices) {
        //     return invoices
        // },
        currentInvoice (invoice) {
            return invoice
        },
        selectedList (list) {
            return list
        }
    },
    filters: {
        deliveryTime: (value) => {
            value = JSON.parse(value._delivery)
            return (jm.unix(value.date).format('jMM/jDD')) + ' ' + value.time
        },
        translateStatus: (status) => {
            const options = [
                { text: 'لغو شده', value: 'canceled' },
                { text: 'در انتظار پرداخت', value: 'pending-payment' },
                { text: 'در حال انجام', value: 'on-hold' },
                { text: 'در حال ارسال', value: 'processing' },
                { text: 'تکمیل شده', value: 'completed' }
            ]
            const currentTranslate = options.find(option => {
                if (option.value === status) return option
            })
            return currentTranslate.text
        }
    }
}
</script>

<style>
    .onp-panel-main_invoices .mx-input-wrapper{
        display: none !important;
    }
    .onp-panel-main_invoices .mx-datepicker-popup{
        display: block !important;
        top: 0;
        left: 0;
        border-radius: 5px;
    }
    ._current-invoice-content__details .mx-datepicker{
        width: unset;
    }
    .__sortable.delivery .mx-datepicker{
        position: unset;
    }
    .__sortable.delivery .__sortable-input{
        left: 0;
        right: unset;
    }
    .__sortable.delivery .__sortable-input.range-time{
        width: 250px;
        top: 310px;
    }
</style>
