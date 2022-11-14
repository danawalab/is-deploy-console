import Layout from "../../../components/Layout/Layout";
import LogArea from "../../../components/Log/LogArea";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";

export default function PodLog() {
    const router = useRouter();
    const [podName, setPodName] = useState();

    console.log(router)
    console.log(router.query.service)
    console.log(router.query.node)
    console.log(router.query.pod)

    useEffect(() => {
        if (!router.isReady) return;
        rendering(router.query.pod);
    }, [router.isReady])

    const rendering = (podName) => {
        setPodName(podName);
    }

    return (
        <Layout title={podName}>
            <LogArea
                service={router.query.service}
                node={router.query.node}
                pod={router.query.pod}
            />
        </Layout>
    );
}