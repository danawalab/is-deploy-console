import * as React from "react";
import axios from "axios";
import {Box, Button, Divider, Modal, TextField, Typography} from "@mui/material";
import styles from "./_modal.module.scss";
import {useEffect, useState} from "react";
import Grid from "@mui/material/Unstable_Grid2";

export default function UpdateModal({
                                        open,
                                        onClose,
                                        service,
                                        node,
                                    }) {

    const API = '/api/agent/';
    const query = `?service=${service}&node=${node}`;

    const [version, setVersion] = useState('');
    const [agentVersion, setAgentVersion] = useState('');
    const [latestVersion, setLatestVersion] = useState('');

    useEffect(() => {
        axios.get("/api/update")
            .then((resp) => {
                setLatestVersion(resp.data)
            });

        axios.get(`${API}/update${query}`)
            .then((resp) => {
                setAgentVersion(resp.data.message);
            })
    }, [query])

    const changeVersion = (e) => {
        setVersion(e.target.value);
    }

    const update = () => {
        close();
        axios.put(`${API}/update${query}&version=${version}`)
            .then((resp) => {
            });
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
                        {node}의 에이전트를 업데이트/롤백 하시겠습니까?
                    </Typography>
                    {/*{agentVersion === latestVersion ? '최신버전입니다.' : '업데이트가 존재합니다'}*/}
                    <Grid container>
                        <Grid xs={6}>
                            <div className={styles.version}>
                                {`설치된 에이전트 버전: ${agentVersion}`}
                            </div>
                        </Grid>
                        <Grid xs={6}>
                            <div className={styles.version}>
                                {`에이전트 최신 버전: ${latestVersion}`}
                            </div>
                        </Grid>
                    </Grid>
                    <Typography className={styles.version}>
                    </Typography>
                    <TextField
                        id={"outlined-basic"}
                        label={"version"}
                        variant={"outlined"}
                        size={"small"}
                        onChange={(e) => changeVersion(e)}
                        className={styles.textField}
                    />
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