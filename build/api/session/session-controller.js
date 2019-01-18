"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sequelize = require("sequelize");
const nanoid = require("nanoid");
const uphold_sdk_javascript_1 = require("@uphold/uphold-sdk-javascript");
const Op = Sequelize.Op;
class UserController {
    constructor(configs) {
        this.path = {
            authorize: "/authorize/",
            clientId: null,
            intention: "?intention=",
            state: "&state=",
            scope: "&scope=accounts:read%20cards:read%20cards:write%20contacts:read%20contacts:write%20phones:read%20phones:write%20transactions:deposit%20transactions:read%20transactions:transfer:application%20transactions:transfer:others%20transactions:transfer:self%20transactions:withdraw%20user:read"
        };
        let Roles = configs.get("Roles");
        this.UserRoles = Roles.User;
        this.AuthReqRoles = Roles.Auth_req;
        this.baseUrl = "http://sandbox.uphold.com"; // Config.get('/upholdBaseURL');
        this.sdkBaseUrl = "https://api-sandbox.uphold.com";
        this.clientId = "92b60dcae7c59ee80254ebe10f6aa959f4aa128f"; // Config.get('/upholdClientId');
        this.clientSecret = "65164feb2c793b3d0409e0847685c3647f96b8e2"; // Config.get('/upholdClientSecret');
        this.path.clientId = this.clientId;
        this.frontendBaseUrl = configs.get("Frontend_host");
        this.frontendPort = configs.get("Frontend_port");
        this.frontendUrl = configs.get("Frontend_url");
    }
    async loginUser(request, h) {
        const intention = "login";
        const db = request.getDb();
        const authReqModel = db.getModel('Auth_req');
        // console.log(auth_req_model);
        if (request.pre.role === this.AuthReqRoles.Employee_login) {
            console.log("employee role");
            const state = nanoid();
            let authReq = {
                State: state,
                Role: this.AuthReqRoles.Employee_login
            };
            authReq = await authReqModel.findOrCreate({ where: { State: authReq.State, Role: authReq.Role } });
            authReq = authReq[0];
            return h.redirect(this.baseUrl + this.path.authorize + this.path.clientId + this.path.intention + intention + this.path.state + authReq.State + this.path.scope);
        }
        else {
            // todo: something went wrong reaching here. log it and proceed further.
            return false;
        }
    }
    async signupUser(request, h) {
        // todo: unfinished functionality
        const base_url = "http://sandbox.uphold.com"; // Config.get('/upholdBaseURL');
        const client_id = "92b60dcae7c59ee80254ebe10f6aa959f4aa128f"; // Config.get('/upholdClientId');
        const intention = "signup";
        if (request.pre.role.toString() === 'Employer') {
            console.log("employer role");
            // todo: save state to db with role as owner
            const state = "dummy"; // crypto.randomBytes(10).toString('hex');
            let auth_req = {
                state: state,
                purpose: "owner_signup"
            };
            //auth_req = await ;
            const path = "/authorize/" + client_id + "?intention=" + intention + "&state=" + auth_req.state + "&scope=accounts:read%20cards:read%20cards:write%20contacts:read%20contacts:write%20phones:read%20phones:write%20transactions:deposit%20transactions:read%20transactions:transfer:application%20transactions:transfer:others%20transactions:transfer:self%20transactions:withdraw%20user:read";
            // console.log(base_url);
            return h.redirect(base_url + path);
        }
        else if (request.pre.role.toString() === 'Employee') {
            console.log("employee role");
            // todo: save state to db with role as employee
            const state = "dummy_emp_state"; // todo: need to generate dynamically
            const path = "/authorize/" + client_id + "?intention=" + intention + "&state=" + state + "&scope=accounts:read%20cards:read%20cards:write%20contacts:read%20contacts:write%20phones:read%20phones:write%20transactions:deposit%20transactions:read%20transactions:transfer:application%20transactions:transfer:others%20transactions:transfer:self%20transactions:withdraw%20user:read";
            return h.redirect(base_url + path);
        }
        else {
            // todo: something went wrong reaching here. log it and proceed further.
            return false;
        }
    }
    async uphold(request, h) {
        console.log("Uphold Has Returned");
        const db = request.getDb();
        const authReqModel = db.getModel('Auth_req');
        const userModel = db.getModel('User');
        const employeeModel = db.getModel('Employee');
        let authReq = await authReqModel.findOne({
            where: {
                State: request.query.state
            }
        }).then(dbAuthReq => {
            return dbAuthReq.dataValues;
        });
        if (authReq) {
            console.log('auth_req found');
            console.log(authReq);
            if (authReq.State.length === 21) {
                if (authReq.Role === this.AuthReqRoles.Employer_login.toString()) {
                    console.log("employer_login is detected");
                    //get user from uphold
                    const sdk = new uphold_sdk_javascript_1.default({
                        baseUrl: this.sdkBaseUrl,
                        clientId: this.clientId,
                        clientSecret: this.clientSecret
                    });
                    let sdkAuth = await sdk.authorize(request.query.code)
                        .then(token => {
                        return token;
                    }, err => {
                        console.log(err);
                        return err;
                    });
                    console.log(sdkAuth);
                    let upholdUser = await sdk.getMe();
                    console.log(upholdUser);
                    let dbUser = await userModel.findOrCreate({
                        where: {
                            Uphold_id: upholdUser.id.toString()
                        },
                        defaults: {
                            Name: upholdUser.firstName,
                            Email: upholdUser.email,
                            Uphold_id: upholdUser.id.toString(),
                            Access_token: sdkAuth.access_token,
                            Refresh_token: sdkAuth.refresh_token,
                            Role: this.UserRoles.Employer,
                        }
                    }).then((db_user) => {
                        return { user: db_user[0], created: db_user[1] };
                    });
                    return h.redirect(this.frontendUrl + '/welcome/employer/' + dbUser.user.dataValues.User_id);
                }
                else if (authReq.Role === this.AuthReqRoles.Employee_login.toString()) {
                    console.log("employee_login is detected");
                    //get user from uphold
                    const sdk = new uphold_sdk_javascript_1.default({
                        baseUrl: this.sdkBaseUrl,
                        clientId: this.clientId,
                        clientSecret: this.clientSecret
                    });
                    let sdkAuth = await sdk.authorize(request.query.code)
                        .then(token => {
                        return token;
                    }, err => {
                        console.log(err);
                        return err;
                    });
                    let upholdUser = await sdk.getMe();
                    let dbUser = await userModel.findOrCreate({
                        where: {
                            Uphold_id: upholdUser.id.toString()
                        },
                        defaults: {
                            Name: upholdUser.firstName,
                            Email: upholdUser.email,
                            Uphold_id: upholdUser.id.toString(),
                            Access_token: sdkAuth.access_token,
                            Refresh_token: sdkAuth.refresh_token,
                            Role: this.UserRoles.Employee,
                        }
                    }).then((db_user) => {
                        return { user: db_user[0], created: db_user[1] };
                    });
                    console.log(dbUser.user);
                    console.log(dbUser.user.dataValues);
                    return h.redirect(this.frontendUrl + '/welcome/employee/' + dbUser.user.dataValues.User_id);
                }
                else if (authReq.Role === this.AuthReqRoles.Employer_register.toString()) {
                    return true;
                }
                else if (authReq.Role === this.AuthReqRoles.Employee_register.toString()) {
                    return true;
                }
            }
            else {
                return {
                    code: 401,
                    error: "unauthorised request"
                };
            }
        }
    }
}
exports.default = UserController;
