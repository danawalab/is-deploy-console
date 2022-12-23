import {Button, Grid, TextareaAutosize, TextField} from "@mui/material";
import styles from './_logArea.module.scss'
import * as React from "react";
import axios from "axios";
import {useState} from "react";
import useInterval from "../../service/useInterval";

export default function LogArea({service, node, pod}) {
    const API = '/api/agent/'
    const query = `?service=${service}&node=${node}`
    const [logData, setLogData] = useState('로그는 5초에 1번씩 불러옵니다.\n최대 로그수 제한에 값이 없다면 기본 값인 100줄로 로그를 반환 받습니다.');
    const [line, setLine] = useState(100);

    const logInit = () => {
        setLogData('');
    }

    const changeLine = (e) => {
        setLine(e.target.value);
    }

    // 5초에 로그 100줄 다시 불러옴
    useInterval(async () => {
        await axios.post(API + '/log' + query + `&pod=${pod}&line=${line}`)
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
                    minRows={30}
                    maxRows={40}
                    value={logData}
                    className={styles.area}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    id={"outlined-basic"}
                    size={"small"}
                    label={"최대 로그수 제한"}
                    variant={"outlined"}
                    value={line}
                    onChange={(e) => changeLine(e)}
                    className={styles.textField}
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