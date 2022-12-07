import * as React from 'react';
import styles from './_code.module.scss';

export default function Init() {
    const exampleJson = {
        "service": "",
        "node": [
            {
                "name": "",
                "agent": {
                    "host": "",
                    "port": ":"
                },
                "path": "",
                "lbMap": [
                    {
                        "key": "",
                        "value": ""
                    }
                ],
                "podList": [
                    {
                        "name": "",
                        "lbMap": [
                            {
                                "key": "",
                                "value": ""
                            }
                        ],
                        "logPath": "",
                        "shPath": ""
                    }
                ]
            }
        ]
    }

    return (
        <div>
            <div>오른쪽 상단의 톱니바퀴를 눌러 JSON을 수정해 Node와 Pod를 만드세요</div>
            <p>JSON 양식</p>
            <pre className={styles.code}>
                <code>
                    {JSON.stringify(exampleJson, null, 2)}
                </code>
            </pre>
        </div>
    );
}