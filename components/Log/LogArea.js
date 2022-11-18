import {Button, Grid, TextareaAutosize} from "@mui/material";
import styles from './_logArea.module.scss'
import * as React from "react";
import axios from "axios";
import {useState} from "react";
import useInterval from "../../service/useInterval";

const API = 'http://localhost:3000/api/agent/'

export default function LogArea({service, node, pod}) {
    const [logData, setLogData] = useState();
    const QUERY = `?service=${service}&node=${node}`

    const logInit = () => {
        setLogData('');
    }

    useInterval(async () => {
        await axios.post(API + '/log' + QUERY + `&pod=${pod}`)
            .then((resp) => {
                setLogData(resp.data)
            });
    }, 2000)

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextareaAutosize
                    disabled={true}
                    maxRows={2}
                    value={logData}
                    className={styles.area}
                />
            </Grid>
            <Grid item xs={12}>
                <Button
                    variant={"contained"}
                    color={"success"}
                    onClick={logInit}
                    className={styles.btn}
                >
                    로그 초기화
                </Button>
            </Grid>
        </Grid>
    );
}