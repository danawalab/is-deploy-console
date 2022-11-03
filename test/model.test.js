const json = require("../config/config.json");

describe('json ', function () {
    let name = json.serviceList[0].name
    it('should ', function () {
        expect(name === "EX1")
    });
});
