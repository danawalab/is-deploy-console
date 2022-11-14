import {Button, Grid, TextareaAutosize} from "@mui/material";
import styles from './_logArea.module.scss'
import * as React from "react";

export default function LogArea({log}) {
    console.log("LogArea", log);
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextareaAutosize
                    disabled={true}
                    maxRows={2}
                    value={log}
                    className={styles.area}
                />
            </Grid>
            <Grid item xs={12}>
                <Button
                    variant={"contained"}
                    color={"success"}
                    className={styles.btn}
                >
                    Init
                </Button>
            </Grid>
        </Grid>
    );
}