if (typeof localStorage === 'undefined' || localStorage === null) {
    let LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

const orders_key = 'orders';
const balance_key = 'balance';

let _get = (key) => {
    let obj = localStorage.getItem(key);
    return obj ? JSON.parse(obj) : _initialValue(key);
};

let _set = (key, value) => {
    if(!value) {
        value = _initialValue(key);
    }
    localStorage.setItem(key, JSON.stringify(value));
};

let _initialValue = (key) => {
    switch (key) {
        case orders_key:
          return [];
        case balance_key:
          return { btc: 0, uah: 0 };
      }
};

module.exports = class Storage 
{
    addOrder(order) {
        let orders = _get(orders_key);
        orders.push(order);
        _set(orders_key, orders);
    }

    hasOrder(price, type) {
        let orders = _get(orders_key);
        return !!orders.find(item => item.price === price && item.type === type);
    }

    removeOrder(price, type) {
        let orders = _get(orders_key);
        let filtered = orders.filter(item => !(item.price === price && item.type === type));
        _set(orders_key, filtered);
    }

    getAllOrders() {
        return _get(orders_key);
    }

    getClosedOrders(price, type, time) {
        let orders = _get(orders_key);
        return orders.filter(item => 
                    item.price === price && 
                    item.type === type &&
                    item.time < time);
    }

    removeAllOrders(type) {
        if(type) {
            let orders = _get(orders_key);
            let filtered = orders.filter(item => item.type !== type);    
            _set(orders_key, filtered);
        }
        else {
            _set(orders_key, null);
        }
    }

    getBalance() {
        return _get(balance_key);
    }

    setBalance(balance) {
        return _set(balance_key, balance);
    }
}