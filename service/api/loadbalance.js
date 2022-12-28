import {agentLog} from "./agentLog";
import axios from "axios";

export async function loadBalance(req, res, ip) {
    let responses = []
    for (let node of req.body.data.node) {
        try {
            let lbStatusApi = `${node.agent.host}${node.agent.port}/api/v1/load-balance`;
            agentLog(ip, lbStatusApi, 'GET');

            let resp = await axios.get(lbStatusApi);
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
}