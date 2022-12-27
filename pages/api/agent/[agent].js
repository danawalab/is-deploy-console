import fs from "fs";
import {restore} from "../../../service/api/restore";
import {agentLog} from "../../../service/api/agentLog";
import {agentHealthCheck, tomcatHealthCheck} from "../../../service/api/health";
import {loadBalance} from "../../../service/api/loadbalance";
import {exclude} from "../../../service/api/exclude";
import {deploy} from "../../../service/api/deploy";
import {log} from "../../../service/api/log";
import {setting} from "../../../service/api/setting";
import {agentUpdate, update} from "../../../service/api/update";


/**
 * Agent 통신
 * @param req
 * @param res
 */
export default function handler(req, res) {
    const service = req.query.service;
    const node = req.query.node;
    const pod = req.query.pod;
    const path = `./config/service/${service}/${service}.json`;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    fs.readFile(path, 'utf-8', async (err, data) => {
        if (err !== null) {
            console.error(err);
        } else {
            let agent = node !== undefined ? JSON.parse(data).node
                .filter(nodes => nodes.name === node)
                .reduce(nodes => nodes.agent) : '';
            const API = node !== undefined ? `${agent.agent.host}${agent.agent.port}/api/v1` : '';

            /**
             * 공통 error 가 undefined가 아닐경우
             * Agent에서 error 발생 후 { "error" : 에러내용" } 으로 반환
             * 그대로 받아서 return
             * 반대로 error 가 없으면 Agent에 error 없음
             * { "message" : 내용 } 으로 반환 그대로 받아서 return
             * catch는 Console에서 Agent의 host와 port가 잘못되거나 Agent가 죽어서 연결 안 될 경우
             * { "error" : "연결 안됨" }로 return
             */
            switch (req.query.agent) {
                case 'health':
                    const healthApi = API + '/health-check/agent';
                    agentLog(ip, healthApi, 'GET');
                    agentHealthCheck(req, res, healthApi);
                    break;
                case 'tomcat-health':
                    await tomcatHealthCheck(req, res, ip)
                    break;
                case 'restore' :
                    const restoreApi = API + '/load-balance/restore';
                    agentLog(ip, restoreApi, 'PUT');
                    restore(req, res, restoreApi);
                    break;
                case 'lb':
                    await loadBalance(req, res, ip);
                    break;
                case 'exclude':
                    const excludeApi = API + `/load-balance/exclude?worker=${pod}`;
                    agentLog(ip, excludeApi, 'PUT');
                    exclude(req, res, excludeApi);
                    break;
                case 'deploy':
                    const parameters = req.query.parameters;
                    const deployApi = API + `/deploy/shell?worker=${pod}&arguments=${parameters}`;
                    agentLog(ip, deployApi, 'PUT');
                    deploy(req, res, deployApi);
                    break;
                case 'log':
                    const line = req.query.line;
                    const logApi = API + `/logs?worker=${pod}&line=${line}`
                    agentLog(ip, logApi, 'GET');
                    log(req, res, logApi);
                    break;
                case 'setting':
                    await setting(req, res, ip);
                    break;
                case 'update':
                    if (req.method === 'POST') {
                        await update(req, res, ip);
                    } else if (req.method === 'PUT') {
                        const updateApi = API + `/update/${req.query.version}`;
                        await agentUpdate(req, res, updateApi);
                        agentLog(ip, updateApi, 'PUT');
                    }
                    break;
            }
        }
    });
}
