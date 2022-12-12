import {Box, Button, Card, CardContent, CircularProgress, Divider, Fade, Typography} from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2'
import styles from "./_podCard.module.scss";
import * as React from "react";
import {useEffect, useState} from "react";
import axios from "axios";
import {router} from "next/router";
import ConfirmModal from "../Modal/ConfirmModal";
import useInterval from "../../service/useInterval";
import UpdateModal from "../Modal/UpdateModal";

const API = '/api/agent/'

const CardHeader = ({
                        json,
                        node,
                        index,
                        changeRestore,
                        setAlertOpen,
                        setAlertType,
                        setAlertMessage,
                        query,
                        setQuery
                    }) => {

    const [modalOpen, setModalOpen] = useState(false);
    const modalHandleOpen = () => setModalOpen(!modalOpen);
    const restore = async () => {
        await axios.get(API + `/restore?service=${json.service}&node=${node}`)
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
        changeRestore();
        setQuery('idle');
    }

    const healthCheck = async () => {
        await axios.get(API + `/health?service=${json.service}&node=${node}`)
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
    }

    const updateAgent = () => {
        modalHandleOpen();
    }

    useEffect(() => {
        axios.get("/api/update")
            .then((resp) => {
                const version = resp.data;

                axios.post(API + `/update?service=${json.service}`, {
                    data: json
                }).then((resp) => {
                    json.node.map((node, nodeIndex) => {
                        if (nodeIndex === index) {
                            const agentVersion = resp.data[nodeIndex];
                            console.log(agentVersion);
                            if (version !== agentVersion) {
                                setAlertMessage('Agent New Version Upload, Please Update Agent');
                                setAlertType('success');
                                setAlertOpen(true)
                            }
                        }
                    })
                })
            })
    }, [])


    return (
        <Grid container>
            <Grid xs={6} md={8} xl={8}>
                <Typography
                    variant="h5"
                    component="div"
                >
                    {node}
                </Typography>
                <Box sx={{height: 40}}>
                    {query === 'success' ? (
                        <Typography>Success!</Typography>
                    ) : query === 'failed' ? (
                        <Typography>Failed!</Typography>
                    ) : (
                        <Fade
                            in={query === 'progress'}
                            style={{
                                transitionDelay: query === 'progress' ? '800ms' : '0ms',
                            }}
                            unmountOnExit
                        >
                            <CircularProgress/>
                        </Fade>
                    )}
                </Box>
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
                <Button
                    variant={"contained"}
                    size={"small"}
                    color={"primary"}
                    onClick={updateAgent}
                    className={styles.btn}
                >
                    Agent Update
                </Button>
                <UpdateModal
                    open={modalOpen}
                    onClose={modalHandleOpen}
                    service={json.service}
                    node={node}
                />
            </Grid>
        </Grid>
    );
}

const CardBody = ({
                      json,
                      index,
                      restore,
                      changeRestoreFalse,
                      timer,
                      setAlertOpen,
                      setAlertType,
                      setAlertMessage,
                      query,
                      setQuery
                  }) => {
    const [action, setAction] = useState();

    const [podName, setPodName] = useState();
    const [modalOpen, setModalOpen] = useState(false);
    const modalHandleOpen = () => setModalOpen(!modalOpen);

    const [excludeStatus, setExcludeStatus] = useState(false);
    const [excludePodIndex, setExcludePodIndex] = useState(0);

    // 5초마다 Agent 상태 갱신
    useInterval(() => {
        axios.post(API + `/lb?service=${json.service}`, {
            data: json
        }).then((resp) => {
            json.node.map((node, nodeIndex) => {
                nodeIndex === index ? node.podList.map((pod, podIndex) => {
                    if (resp.data[nodeIndex].message === pod.name) {
                        setExcludeStatus(true);
                        setExcludePodIndex(podIndex);
                        changeRestoreFalse();
                        setQuery('success');
                    } else if (resp.data[nodeIndex].error !== undefined) {
                        const error = JSON.stringify(resp.data[nodeIndex].error);
                        setAlertMessage(node.name + " is " + error);
                        setAlertType('error');
                        setAlertOpen(true)
                        setQuery('failed');
                    } else if (resp.data[nodeIndex].name === 'Error') {
                        setAlertMessage(node.name + " Agent is Not Connect");
                        setAlertType('error');
                        setAlertOpen(true)
                        setQuery('failed');
                    }
                }) : null
            });
        });
    }, timer)

    const handleClickQuery = () => {
        if (query !== 'idle') {
            setQuery('idle');
            return;
        }
        setQuery('progress');
    };

    const exclude = (podName) => {
        setAction('exclude');
        setPodName(podName);
        modalHandleOpen();
        handleClickQuery();
    }

    const deploy = (podName) => {
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

    return (
        <Grid container>
            {json.node.map((node, nodeIndex) => (
                nodeIndex === index ? node.podList.map((pod, podIndex) => (
                    <Grid
                        key={pod} xs={12} md={6} xl={6}>
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
                                        disabled={restore === true ? false : excludeStatus === false ? false
                                            : podIndex !== excludePodIndex}
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
                                        disabled={restore === true ? true : excludeStatus === false ? true
                                            : podIndex !== excludePodIndex}
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
                                    setAlertType={setAlertType}
                                    setAlertMessage={setAlertMessage}
                                />
                            </Grid>
                        </Box>
                    </Grid>
                )) : <></>
            ))}
        </Grid>
    );
}

export default function PodCard({
                                    json,
                                    node,
                                    index,
                                    setAlertOpen,
                                    setAlertType,
                                    setAlertMessage
                                }) {
    const [restore, setRestore] = useState(false);
    const [intervalTimer, setIntervalTimer] = useState(5000); // 5초

    const [query, setQuery] = React.useState('idle');

    const changeRestoreTrue = () => {
        setRestore(true);
        // setIntervalTimer(30000); // 30초
    }

    const changeRestoreFalse = () => {
        setRestore(false);
        // setIntervalTimer(3000); // 3초

        // setTimeout(() => {
        //     setIntervalTimer(60000);
        // }, 30000);
    }

    return (
        <>
            <Box sx={{minWidth: 275}}>
                <Card variant="outlined" className={styles.card}>
                    <CardContent>
                        <CardHeader
                            json={json}
                            node={node}
                            index={index}
                            changeRestore={changeRestoreTrue}
                            setAlertOpen={setAlertOpen}
                            setAlertType={setAlertType}
                            setAlertMessage={setAlertMessage}
                            query={query}
                            setQuery={setQuery}
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
                            setAlertOpen={setAlertOpen}
                            setAlertType={setAlertType}
                            setAlertMessage={setAlertMessage}
                            query={query}
                            setQuery={setQuery}
                        />
                    </CardContent>
                </Card>
            </Box>
        </>
    );
}