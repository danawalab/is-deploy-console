import {MongoClient} from "mongodb";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const {id, password, adminId} = req.body;

        const client = await MongoClient.connect(uri);
        const db = client.db();

        // const isAdmin = await db.collection('users')
        //     .findOne({adminId});
        //
        // if (isAdmin.admin === false) {
        //     client.close();
        //     res.status(422).json({
        //         "error": '어드민 계정이 아닙니다.',
        //     });
        // }

        const isExistsId = await db.collection('users')
            .findOne({id});

        if (isExistsId) {
            client.close();
            res.status(422).json({
                "error": '이미 존재 하는 계정 입니다.',
            });
        }

        const status = await db.collection('users')
            .insertOne({
                id,
                // password: await hash(password, 12),
            });

        client.close();
        return res.status(200).json({
            'message': '계정 생성 완료',
        });
    }
}