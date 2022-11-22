import axios from "axios";
import fs from "fs";

export default function handler(req, res) {
    const SERVICE = req.query.service;
    const NODE = req.query.node;
    const POD = req.query.pod;
    const PATH = `./config/service/${SERVICE}/${SERVICE}.json`;

    fs.readFile(PATH, 'utf-8', (err, data) => {
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
                            return res.status(200).json(resp.data);
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
                            return res.status(200).json(resp.data);
                        })
                        .catch(() => {
                            return res.status(200).json({
                                error: "Not Connect",
                            });
                        });
                    break;
                case 'lb':
                    req.body.data.node.map((node) => {
                        axios.get(`${node.agent.host}${node.agent.port}/load-balance`)
                            .then((resp) => {
                                return res.status(200).json(resp.data);
                            })
                            .catch(() => {
                                return res.status(200).json({
                                    error: "Not Connect",
                                });
                            });
                    });
                    break;
                case 'exclude':
                    axios.put(API + `/load-balance/exclude?worker=${POD}`)
                        .then((resp) => {
                            return res.status(200).json(resp.data);
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
                            return res.status(200).json(resp.data);
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
                            return res.status(200).json(resp.data);
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
                                    return res.status(200).json(resp.data.data);
                                })
                                .catch(() => {
                                    return res.status(200).json({
                                        error: "Not Connect",
                                    });
                                });
                            ;
                            break;
                        case 'PUT':
                            JSON.parse(req.body.data).node.map((node) => {
                                axios.put(
                                    `${node.agent.host}${node.agent.port}/sync`,
                                    JSON.stringify(node, null, 2)
                                ).then((resp) => {
                                    return res.status(200).json(resp.data);
                                }).catch(() => {
                                    return res.status(200).json({
                                        error: "Not Connect",
                                    });
                                });
                            });
                            break;
                    }
                    break;
            }
        }
    });
}