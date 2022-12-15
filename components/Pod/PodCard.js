import {Box, Button, Card, CardContent, CircularProgress, Divider, Fade, Typography} from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2'
import styles from "./_podCard.module.scss";
import * as React from "react";
import {useState} from "react";
import axios from "axios";
import ConfirmModal from "../Modal/ConfirmModal";
import useInterval from "../../service/useInterval";
import UpdateModal from "../Modal/UpdateModal";
import Link from "next/link";

const API = '/api/agent/'

const CardHeader = ({
                        json,
                        node,
                        index,
                        changeRestore,
                        setAlertOpen,
                        setAlertType,
                        setAlertMessage,
                        query,
                        setQuery
                    }) => {

    const [modalOpen, setModalOpen] = useState(false);
    const modalHandleOpen = () => setModalOpen(!modalOpen);
    const restore = async () => {
        await axios.get(API + `/restore?service=${json.service}&node=${node}`)
            .then((resp) => {
                setAlertMessage(JSON.stringify(resp.data.message));
                setAlertType('success');
                setAlertOpen(true)
                if (resp.data.error !== undefined) {
                    setAlertMessage(JSON.stringify(resp.data.error));
                    setAlertType('error');
                    setAlertOpen(true)
                }
            });
        changeRestore();
        setQuery('idle');
    }

    const healthCheck = async () => {
        await axios.get(API + `/health?service=${json.service}&node=${node}`)
            .then((resp) => {
                setAlertMessage(JSON.stringify(resp.data.message));
                setAlertType('success');
                setAlertOpen(true)
                if (resp.data.error !== undefined) {
                    setAlertMessage(JSON.stringify(resp.data.error));
                    setAlertType('error');
                    setAlertOpen(true)
                }
            });
    }

    /**
     *  에이전트 동적 업데이트 및 다운그레이드 기능
     *  update.sh 불안정 해서 잠시 기능 삭제
     *  중요 !! 사내에서 사용시 보안 정책 확인 필요
     *  빌드 파일 깃허브, 깃랩, 미니오등 어디에 올리든 보안정책에 의해 443포트 닫혀 있다면 동작 x
     */
    /*    const updateAgent = () => {
            modalHandleOpen();
        }

        useEffect(() => {
            axios.get("/api/update")
                .then((resp) => {
                    const version = resp.data;

                    axios.post(API + `/update?service=${json.service}`, {
                        data: json
                    }).then((resp) => {
                        json.node.map((node, nodeIndex) => {
                            if (nodeIndex === index) {
                                const agentVersion = resp.data[nodeIndex];
                                console.log(agentVersion);
                                if (version !== agentVersion) {
                                    setAlertMessage('새 버전의 에이전트가 나왔습니다, 업데이트를 권장합니다');
                                    setAlertType('success');
                                    setAlertOpen(true)
                                }
                            }
                        })
                    })
                })
        }, [])*/

    return (
        <Grid container>
            <Grid xs={6} md={8} xl={8}>
                <Typography
                    variant="h5"
                    component="div"
                >
                    {node}
                </Typography>
                <Box sx={{height: 40}}>
                    {query === 'success' ? (
                        <Typography>성공!</Typography>
                    ) : query === 'failed' ? (
                        <Typography>실패!</Typography>
                    ) : (
                        <Fade
                            in={query === 'progress'}
                            style={{
                                transitionDelay: query === 'progress' ? '800ms' : '0ms',
                            }}
                            unmountOnExit
                        >
                            <CircularProgress/>
                        </Fade>
                    )}
                </Box>
            </Grid>
            <Grid xs={6} md={4} xl={4}>
                <Button
                    variant={"contained"}
                    size={"small"}
                    color={"secondary"}
                    onClick={restore}
                    className={styles.btn}
                >
                    연결복원
                </Button>
                <Button
                    variant={"contained"}
                    size={"small"}
                    color={"warning"}
                    onClick={healthCheck}
                    className={styles.btn}
                >
                    에이전트 헬스체크
                </Button>
                {/*<Button
                    variant={"contained"}
                    size={"small"}
                    color={"primary"}
                    onClick={updateAgent}
                    // disabled={true}
                    className={styles.btn}
                >
                    에이전트 업데이트
                </Button>*/}
                <UpdateModal
                    open={modalOpen}
                    onClose={modalHandleOpen}
                    service={json.service}
                    node={node}
                />
            </Grid>
        </Grid>
    );
}

const CardBody = ({
                      json,
                      index,
                      restore,
                      changeRestoreFalse,
                      timer,
                      setAlertOpen,
                      setAlertType,
                      setAlertMessage,
                      query,
                      setQuery
                  }) => {
    const [action, setAction] = useState();

    const [podName, setPodName] = useState();
    const [modalOpen, setModalOpen] = useState(false);
    const modalHandleOpen = () => setModalOpen(!modalOpen);

    const [excludeStatus, setExcludeStatus] = useState(false);
    const [excludePodIndex, setExcludePodIndex] = useState(0);

    // 5초마다 Agent 상태 갱신
    useInterval(() => {
        axios.post(API + `/lb?service=${json.service}`, {
            data: json
        }).then((resp) => {
            json.node.map((node, nodeIndex) => {
                nodeIndex === index ? node.podList.map((pod, podIndex) => {
                    if (resp.data[nodeIndex].message === pod.name) {
                        setExcludeStatus(true);
                        setExcludePodIndex(podIndex);
                        changeRestoreFalse();
                        setQuery('success');
                    } else if (resp.data[nodeIndex].error !== undefined) {
                        const error = JSON.stringify(resp.data[nodeIndex].error);
                        setAlertMessage(node.name + " is " + error);
                        setAlertType('error');
                        setAlertOpen(true)
                        setQuery('failed');
                    } else if (resp.data[nodeIndex].name === 'Error') {
                        setAlertMessage(node.name + " 에이전트가 연결이 안 됐습니다");
                        setAlertType('error');
                        setAlertOpen(true)
                        setQuery('failed');
                    }
                }) : null
            });
        });
    }, timer)

    const handleClickQuery = () => {
        if (query !== 'idle') {
            setQuery('idle');
            return;
        }
        setQuery('progress');
    };

    const exclude = (podName) => {
        setAction('exclude');
        setPodName(podName);
        modalHandleOpen();
    }

    const deploy = (podName) => {
        setAction('deploy');
        setPodName(podName);
        modalHandleOpen();
    }

    return (
        <Grid container>
            {json.node.map((node, nodeIndex) => (
                nodeIndex === index ? node.podList.map((pod, podIndex) => (
                    <Grid
                        key={pod} xs={12} md={6} xl={6}>
                        <Box
                            className={restore === true ? styles.box : excludeStatus === false ? styles.box
                                : podIndex === excludePodIndex ? styles.excludeBox : styles.box}
                        >
                            <Grid container>
                                <Grid xs={12} className={styles.mL}>
                                    <div className={styles.podTitle}>
                                        {restore === true ? pod.name : excludeStatus === false ? pod.name
                                            : podIndex === excludePodIndex ? pod.name + " Exclude" : pod.name}
                                    </div>
                                </Grid>
                                <Grid xs={4}>
                                    <Button
                                        variant={"contained"}
                                        size={"small"}
                                        color={"error"}
                                        disabled={restore === true ? false : excludeStatus === false ? false
                                            : podIndex !== excludePodIndex}
                                        onClick={() => exclude(pod.name)}
                                        className={styles.mL}
                                    >
                                        제외하기
                                    </Button>
                                </Grid>
                                <Grid xs={4}>
                                    <Button
                                        variant={"contained"}
                                        size={"small"}
                                        color={"primary"}
                                        disabled={restore === true ? true : excludeStatus === false ? true
                                            : podIndex !== excludePodIndex}
                                        onClick={() => deploy(pod.name)}
                                        className={styles.mL}
                                    >
                                        배포하기
                                    </Button>
                                </Grid>
                                <Grid xs={4}>
                                    <Link
                                        href={{
                                            pathname: `/service/log/${pod.name}`,
                                            query: {
                                                service: json.service,
                                                node: node.name,
                                                pod: pod.name,
                                            }
                                        }}
                                        passHref>
                                        <a
                                            target={"_blank"}
                                            rel={"noopener noreferrer"}
                                            className={styles.a}
                                        >
                                            <Button
                                                variant={"contained"}
                                                size={"small"}
                                                color={"success"}
                                                className={styles.mL}
                                            >
                                                로그보기
                                            </Button>
                                        </a>
                                    </Link>
                                </Grid>
                                <ConfirmModal
                                    open={modalOpen}
                                    onClose={modalHandleOpen}
                                    action={action}
                                    service={json.service}
                                    node={node.name}
                                    pod={podName}
                                    setAlertOpen={setAlertOpen}
                                    setAlertType={setAlertType}
                                    setAlertMessage={setAlertMessage}
                                    handleClickQuery={handleClickQuery}
                                />
                            </Grid>
                        </Box>
                    </Grid>
                )) : <></>
            ))}
        </Grid>
    );
}

export default function PodCard({
                                    json,
                                    node,
                                    index,
                                    setAlertOpen,
                                    setAlertType,
                                    setAlertMessage
                                }) {
    const [restore, setRestore] = useState(false);
    const [intervalTimer, setIntervalTimer] = useState(5000); // 5초

    const [query, setQuery] = useState('idle');

    const changeRestoreTrue = () => {
        setRestore(true);
        // setIntervalTimer(30000); // 30초
    }

    const changeRestoreFalse = () => {
        setRestore(false);
        // setIntervalTimer(3000); // 3초

        // setTimeout(() => {
        //     setIntervalTimer(60000);
        // }, 30000);
    }

    return (
        <>
            <Box sx={{minWidth: 275}}>
                <Card variant="outlined" className={styles.card}>
                    <CardContent>
                        <CardHeader
                            json={json}
                            node={node}
                            index={index}
                            changeRestore={changeRestoreTrue}
                            setAlertOpen={setAlertOpen}
                            setAlertType={setAlertType}
                            setAlertMessage={setAlertMessage}
                            query={query}
                            setQuery={setQuery}
                        />
                    </CardContent>
                    <Divider/>
                    <CardContent>
                        <CardBody
                            json={json}
                            index={index}
                            restore={restore}
                            changeRestoreFalse={changeRestoreFalse}
                            timer={intervalTimer}
                            setAlertOpen={setAlertOpen}
                            setAlertType={setAlertType}
                            setAlertMessage={setAlertMessage}
                            query={query}
                            setQuery={setQuery}
                        />
                    </CardContent>
                </Card>
            </Box>
        </>
    );
}