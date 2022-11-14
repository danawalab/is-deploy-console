import * as React from 'react';
import {Box, Button, Card, CardActions, CardContent, Divider, Typography} from '@mui/material';
import styles from './_nodeCard.module.scss'
import {router} from "next/router";

export default function NodeCard({serviceName, description}) {

    const push = (serviceName) => {
        router.push({
                pathname: `/service/${serviceName}`,
                query: {
                    serviceName,
                },
            },
            `/service/${serviceName}`
        );
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
                        <Button
                            size="small"
                            className={styles.btn}
                            onClick={() => push(serviceName.toLowerCase())}
                        >
                            자세히 보기
                        </Button>
                    </CardActions>
                </Card>
            </Box>
        </>
    );
}