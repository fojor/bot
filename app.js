const Service = require("./service.js");
const Storage = require("./storage.js");
const OrderType = require("./enums.js").OrderType;


let service = new Service();
let storage = new Storage();

async function start() {
    
    let orders = await service.getAllOrders();

    let bid = +orders.bids[0].price;
    let ask = +orders.asks[0].price;

    if(!storage.hasOrder(bid, OrderType.BUY)) {
        storage.removeAllOrders(OrderType.BUY);
        let order = {
            created: new Date().getTime(),
            price: bid,
            type: OrderType.BUY,
            amount: 50
        };
        storage.addOrder(order);

        console.log(`Размещаем ордер на покупку по цене ${bid}`);
    } 

    let trades = await service.getTrades();
    let closedOrders = [];

    trades.forEach(item => {
        let co = storage.getClosedOrders(item.price, OrderType.BUY, new Date().getTime());
        if(co.length) {
            closedOrders.push(co);
        }
    });
  
    closedOrders.forEach(item => {
        console.log(`Закрыли ордер на покупку по цене ${item.price}`);
    });
}

setInterval(start, 15 * 1000);