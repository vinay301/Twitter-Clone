import TwitterLayout from "@/components/Layout/TwitterLayout";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { IoIosArrowRoundBack } from "react-icons/io";
import Image from "next/image";
import { useCurrentUser } from "@/hooks/user";
import FeedCard from "@/components/FeedCard";
import { Tweet, User } from "@/gql/graphql";
import { graphQLClient } from "@/clients/api";
import { getUserByIdQuery } from "@/graphql/query/user";

interface ServerProps{
    userInfo?: User
}

const UserProfilePage: NextPage<ServerProps> = (props) => {
   
    const router = useRouter();
  
    return (
        <div>
            <TwitterLayout>
                <div>
                    <nav className="flex items-center gap-3 p-3">
                    <IoIosArrowRoundBack className="text-4xl"/>
                        <div>
                            <h1 className="text-2xl font-bold">Vinay Sharma</h1>
                            <h1 className="text-md font-bold">{props.userInfo?.tweets?.length} Tweets</h1>
                        </div>
                    </nav>
                    <div className="p-4 border-b border-slate-800">
                        {props.userInfo?.profileImageUrl && <Image src={props.userInfo?.profileImageUrl} alt="user-image" height={100} width={100} className="rounded-full"/>}
                        <h1 className="text-2xl font-bold mt-5">Vinay Sharma</h1>
                    </div>
                    <div>
                        {props.userInfo?.tweets?.map(tweet => <FeedCard data={tweet as Tweet} key={tweet?.id} />)}
                    </div>
                </div>
            </TwitterLayout>
           
        </div>
    );
};

export const getServerSideProps: GetServerSideProps<ServerProps> = async(context) => {
    const id = context.query.id as string | undefined;
    if(!id) return {notFound: true, props:{userInfo:undefined}};
    const userInfo = await graphQLClient.request(getUserByIdQuery, {id})
    if(!userInfo?.getUserById) return {notFound:true}
    return {
        props: {
            userInfo: userInfo.getUserById as User,
        }
    }
}

export default UserProfilePage