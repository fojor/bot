const fetch = require('node-fetch');
const crypto = require('crypto');

const domain = 'https://kuna.io';
const key    = '';
const secret = '';
const market = 'btcuah';

module.exports = class Service 
{
    constructor() 
    {
       
    }

    getAllOrders() {
        //GET https://kuna.io/api/v2/order_book?market=btcuah

        const method = 'GET';
        const path = '/api/v2/order_book';

        let url = `${domain}${path}?market=${market}`;

        return fetch(url, { method: method })
                    .then(response => response.json())
                    .catch(function(err) {  
                        console.log('getAllOrders erorr', err);  
                    });
    }

    getTrades() {
        //GET https://kuna.io/api/v2/trades?market=btcuah

        const method = 'GET';
        const path = '/api/v2/trades';

        let url = `${domain}${path}?market=${market}`;

        return fetch(url, { method: method })
                    .then(response => response.json())
                    .catch(function(err) {  
                        console.log('getTrades erorr', err);  
                    });
    }

    getMyOrders() {
        //GET https://kuna.io/api/v2/orders
        //market — btcuah

        const method = 'GET';
        const path = '/api/v2/orders';
        const date = new Date().getTime();
        const hash = crypto.createHmac('sha256', secret)
                    .update(`${method}|${path}|access_key=${key}&market=${market}&tonce=${date}`)
                    .digest('hex');

        let url = `${domain}${path}?access_key=${key}&tonce=${date}&market=${market}&signature=${hash}`;

        return fetch(url, { method: method })
                    .then(response => response.json())
                    .catch(function(err) {  
                        console.log('getMyOrders erorr', err);  
                    });
    }

    addOrder() {
        //POST https://kuna.io/api/v2/orders
        // side — buy или sell
        // volume — объём ордера в биткоинах
        // market — btcuah
        // price — цена за один биткоин

        let data = {
            side: 'sell',
            volume: '8.0',
            market: market,
            price: '0.000924'
        };

        const method = 'POST';
        const path = '/api/v2/orders';
        const date = new Date().getTime();
        const hash = crypto.createHmac('sha256', secret)
                    .update(`${method}|${path}|access_key=${key}&market=${data.market}&price=${data.price}&side=${data.side}&tonce=${date}&volume=${data.volume}`)
                    .digest('hex');

        let url  = `${domain}${path}?access_key=${key}&market=${data.market}&price=${data.price}&side=${data.side}&tonce=${date}&volume=${data.volume}&signature=${hash}`;

        return fetch(url, { method: method })
                    .then(response => response.json())
                    .catch(function(err) {  
                        console.log('addOrder erorr', err);  
                    });
    }

    deleteOrder(id) {
        //POST https://kuna.io/api/v2/order/delete
        //id — идентификатор ордера

        const method = 'POST';
        const path = '/api/v2/order/delete';
        const date = new Date().getTime();
        const hash = crypto.createHmac('sha256', secret)
                    .update(`${method}|${path}|access_key=${key}&id=${id}&tonce=${date}`)
                    .digest('hex');

        let url  = `${domain}${path}?access_key=${key}&id=${id}&tonce=${date}&signature=${hash}`;

        return fetch(url, { method: method })
                    .then(response => response.json())
                    .catch(function(err) {  
                        console.log('deleteOrder erorr', err);  
                    });
    }
};
