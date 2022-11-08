import * as React from 'react';
import {useEffect, useState} from 'react';
import {Box, Button, Divider, Modal, TextareaAutosize, Typography} from '@mui/material';
import styles from './_modal.module.scss'
import axios from "axios";


export default function JsonModal({open, onClose, config, data, id}) {
    const [textAreaOpen, setTextAreaOpen] = useState(true);
    const handleTextArea = () => setTextAreaOpen(!textAreaOpen);
    const [json, setJson] = useState();

    useEffect(() => {
        setJson(data);
    }, [data])

    /**
     * 수정한 json을 저장한다.
     * 만약 수정 버튼이 활성화돼있다면 alert를 통해 수정 버튼을 비활성화 유도한다.
     * @returns {Promise<void>}
     */
    const save = async () => {
        if (isOpen(textAreaOpen)) {
            alert("수정을 비활성화해주세요.");
        } else {
            // axios는 값을 object 형태로 감싸서 서버로 보내기에 content-type을 text로 지정해 그대로 넘기게 변경
            await axios.put(`http://localhost:3000/api/${id}`, json, {
                "headers": {
                    "content-type": "application/text",
                },
            });
        }
    }

    /**
     * console에 수정된 json을 agent에 동기화해준다.
     * @returns {Promise<void>}
     */
    const sync = async () => {
        if (isOpen(textAreaOpen)) {
            alert("수정을 비활성화해주세요.");
        } else {
            console.log("sync");
        }
    }

    /**
     * init.json을 만들어 준다.
     * 첫 화면에서 json을 수정해 새 서비스를 정의했을 때 init.json을 보는데
     * init.json이 없으면 오류가 나기에 없어졌을 경우를 위한 기능
     * @returns {Promise<void>}
     */
    const createInitJson = async () => {
        let init = {
            "service": "",
            "consoleInfo": {
                "address": ""
            },
            "agentInfo": {
                "name": "",
                "ip": "",
                "port": ""
            },
            "node": []
        }

        await axios.post("http://localhost:3000/api/${id}", init, {
            "headers": {
                "content-type": "application/text",
            },
        });
    }

    const isOpen = (open) => {
        return open === false;
    }

    if (open === false && textAreaOpen === false) {
        setTextAreaOpen(true);
    }

    return (
        <div>
            <Modal
                open={open}
                onClose={onClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className={styles.modal}
            >
                <Box className={styles.box}>
                    <Typography className={styles.title}>
                        JSON 수정
                    </Typography>
                    <Divider className={styles.divider}/>
                    <Box className={styles.boxArea}>
                        <TextareaAutosize
                            className={styles.textArea}
                            disabled={textAreaOpen}
                            maxRows={4}
                            defaultValue={data}
                            onChange={(e) => setJson(e.target.value)}
                        />
                    </Box>
                    <Divider className={styles.divider}/>
                    <Box className={styles.boxArea}>
                        <Button
                            variant={"contained"}
                            color={"error"}
                            onClick={handleTextArea}
                            className={styles.mL}
                        >
                            수정
                        </Button>
                        <Button
                            variant={"contained"}
                            color={"primary"}
                            onClick={save}
                            className={styles.mL}
                        >
                            저장
                        </Button>
                        {config === false ? (
                            <Button
                                variant={"contained"}
                                color={"success"}
                                onClick={sync}
                                className={styles.mL}
                            >
                                동기화
                            </Button>
                        ) : (
                            <Button
                                variant={"contained"}
                                color={"success"}
                                onClick={createInitJson}
                                className={styles.mL}
                            >
                                init.json 생성
                            </Button>
                        )}
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}