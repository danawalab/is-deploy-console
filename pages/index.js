import * as React from 'react';
import {Box, Grid, Paper, IconButton} from "@mui/material";
import {styled} from '@mui/material/styles';
import SettingsIcon from '@mui/icons-material/Settings';
import Layout from "../components/Layout/Layout";
import ServiceCard from "../components/ServiceCard";
import styles from './_index.module.scss'

const Item = styled(Paper)(({theme}) => ({
    backgroundColor: '#1A2027',
    border: '1px solid blue',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: 'white',
}));


export default function Home() {
    return (
        <Layout>
            <Box sx={{flexGrow: 1}}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <IconButton className={styles.iconButton}>
                            <SettingsIcon/>
                        </IconButton>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <ServiceCard
                            header={"서비스 A"}
                            body={"서비스 A 입니다."}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <ServiceCard
                            header={"서비스 B"}
                            body={"서비스 B 입니다."}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <ServiceCard
                            header={"서비스 C"}
                            body={"서비스 C 입니다."}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <ServiceCard
                            header={"서비스 D"}
                            body={"서비스 D 입니다."}
                        />
                    </Grid>
                </Grid>
            </Box>
        </Layout>
    )
}
