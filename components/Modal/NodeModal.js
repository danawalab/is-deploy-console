import {Box, Button, Divider, Modal, TextareaAutosize, Typography} from "@mui/material";
import styles from "./_modal.module.scss";
import * as React from "react";
import {useState} from "react";
import axios from "axios";

export default function NodeModal({open, onClose, service, nodeName}) {
    const [textAreaOpen, setTextAreaOpen] = useState(true);
    const handleTextArea = () => setTextAreaOpen(!textAreaOpen);
    const [json, setJson] = useState();
    const API = `http://localhost:3000/api/agent/sync?service=${service}&node=${nodeName}`;

    /**
     * agent로 부터 setting.json을 불러온다
     * @returns {Promise<void>}
     */
    const getJson = async () => {
        if (isOpen(textAreaOpen)) {
            alert("수정을 비활성화해주세요.");
        } else {
            await axios.get(API)
                .then((resp) => {
                    setJson(JSON.stringify(resp.data, null, 2));
                });
        }
    }

    /**
     * agent에게 변경된 setting.json 정보를 보내 동기화 시킨다
     * @returns {Promise<void>}
     */
    const sync = async () => {
        if (isOpen(textAreaOpen)) {
            alert("수정을 비활성화해주세요.");
        } else {
            await axios.put(API, {
                data: json
            });
        }
    }

    const isOpen = (open) => {
        return open === false;
    }

    // 모달창 꺼지면 수정 비홯성화
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
                            minRows={4}
                            value={json}
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
                            onClick={getJson}
                            className={styles.mL}
                        >
                            json 불러오기
                        </Button>
                        <Button
                            variant={"contained"}
                            color={"success"}
                            onClick={sync}
                            className={styles.mL}
                        >
                            동기화
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );

}