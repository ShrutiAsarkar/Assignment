"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uphold_sdk_javascript_1 = require("@uphold/uphold-sdk-javascript");
class UserController {
    async getEmployeeAccountdetails(request, h) {
        const db = request.getDb();
        const empModel = db.getModel('Employee');
        const companyModel = db.getModel('Company');
        console.log("USer_id:", request.payload);
        let userId = request.payload.user;
        console.log("USer_id:", userId);
        let profileData = {
            personalDetails: null,
            jobDetails: null,
            userName: null
        };
        let employee = await empModel.findOne({
            where: {
                User_id: userId
            }
        }).then(employee => {
            return employee;
        });
        let company = await companyModel.findOne({
            where: {
                User_id: employee.Company_id
            }
        }).then(company => {
            console.log("company:", company);
            return company;
        });
        profileData.personalDetails = employee;
        profileData.jobDetails = company;
        console.log(profileData);
        return h.response(profileData);
    }
    async getEmployerAccountdetails(request, h) {
        const db = request.getDb();
        const userModel = db.getModel('User');
        const companyModel = db.getModel('Company');
        const empModel = db.getModel('Employee');
        console.log("USer_id:", request.payload);
        let userId = request.payload.user;
        let profileData = {
            personalDetails: null,
            companyDetails: null,
            userName: null,
        };
        let user = await userModel.findOne({
            where: {
                User_id: userId
            }
        }).then(user => {
            return user;
        });
        let company = await companyModel.findOne({
            where: {
                User_id: user.Company_id
            }
        }).then(company => {
            console.log("company:", company);
            return company;
        });
        profileData.personalDetails = {
            Name: null,
            birthdate: null,
            email: null,
            phoneNo: null
        };
        if (company) {
            profileData.companyDetails = {
                Name: company.Name,
                address: company.Address,
                phone: company.Phone,
                empNo: null
            };
            let employee = await empModel.findAndCountAll({
                where: {
                    Company_id: user.Company_id
                }
            }).then(employee => {
                return employee;
            });
            profileData.companyDetails.empNo = employee.count;
        }
        const clientId = "92b60dcae7c59ee80254ebe10f6aa959f4aa128f"; // Config.get('/upholdClientId');
        const clientSecret = "65164feb2c793b3d0409e0847685c3647f96b8e2"; // Config.get('/upholdClientSecret');
        const sdk = new uphold_sdk_javascript_1.default({
            baseUrl: 'https://api-sandbox.uphold.com',
            clientId: clientId,
            clientSecret: clientSecret
        });
        sdk.setToken({
            access_token: user.dataValues.Access_token,
            refresh_token: user.dataValues.Refresh_token
        });
        let upholdDetails = await sdk.getMe();
        console.log("Uphold Details:", upholdDetails);
        let phones = await sdk.getPhones();
        console.log("Uphold phones:", phones);
        profileData.personalDetails.Name = user.Name;
        profileData.personalDetails.email = user.Email;
        profileData.personalDetails.birthdate = upholdDetails.birthdate;
        // profileData.companyDetails.Name = company.Name;
        // profileData.companyDetails.addres = company.Address;
        // profileData.companyDetails.phone = company.Phone;
        console.log(profileData);
        return h.response(profileData);
    }
}
exports.default = UserController;
