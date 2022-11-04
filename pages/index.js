import * as React from 'react';
import {Box, Grid, IconButton} from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import Layout from "../components/Layout/Layout";
import NodeCard from "../components/Node/NodeCard";
import styles from './_index.module.scss'

const JSON = require("../config/config.json");
const TITLE = "Is Deploy Console";

export default function Home() {
    return (
        <Layout title={TITLE}>
            <Box sx={{flexGrow: 1}} className={styles.body}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <IconButton className={styles.iconButton}>
                            <SettingsIcon/>
                        </IconButton>
                    </Grid>
                    {JSON.serviceList.map((service) => (
                        <Grid key={service} item xs={12} md={6} lg={3}>
                            <NodeCard
                                serviceName={service.name}
                                description={service.description}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Layout>
    );
}
