import fs from 'fs';

export default function handler(req, res) {
    /**
     * req.query['service'] 가 config면 './config/config.json'
     * 아닐 경우 동적으로 경로가 지정된다 `./config/service/${req.query['service']}/${req.query['service']}.json`
     * @type {string|string}
     */
    let path = isQueryConfig(req) ?
        './config/config.json' :
        `./config/service/${req.query['service']}/${req.query['service']}.json`;

    /**
     * json을 읽어 반환한다.
     */
    if (isMethodGet(req)) {
        fileRead(path);
    }

    /**
     * 수정된 json 값을 받아 json 파일을 덮어 쓴다.
     */
    if (isMethodPut(req)) {
        let json = JSON.stringify(JSON.parse(req.body),null, 2);
        fs.writeFileSync(path, json, 'utf-8');
    }

    /**
     * init.json을 만든다.
     */
    if (isMethodPost(req)) {
        let json = JSON.stringify(JSON.parse(req.body), null, 2);
        path = './config/service/init.json';
        fs.writeFileSync(path, json, 'utf-8');
    }

    /**
     * 지정된 path에 있는 json을 읽어 반환한다.
     * 만약 path가 없으면 path는 './config/service/init.json' 지정하고 재귀함 수로 한 번 더 호출한다.
     * @param path
     */
    function fileRead(path) {
        fs.readFile(path, 'utf-8', (err, data) => {
            if (err !== null) {
                path = './config/service/init.json';
                fileRead(path);
            } else {
                return res.status(200).json(data);
            }
        });
    }

    function isMethodGet(req) {
        return req.method === 'GET';
    }

    function isMethodPut(req) {
        return req.method === 'PUT';
    }

    function isMethodPost(req) {
        return req.method === 'POST';
    }

    function isQueryConfig(req) {
        return req.query['service'] === 'config';
    }
}

