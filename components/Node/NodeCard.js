import * as React from 'react';
import {Box, Button, Card, CardActions, CardContent, CardMedia, Typography, Divider} from '@mui/material';
import styles from './_nodeCard.module.scss'
import {router} from "next/router";

export default function NodeCard({serviceName, description}) {

    const push = (serviceName) => {
        router.push(`/service/${serviceName}`);
    }

    const healthCheck = () => {
        console.log("Health Check");
    }

    return (
        <>
            <Box>
                <Card variant="outlined" className={styles.card}>
                    <CardContent>
                        <Typography variant={"h4"} component={"div"} className={styles.header}>
                            {serviceName}
                        </Typography>
                        <Typography variant={"body2"} className={styles.body}>
                            {description}
                        </Typography>
                    </CardContent>
                    <Divider/>
                    <CardActions>
                        <Button size="small" onClick={() => push(serviceName)}>자세히 보기</Button>
                        <Button size="small" onClick={healthCheck}>에이전트 체크</Button>
                    </CardActions>
                </Card>
            </Box>
        </>
    );
}