import * as React from "react";
import axios from "axios";
import {Box, Button, Divider, Modal, TextField, Typography} from "@mui/material";
import styles from "./_modal.module.scss";
import {useState} from "react";

export default function ConfirmModal({
                                         open,
                                         onClose,
                                         action,
                                         service,
                                         node,
                                         pod,
                                         setAlertOpen,
                                         setAlertType,
                                         setAlertMessage,
                                         handleClickQuery
                                     }) {

    const API = '/api/agent/';
    const QUERY = `?service=${service}&node=${node}`;

    const [parameters, setParameters] = useState();

    const changeParameters = (e) => {
        setParameters(e.target.value);
    }

    const exclude = () => {
        handleClickQuery();
        axios.post(API + '/exclude' + QUERY + `&pod=${pod}`)
            .then((resp) => {
                setAlertMessage(JSON.stringify(resp.data.message));
                setAlertType('success');
                setAlertOpen(true)
                if (resp.data.error !== undefined) {
                    setAlertMessage(JSON.stringify(resp.data.error));
                    setAlertType('error');
                    setAlertOpen(true)
                }
            });
        close();
    }

    const deploy = () => {
        if (parameters === undefined || parameters === null) {
            setAlertMessage('인수 값을 넣어주세요, 인수 값이 없다면 스페이스를 누르고 확인을 눌러주세요');
            setAlertType('error');
            setAlertOpen(true)
        } else {
            axios.post(API + '/deploy' + QUERY + `&pod=${pod}&parameters=${parameters}`)
                .then((resp) => {
                    setAlertMessage(JSON.stringify(resp.data.message));
                    setAlertType('success');
                    setAlertOpen(true)
                    if (resp.data.error !== undefined) {
                        setAlertMessage(JSON.stringify(resp.data.error));
                        setAlertType('error');
                        setAlertOpen(true)
                    }
                });
            close();
        }
    }

    const close = () => {
        onClose();
    }

    return (
        <div>
            <Modal
                open={open}
                onClose={onClose}
                aria-labelledby={"modal-modal-title"}
                aria-describedby={"modal-modal-description"}
                className={styles.modal}
            >
                <Box className={styles.box}>
                    <Typography className={styles.title}>
                        정말 {pod}을 {action === 'exclude' ? '제외' : '배포'} 하시겠습니까?
                    </Typography>
                    {action !== 'exclude' ? (
                        <TextField
                            id={"outlined-basic"}
                            label={"쉘스크립트 인수 값"}
                            variant={"outlined"}
                            size={"small"}
                            onChange={(e) => changeParameters(e)}
                            className={styles.textField}
                        />
                    ) : <></>}
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
