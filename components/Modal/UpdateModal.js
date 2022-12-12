import * as React from "react";
import axios from "axios";
import {Box, Button, Divider, Modal, TextField, Typography} from "@mui/material";
import styles from "./_modal.module.scss";
import {useState} from "react";

export default function UpdateModal({
                                        open,
                                        onClose,
                                        service,
                                        node,
                                    }) {

    const API = '/api/agent/';
    const QUERY = `?service=${service}&node=${node}`;
    // const REGEX = '/([1-9]).([0-9]|[1-9][0-9]).([0-9])/';

    const [version, setVersion] = useState('');

    const changeVersion = (e) => {
        setVersion(e.target.value);
    }

    const update = () => {
        axios.put(API + '/update' + QUERY + "&version=" + version)
            .then((resp) => {

            });
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
                    <TextField
                        id="outlined-basic"
                        label="version"
                        variant="outlined"
                        onChange={(e) => changeVersion(e)}
                    />
                    <Typography className={styles.title}>
                        정말 {node}의 에이전트를 업데이트/롤백 하시겠습니까?
                    </Typography>
                    <Divider className={styles.divider}/>
                    <Box className={styles.boxArea}>
                        <Button
                            variant={"contained"}
                            color={"primary"}
                            onClick={update}
                            className={styles.mL}
                        >
                            업데이트
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