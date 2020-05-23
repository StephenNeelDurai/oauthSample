// async.js 2
function performAsync(fn, callback, ...args) {
    fn(...args).then((result) => {
        return callback(null, result);
    }).catch(callback);
}
// auth.js
const auth = require("auth");
async function register({ email }) { // password missing from the input fn call and here also.
    let result = await auth.register(email); // password missing.
    if (result === auth.ALREADY_REGISTERED) { // ALREADY_REGISTERED boolean should be returned from the result
        return login(user); //  password missing.
    }
    return result;
}
async function login(user, password) {
    let result = await auth.login(user, password);
    if (result === auth.UNREGISTERED) { // UNREGISTERED boolean should be returned from the result
        register(user); // here we should pass the password.
    }
    return result;
}
// app.js 
const express = require("express");
const bodyParser = require("body-parser");
const auth = require("./auth");
let app = express();
app.use(bodyParser.json());
app.get("/register", (request, response) => {
    let { email, password } = request.body;
    if (email && /@\w+\.\w+$/g.test(email) ||   // in regex check should also "@pomelofashion.com"
        email.endsWith("@pomelofashion.com")) {
        auth.register(email) // here we can use await and get result in a var  and password value missing in 2nd param
            .then((result) => {
                response.status(200).send({ message: "User registered" });
            });
    } // else case missing - 400 error response
});
app.post("/login", (request, response) => performAsync(async (request, response) => { // it's not clear for other devs. so we can only define path and function then seperate the other operation to another file action.js
    let user = request.body.user; //  we can destructuring let { user , password } = req.body;
    let password = request.body.password;
    let result = auth.login(user, password); // we should use await here await auth.login...
    return result;
}, (result) => { // there are two params the 2nd one is result first one always null from the callback.
    response.status(200).send(result); // here also result check missing for failure response.
}, request, response));
app.listen(3000); // we can use a function in 2nd param for log the server startup.
