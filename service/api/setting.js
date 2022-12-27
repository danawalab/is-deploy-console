import {agentLog} from "./agentLog";
import axios from "axios";

export async function setting(req, res, ip) {
    let responses = []
    for (let node of JSON.parse(req.body.data).node) {
        try {
            let syncApi = `${node.agent.host}${node.agent.port}/api/v1/setting`;
            agentLog(ip, syncApi, 'PUT');

            let resp = await axios.put(syncApi,
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
}