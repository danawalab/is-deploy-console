import * as React from "react";
import {useState} from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import {Box, Divider, Grid, IconButton} from "@mui/material";
import Layout from "../../components/Layout/Layout";
import PodCard from "../../components/Pod/PodCard";
import JsonModal from "../../components/Modal/JsonModal";
import LogArea from "../../components/Pod/LogArea";
import Init from "../../components/Layout/Init";
import axios from "axios";
import styles from "../_index.module.scss";

export default function ServiceHome({data}) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(!open);
    const json = JSON.parse(data);
    const nodeLength = json.node.length;

    return (
        <Layout title={json.service}>
            <Box sx={{flexGrow: 1}} className={styles.body}>
                <Grid container spacing={2} className={styles.serviceGrid}>
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
                            id={json.service}
                        />
                    </Grid>
                    {nodeLength !== 0 ? json.node.map((node, index) => (
                        <Grid key={node} item xs={12} md={6} xl={6}>
                            <PodCard
                                nodeName={node.name}
                                json={json}
                                index={index}
                            />
                        </Grid>
                    )) : <Init/>}
                </Grid>
                <Divider/>
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