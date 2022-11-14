export default function handler(req, res) {
    const json = {
        service: req.query.service,
        node: req.query.node,
        pod: req.query.pod,
    };

    return res.status(200).json(json);
}