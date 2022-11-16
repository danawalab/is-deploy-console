import * as React from 'react';
import {useState} from 'react';
import {Box, Grid, IconButton} from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import Layout from "../components/Layout/Layout";
import NodeCard from "../components/Node/NodeCard";
import JsonModal from "../components/Modal/JsonModal";
import styles from './_index.module.scss'
import axios from "axios";

export default function Home({data}) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(!open);
    const json = JSON.parse(data);
    const title = "Is Deploy Console";

    return (
        <Layout title={title}>
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
                            data={data}
                            service={'config'}
                        />
                    </Grid>
                    {json.serviceList.map((service) => (
                        <Grid key={service} item xs={12} md={6} xl={3}>
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

export async function getServerSideProps() {
    const res = await axios.get("http://localhost:3000/api/config");
    const data = await res.data;

    return {
        props: {
            data,
        }
    }
}
