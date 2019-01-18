"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uphold_sdk_javascript_1 = require("@uphold/uphold-sdk-javascript");
class PayrollController {
    async payrollController(request, h) {
        // This controller controls behaviour for base route /employee
        return "base path";
    }
    // This controller controls behaviour for base route /employee
    async payrollCreationController(request, h) {
        let reqData = request.payload;
        console.log(reqData);
        let userId = reqData.data.id;
        const db = request.getDb();
        const userModel = db.getModel('User');
        const empModel = db.getModel('Employee');
        const payrollModel = db.getModel('Payroll');
        const payrollDetailsModel = db.getModel('Payroll_details');
        let user = await userModel.findOne({ where: {
                User_id: userId
            } });
        let companyId = user.dataValues.Company_id;
        let dbPayroll = await payrollModel.create({
            Company_id: companyId,
            Payroll_name: reqData.data.payrollName,
            // Run_date: DataTypes.DATE,
            //   First_date:DataTypes.DATE,
            //   End_date:DataTypes.DATE,
            Total_amt: reqData.data.totalAmt,
        }).then((dbPayroll) => {
            console.log("created:", dbPayroll);
            return dbPayroll;
        });
        let dbPayrollDetails = null;
        if (dbPayroll) {
            console.log(dbPayroll.dataValues);
            console.log(reqData.data.empData);
            for (let emp of reqData.data.empData) {
                // let db_emp = await emp_model.findOne({where:{
                //         Emp_id: emp.emp_id
                // }});
                console.log(emp);
                dbPayrollDetails = await payrollDetailsModel.create({
                    payroll_id: dbPayroll.dataValues.payroll_id,
                    Emp_id: emp.empId,
                    Hours: emp.hours,
                    Taxes: emp.taxes,
                    Benefits: emp.benefits,
                    Total_amt: emp.subTotal,
                    Processed: 0
                });
                if (dbPayrollDetails) {
                    await empModel.update({ Payroll_id: dbPayroll.dataValues.payroll_id }, {
                        where: {
                            Emp_id: emp.empId
                        }
                    });
                    dbPayrollDetails = null;
                }
            }
            return true;
        }
        else {
            return false;
        }
    }
    async payrollList(request, h) {
        let reqData = request.payload;
        console.log(reqData);
        let userId = reqData.user;
        let payrollList = [];
        const db = request.getDb();
        const userModel = db.getModel('User');
        const payrollModel = db.getModel('Payroll');
        let user = await userModel.findOne({ where: {
                User_id: userId
            } });
        let payrolls = await payrollModel.findAll({
            where: {
                Company_id: user.dataValues.Company_id
            }
        }).then(payrolls => {
            console.log("found this: ");
            console.log(payrolls);
            return payrolls;
        });
        for (let payroll of payrolls) {
            console.log("in for loop");
            // let payroll_id = payroll.dataValues.payroll_id.toString();
            //     user_model.findOne({
            //     where: {
            //         User_id: employee.dataValues.User_id.toString()
            //     }
            // }).then(emp => {
            //     return emp.dataValues.Name;
            // });
            let payrollObj = {
                id: payroll.dataValues.payroll_id.toString(),
                total_amt: payroll.dataValues.Total_amt.toString(),
                name: payroll.dataValues.Payroll_name.toString()
                // last_pay_date: payroll.dataValues.Last_pay_date.toString()
            };
            payrollList.push(payrollObj);
        }
        if (payrollList.length > 0) {
            return h.response(payrollList);
        }
        else {
            return null;
        }
    }
    async runPayroll(request, h) {
        let reqData = request.payload;
        let userId = reqData.user;
        let payrollId = reqData.payroll;
        const db = request.getDb();
        const userModel = db.getModel('User');
        const payrollModel = db.getModel('Payroll');
        const payrollDetailsModel = db.getModel('Payroll_details');
        const transactionModel = db.getModel('Transaction');
        const employeeModel = db.getModel('Employee');
        const clientId = "92b60dcae7c59ee80254ebe10f6aa959f4aa128f"; // Config.get('/upholdClientId');
        const clientSecret = "65164feb2c793b3d0409e0847685c3647f96b8e2"; // Config.get('/upholdClientSecret');
        let dbUser = await userModel.findOne({ where: {
                User_id: userId
            } });
        const sdk = new uphold_sdk_javascript_1.default({
            baseUrl: 'https://api-sandbox.uphold.com',
            clientId: clientId,
            clientSecret: clientSecret
        });
        sdk.setToken({
            access_token: dbUser.dataValues.Access_token,
            refresh_token: dbUser.dataValues.Refresh_token
        });
        let upholdCards = await sdk.getCards().then(paginatorObj => {
            return paginatorObj.items;
        });
        console.log(upholdCards);
        // let uphold_user = await sdk.getMe();
        //
        // console.log(uphold_user);
        // let db_payroll = await payrollModel.findOne({where:{
        //     Payroll_id: payrollId
        // }});
        let dbPayrollDetails = await payrollDetailsModel.findAll({ where: {
                Payroll_id: payrollId
            } });
        let baseDate = new Date();
        let date = baseDate.getUTCFullYear().toString() + '-' + (baseDate.getUTCMonth() + 1).toString() + '-' + baseDate.getUTCDate().toString();
        let payrollProcessed = false;
        // console.log(date);
        for (let record of dbPayrollDetails) {
            let currRecord = record.dataValues;
            let currEmp = await employeeModel.findOne({ where: {
                    Emp_id: currRecord.Emp_id
                } }).then(emp => { return emp.dataValues; });
            let currEmpUser = await userModel.findOne({ where: {
                    User_id: currEmp.User_id
                } }).then(user => { return user.dataValues; });
            let dbTransaction = await transactionModel.create({
                Date: date,
                Payroll_id: payrollId,
                Amount: currRecord.Total_amt,
                Currency: "USD",
                Pay_to_id: currEmpUser.Email,
                Pay_to_name: currEmpUser.Name,
                Pay_to_email: currEmpUser.Email,
                Status: 0
            });
            let transactionCard = upholdCards.find(card => card.currency === dbTransaction.dataValues.Currency);
            // let db_emp_user = await user_model.findOne({where:{
            //         Email: currEmp.Email
            //     }});
            let transBody = {
                "amount": currRecord.Total_amt,
                "currency": "USD",
                "destination": currEmpUser.Email
            };
            let upholdTrans = await sdk.createCardTransaction(transactionCard.id, transBody, true).then(result => {
                console.log("result of transaction :");
                console.log(result);
                return result;
            }, reason => {
                console.log("reason: ");
                console.log(reason);
            });
            if (upholdTrans.status === 'completed') {
                payrollProcessed = true;
                await transactionModel.update({
                    Uphold_trans_id: upholdTrans.id,
                    Status: 1
                }, {
                    where: {
                        Trans_id: dbTransaction.dataValues.Trans_id
                    }
                });
            }
            else {
                payrollProcessed = false;
                await transactionModel.update({
                    Uphold_trans_id: upholdTrans.id
                }, {
                    where: {
                        Trans_id: dbTransaction.dataValues.Trans_id
                    }
                });
                // todo: transaction failed handler
            }
        }
        return payrollProcessed;
    }
}
exports.default = PayrollController;
