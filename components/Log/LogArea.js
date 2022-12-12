import {Button, Grid, TextareaAutosize} from "@mui/material";
import styles from './_logArea.module.scss'
import * as React from "react";
import axios from "axios";
import {useState} from "react";
import useInterval from "../../service/useInterval";

const API = '/api/agent/'

export default function LogArea({service, node, pod}) {
    const [logData, setLogData] = useState();
    const QUERY = `?service=${service}&node=${node}`

    const logInit = () => {
        setLogData('');
    }

    // 5초에 로그 100줄 다시 불러옴
    //todo 100줄이 아닌 동적으로 원하는 줄 불러오게
    useInterval(async () => {
        await axios.post(API + '/log' + QUERY + `&pod=${pod}`)
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