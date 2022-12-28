import axios from "axios";

export async function getAgentVersion(req, res, updateApi) {
    await axios.get(updateApi)
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

export async function agentUpdate(req, res, updateApi) {
    await axios.put(updateApi)
        .then((resp) => {

        })
        .catch(() => {
            return res.status(200).json({
                error: "연결 안됨",
            });
        });
}