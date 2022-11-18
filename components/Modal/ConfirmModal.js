import * as React from "react";
import axios from "axios";
import {Box, Button, Divider, Modal, Typography} from "@mui/material";
import styles from "./_modal.module.scss";

const API = 'http://localhost:3000/api/agent/'

export default function ConfirmModal({open, onClose, action, service, node, pod}) {
    const QUERY = `?service=${service}&node=${node}`;

    const exclude = () => {
        axios.post(API + '/exclude' + QUERY + `&pod=${pod}`);
        close();
    }

    const deploy = () => {
        axios.post(API + '/deploy' + QUERY + `&pod=${pod}`);
        close();
    }

    const close = () => {
        onClose();
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
                        정말 {pod}을 {action} 하시겠습니까?
                    </Typography>
                    <Divider className={styles.divider}/>
                    <Box className={styles.boxArea}>
                        <Button
                            variant={"contained"}
                            color={"primary"}
                            onClick={action === 'exclude' ? exclude : deploy}
                            className={styles.mL}
                        >
                            확인
                        </Button>
                        <Button
                            variant={"contained"}
                            color={"error"}
                            onClick={close}
                            className={styles.mL}
                        >
                            취소
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}