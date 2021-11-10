# pozitron_server
Server-Side of the Pozitron (an Online Point of Sales)


# Setup Database
### Create Config Folder
- create a <code>config</code> folder in <code>app</code> folder
- create <code>db.config.js</code> file in <code>config</code> folder
- put these code in the <code>db.config.js</code> file (for mysql database): 
```javascript
module.exports = {
      HOST: "localhost",
      USER: "DB_USER",
      PASS: "DB_USER_PASS",
      DB: "DB_NAME",
      dialect: "mysql",
      pool: {
          max: 5, // maximum number of connection in pool
          min: 0, // minimum number of connection in pool
          acquire: 30000, // maximum time, in milliseconds, that pool will try to get connection before throwing error
          idle: 10000 //maximum time, in milliseconds, that a connection can be idle before being released
      }
}
```

# Run
```bash
# install packages
npm install

# run server
node server.js
```
## License
[MIT](https://choosealicense.com/licenses/mit/)

powered by [Zitron](https://zitronet.ir)