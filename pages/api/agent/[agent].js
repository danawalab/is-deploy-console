import axios from "axios";
import fs from "fs";

export default function handler(req, res) {
    let api;
    const POD_NAME = req.body.podName;
    const SERVICE = req.query.service;
    const NODE = req.query.node;

    let path = `./config/service/${SERVICE}/${SERVICE}.json`;
    fs.readFile(path, 'utf-8', (err, data) => {
        if (err !== null) {
            console.error(err);
        } else {
            let agent = JSON.parse(data)
                .node.filter(nodes => nodes.name === NODE)
                .reduce(nodes => nodes.agent)
            api = `http://${agent.agent.host}:${agent.agent.port}`;

            switch (req.query.agent) {
                case 'health':
                    axios.get(api + '/health-check')
                        .then((resp) => {
                            console.log(resp.data);
                            return res.status(200).json(resp.data);
                        });
                    break;
                case 'restore' :
                    axios.put(api + '/load-balance/restore')
                        .then((resp) => {
                            console.log(resp.data);
                            return res.status(200).json(resp.data);
                        });
                    break
                case 'exclude':
                    axios.put(api + `/load-balance/exclude?worker=${POD_NAME}`)
                        .then((resp) => {
                            console.log(resp.data);
                            return res.status(200).json(resp.data);
                        });
                    break;
                case 'deploy':
                    axios.put(api + `/webapp/deploy?worker=${POD_NAME}`)
                        .then((resp) => {
                            console.log(resp.data);
                            return res.status(200).json(resp.data);
                        });
                    break;
                case 'log':
                    axios.get(api + `/logs/tail/n?worker=${POD_NAME}&line=100`)
                        .then((resp) => {
                            console.log(resp.data);
                            return res.status(200).json(resp.data);
                        });
                    break;
                case 'sync':
                    switch (req.method) {
                        case 'GET':
                            axios.get(api + `/sync`)
                                .then((resp) => {
                                    return res.status(200).json(resp.data.data);
                                });
                            break;
                        case 'PUT':
                            axios.put(api + `/sync`)
                                .then((resp) => {
                                    console.log(resp.data);
                                    return res.status(200).json(resp.data);
                                });
                            break;
                    }
                    break;
            }
        }
    });
}