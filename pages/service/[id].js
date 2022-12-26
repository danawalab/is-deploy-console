import * as React from "react";
import {useState} from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import {Box, Divider, Grid, IconButton, TextareaAutosize, Typography} from "@mui/material";
import Layout from "../../components/Layout/Layout";
import PodCard from "../../components/Pod/PodCard";
import JsonModal from "../../components/Modal/JsonModal";
import Init from "../../components/Layout/Init";
import axios from "axios";
import styles from "../_index.module.scss";
import CustomAlert from "../../components/alert/CustomAlert";

export default function ServiceHome({data}) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(!open);
    const json = JSON.parse(data);
    const nodeLength = json.node.length;

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertType, setAlertType] = useState('error');
    const [alertMessage, setAlertMessage] = useState('');
    const [shellLog, setShellLog] = useState('');

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlertOpen(false);
    };

    return (
        <Layout title={json.service}>
            <Box sx={{flexGrow: 1}} className={styles.body}>
                <Grid container spacing={2} className={styles.serviceGrid}>
                    <Grid item xs={12}>
                        <Typography
                            className={styles.comment}
                        >
                            확인 사항: {json.comment}
                        </Typography>
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
                            service={json.service}
                            setAlertOpen={setAlertOpen}
                            setAlertType={setAlertType}
                            setAlertMessage={setAlertMessage}
                        />
                    </Grid>
                    {nodeLength !== 0 ? json.node.map((node, index) => (
                        <Grid key={node} item xs={12} md={6} xl={6}>
                            <PodCard
                                json={json}
                                node={node.name}
                                index={index}
                                setAlertOpen={setAlertOpen}
                                setAlertType={setAlertType}
                                setAlertMessage={setAlertMessage}
                                setShellLog={setShellLog}
                            />
                        </Grid>
                    )) : <Init/>}
                </Grid>
                <CustomAlert
                    open={alertOpen}
                    onClose={handleClose}
                    type={alertType}
                    message={alertMessage}
                />
                <Divider/>
                <TextareaAutosize
                    disabled={true}
                    minRows={30}
                    maxRows={40}
                    value={shellLog}
                    className={styles.area}
                />
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