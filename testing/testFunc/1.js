const obj = {
    foo: 1,
    bar: 2,
    get calculate() { 
        return this.foo+ this.bar
    }
}

console.log(obj.calculate);
obj.bar = 3;
console.log(obj.calculate);
