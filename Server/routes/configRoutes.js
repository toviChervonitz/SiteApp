const indexR = require('./index');
const siteR = require('./siteRoutes');
const userR = require('./user')
const countryR = require('./countryRoutes')

exports.routerInit = (app) => {
    app.use("/", indexR)
    app.use("/users", userR)
    app.use("/sites", siteR)
    app.use("/country", countryR)
}