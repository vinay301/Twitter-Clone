import Image from 'next/image';
import React, { useCallback, useState } from 'react'
import { TbMessageCircle2  } from "react-icons/tb";
import { FaRetweet } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { SiSimpleanalytics } from "react-icons/si";
import { FiUpload } from "react-icons/fi";
import { FiBookmark } from "react-icons/fi";
import { Tweet, User } from '@/gql/graphql';
import Link from 'next/link';
import { useLikeTweet } from '@/hooks/tweet';
import { useCurrentUser } from '@/hooks/user';
import { userInfo } from 'os';
import { likedTweetMutation } from '@/graphql/mutation/likedTweet';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { graphQLClient } from '@/clients/api';
import { AiFillHeart } from 'react-icons/ai';


interface FeedCardProps {
    data: Tweet
}
interface  Props extends FeedCardProps{
    userInfo : User
}

const FeedCard : React.FC<FeedCardProps> = (props) => {
    const { data } = props
    const {user:currentUser} = useCurrentUser();
    const queryClient = useQueryClient();
    const [isLiked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(data.likes);

    const likeTweetMutation = useLikeTweet();

    const handleLikeTweet = useCallback(async ()=>{
        if(!props.data?.id || !currentUser)return;
        try{
            await  graphQLClient.request(likedTweetMutation, {tweetId: data.id, userId: currentUser.id})
            toast.success(`You liked the tweet`);
            await  queryClient.invalidateQueries({queryKey: ["like-tweets"]})
            setLiked(isLiked);
        }catch(err){
            console.log(err);
            toast.error('Failed to like the tweet');
        }
        console.log(data)
        
    },[props.data?.id,currentUser?.id, queryClient, likedTweetMutation])

    const LikeIcon = data.likes ? AiFillHeart : FaRegHeart
    return (
        <div className='border border-r-0 border-l-0 border-b-0 border-gray-800 p-5 hover:bg-slate-900 transition-all cursor-pointer'>
            <div className="grid grid-cols-12">
                <div className='col-span-1'>
                    {data.author?.profileImageUrl && <Image src={data.author?.profileImageUrl} alt='userAvatar' width={40} height={40} className='rounded-full'/>}
                </div>
                <div className="col-span-11 pl-3">
                    <Link href={`/${data.author?.id}`}>{data.author?.firstName} {data.author?.lastName}</Link>
                    <p>{data.content}</p>
                    {
                        data.imageUrl && <Image src={data.imageUrl} alt="TweetImage" height={400} width={400} className='rounded-lg'/>
                    }
                    <div className='flex justify-between mt-5 items-center text-xl p-2 w-[90%]'>
                        <div>
                        <TbMessageCircle2 />
                        </div>
                        <div>
                        <FaRetweet />
                        </div>
                        <div className='flex gap-2 justify-between'>
                            <LikeIcon  onClick={handleLikeTweet}/> 
                            { 
                                data.likes ?
                                <>
                                <span className='text-sm text-gray-500'>{data.likes}</span>
                                </>
                                :  null
                            }
                        </div>
                        <div>
                        <SiSimpleanalytics />
                        </div>
                        <div>
                        <FiBookmark />
                        </div>
                        <div>
                        <FiUpload />
                        </div>
                    </div>
                </div>
            </div>
        </div>
      
    );
}

export default FeedCard