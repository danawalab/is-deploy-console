import axios from "axios";
import {agentLog} from "./agentLog";

export function agentHealthCheck(req, res, healthApi) {
    axios.get(healthApi)
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

export async function tomcatHealthCheck(req, res, ip) {
    let responses = []
    for (let node of req.body.data.node) {
        try {
            for (let pod of node.podList) {
                try {
                    let tomcatHealthAPi = `${node.agent.host}${node.agent.port}/api/v1/health-check/tomcat?worker=${pod.name}`;
                    agentLog(ip, tomcatHealthAPi, 'GET');

                    let resp = await axios.get(tomcatHealthAPi);

                    if (resp.data.error !== undefined) {
                        responses.push(resp.data);
                    } else {
                        responses.push(resp.data)
                    }
                } catch (error) {
                    responses.push(error);
                }
            }
        } catch (error) {
            responses.push(error);
        }
    }
    res.status(200).json(responses);
}