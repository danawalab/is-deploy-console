import {Box, Button, Card, CardActions, CardContent, CardMedia, Divider, Typography} from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2'
import styles from "./_podCard.module.scss";
import * as React from "react";

const CardHeader = ({header}) => {

    const restore = () => {
        console.log("restore");
    }

    const healthCheck = () => {
        console.log("health-check");
    }

    return (
        <Grid container>
            <Grid xs={6} md={8} xl={8}>
                <Typography
                    variant="h5"
                    component="div"
                >
                    {header}
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
                    Health
                </Button>
            </Grid>
        </Grid>
    );
}

const CardBody = ({json, index}) => {

    const exclude = () => {
        console.log("exclude");

    }

    const deploy = () => {
        console.log("deploy");
    }

    const log = () => {
        console.log("log");
    }

    return (
        // <Grid container>
        <>
            {json.node.map((node, idx) => (
                idx === index ? node.podList.map((pod) => (
                    // <Grid xs={12} md={6} xl={6}>
                        <Box className={styles.box}>
                            <Grid container>
                                <Grid xs={12} className={styles.mL}>
                                    {pod.name}
                                </Grid>
                                <Grid xs={4}>
                                    <Button
                                        variant={"contained"}
                                        size={"small"}
                                        color={"error"}
                                        onClick={exclude}
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
                                        onClick={deploy}
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
                                        onClick={log}
                                        className={styles.mL}
                                    >
                                        Log
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    // </Grid>
                )) : <></>
            ))}
        {/*</Grid>*/}
        </>
    );
}

export default function PodCard2({header, json, index}) {
    return (
        <>
            <Box sx={{minWidth: 275}}>
                <Card variant="outlined" className={styles.card}>
                    <CardContent>
                        <CardHeader
                            header={header}
                        />
                    </CardContent>
                    <Divider/>
                    <CardActions>
                        <CardBody
                            json={json}
                            index={index}
                        />
                    </CardActions>
                </Card>
            </Box>
        </>
    );
}