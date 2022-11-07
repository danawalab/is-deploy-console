import * as React from "react";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import SettingsIcon from "@mui/icons-material/Settings";
import {Box, Grid, IconButton} from "@mui/material";
import Layout from "../../components/Layout/Layout";
import styles from "../_index.module.scss";
import PodCard from "../../components/Pod/PodCard";
import JsonModal from "../../components/Modal/JsonModal";
import axios from "axios";

export default function ServiceHome({data}) {
    const router = useRouter();
    const [id, setId] = useState();
    const [server, setServer] = useState();
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(!open);

    useEffect(() => {
        if (!router.isReady) return;
        rendering(router.query.id);
        import(`../../config/service/${router.query.id}/${router.query.id}.json`)
            .then((config) => {
                setServer(config);
            });
    }, [router.isReady]);

    const rendering = (id) => {
        setId(id);
    }

    return (
        <Layout title={id}>
            <Box sx={{flexGrow: 1}} className={styles.body}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <IconButton
                            className={styles.iconButton}
                            onClick={handleOpen}
                        >
                            <SettingsIcon/>
                        </IconButton>
                        <JsonModal
                            open={open}
                            onClose={handleOpen}
                            config={false}
                            data={data}
                        />
                    </Grid>
                    {server !== undefined ? server.node.map((service) => (
                        <Grid key={service} item xs={12} md={6} xl={3}>
                            <PodCard
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

export async function getServerSideProps({query}) {
    const {id} = query;
    const res = await axios.get(`http://localhost:3000/api/${id}`);
    const data = await res.data;
    return {
        props: {
            data,
        }
    }
}