// Woocommerce Rest API module
const WoocommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;

class WcHelpers {
    constructor(url, consumerKey, consumerSecret) {
        this.url = url;
        this.consumerKey = consumerKey;
        this.consumerSecret = consumerSecret;
        this.api = new WoocommerceRestApi({
            url,
            consumerKey,
            consumerSecret,
            wpAPI: true,
            version: "wc/v3",
        });
    }
    async check() {
        try {
            await this.api.get("system_status");
            return true;
        } catch (err) {
            console.log(err.response.data);
            return false;
        }
    }
    async getAllProducts() {
        try {
            let products = [];
            let totalProducts = 0;
            let totalPages = 1;
            for (let page = 1; page <= totalPages; page++) {
                const { headers, data } = await this.api.get("products", {
                    page: page,
                    per_page: 100,
                    orderby: "id",
                    order: "asc",
                });

                if (page === 1) {
                    totalPages = headers["x-wp-totalpages"];
                    totalProducts = headers["x-wp-total"];
                }
                products.push(...data);
            }

            let variations = [];
            let variationsID = products
                .filter((product) => product.type === "variable")
                .map((product) => product.variations)
                .flat();

            for (let id of variationsID) {
                const { data } = await this.api.get(`products/${id}`);
                variations.push(data);
            }

            return { success: true, products, variations };
        } catch (err) {
            console.log("cannot fetch products from getAllProducts()");
            console.log(err);
            return { success: false };
        }
    }
    async createProduct(body) {
        try {
            const data = {
                name: body.name,
                type: body.type,
                sku: body.barcode,
                description: body.description,
                regular_price: body.onlinePrice.toString(),
                sale_price: body.onlineSalePrice.toString(),
                stock_status: body.infiniteStock ? 'instock' : 'outofstock',
                stock_quantity: body.onlineStock.toString(),
                images: body.images
            };

            const response = await this.api.post("products", data);
            console.log(response.data);
            return { success: true, message: `wc's product created`, id: response.data.id};
        } catch (err) {
            console.log("cannot create woocommerce from createProduct()");
            console.log(err.response.data);
            return { success: false, message: err.response.data.message, data: null };
        }
    }
    async updateProduct({ id, onlinePrice, onlineSalePrice, onlineStock }) {
        const data = {
            regular_price: onlinePrice.toString(),
            sale_price: onlineSalePrice.toString(),
            stock_quantity: onlineStock,
        };

        return this.api
            .put(`products/${id}`, data)
            .then((res) => {
                return res.status === 200 && res.statusText === "OK";
            })
            .catch((err) => {
                console.log(err.response.data);
            });
    }
    async updateProductVariation({
        id,
        parentId,
        onlinePrice,
        onlineSalePrice,
        onlineStock,
    }) {
        const data = {
            regular_price: onlinePrice.toString(),
            sale_price: onlineSalePrice.toString(),
            stock_quantity: onlineStock,
        };

        return this.api
            .put(`products/${parentId}/variations/${id}`, data)
            .then((res) => {
                return res.status === 200 && res.statusText === "OK";
            })
            .catch((err) => {
                console.log(err.response.data);
            });
    }
    async deleteProduct(id) {
        return this.api
            .delete(`products/${id}`, { force: true })
            .then((res) => {
                return res.status === 200 && res.statusText === "OK";
            })
            .catch((err) => {
                console.log(err.response.data);
            });
    }
    async deleteProductVariation(id, parentId) {
        return this.api
            .delete(`products/${parentId}/variations/${id}`)
            .then((res) => {
                return res.status === 200 && res.statusText === "OK";
            })
            .catch((err) => {
                console.log(err.response.data);
            });
    }
    async createWebhooks(businessId, businessKey) {
        try {
            const sections = ["product", "order"];
            const methods = ["create", "update", "delete"];

            for (const section of sections) {
                for (const method of methods) {
                    const webhook = {
                        name: `${section} ${method}`,
                        topic: `${section}.${method}d`,
                        delivery_url: `${process.env.WCH_BASE_URL}/${section}s/webhook/${method}/${businessId}/${businessKey}`,
                    };

                    await this.api.post("webhooks", webhook);
                }
            }
            return true;
        } catch (err) {
            console.log(`creating webhook has failed, with error:\n${err}`);
            return false;
        }
    }
    async getAllCategories() {
        try {
            let categories = [];
            let totalCategories = 0;
            let totalPages = 1;
            for (let page = 1; page <= totalPages; page++) {
                const { headers, data } = await this.api.get(
                    "products/categories",
                    {
                        page: page,
                        per_page: 100,
                        orderby: "id",
                        order: "asc",
                    }
                );

                if (page === 1) {
                    totalPages = headers["x-wp-totalpages"];
                    totalCategories = headers["x-wp-total"];
                }
                categories.push(...data);
            }

            return { success: true, categories };
        } catch (err) {
            console.log("cannot fetch categories from getAllCategories()");
            console.log(err);
            return { success: false };
        }
    }
    async getAllTags() {
        try {
            let tags = [];
            let totalTags = 0;
            let totalPages = 1;
            for (let page = 1; page <= totalPages; page++) {
                const { headers, data } = await this.api.get("products/tags", {
                    page: page,
                    per_page: 100,
                    orderby: "id",
                    order: "asc",
                });

                if (page === 1) {
                    totalPages = headers["x-wp-totalpages"];
                    totalTags = headers["x-wp-total"];
                }
                tags.push(...data);
            }

            return { success: true, tags };
        } catch (err) {
            console.log("cannot fetch tags from getAllTags()");
            console.log(err);
            return { success: false };
        }
    }
    async getAllOrders() {
        try {
            let orders = [];
            let totalTags = 0;
            let totalPages = 1;
            for (let page = 1; page <= totalPages; page++) {
                const { headers, data } = await this.api.get("orders", {
                    page: page,
                    per_page: 100,
                    orderby: "id",
                    order: "asc",
                });

                if (page === 1) {
                    totalPages = headers["x-wp-totalpages"];
                    totalTags = headers["x-wp-total"];
                }
                orders.push(...data);
            }

            return { success: true, orders };
        } catch (err) {
            console.log("cannot fetch orders from getAllOrders()");
            console.log(err);
            return { success: false };
        }
    }
    async getAllCustomers() {
        try {
            let customers = [];
            let totalCustomers = 0;
            let totalPages = 1;
            for (let page = 1; page <= totalPages; page++) {
                const { headers, data } = await this.api.get("customers", {
                    page: page,
                    per_page: 100,
                    orderby: "id",
                    order: "asc",
                });

                if (page === 1) {
                    totalPages = headers["x-wp-totalpages"];
                    totalCustomers = headers["x-wp-total"];
                }
                customers.push(...data);
            }

            return { success: true, customers };
        } catch (err) {
            console.log("cannot fetch customers from getAllOrders()");
            console.log(err);
            return { success: false };
        }
    }
    async updateOrder({ id, status }) {
        return await this.api.put(`orders/${id}`, { status });
    }
    async deleteOrder(id) {
        return await this.api.delete(`orders/${+id}`);
    }
}

// export helper
module.exports = WcHelpers;
