import * as React from "react";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import SettingsIcon from "@mui/icons-material/Settings";
import {Box, Grid, IconButton} from "@mui/material";
import Layout from "../../components/Layout/Layout";
import styles from "../_index.module.scss";
import ServerCard from "../../components/ServerCard";

export default function ServiceHome() {
    const router = useRouter();
    const [id, setId] = useState();
    const [server, setServer] = useState();

    useEffect(() => {
        if (!router.isReady) return;
        rendering(router.query.id);
        import(`../../config/service/${router.query.id}.json`)
            .then((config) => {
                setServer(config);
            });
    }, [router.isReady]);

    const rendering = (id) => {
        setId(id);
    }

    return (
        <Layout title={`${id}`}>
            <Box sx={{flexGrow: 1}} className={styles.body}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <IconButton className={styles.iconButton}>
                            <SettingsIcon/>
                        </IconButton>
                    </Grid>
                    {server !== undefined ? server.node.map((service) => (
                        <Grid key={service} item xs={12} md={6} lg={3}>
                            <ServerCard
                                header={service.name}
                                json={server}
                            />
                        </Grid>
                    )) : <></>}
                </Grid>
            </Box>
        </Layout>
    );
}