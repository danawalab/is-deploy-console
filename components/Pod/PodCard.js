import {Box, Button, Card, CardActions, CardContent, CardMedia, Divider, Typography} from "@mui/material";
import styles from "../Node/_nodeCard.module.scss";
import * as React from "react";

export default function PodCard({header, json}) {
    return (
        <>
            <Box sx={{minWidth: 275}}>
                <Card variant="outlined" className={styles.card}>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            서비스: {header}
                        </Typography>
                        <Divider/>
                        {/*{json.node.map((node) => (*/}
                        {/*    node.podList.map((pod) => (*/}
                        {/*        <>*/}
                        {/*            <div>{pod.name}</div>*/}
                        {/*        </>*/}
                        {/*    ))*/}
                        {/*))}*/}

                    </CardContent>
                    <CardActions>
                        <Button size="small">제거</Button>
                        <Button size="small">배포</Button>
                        <Button size="small">로그</Button>
                    </CardActions>
                </Card>
            </Box>
        </>
    );
}