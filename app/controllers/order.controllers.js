"use strict";

// dependencies
const fs = require("fs/promises");
const path = require("path");

// models
const Business = require("../db/models/business");
const Product = require("../db/models/product");
const ProductImage = require("../db/models/productImage");
const ProductMeta = require("../db/models/productmeta");
const Order = require("../db/models/order");
const OrderHasProducts = require("../db/models/orderHasProducts");
const Customer = require("../db/models/customer");
const Address = require("../db/models/address");

// error handlers
const BaseErr = require("../errors/baseErr");
const httpStatusCodes = require("../errors/httpStatusCodes");

// helpers
const { calculateDiscount } = require("../helpers/product.helpers");
const { ORDER } = require("mysql/lib/PoolSelector");
const WcHelpers = require("../helpers/wc.helpers");
const { type } = require("os");

// functions

function getMeta(wcProduct, productId) {
    let productMeta = [];
    if (wcProduct.weight?.length) {
        productMeta.push({
            metaKey: "weight",
            metaValue: wcProduct.weight,
            productId,
        });
    }
    if (
        wcProduct.dimensions.length ||
        wcProduct.dimensions.width ||
        wcProduct.dimensions.height
    ) {
        productMeta.push({
            metaKey: "dimensions",
            metaValue: JSON.stringify(wcProduct.dimensions),
            productId,
        });
    }
    if (wcProduct.attributes.length) {
        productMeta.push({
            metaKey: "attributes",
            metaValue: JSON.stringify(wcProduct.attributes),
            productId,
        });
    }
    if (wcProduct._links?.self) {
        productMeta.push({
            metaKey: "links",
            metaValue: JSON.stringify(wcProduct._links.self),
            productId,
        });
    }
    return productMeta;
}
function getImages(wcProduct, productId) {
    let productImages = [];
    if (wcProduct.images?.length) {
        for (const img of wcProduct.images) {
            productImages.push({
                src: img.src,
                name: img.name,
                productId,
            });
        }
    }
    return productImages;
}

async function getAll(req, res, next) {
    try {
        const business = await Business.findOne({
            where: { userId: req.user.id },
        });
        if (!business) {
            throw new BaseErr(
                "BusinessDoesNotExist",
                httpStatusCodes.NOT_FOUND,
                true,
                `The user business not found.`
            );
        }

        // console.log(Object.keys(Business.prototype));

        const orders = await business.getOrders({
            where: {
                businessId: business.id,
            },
            include: [
                {
                    model: OrderHasProducts,
                    as: "items",
                    include: [
                        {
                            model: Product,
                            left: true,
                            attributes: ["id"],
                            include: [
                                {
                                    model: ProductImage,
                                    as: "images",
                                    attributes: ["src"],
                                },
                                {
                                    model: ProductMeta,
                                    as: "meta",
                                },
                                {
                                    model: ProductImage,
                                    as: "images",
                                    required: false,
                                },
                            ],
                        },
                    ],
                },
                {
                    model: Customer,
                },
            ],
        });
        if (!orders.length) {
            throw new BaseErr(
                "BusinessDoesNotHaveOrders",
                httpStatusCodes.NOT_FOUND,
                true,
                `There is not any orders.`
            );
        }

        return res.status(200).json({
            success: true,
            message: "The list of orders found successfully.",
            data: orders,
            domain: business.domain,
        });
    } catch (e) {
        next(e);
    }
}
async function create(req, res, next) {
    try {
        const business = await Business.findOne({
            where: { userId: req.user.id },
        });
        if (!business) {
            throw new BaseErr(
                "BusinessDoesNotExist",
                httpStatusCodes.NOT_FOUND,
                true,
                `The user business not found.`
            );
        }

        const product = await Product.findByPk(req.body.item);
        if (!product) {
            throw new BaseErr(
                "ProductDoesNotExist",
                httpStatusCodes.NOT_FOUND,
                true,
                `The product not found.`
            );
        }
        if (!product.stock) {
            throw new BaseErr(
                "ProductDoesNotHaveEnoughStock",
                httpStatusCodes.NOT_ACCEPTABLE,
                true,
                `The product does not have enough stock.`
            );
        }

        let customer = null;
        if (req.body.customer?.id) {
            customer = await Customer.findByPk(req.body.customer.id);
        } else if (req.body.customer?.phone) {
            customer = await Customer.findOne({
                where: { phone: req.body.customer.phone },
            });
        }

        const order = await Order.create({
            src: "offline",
            orderKey: `order_key_${business.domain}`,
            totalPirce: product.price,
            businessId: business.id,
        });
        if (!order) {
            throw new BaseErr(
                "OrderNotCreated",
                httpStatusCodes.NOT_IMPLEMENTED,
                true,
                `The order has not been created successfully.`
            );
        }

        const orderHasProduct = await OrderHasProducts.create({
            name: product.name,
            price: product.price,
            onlinePrice: product.onlinePrice,
            type: product.type,
            onlineDiscount: product.onlineDiscount,
            discount: product.discount,
            onlineSalePrice: product.onlineSalePrice,
            total: product.price,
            productId: product.id,
            orderId: order.id,
        });
        if (!orderHasProduct) {
            throw new BaseErr(
                "OrderHasProductNotCreated",
                httpStatusCodes.NOT_IMPLEMENTED,
                true,
                `The relation between order and product not been created successfully.`
            );
        }

        return res.status(200).json({
            success: true,
            message: "The order created successfully.",
            data: order,
        });
    } catch (e) {
        next(e);
    }
}
async function edit(req, res, next) {
    try {
        const business = await Business.findOne({
            where: { userId: req.user.id },
        });
        if (!business) {
            throw new BaseErr(
                "BusinessNotFound",
                httpStatusCodes.NOT_FOUND,
                true,
                `The business does not exists.`
            );
        }

        const { status } = req.body;

        if (!!business.onlineBusiness) {
            const wc = new WcHelpers(
                `https://${business.domain}`,
                business.key,
                business.secret
            );

            for (const id of req.body.ids) {
                const order = await Order.findByPk(+id);
                if (order?.businessId !== business.id) continue;

                await wc.updateOrder({ id: order.ref, status });

                order.status = status;
                await order.save();
            }
        }

        return res.json({
            success: true,
            message: "The order have been updated successfully.",
        });
    } catch (e) {
        next(e);
    }
}
async function remove(req, res, next) {
    try {
        const business = await Business.findOne({
            where: { userId: req.user.id },
        });
        if (!business) {
            throw new BaseErr(
                "BusinessNotFound",
                httpStatusCodes.NOT_FOUND,
                true,
                `The business does not exists.`
            );
        }

        if (!!business.onlineBusiness) {
            const wc = new WcHelpers(
                `https://${business.domain}`,
                business.key,
                business.secret
            );

            for (const id of req.body.ids) {
                const order = await Order.findByPk(+id);
                if (order?.businessId !== business.id) continue;

                await wc.deleteOrder(order.ref);

                await order.destroy();
            }
        } else {
            for (const id of req.body.ids) {
                const order = await Order.findByPk(+id);
                if (order?.businessId !== business.id) continue;
                await order.destroy();
            }
        }

        return res.json({
            success: true,
            message: "The orders have been deleted successfully.",
        });
    } catch (e) {
        next(e);
    }
}
async function getAllPendingOrders(req, res, next) {
    try {
        const business = await Business.findOne({
            where: { userId: req.user.id },
        });
        if (!business) {
            throw new BaseErr(
                "BusinessDoesNotExist",
                httpStatusCodes.NOT_FOUND,
                true,
                `The user business not found.`
            );
        }

        const orders = await business.getOrders({
            where: {
                businessId: business.id,
                status: "pending",
            },
            include: [
                {
                    model: OrderHasProducts,
                    as: "items",
                    include: [
                        {
                            model: Product,
                            attributes: ["id"],
                            left: true,
                            include: [
                                {
                                    model: ProductImage,
                                    as: "images",
                                    attributes: ["src"],
                                }, {
                                    model: ProductMeta,
                                    as: "meta"
                                },
                            ],
                        },
                    ],
                },
                {
                    model: Customer,
                    as: "customer"
                },
                {
                    model: Address,
                    as: "address"

                },
            ],
        });
        if (!orders.length) {
            throw new BaseErr(
                "BusinessDoesNotHaveOrders",
                httpStatusCodes.NOT_FOUND,
                true,
                `There is not any orders.`
            );
        }


        const oredersData = [];
        for (let index = 0; index < orders.length; index++) {
            // orders[index].items.map(
            //     item => Object.assign(item, { images: item.product.images, meta: item.product.meta })
            // )
            // orders[index].items.map(
            //     item => delete item.product
            // )

            let customerDataValue = {};
            if (orders[index].customer !== null) {
                customerDataValue = orders[index].customer.dataValues;
            }

            let addressDataValue = {};
            if (orders[index].address !== null) {
                addressDataValue = orders[index].address.dataValues;
            }

            let orderObject = {
                id: orders[index].id,
                discountTotal: orders[index].discountTotal,
                totalPrice: orders[index].totalPrice,
                items: orders[index].items,
                customerData: {
                    deliveryDate: orders[index].deliveryDate,
                    ...customerDataValue,
                    ...addressDataValue
                },
                extraData: {
                    shippingTotal: orders[index].shippingTotal,
                    totalTax: orders[index].totalTax,
                    discountTotal: orders[index].discountTotal,
                }

            }
            oredersData.push(orderObject);
        }

        return res.status(200).json({
            success: true,
            message: "The list of pending orders found successfully.",
            data: oredersData,
            domain: business.domain,
        });
    } catch (e) {
        next(e);
    }
}

async function addProduct(req, res, next) {
    try {

        const business = await Business.findOne({ where: { userId: req.user.id } });
        if (!business) {
            throw new BaseErr(
                "BusinessNotFound",
                httpStatusCodes.NOT_FOUND,
                true,
                `The business does not exists.`
            );
        }

        

        const order = await Order.findOne({
            where: { id: req.body.orderId },
        });
        if (!order) {
            throw new BaseErr(
                "OrderNotFound",
                httpStatusCodes.NOT_FOUND,
                true,
                `The order does not exists.`
            );
        }

        const product = await Product.findOne({
            where: { id: req.body.productId },
        });
        if (!product) {
            throw new BaseErr(
                "ProductNotFound",
                httpStatusCodes.NOT_FOUND,
                true,
                `The product does not exists.`
            );
        }

        if (business.id !== order.businessId) {
            throw new BaseErr(
                "OrderDidNotBelongToBusiness",
                httpStatusCodes.BAD_REQUEST,
                true,
                `The order didn't belong to business.`
            );
        }

        if (business.id !== product.businessId) {
            throw new BaseErr(
                "ProductDidNotBelongToBusiness",
                httpStatusCodes.BAD_REQUEST,
                true,
                `The product didn't belong to business.`
            );
        }

        const checkOrderHasProduct = await OrderHasProducts.findOne({
            where: { orderId: req.body.orderId, productId: req.body.productId },
        });
        if (checkOrderHasProduct) {
            checkOrderHasProduct.quantity += req.body.quantity;
            await checkOrderHasProduct.save();
        } else {
            await OrderHasProducts.create({
                name: product.name,
                price: product.price,
                type: product.type,
                discount: product.discount,
                salePrice: product.salePrice,
                onlinePrice: product.onlinePrice,
                onlineDiscount: product.onlineDiscount,
                onlineSalePrice: product.onlineSalePrice,
                quantity: req.body.quantity,
                total: product.price,
                totalTax: 0,
                productId: product.id,
                orderId: order.id,
            });
        }
        product.stock -= req.body.quantity;
        product.reservationStock += req.body.quantity;
        order.totalPrice += product.price * req.body.quantity;
        await order.save();
        await product.save();

        // console.log(order.items);

        return res.status(200).json({
            success: true,
            message: "product added successfully.",
        })
    } catch (e) {
        next(e)
    }
}

async function completeOrder(req, res, next) {
    try {

        const business = await Business.findOne({
            where: { userId: req.user.id },
        });
        if (!business) {
            throw new BaseErr(
                "BusinessDoesNotExist",
                httpStatusCodes.NOT_FOUND,
                true,
                `The user business not found.`
            );
        }


        const order = await Order.findOne({
            where: { id: req.body.id },
        });
        if (!order || order.businessId !== business.id) {
            throw new BaseErr(
                "OrderDoesNotExist",
                httpStatusCodes.NOT_FOUND,
                true,
                `The order not found.`
            );
        }

        order.status = "completed";
        order.deliveryDate = req.body.deliveryDate;
        order.description = req.body.description;
        order.deliveryTime = req.body.deliveryTime;
        order.additionsPrice = req.body.additionsPrice;


        const customer = await Customer.findOne({
            where: { phone: req.body.customerData.phone },
        });

        if (!customer) {
            const customer = await Customer.create({
                username: req.body.customerData.username,
                firstname: req.body.customerData.firstname,
                lastname: req.body.customerData.lastname,
                email: req.body.customerData.email,
                phone: req.body.customerData.phone,
                businessId: business.id
            });
        }
        order.customerId = customer.id;
        await order.save();

        const address = await Address.create({
            country: req.body.addressData.country,
            city: req.body.addressData.city,
            postCode: req.body.addressData.postCode,
            phone: req.body.addressData.phone,
            address: req.body.addressData.address,
            customerId: customer.id
        });

        let ordersData = { order, customer, address };

        return res.status(200).json({
            success: true,
            message: "The completed this order.",
            data: ordersData,
        });
        // const business = await Business.findOne({
        //     where: { userId: req.user.id },
        // });
        // if (!business) {
        //     throw new BaseErr(
        //         "BusinessDoesNotExist",
        //         httpStatusCodes.NOT_FOUND,
        //         true,
        //         `The user business not found.`
        //     );
        // }

        // const order = await Order.findByPk(+req.body.orderId);
        // if (order?.businessId !== business.id) {
        //     throw new BaseErr(
        //         "OrderDoesNotExist",
        //         httpStatusCodes.NOT_FOUND,
        //         true,
        //         `The order not found.`
        //     );
        // }

        // order = { ...order, ...req.body };
        // order.save();
    } catch (e) {
        next(e);
    }
}

// handlers for socket
async function addProductToOrder(userId, orderId, productId) {
    try {
        const business = await Business.findOne({ where: { userId } });
        if (!business) {
            throw new BaseErr(
                "BusinessNotFound",
                httpStatusCodes.NOT_FOUND,
                true,
                `The business does not exists.`
            );
        }

        const order = await Order.findByPk(orderId);
        if (!order) {
            throw new BaseErr(
                "OrderNotFound",
                httpStatusCodes.NOT_FOUND,
                true,
                `The order does not exists.`
            );
        }

        const product = await Product.findByPk(productId);
        if (!product) {
            throw new BaseErr(
                "ProductNotFound",
                httpStatusCodes.NOT_FOUND,
                true,
                `The product does not exists.`
            );
        }

        if (business.id !== order.businessId) {
            throw new BaseErr(
                "OrderDidNotBelongToBusiness",
                httpStatusCodes.BAD_REQUEST,
                true,
                `The order didn't belong to business.`
            );
        }

        if (business.id !== product.businessId) {
            throw new BaseErr(
                "ProductDidNotBelongToBusiness",
                httpStatusCodes.BAD_REQUEST,
                true,
                `The product didn't belong to business.`
            );
        }

        const checkOrderHasProduct = await OrderHasProducts.findOne({
            where: { orderId, productId },
        });
        if (checkOrderHasProduct) {
            checkOrderHasProduct.quantity++;
            await checkOrderHasProduct.save();
        } else {
            await OrderHasProducts.create({
                name: product.name,
                price: product.price,
                type: product.type,
                discount: product.discount,
                salePrice: product.salePrice,
                onlinePrice: product.onlinePrice,
                onlineDiscount: product.onlineDiscount,
                onlineSalePrice: product.onlineSalePrice,
                quantity: 1,
                total: product.price,
                totalTax: 0,
                productId,
                orderId,
            });
        }
        product.stock--;
        await product.save();

        return true;
    } catch (e) {
        console.log("controller: addProductToOrder");
        console.log(e);
        return false;
    }
}
async function getPendingOrders(userId) {
    try {
        const business = await Business.findOne({ where: { userId } });
        if (!business) {
            throw new BaseErr(
                "BusinessNotFound",
                httpStatusCodes.NOT_FOUND,
                true,
                `The business does not exists.`
            );
        }

        const orders = await Order.findAll({
            where: { businessId: business.id, status: "pending" },
            include: [
                {
                    model: ProductImage,
                    as: "images",
                    attributes: ["src"],
                },
            ],
        });

        if (!orders) {
            throw new BaseErr(
                "OrderNotFound",
                httpStatusCodes.NOT_FOUND,
                true,
                `The order does not exists.`
            );
        }

    } catch (e) {
        console.log("get all pending orders:");
        console.log(e?.message);
        return false;
    }
}

// handlers for webhooks action
async function logWebhookResponse(webhook, body) {
    try {
        const date = new Date();
        const data = {
            date,
            webhook,
            body,
        };
        await fs.appendFile(
            path.join(__dirname, `../logs/webhooks/order/${+date}.json`),
            JSON.stringify(data),
            "utf-8"
        );
    } catch (err) {
        console.log(err);
    }
}
async function createdWithWebhook(req, res, next) {
    try {
        await logWebhookResponse("order create", req.body);

        const { businessId, businessKey } = req.params;
        const business = await Business.findByPk(businessId);
        if (business?.key !== businessKey) {
            throw new BaseErr(
                "BusinessKeyIsNotCorrect",
                httpStatusCodes.NOT_ACCEPTABLE,
                true,
                "Your business key is not correct."
            );
        }

        for (const item of req.body.line_items) {
            const product = await Product.findOne({
                where: { ref: item.product_id, businessId },
            });
            if (!product) {
                throw new BaseErr(
                    "ProductNotFound",
                    httpStatusCodes.NOT_FOUND,
                    true,
                    "This product not found."
                );
            }

            if (product.type === "simple") {
                const onlineStock = product.onlineStock - item.quantity;
                await product.update({ onlineStock });
            }
            if (product.type === "variable") {
                const variation = await Product.findOne({
                    where: { ref: item.variation_id, businessId },
                });
                const onlineStock = variation.onlineStock - item.quantity;
                await variation.update({ onlineStock });
            }
        }
    } catch (e) {
        console.log("cannot create order through webhooks.");
        next(e);
    }
}
async function updatedWithWebhook(req, res, next) {
    try {
        await logWebhookResponse("order update", req.body);

        const { businessId, businessKey } = req.params;
        const business = await Business.findByPk(businessId);
        if (business?.key !== businessKey) {
            throw new BaseErr(
                "BusinessKeyIsNotCorrect",
                httpStatusCodes.NOT_ACCEPTABLE,
                true,
                "Your business key is not correct."
            );
        }

        for (const item of req.body.line_items) {
            const product = await Product.findOne({
                where: { ref: item.product_id, businessId },
            });
            if (!product) {
                throw new BaseErr(
                    "ProductNotFound",
                    httpStatusCodes.NOT_FOUND,
                    true,
                    "This product not found."
                );
            }

            if (product.type === "simple") {
                const onlineStock = product.onlineStock - item.quantity;
                await product.update({ onlineStock });
            }
            if (product.type === "variable") {
                const variation = await Product.findOne({
                    where: { ref: item.variation_id, businessId },
                });
                const onlineStock = variation.onlineStock - item.quantity;
                await variation.update({ onlineStock });
            }
        }
    } catch (e) {
        console.log("cannot update order through webhooks.");
        next(e);
    }
}
async function deletedWithWebhook(req, res, next) {
    try {
        await logWebhookResponse("order delete", req.body);

        const { businessId, businessKey } = req.params;
        const business = await Business.findByPk(businessId);
        if (business?.key !== businessKey) {
            throw new BaseErr(
                "BusinessKeyIsNotCorrect",
                httpStatusCodes.NOT_ACCEPTABLE,
                true,
                "Your business key is not correct."
            );
        }

        for (const item of req.body.line_items) {
            const product = await Product.findOne({
                where: { ref: item.product_id, businessId },
            });
            if (!product) {
                throw new BaseErr(
                    "ProductNotFound",
                    httpStatusCodes.NOT_FOUND,
                    true,
                    "This product not found."
                );
            }

            if (product.type === "simple") {
                const onlineStock = product.onlineStock + item.quantity;
                await product.update({ onlineStock });
            }
            if (product.type === "variable") {
                const variation = await Product.findOne({
                    where: { ref: item.variation_id, businessId },
                });
                const onlineStock = variation.onlineStock + item.quantity;
                await variation.update({ onlineStock });
            }
        }
    } catch (e) {
        console.log("cannot update order through webhooks.");
        next(e);
    }
}

// export controller
module.exports = {
    getAll,
    create,
    edit,
    remove,
    getAllPendingOrders,
    addProductToOrder,
    getPendingOrders,
    createdWithWebhook,
    updatedWithWebhook,
    deletedWithWebhook,
    completeOrder,
    addProduct
};
