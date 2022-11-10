import axios from "axios";

export default function handler(req, res) {
    const API = 'http://localhost:5000'

    if (req.query['agent'] === 'health') {
        const health = axios.get(API + '/health-check')
            .then((resp) => {
                console.log(resp.data);
                return res.status(200).json(resp.data);
            });
    }

    if (req.query['agent'] === 'restore') {
        const restore = axios.put(API + '/load-balance/restore')
            .then((resp) => {
                console.log(resp.data);
                return res.status(200).json(resp.data);
            });
    }

    if (req.query['agent'] === 'exclude') {
        const restore = axios.put(API + `/exclude?worker=${req.body}`)
            .then((resp) => {
                console.log(resp.data);
                return res.status(200).json(resp.data);
            });
    }

    if (req.query['agent'] === 'deploy') {
        const restore = axios.put(API + `/webapp/deploy?worker=${req.body}`)
            .then((resp) => {
                console.log(resp.data);
                return res.status(200).json(resp.data);
            });
    }

    if (req.query['agent'] === 'log') {
        const restore = axios.get(API + `/logs/tail/n?worker=${req.body}&line=100`)
            .then((resp) => {
                console.log(resp.data);
                return res.status(200).json(resp.data);
            });
    }

    if (req.query['agent'] === 'sync') {
        const restore = axios.get(API + `/sync`)
            .then((resp) => {
                console.log(resp.data);
                return res.status(200).json(resp.data);
            });
    }
}