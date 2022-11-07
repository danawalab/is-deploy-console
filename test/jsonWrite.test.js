const json = require("../config/config.json");
const fs = require("fs");

describe('json ', function () {
    let testJson = {
        "test": "wow"
    };
    let j = JSON.stringify(testJson);
    fs.readFile("./config.json", 'utf-8', (err, data) => {
        fs.writeFileSync("./test/config.json", j, 'utf-8');
    })

    it('write ', function () {
        expect(json.test === "wow")
    });
});
