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
                                         handleClickQuery,
                                         setShellLog,
                                         setQuery
                                     }) {

    const API = '/api/agent/';
    const query = `?service=${service}&node=${node}`;

    const [parameters, setParameters] = useState();

    const changeParameters = (e) => {
        setParameters(e.target.value);
    }

    const exclude = () => {
        handleClickQuery();
        axios.post(API + '/exclude' + query + `&pod=${pod}`)
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

    const deploy = async () => {
        if (parameters === undefined || parameters === null) {
            setAlertMessage('인수 값을 넣어주세요, 인수 값이 없다면 스페이스를 누르고 확인을 눌러주세요');
            setAlertType('error');
            setAlertOpen(true)
        } else {
            close();
            setQuery('deployProgress')
            await axios.post(API + '/deploy' + query + `&pod=${pod}&parameters=${parameters}`)
                .then((resp) => {
                    setAlertMessage(JSON.stringify(resp.data.message));
                    setShellLog(resp.data.output)
                    setAlertType('success');
                    setAlertOpen(true)
                    setQuery('idle');
                    if (resp.data.error !== undefined) {
                        setAlertMessage(JSON.stringify(resp.data.error));
                        setAlertType('error');
                        setAlertOpen(true)
                        setQuery('idle');
                    }
                });
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
                            helperText={"인수 값이 여러 개일 경우 띄어쓰기를 통해서 주세요 ex) 5000 profile=prod -f"}
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
