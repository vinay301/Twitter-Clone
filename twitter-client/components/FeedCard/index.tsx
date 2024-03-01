import Image from 'next/image';
import React from 'react'
import { TbMessageCircle2  } from "react-icons/tb";
import { FaRetweet } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { SiSimpleanalytics } from "react-icons/si";
import { FiUpload } from "react-icons/fi";
import { FiBookmark } from "react-icons/fi";
import { Tweet } from '@/gql/graphql';
import Link from 'next/link';


interface FeedCardProps {
    data: Tweet
}

const FeedCard : React.FC<FeedCardProps> = (props) => {
    const { data } = props
    return (
        <div className='border border-r-0 border-l-0 border-b-0 border-gray-600 p-5 hover:bg-slate-900 transition-all cursor-pointer'>
            <div className="grid grid-cols-12">
                <div className='col-span-1'>
                    {data.author?.profileImageUrl && <Image src={data.author?.profileImageUrl} alt='userAvatar' width={40} height={40} className='rounded-full'/>}
                </div>
                <div className="col-span-11 pl-3">
                    <Link href={`/${data.author?.id}`}>{data.author?.firstName} {data.author?.lastName}</Link>
                    <p>{data.content}</p>
                    {
                        data.imageUrl && <Image src={data.imageUrl} alt="TweetImage" height={400} width={400}/>
                    }
                    <div className='flex justify-between mt-5 items-center text-xl p-2 w-[90%]'>
                        <div>
                        <TbMessageCircle2 />
                        </div>
                        <div>
                        <FaRetweet />
                        </div>
                        <div>
                        <FaRegHeart />
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