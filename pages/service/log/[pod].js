import Layout from "../../../components/Layout/Layout";
import LogArea from "../../../components/Log/LogArea";
import axios from "axios";

export default function PodLog({data}) {
    const service = data.service;
    const node = data.node;
    const pod = data.pod;

    return (
        <Layout title={`${service} > ${node} > ${pod} 의 로그`}>
            <LogArea
                service={service}
                node={node}
                pod={pod}
            />
        </Layout>
    );
}

export async function getServerSideProps({query}) {
    const {service, node, pod} = query;
    const res = await axios.get(`http://localhost:3000/api/log?service=${service}&node=${node}&pod=${pod}`);
    const data = await res.data;
    return {
        props: {
            data
        }
    }
}