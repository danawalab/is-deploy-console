import * as React from 'react';
import {Box, Button, Card, CardActions, CardContent, Typography,} from '@mui/material';
import styles from './_serviceCard.module.scss'

export default function ServiceCard({header, body}) {
    return (
        <>
            <Box sx={{minWidth: 275}}>
                <Card variant="outlined" className={styles.card}>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            서비스: {header}
                        </Typography>
                        <Typography sx={{mb: 1.5}} color="text.secondary">
                            online
                        </Typography>
                        <Typography variant="body2">
                            {body}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small">자세히 보기</Button>
                    </CardActions>
                </Card>
            </Box>
        </>
    );
}