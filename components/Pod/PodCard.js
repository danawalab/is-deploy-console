import {Alert, Box, Button, Card, CardContent, Divider, Typography} from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2'
import styles from "./_podCard.module.scss";
import * as React from "react";
import {useState} from "react";
import axios from "axios";
import {router} from "next/router";
import ConfirmModal from "../Modal/ConfirmModal";

const API = 'http://localhost:3000/api/agent/'

const CardHeader = ({json, node, changeRestore}) => {
    const restore = async () => {
        await axios.get(API + `/restore?service=${json.service}&node=${node}`);
        changeRestore();
    }

    const healthCheck = async () => {
        await axios.get(API + `/health?service=${json.service}&node=${node}`)
            .then((resp) => {
                alert(JSON.stringify(resp.data));
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
            </Grid>
        </Grid>
    );
}

const CardBody = ({json, index, restore, changeRestoreFalse}) => {
    const [excludeStatus, setExcludeStatus] = useState(false);
    const [excludePodIndex, setExcludePodIndex] = useState(0);
    const [action, setAction] = useState();
    const [podName, setPodName] = useState();
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(!open);

    const exclude = async (podName, podIndex) => {
        // await axios.post(API + '/exclude' + QUERY + `&pod=${podName}`);
        // setExcludeStatus(true);
        // setExcludePodIndex(podIndex);
        // changeRestoreFalse();
        setAction('exclude')
        setPodName(podName)
        handleOpen();
    }

    const deploy = async (podName) => {
        setAction('deploy')
        setPodName(podName)
        handleOpen();
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
                nodeIndex === index? node.podList.map((pod, podIndex) => (
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
                                        onClick={() => exclude(pod.name, podIndex)}
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
                                    <ConfirmModal
                                        open={open}
                                        onClose={handleOpen}
                                        action={action}
                                        service={json.service}
                                        node={node.name}
                                        pod={podName}
                                    />
                                </Grid>
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

    const changeRestoreTrue = () => {
        setRestore(true);
    }

    const changeRestoreFalse = () => {
        setRestore(false);
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
                        />
                    </CardContent>
                </Card>
            </Box>
        </>
    );
}