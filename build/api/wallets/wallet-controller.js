"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uphold_sdk_javascript_1 = require("@uphold/uphold-sdk-javascript");
class WalletController {
    // public async paymentController(request: Hapi.Request, h: Hapi.ResponseToolkit) {
    //     return "base path";
    // }
    async walletController(request, h) {
        let userId = request.payload.user;
        const db = request.getDb();
        const userModel = db.getModel('User');
        let walletData = {
            employee: null,
            totalAssets: null,
            assetCards: []
        };
        let user = await userModel.findOne({ where: {
                User_id: request.payload.user
            } }).then(user => {
            walletData.employee = user.dataValues;
            console.log("inside wallet:", user);
            return user;
        });
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
        let upholdCards = await sdk.getCards().then(paginatorObj => {
            return paginatorObj.items;
        });
        for (let card of upholdCards) {
            let cardObj = {
                label: card.label,
                currency: card.currency,
                amt: card.balance
            };
            walletData.assetCards.push(cardObj);
        }
        let upholdDetails = await sdk.getMe();
        walletData.totalAssets = upholdDetails.balances.total;
        console.log("inside wallllllleeettttt", walletData);
        return h.response(walletData);
    }
}
exports.default = WalletController;
