import axios from "axios";

export default function handler(req, res) {

    if (req.query['agent'] === 'health') {
        const health = axios.get('http://localhost:5000/health-check')
            .then((resp) => {
                console.log(resp.data);
                return res.status(200).json(resp.data);
            });
    }

    if (req.query['agent'] === 'restore') {
        const restore = axios.put('http://localhost:5000/load-balance/restore')
            .then((resp) => {
                console.log(resp.data);
                return res.status(200).json(resp.data);
            });
    }

    if (req.query['agent'] === 'exclude') {
        const restore = axios.put(`http://localhost:5000/load-balance/exclude?worker=${req.body}`)
            .then((resp) => {
                console.log(resp.data);
                return res.status(200).json(resp.data);
            });
    }

    if (req.query['agent'] === 'deploy') {
        const restore = axios.put(`http://localhost:5000/webapp/deploy?worker=${req.body}`)
            .then((resp) => {
                console.log(resp.data);
                return res.status(200).json(resp.data);
            });
    }

    if (req.query['agent'] === 'log') {
        const restore = axios.get(`http://localhost:5000/logs/tail/n?worker=${req.body}&line=100`)
            .then((resp) => {
                console.log(resp.data);
                return res.status(200).json(resp.data);
            });
    }
}