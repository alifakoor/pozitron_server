module.exports = {
    HOST: "localhost",
    USER: "remote",
    PASS: 'N%@vD6"ba$2AHJq+',
    DB: "demo",
    dialect: "mysql",
    pool: {
        max: 5, // maximum number of connection in pool
        min: 0, // minimum number of connection in pool
        acquire: 15000, // maximum time, in milliseconds, that pool will try to get connection before throwing error
        idle: 10000 //maximum time, in milliseconds, that a connection can be idle before being released
    }
}
