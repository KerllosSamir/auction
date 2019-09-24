const cron = require("node-cron");
const Product = require('../Models/product');
const bidsController = require('../Controllers/bids.controller');

module.exports = {
    init: () => {
        cron.schedule("* * * * *", function () {
            console.log("running a task every minute");
            Product.find()
                .then(products => {
                    let date = new Date();
                    for (let p of products) {
                        if( date - p.end_time > 0){
                            bidsController.sell(p);
                        }
                    }
                }).catch(err => {
                console.log("error in cron job", err);
            });
        });
    }
}
