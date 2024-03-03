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
import { useCallback, useMemo } from "react";
import { followUserMutation, unFollowUserMutation } from "@/graphql/mutation/user";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface ServerProps{
    userInfo?: User
}

const UserProfilePage: NextPage<ServerProps> = (props) => {
   
    const router = useRouter();
    const {user:currentUser} = useCurrentUser();
    const queryClient = useQueryClient();

    const amIFollowing = useMemo(() => {
        if(!props.userInfo) return false;
        return(
             (currentUser?.following?.findIndex(
                (element) => element?.id === props.userInfo?.id) ?? -1) >= 0 ); 
    },[currentUser?.following, props.userInfo])

    const handleFollowButtonClick =useCallback(async()=> {
        if(!props.userInfo?.id)return;
        await  graphQLClient.request(followUserMutation, {to: props.userInfo?.id})
        toast.success(`You are now following ${props.userInfo?.firstName} ${props.userInfo?.lastName}`);
        await  queryClient.invalidateQueries({queryKey: ["current-user"]})
    },[props.userInfo?.id, queryClient])

    const handleUnfollowButtonClick = useCallback(async()=>{
        if(!props.userInfo?.id)return;
        await graphQLClient.request(unFollowUserMutation,{to:props.userInfo?.id})
        toast.success(`You have stopped following ${props.userInfo?.firstName} ${props.userInfo?.lastName}`);
        await queryClient.invalidateQueries({queryKey:["current-user"]})
    },[props.userInfo?.id, queryClient])

    return (
        <div>
            <TwitterLayout>
                <div>
                    <nav className="flex items-center gap-3 p-3">
                    <IoIosArrowRoundBack className="text-4xl"/>
                        <div>
                            <h1 className="text-2xl font-bold">{props.userInfo?.firstName} {props.userInfo?.lastName}</h1>
                            <h1 className="text-md font-bold">{props.userInfo?.tweets?.length} Tweets</h1>
                        </div>
                    </nav>
                    <div className="p-4 border-b border-slate-800">
                        {props.userInfo?.profileImageUrl && <Image src={props.userInfo?.profileImageUrl} alt="user-image" height={100} width={100} className="rounded-full"/>}
                        <h1 className="text-2xl font-bold mt-5">{props.userInfo?.firstName} {props.userInfo?.lastName}</h1>
                        <div className="flex justify-between items-center">
                            <div className="flex gap-4 mt-2 text-sm text-gray-400">
                                <span>{props.userInfo?.followers?.length} followers</span>
                                <span>{props.userInfo?.following?.length} following</span>
                            </div>
                           { 
                                currentUser?.id !== props.userInfo?.id &&
                                (
                                    <>
                                        {
                                            amIFollowing ? (<button onClick={handleUnfollowButtonClick} className="bg-white text-black px-3 py-1 rounded-full text-sm">Unfollow</button>)
                                            : (<button onClick={handleFollowButtonClick} className="bg-white text-black px-3 py-1 rounded-full text-sm">Follow</button>)
                                        }
                                    </>
                                )
                            }
                        </div>
                       
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