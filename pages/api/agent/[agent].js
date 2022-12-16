import axios from "axios";
import fs from "fs";


/**
 * Agent 통신
 * @param req
 * @param res
 */
export default function handler(req, res) {
    const SERVICE = req.query.service;
    const NODE = req.query.node;
    const POD = req.query.pod;
    const PATH = `./config/service/${SERVICE}/${SERVICE}.json`;

    const ip = req.headers['x-forwarded-for'] ||  req.connection.remoteAddress;
    const krTime = new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).format(new Date())
    const date = new Date(krTime).toISOString().split('T')[0];
    const time = new Date(krTime).toTimeString().split(' ')[0];
    console.log(`${date}-${time} : ${ip} 에서 ${req.query.agent} 를 ${req.method} 메소드로 호출 하였습니다.`);

    fs.readFile(PATH, 'utf-8', async (err, data) => {
        if (err !== null) {
            console.error(err);
        } else {
            let agent = NODE !== undefined ? JSON.parse(data).node
                .filter(nodes => nodes.name === NODE)
                .reduce(nodes => nodes.agent) : '';
            const API = NODE !== undefined ? `${agent.agent.host}${agent.agent.port}` : '';

            /**
             * 공통 error 가 undefined가 아닐경우
             * Agent에서 error 발생 후 { "error" : 에러내용" } 으로 반환
             * 그대로 받아서 return
             * 반대로 error 가 없으면 Agent에 error 없음
             * { "message" : 내용 } 으로 반환 그대로 받아서 return
             * catch는 Console에서 Agent의 host와 port가 잘못되거나 Agent가 죽어서 연결 안 될 경우
             * { "error" : "연결 안됨" }로 return
             */
            switch (req.query.agent) {
                case 'health':
                    axios.get(API + '/health-check')
                        .then((resp) => {
                            if (resp.data.error !== undefined) {
                                return res.status(200).json(resp.data);
                            } else {
                                return res.status(200).json(resp.data);
                            }
                        })
                        .catch(() => {
                            return res.status(200).json({
                                error: "연결 안됨",
                            });
                        });
                    break;
                case 'restore' :
                    axios.put(API + '/load-balance/restore')
                        .then((resp) => {
                            if (resp.data.error !== undefined) {
                                return res.status(200).json(resp.data);
                            } else {
                                return res.status(200).json(resp.data);
                            }
                        })
                        .catch(() => {
                            return res.status(200).json({
                                error: "연결 안됨",
                            });
                        });
                    break;
                case 'lb':
                    let responses = []
                    for (let node of req.body.data.node) {
                        try {
                            let resp = await axios.get(`${node.agent.host}${node.agent.port}/load-balance`);
                            if (resp.data.error !== undefined) {
                                responses.push(resp.data);
                            } else {
                                responses.push(resp.data)
                            }
                        } catch (error) {
                            responses.push(error);
                        }
                    }
                    res.status(200).json(responses);
                    break;
                case 'exclude':
                    axios.put(API + `/load-balance/exclude?worker=${POD}`)
                        .then((resp) => {
                            if (resp.data.error !== undefined) {
                                return res.status(200).json(resp.data);
                            } else {
                                return res.status(200).json(resp.data);
                            }
                        })
                        .catch(() => {
                            return res.status(200).json({
                                error: "연결 안됨",
                            });
                        });
                    break;
                case 'deploy':
                    const parameters = req.query.parameters;
                    axios.put(API + `/webapp/deploy?worker=${POD}&arguments=${parameters}`)
                        .then((resp) => {
                            if (resp.data.error !== undefined) {
                                return res.status(200).json(resp.data);
                            } else {
                                return res.status(200).json(resp.data);
                            }
                        })
                        .catch(() => {
                            return res.status(200).json({
                                error: "연결 안됨",
                            });
                        });
                    break;
                case 'log':
                    const line = req.query.line;
                    axios.get(API + `/logs/tail/n?worker=${POD}&line=${line}`)
                        .then((resp) => {
                            if (resp.data.error !== undefined) {
                                return res.status(200).json(resp.data);
                            } else {
                                return res.status(200).json(resp.data);
                            }
                        })
                        .catch(() => {
                            return res.status(200).json({
                                error: "연결 안됨",
                            });
                        });
                    break;
                case 'sync':
                    switch (req.method) {
                        /**
                         * deprecated
                         * GET Method 사용 안하고 있음
                         */
                        case 'GET':
                            axios.get(API + `/sync`)
                                .then((resp) => {
                                    if (resp.data.error !== undefined) {
                                        return res.status(200).json(resp.data);
                                    } else {
                                        return res.status(200).json(resp.data.data);
                                    }
                                })
                                .catch(() => {
                                    return res.status(200).json({
                                        error: "연결 안됨",
                                    });
                                });
                            break;
                        case 'PUT':
                            let responses = []
                            for (let node of JSON.parse(req.body.data).node) {
                                try {
                                    let resp = await axios.put(`${node.agent.host}${node.agent.port}/sync`,
                                        JSON.stringify(node, null, 2)
                                    );
                                    if (resp.data.error !== undefined) {
                                        responses.push(resp.data);
                                    } else {
                                        responses.push(resp.data)
                                    }
                                } catch (error) {
                                    responses.push(error);
                                }
                            }
                            res.status(200).json(responses);
                            break;
                    }
                    break;
                case 'update':
                    switch (req.method) {
                        case 'POST':
                            let responses = []
                            for (let node of req.body.data.node) {
                                try {
                                    let resp = await axios.get(`${node.agent.host}${node.agent.port}/update/version`);

                                    if (resp.data.error !== undefined) {
                                        responses.push(resp.data);
                                    } else {
                                        responses.push(resp.data)
                                    }
                                } catch (error) {
                                    responses.push(error);
                                }
                            }
                            res.status(200).json(responses);
                            break;
                        case 'PUT':
                            axios.put(API + `/update/${req.query.version}`)
                                .then((resp) => {

                                })
                                .catch(() => {
                                    return res.status(200).json({
                                        error: "연결 안됨",
                                    });
                                });
                            break;
                    }
                    break;
            }
        }
    });
}
