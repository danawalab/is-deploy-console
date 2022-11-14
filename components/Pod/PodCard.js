import {Box, Button, Card, CardContent, Divider, IconButton, Typography} from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2'
import styles from "./_podCard.module.scss";
import * as React from "react";
import {useEffect, useState} from "react";
import axios from "axios";
import SettingsIcon from "@mui/icons-material/Settings";
import NodeModal from "../Modal/NodeModal";
import {router} from "next/router";

const API = 'http://localhost:3000/api/agent/'

const CardHeader = ({nodeName, json, changeRestore}) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(!open);

    const restore = async () => {
        await axios.get(API + `/restore?service=${json.service}&node=${nodeName}`);
        changeRestore();
    }

    const healthCheck = async () => {
        await axios.get(API + `/health?service=${json.service}&node=${nodeName}`);
    }

    return (
        <Grid container>
            <Grid xs={6} md={8} xl={8}>
                <Typography
                    variant="h5"
                    component="div"
                >
                    {nodeName}
                </Typography>
            </Grid>
            <Grid xs={6} md={4} xl={4}>
                <IconButton
                    className={styles.iconButton}
                    onClick={handleOpen}
                >
                    <SettingsIcon/>
                </IconButton>
                <NodeModal
                    open={open}
                    onClose={handleOpen}
                    service={json.service}
                    nodeName={nodeName}
                />
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
                    Health
                </Button>
            </Grid>
        </Grid>
    );
}

const CardBody = ({json, nodeName, index, restore, changeRestoreFalse}) => {
    const [excludeStatus, setExcludeStatus] = useState(false);
    const [podIdx, setPodIdx] = useState(0);

    const QUERY = `?service=${json.service}&node=${nodeName}`

    const exclude = async (podName, podIndex) => {
        await axios.post(API + '/exclude' + QUERY + `&pod=${podName}`);
        setExcludeStatus(true);
        setPodIdx(podIndex);
        changeRestoreFalse();
    }

    const deploy = async (podName) => {
        await axios.post(API + '/deploy' + QUERY + `&pod=${podName}`);
    }

    const log = (service, node, pod) => {
        router.push({
                pathname: `/service/log/${pod}`,
                query: {
                    service: service,
                    node: node,
                    pod: pod,
                },
            },
            `/service/log/${pod}`
        );
    }

    return (
        <Grid container>
            {json.node.map((node, idx) => (
                idx === index ? node.podList.map((pod) => (
                    <Grid xs={12} md={6} xl={6}>
                        <Box
                            className={restore === true ? styles.box : excludeStatus === false ? styles.box
                                : pod.index === podIdx ? styles.excludeBox : styles.box}
                        >
                            <Grid container>
                                <Grid xs={12} className={styles.mL}>
                                    <div className={styles.podTitle}>
                                        {restore === true ? pod.name : excludeStatus === false ? pod.name
                                            : pod.index === podIdx ? pod.name + " Exclude" : pod.name}
                                    </div>
                                </Grid>
                                <Grid xs={4}>
                                    <Button
                                        variant={"contained"}
                                        size={"small"}
                                        color={"error"}
                                        onClick={() => exclude(pod.name, pod.index)}
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
                            </Grid>
                        </Box>
                    </Grid>
                )) : <></>
            ))}
        </Grid>
    );
}

export default function PodCard({nodeName, json, index}) {
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
                            nodeName={nodeName}
                            json={json}
                            changeRestore={changeRestoreTrue}
                        />
                    </CardContent>
                    <Divider/>
                    <CardContent>
                        <CardBody
                            json={json}
                            nodeName={nodeName}
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