import axios from "axios";
import fs from "fs";

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
                    axios.get(API + `/logs/tail/n?worker=${POD}&line=100`)
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
            }
        }
    });
}
