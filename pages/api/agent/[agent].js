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
             * { "error" : "Not Connect" }로 return
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
                                error: "Not Connect",
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
                                error: "Not Connect",
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
                                error: "Not Connect",
                            });
                        });
                    break;
                case 'deploy':
                    axios.put(API + `/webapp/deploy?worker=${POD}`)
                        .then((resp) => {
                            if (resp.data.error !== undefined) {
                                return res.status(200).json(resp.data);
                            } else {
                                return res.status(200).json(resp.data);
                            }
                        })
                        .catch(() => {
                            return res.status(200).json({
                                error: "Not Connect",
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
                                error: "Not Connect",
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
                                        error: "Not Connect",
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
                                        error: "Not Connect",
                                    });
                                });
                            break;
                    }
                    break;
            }
        }
    });
}
