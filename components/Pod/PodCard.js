import {Box, Button, Card, CardActions, CardContent, CardMedia, Divider, Grid, Typography} from "@mui/material";
import styles from "./_podCard.module.scss";
import * as React from "react";

export default function PodCard({header, json, index}) {

    const restore = () => {
        console.log("restore");
    }

    const healthCheck = () => {
        console.log("health-check");
    }

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
        <>
            <Box sx={{minWidth: 275}}>
                <Card variant="outlined" className={styles.card}>
                    <CardContent>
                        <Grid container>
                            <Grid item xs={8} md={8} xl={8}>
                                <Typography
                                    variant="h5"
                                    component="div"
                                >
                                    서비스: {header}
                                </Typography>
                            </Grid>
                            <Grid item xs={4} md={4} xl={4}>
                                <Button
                                    variant={"contained"}
                                    size={"small"}
                                    color={"secondary"}
                                    onClick={restore}
                                    className={styles.mL}
                                >
                                    복구
                                </Button>
                                <Button
                                    variant={"contained"}
                                    size={"small"}
                                    color={"warning"}
                                    onClick={healthCheck}
                                    className={styles.mL}
                                >
                                    에이전트 체크
                                </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                    <Divider/>
                    <CardActions>
                        {json.node.map((node, idx) => (
                            idx === index ? node.podList.map((pod) => (
                                <Grid container>
                                    <Box className={styles.box}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} className={styles.mL}>
                                                {pod.name}
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Button
                                                    variant={"contained"}
                                                    size={"small"}
                                                    color={"error"}
                                                    onClick={exclude}
                                                    className={styles.mL}
                                                >
                                                    제거
                                                </Button>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Button
                                                    variant={"contained"}
                                                    size={"small"}
                                                    color={"primary"}
                                                    onClick={deploy}
                                                    className={styles.mL}
                                                >
                                                    배포
                                                </Button>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Button
                                                    variant={"contained"}
                                                    size={"small"}
                                                    color={"success"}
                                                    onClick={log}
                                                    className={`${styles.mB} ${styles.mL}`}
                                                >
                                                    로그
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                            )) : <></>
                        ))}
                    </CardActions>
                </Card>
            </Box>
        </>
    );
}