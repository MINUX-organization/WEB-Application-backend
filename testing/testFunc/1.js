const obj = {
    x: 20,
    get y() {
        return this.x;
    }
}
console.log(obj.y)