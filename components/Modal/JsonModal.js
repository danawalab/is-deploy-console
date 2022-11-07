import * as React from 'react';
import {useState} from 'react';
import {Box, Button, Divider, Modal, TextareaAutosize, Typography} from '@mui/material';
import styles from './_modal.module.scss'


export default function JsonModal({open, onClose, config, data}) {
    const [textAreaOpen, setTextAreaOpen] = useState(true);
    const handleTextArea = () => setTextAreaOpen(!textAreaOpen);

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
                        />
                    </Box>
                    <Divider className={styles.divider}/>
                    <Box className={styles.boxArea}>
                        <Button
                            variant={"contained"}
                            color={"error"}
                            onClick={handleTextArea}
                            className={styles.btn}
                        >
                            수정
                        </Button>
                        <Button
                            variant={"contained"}
                            color={"primary"}
                            className={styles.btn}
                        >
                            저장
                        </Button>
                        {config === false ? (
                            <Button
                                variant={"contained"}
                                color={"success"}
                                className={styles.btn}
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