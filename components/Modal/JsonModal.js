import * as React from 'react';
import {useEffect, useState} from 'react';
import {Box, Button, Divider, Modal, TextareaAutosize, Typography} from '@mui/material';
import styles from './_modal.module.scss'
import axios from "axios";


export default function JsonModal({open, onClose, data, service}) {
    const [textAreaOpen, setTextAreaOpen] = useState(true);
    const handleTextArea = () => setTextAreaOpen(!textAreaOpen);
    const [json, setJson] = useState();
    const API = `http://localhost:3000/api/${service.toLowerCase()}`;
    const AGENT_API =  `http://localhost:3000/api/agent/sync?service=${service}`;

    useEffect(() => {
        setJson(data);
    }, [data])

    /**
     * 수정한 json을 저장한다.
     * @returns {Promise<void>}
     */
    const save = async () => {
        if (service === 'config') {
            await axios.put(API, {
                data: json,
            });
        } else {
            await axios.put(API, {
                data: json,
            });

            await axios.put(AGENT_API, {
                data: json,
            });
        }
        close();
    }

    const close = () => {
        onClose();
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
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}