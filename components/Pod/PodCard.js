import {Box, Button, Card, CardContent, Divider, Typography} from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2'
import styles from "./_podCard.module.scss";
import * as React from "react";
import {useState} from "react";
import axios from "axios";
import {router} from "next/router";
import ConfirmModal from "../Modal/ConfirmModal";
import CustomAlert from "../alert/CustomAlert";
import useInterval from "../../service/useInterval";

const API = 'http://localhost:3000/api/agent/'

const CardHeader = ({json, node, changeRestore}) => {
    const [open, setOpen] = useState(false);
    const [type, setType] = useState('error');
    const [message, setMessage] = useState('');
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const restore = async () => {
        await axios.get(API + `/restore?service=${json.service}&node=${node}`)
            .then((resp) => {
                setMessage(JSON.stringify(resp.data.message));
                setType('success');
                setOpen(true)
            })
            .catch((resp) => {
                setMessage(JSON.stringify(resp.data.message));
                setType('error');
                setOpen(true)
            });
        changeRestore();
    }

    const healthCheck = async () => {
        await axios.get(API + `/health?service=${json.service}&node=${node}`)
            .then((resp) => {
                setMessage(JSON.stringify(resp.data.message));
                setType('success');
                setOpen(true)
            })
            .catch((resp) => {
                setMessage(JSON.stringify(resp.data.message));
                setType('error');
                setOpen(true)
            });
    }

    return (
        <Grid container>
            <Grid xs={6} md={8} xl={8}>
                <Typography
                    variant="h5"
                    component="div"
                >
                    {node}
                </Typography>
            </Grid>
            <Grid xs={6} md={4} xl={4}>
                <Button
                    variant={"contained"}
                    size={"small"}
                    color={"secondary"}
                    onClick={restore}
                    className={styles.btn}
                >
                    Restore
                </Button>
                <Button
                    variant={"contained"}
                    size={"small"}
                    color={"warning"}
                    onClick={healthCheck}
                    className={styles.btn}
                >
                    Agent Health Check
                </Button>
                <CustomAlert
                    open={open}
                    onClose={handleClose}
                    type={type}
                    message={message}
                />
            </Grid>
        </Grid>
    );
}

const CardBody = ({json, index, restore, changeRestoreFalse, timer}) => {
    const [excludeStatus, setExcludeStatus] = useState(false);
    const [excludePodIndex, setExcludePodIndex] = useState(0);
    const [action, setAction] = useState();
    const [podName, setPodName] = useState();

    const [modalOpen, setModalOpen] = useState(false);
    const modalHandleOpen = () => setModalOpen(!modalOpen);

    const [alertOpen, setAlertOpen] = useState(false);
    const [type, setType] = useState('error');
    const [message, setMessage] = useState('');
    const alertHandleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlertOpen(false);
    };

    const exclude = async (podName) => {
        setAction('exclude');
        setPodName(podName);
        modalHandleOpen();
        changeRestoreFalse();
    }

    const deploy = async (podName) => {
        setAction('deploy');
        setPodName(podName);
        modalHandleOpen();
    }

    const log = (service, node, pod) => {
        router.push({
                pathname: `/service/log/${pod}?service=${service}&node=${node}`,
                query: {
                    service: service,
                    node: node,
                    pod: pod,
                },
            },
            `/service/log/${pod}?service=${service}&node=${node}`
        );
    }

    useInterval(() => {
        axios.post(API + `/lb?service=${json.service}`, {
            data: json
        }).then((resp) => {
            json.node.map((node, nodeIndex) => {
                nodeIndex === index ? node.podList.map((pod, podIndex) => {
                    if (resp.data.message === pod.name) {
                        setExcludeStatus(true);
                        setExcludePodIndex(podIndex);
                    }
                }) : null
            })
        });
    }, timer)

    return (
        <Grid container>
            {json.node.map((node, nodeIndex) => (
                nodeIndex === index ? node.podList.map((pod, podIndex) => (
                    <Grid key={pod} xs={12} md={6} xl={6}>
                        <Box
                            className={restore === true ? styles.box : excludeStatus === false ? styles.box
                                : podIndex === excludePodIndex ? styles.excludeBox : styles.box}
                        >
                            <Grid container>
                                <Grid xs={12} className={styles.mL}>
                                    <div className={styles.podTitle}>
                                        {restore === true ? pod.name : excludeStatus === false ? pod.name
                                            : podIndex === excludePodIndex ? pod.name + " Exclude" : pod.name}
                                    </div>
                                </Grid>
                                <Grid xs={4}>
                                    <Button
                                        variant={"contained"}
                                        size={"small"}
                                        color={"error"}
                                        onClick={() => exclude(pod.name)}
                                        className={styles.mL}
                                    >
                                        Exclude
                                    </Button>
                                </Grid>
                                <Grid xs={4}>
                                    <Button
                                        variant={"contained"}
                                        size={"small"}
                                        color={"primary"}
                                        onClick={() => deploy(pod.name)}
                                        className={styles.mL}
                                    >
                                        Deploy
                                    </Button>
                                </Grid>
                                <Grid xs={4}>
                                    <Button
                                        variant={"contained"}
                                        size={"small"}
                                        color={"success"}
                                        onClick={() => log(json.service, node.name, pod.name)}
                                        className={styles.mL}
                                    >
                                        Log
                                    </Button>
                                </Grid>
                                <ConfirmModal
                                    open={modalOpen}
                                    onClose={modalHandleOpen}
                                    action={action}
                                    service={json.service}
                                    node={node.name}
                                    pod={podName}
                                    setAlertOpen={setAlertOpen}
                                    setType={setType}
                                    setMessage={setMessage}
                                />
                                <CustomAlert
                                    open={alertOpen}
                                    onClose={alertHandleClose}
                                    type={type}
                                    message={message}
                                />
                            </Grid>
                        </Box>
                    </Grid>
                )) : <></>
            ))}
        </Grid>
    );
}

export default function PodCard({json, node, index}) {
    const [restore, setRestore] = useState(false);
    const [intervalTimer, setIntervalTimer] = useState(300000);

    const changeRestoreTrue = () => {
        setRestore(true);
        setIntervalTimer(300000);
    }

    const changeRestoreFalse = () => {
        setRestore(false);
        setIntervalTimer(1000);

        setTimeout(() => {
            setIntervalTimer(60000);
        }, 30000);
    }

    return (
        <>
            <Box sx={{minWidth: 275}}>
                <Card variant="outlined" className={styles.card}>
                    <CardContent>
                        <CardHeader
                            json={json}
                            node={node}
                            changeRestore={changeRestoreTrue}
                        />
                    </CardContent>
                    <Divider/>
                    <CardContent>
                        <CardBody
                            json={json}
                            index={index}
                            restore={restore}
                            changeRestoreFalse={changeRestoreFalse}
                            timer={intervalTimer}
                        />
                    </CardContent>
                </Card>
            </Box>
        </>
    );
}