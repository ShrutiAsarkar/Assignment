"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CompanyController {
    companyController(request, h) {
        // This controller controls behaviour for base route /companies
        return {
            "route": "/companies"
        };
    }
    async companySetupController(request, h) {
        let reqData = request.payload.data;
        let userId = reqData.id;
        const db = request.getDb();
        const companyModel = db.getModel('Company');
        const userModel = db.getModel('User');
        let dbCompany = await companyModel.findOrCreate({
            where: {
                User_id: userId
            },
            defaults: {
                User_id: parseInt(userId, 10),
                Name: reqData.company.companyName.toString(),
                Phone: isNaN(parseInt(reqData.company.companyPhone, 10)) ? null : parseInt(reqData.company.companyPhone, 10),
                Address: reqData.company.singleAdd.toString(),
                Signatory_name: reqData.company.companySignatory.name.toString(),
                Signatory_position: reqData.company.companySignatory.position.toString(),
                Signatory_email: reqData.company.companySignatory.email.toString(),
                Signatory_phone: isNaN(parseInt(reqData.company.companySignatory.phone, 10)) ? null : parseInt(reqData.company.companySignatory.phone, 10),
                Federal_ein: isNaN(parseInt(reqData.company.taxInfo.fedEin, 10)) ? null : parseInt(reqData.company.taxInfo.fedEin, 10),
                Company_type: reqData.company.taxInfo.companyType.toString(),
                EDD_acc_no: isNaN(parseInt(reqData.company.taxInfo.eddNo, 10)) ? null : parseInt(reqData.company.taxInfo.eddNo, 10),
                SUI_rate: isNaN(parseInt(reqData.company.taxInfo.suiRate, 10)) ? null : parseInt(reqData.company.taxInfo.suiRate, 10),
                ETT_rate: isNaN(parseFloat(reqData.company.taxInfo.ettRate)) ? null : parseFloat(reqData.company.taxInfo.ettRate),
                Pay_period: isNaN(parseInt(reqData.company.paySchedule.payPeriod, 10)) ? null : parseInt(reqData.company.paySchedule.payPeriod, 10),
            }
        }).then((dbCompany) => {
            return { company: dbCompany[0], created: dbCompany[1] };
        });
        if (dbCompany) {
            await userModel.update({ Company_id: dbCompany.company.dataValues.Company_id }, { where: {
                    User_id: userId
                } });
            console.log(dbCompany.company.dataValues);
            return true;
        }
        else {
            return false;
        }
    }
}
exports.default = CompanyController;
