export class Cars {

    constructor(name, price) {
        this.name = name;
        this.price = price;
        this.amo = 'some amo'
    }
    changePrice(price) {
        this.price = price;
    }
}