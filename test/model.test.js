const json = "../config/config.json"
const obj = JSON.parse(json)

describe('json', function () {
    let name = obj.name
    it('should ', function () {
        expect(name === "EX1")
    });
});
