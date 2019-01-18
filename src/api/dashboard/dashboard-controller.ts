import * as Hapi from "hapi";
import {isNumber} from "util";
import SDK from "@uphold/uphold-sdk-javascript";


export default class DashboardController {
    public async getDashboard(request: Hapi.Request, h: Hapi.ResponseToolkit) {
        const db = request.getDb();
        const userModel = db.getModel('User');
        let dashboardData = {
            assetCards: [],
            userName: null,
            totalAssets: null
        };

        let user = await userModel.findOne({where:{
            User_id: request.payload.user
        }}).then(user => {
            dashboardData.userName = user.dataValues.Name;
            return user;
        });
    const clientId = "92b60dcae7c59ee80254ebe10f6aa959f4aa128f"; // Config.get('/upholdClientId');
    const clientSecret = "65164feb2c793b3d0409e0847685c3647f96b8e2"; // Config.get('/upholdClientSecret');
    const sdk = new SDK({
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

    let maxCards = 3;
    let currCardNo = 0;

    for (let card of upholdCards) {
        if (currCardNo < maxCards) {
            let cardObj = {
                label: card.label,
                currency: card.currency,
                amt: card.balance
            };
            dashboardData.assetCards.push(cardObj);
            currCardNo++;
        }
    }

    let upholdDetails = await sdk.getMe();
    dashboardData.totalAssets = upholdDetails.balances.total;
    console.log(dashboardData);
    return h.response(dashboardData);
    }
}

