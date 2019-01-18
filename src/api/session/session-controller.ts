import * as Hapi from "hapi";
import * as Sequelize from "sequelize";
import * as nanoid from 'nanoid';

import SDK from "@uphold/uphold-sdk-javascript";

const Op = Sequelize.Op;

export default class UserController {
    private UserRoles;
    private AuthReqRoles;
    private readonly baseUrl;
    private readonly sdkBaseUrl;
    private readonly clientId;
    private readonly clientSecret;
    private path =
        {
            authorize: "/authorize/",
            clientId: null,
            intention: "?intention=",
            state: "&state=",
            scope: "&scope=accounts:read%20cards:read%20cards:write%20contacts:read%20contacts:write%20phones:read%20phones:write%20transactions:deposit%20transactions:read%20transactions:transfer:application%20transactions:transfer:others%20transactions:transfer:self%20transactions:withdraw%20user:read"
        };
    private readonly frontendBaseUrl;
    private readonly frontendUrl;
    private readonly frontendPort;

    constructor(configs) {
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

    public async loginUser(request: Hapi.Request, h: Hapi.ResponseToolkit) {
        const intention = "login";
        const db = request.getDb();
        const authReqModel = db.getModel('Auth_req');
        // console.log(auth_req_model);

        if (request.pre.role === this.AuthReqRoles.Employer_login) {
            console.log("employer role");
            const state = nanoid();
            let authReq = {
                State: state,
                Role: this.AuthReqRoles.Employer_login
            };
            authReq = await authReqModel.findOrCreate({where: {State: authReq.State, Role: authReq.Role}});
            authReq = authReq[0];

            return h.redirect(this.baseUrl + this.path.authorize + this.path.clientId + this.path.intention + intention + this.path.state + authReq.State + this.path.scope);
        } else if (request.pre.role === this.AuthReqRoles.Employee_login) {
            console.log("employee role");
            const state = nanoid();
            let authReq = {
                State: state,
                Role: this.AuthReqRoles.Employee_login
            };
            authReq = await authReqModel.findOrCreate({where: {State: authReq.State, Role: authReq.Role}});
            authReq = authReq[0];
            return h.redirect(this.baseUrl + this.path.authorize + this.path.clientId + this.path.intention + intention + this.path.state + authReq.State + this.path.scope);
        } else {
            // todo: something went wrong reaching here. log it and proceed further.
            return false;
        }
    }

    public async signupUser(request: Hapi.Request, h: Hapi.ResponseToolkit) {

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
        } else if (request.pre.role.toString() === 'Employee') {
            console.log("employee role");
            // todo: save state to db with role as employee
            const state = "dummy_emp_state"; // todo: need to generate dynamically
            const path = "/authorize/" + client_id + "?intention=" + intention + "&state=" + state + "&scope=accounts:read%20cards:read%20cards:write%20contacts:read%20contacts:write%20phones:read%20phones:write%20transactions:deposit%20transactions:read%20transactions:transfer:application%20transactions:transfer:others%20transactions:transfer:self%20transactions:withdraw%20user:read";
            return h.redirect(base_url + path);
        } else {
            // todo: something went wrong reaching here. log it and proceed further.
            return false;
        }

    }

    public async uphold(request: Hapi.Request, h: Hapi.ResponseToolkit) {
        console.log("Uphold Has Returned");
        const db = request.getDb();
        const authReqModel = db.getModel('Auth_req');
        const userModel = db.getModel('User');
        const employeeModel = db.getModel('Employee');

        let authReq = await authReqModel.findOne({where:{
                State:request.query.state
            }}).then(dbAuthReq => {
            return dbAuthReq.dataValues;
        });

        if (authReq) {
            console.log('auth_req found');
            console.log(authReq);
            if (authReq.State.length === 21) {
                if (authReq.Role === this.AuthReqRoles.Employer_login.toString()) {
                    console.log("employer_login is detected");

                    //get user from uphold

                    const sdk = new SDK({
                        baseUrl: this.sdkBaseUrl,
                        clientId: this.clientId,
                        clientSecret: this.clientSecret
                    });

                    let sdkAuth =  await sdk.authorize(request.query.code)
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
                        where:{
                            Uphold_id: upholdUser.id.toString()
                        },
                        defaults:{
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

                    return h.redirect(this.frontendUrl +  '/welcome/employer/' + dbUser.user.dataValues.User_id);
                } else if (authReq.Role === this.AuthReqRoles.Employee_login.toString()) {
                    console.log("employee_login is detected");
                    //get user from uphold

                    const sdk = new SDK({
                        baseUrl: this.sdkBaseUrl,
                        clientId: this.clientId,
                        clientSecret: this.clientSecret
                    });

                    let sdkAuth =  await sdk.authorize(request.query.code)
                        .then(token => {
                            return token;
                        }, err => {
                            console.log(err);
                            return err;
                        });


                    let upholdUser = await sdk.getMe();
                    let dbUser = await userModel.findOrCreate({
                        where:{
                            Uphold_id: upholdUser.id.toString()
                        },
                        defaults:{
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

                    return h.redirect(this.frontendUrl  + '/welcome/employee/' + dbUser.user.dataValues.User_id);
                } else if (authReq.Role === this.AuthReqRoles.Employer_register.toString()) {
                    return true;
                } else if (authReq.Role === this.AuthReqRoles.Employee_register.toString()) {
                    return true;
                }
            } else {
                if (authReq.Role === this.AuthReqRoles.Employee_invite.toString()) {
                    console.log("employee_invite is detected");
                    //get user from uphold

                    const sdk = new SDK({
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

                    // let encodedState = request.query.state;
                    // let decodedState = this.caesarShift(encodedState.toString(), -1);
                    let stateEmpId = request.query.state.slice(21);

                    let dbEmployee = await employeeModel.findOne({
                        where: {
                            Emp_id: stateEmpId
                        }
                    });

                    console.log(dbEmployee);

                    let db_user = await userModel.findOrCreate({
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
                            Company_id: dbEmployee.dataValues.Company_id
                        }
                    }).then((db_user) => {
                        return {user: db_user[0], created: db_user[1]};
                    });

                    console.log(db_user.user.dataValues);

                    await employeeModel.update({
                            User_id: db_user.user.dataValues.User_id
                        },
                        {
                            where: {
                                Emp_id: stateEmpId
                            }
                        });

                    return h.redirect(this.frontendUrl + '/welcome/employee/' + db_user.user.dataValues.User_id);
                } else {
                    return {
                        code: 401,
                        error: "unauthorised request"
                    };
                }
            }
        } else {
            return {
                code:401,
                error:"unauthorised request"
            };
        }
    }

    public async inviteEmployee(request: Hapi.Request, h: Hapi.ResponseToolkit) {
        console.log("in invite emp");

        const intention = "login";
        const db = request.getDb();
        const auth_req_model = db.getModel('Auth_req');

        console.log(request.query.emp);

        if (request.pre.role === this.AuthReqRoles.Employee_invite) {
            console.log("employee role");
            let state = nanoid();

            state = state.toString() + request.query.emp;
            // state = this.caesarShift(state, 1);

            let authReq = {
                State: state,
                Role: this.AuthReqRoles.Employee_invite
            };
            authReq = await auth_req_model.findOrCreate({where: {State: authReq.State, Role: authReq.Role}});
            authReq = authReq[0];

            return h.redirect(this.baseUrl + this.path.authorize + this.path.clientId + this.path.intention + intention + this.path.state + authReq.State + this.path.scope);
        } else {
            return true;
        }
    }

    // public async authenticate(request: Hapi.Request, h: Hapi.ResponseToolkit) {
    //     console.log("in authenticate");
    //     let bString = atob(request.payload.user.toString());
    //     console.log(bString);
    //     let userId = crypto.AES.decrypt(bString, 'secret').toString(crypto.enc.Utf8);
    //     console.log(userId);
    //     let respObj = {
    //         userId: request.payload.user.toString()
    //     };
    //     return respObj;
    // }

    // public caesarShift (str: String, amount: number) {
    //
    //     // Wrap the amount
    //     if (amount < 0) {
    //         return this.caesarShift(str, amount + 26);
    //     }
    //
    //     // Make an output variable
    //     let output = '';
    //
    //     // Go through each character
    //     for (let i = 0; i < str.length; i ++) {
    //
    //         // Get the character we'll be appending
    //         let c = str[i];
    //
    //         // If it's a letter...
    //         if (c.match(/[a-z]/i)) {
    //
    //             // Get its code
    //             let code = str.charCodeAt(i);
    //
    //             // Uppercase letters
    //             if ((code >= 65) && (code <= 90)) {
    //                 c = String.fromCharCode(((code - 65 + amount) % 26) + 65);
    //             } else if ((code >= 97) && (code <= 122)) {
    //                 c = String.fromCharCode(((code - 97 + amount) % 26) + 97);
    //             }
    //             // Lowercase letters
    //
    //         }
    //
    //         // Append
    //         output += c;
    //
    //     }
    //
    //     // All done!
    //     return output;
    //
    // }

}
