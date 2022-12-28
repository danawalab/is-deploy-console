import axios from "axios";

export function log(req, res, logApi) {
    axios.get(logApi)
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
}