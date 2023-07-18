'use strict';

/**
 * order controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

// module.exports = createCoreController('api::order.order');
module.exports = createCoreController ('api::order.order', ({ strapi }) => ({
    async create(ctx) {
        const result = await super.create(ctx)
        console.log(result)
        const midtransClient = require('midtrans-client');
        // Create Snap API instance
        let snap = new midtransClient.Snap({
                isProduction : false,
                serverKey : 'SB-Mid-server-l6Vebemi1Lsv1PFACGzxl8c_',
                clientKey : 'SB-Mid-client-LMkAdESpL_N3bWO1'
            });

        let parameter = {
            "transaction_details": {
                "order_id": result.data.id,
                "gross_amount": result.data.attributes.totalPrice
            }, "credit_card":{
                "secure" : true
            }
        };


        let response = await snap.createTransaction(parameter)

        // Create Core API instance
        // const midtransClient = require('midtrans-client');
        // let core = new midtransClient.CoreApi({
        //         isProduction : false,
        //         serverKey : 'SB-Mid-server-l6Vebemi1Lsv1PFACGzxl8c_',
        //         clientKey : 'SB-Mid-client-LMkAdESpL_N3bWO1'
        //     });

        // let parameter = {
        //     "payment_type": "gopay",
        //     "transaction_details": {
        //         "gross_amount": result.data.attributes.totalPrice,
        //         "order_id": result.data.id,
        //     },
        //     "credit_card":{
        //         "token_id": 'CREDIT_CARD_TOKEN', // change with your card token
        //         "authentication": true
        //     }
        // };

        // let response = await core.charge(parameter)
        return response
    }
}));