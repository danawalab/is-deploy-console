import fs from 'fs';

export default function handler(req, res) {
    let path
    if (req.method === 'GET') {
        if (req.query['service'] === 'config') {
            path = "./config/config.json"
        } else {
            path = `./config/service/${req.query['service']}/${req.query['service']}.json`
        }

        fs.readFile(path, 'utf-8', (err, data) => {
            if (err !== null) {
                console.error(err);
            } else {
                return res.status(200).json(data);
            }
        });
    }
}

