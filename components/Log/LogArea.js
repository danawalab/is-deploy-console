import {Button, Grid, TextareaAutosize, TextField} from "@mui/material";
import styles from './_logArea.module.scss'
import * as React from "react";
import axios from "axios";
import {useState} from "react";
import useInterval from "../../service/useInterval";

const API = '/api/agent/'

export default function LogArea({service, node, pod}) {
    const [logData, setLogData] = useState();
    const QUERY = `?service=${service}&node=${node}`
    const [line, setLine] = useState(100);

    const logInit = () => {
        setLogData('');
    }

    const changeVersion = (e) => {
        setLine(e.target.value);
    }

    // 5초에 로그 100줄 다시 불러옴
    useInterval(async () => {
        await axios.post(API + '/log' + QUERY + `&pod=${pod}&line=${line}`)
            .then((resp) => {
                if (resp.data.error !== undefined) {
                    setLogData(JSON.stringify(resp.data.error));
                } else {
                    // log는 text로 반환하기에 resp.data를 바로 setLogData에 넣어줌
                    setLogData(resp.data);
                }
            });
    }, 5000)

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
                <TextField
                    id="outlined-basic"
                    label="line"
                    variant="outlined"
                    onChange={(e) => changeVersion(e)}
                    className={styles.btn}
                />
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