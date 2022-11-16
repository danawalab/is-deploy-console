import fs from 'fs';

export default function handler(req, res) {

    const QUERY = req.query.service;
    const INIT_JSON = {
        "service": QUERY,
        "node": []
    }

    /**
     * req.query['service'] 가 config면 './config/config.json'
     * 아닐 경우 동적으로 경로가 지정된다 `./config/service/${req.query['service']}/${req.query['service']}.json`
     * @type {string|string}
     */
    let path = QUERY === 'config' ?
        './config/config.json' :
        `./config/service/${QUERY}/${QUERY.toLowerCase()}.json`;

    /**
     * json을 읽어 반환한다.
     */
    if (req.method === 'GET') {
        fileRead(path);
    }

    /**
     * 수정된 json 값을 받아 json 파일을 덮어 쓴다.
     */
    if (req.method === 'PUT') {
        // let json = JSON.stringify(JSON.parse(req.body),null, 2);
        let json = req.body.data;
        fs.writeFileSync(path, json, 'utf-8');
    }

    /**
     * 지정된 path에 있는 json을 읽어 반환한다.
     * 만약 path에 json이 없다면 초기 json을 만들고 재귀함수로 한 번 더 호출한다.
     * @param path
     */
    function fileRead(path) {
        fs.readFile(path, 'utf-8', (err, data) => {
            if (err !== null) {
                fs.mkdirSync(`./config/service/${QUERY}`);
                fs.writeFileSync(path, JSON.stringify(INIT_JSON, null, 2), 'utf-8');
                fileRead(path);
            } else {
                return res.status(200).json(data);
            }
        });
    }
}

