import {agentLog} from "./agentLog";
import axios from "axios";

export async function update(req, res, updateApi, ip) {
    if (req.method === 'POST') {
        let responses = []
        for (let node of req.body.data.node) {
            try {
                let updateCheckApi = `${node.agent.host}${node.agent.port}/api/v1/update/version`;
                agentLog(ip, updateCheckApi, 'GET');

                let resp = await axios.get(updateCheckApi);
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
    } else if (req.method === 'PUT') {
        axios.put(updateApi)
            .then((resp) => {

            })
            .catch(() => {
                return res.status(200).json({
                    error: "연결 안됨",
                });
            });
    }
}