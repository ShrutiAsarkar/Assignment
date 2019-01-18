"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PaymentController {
    // public async paymentController(request: Hapi.Request, h: Hapi.ResponseToolkit) {
    //     return "base path";
    // }
    async paymentController(request, h) {
        let userId = request.payload.user;
        const db = request.getDb();
        const userModel = db.getModel('User');
        const transModel = db.getModel('Transaction');
        let paymentData = {
            employee: null,
            transactionList: []
        };
        let user = await userModel.findOne({ where: {
                User_id: userId
            } }).then(user => {
            paymentData.employee = user.dataValues;
            return user;
        });
        let transaction = await transModel.findAll({
            where: {
                Pay_to_email: user.dataValues.Email
            }
        }).then(trans => {
            return trans;
        });
        for (let trans of transaction) {
            let empObj = {
                currency: trans.dataValues.Currency,
                Amount: trans.dataValues.Amount,
                Date: trans.dataValues.Date
            };
            paymentData.transactionList.push(empObj);
        }
        return h.response(paymentData);
    }
}
exports.default = PaymentController;
