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

    const save = async () => {
        if (isOpen(textAreaOpen)) {
            alert("수정을 비활성화해주세요.");
        } else {
            await axios.put(`http://localhost:3000/api/${id}`, json, {
                "headers": {
                    "content-type": "application/text",
                },
            });
        }
    }

    const sync = async () => {
        if (isOpen(textAreaOpen)) {
            alert("수정을 비활성화해주세요.");
        } else {
            console.log("sync");
        }
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
                        ) : <></>}
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}