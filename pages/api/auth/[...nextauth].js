import NextAuth from "next-auth"
import {MongoDBAdapter} from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb"

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: "로그인",
            credentials: {
                username: { label: "id", type: "text" },
                password: { label: "password", type: "password" }
            },
            async authorize(credentials, req) {
                const user = { }

                if (user) {
                    return user
                } else {
                    return null
                }
            }
        })
    ],
    secret: '',
    // session: {
    //     strategy: 'jwt',
    // },
    // jwt: {
    //
    // },
    adapter: MongoDBAdapter(clientPromise),
    pages: {
        signIn: '/auth',
        singOut: '/auth',
    },
    debug: true,
})