import Image from 'next/image';
import React from 'react'
import { TbMessageCircle2  } from "react-icons/tb";
import { FaRetweet } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { SiSimpleanalytics } from "react-icons/si";

import { FiUpload } from "react-icons/fi";
import { FiBookmark } from "react-icons/fi";
const FeedCard : React.FC = () => {
    return (
        <div className='border border-r-0 border-l-0 border-b-0 border-gray-600 p-5 hover:bg-slate-900 transition-all cursor-pointer'>
            <div className="grid grid-cols-12">
                <div className='col-span-1'>
                    <Image src="https://avatars.githubusercontent.com/u/108392226?v=4" alt='userAvatar' width={40} height={40} className='rounded-full'/>
                </div>
                <div className="col-span-11 pl-3">
                    <h5>UserName</h5>
                    <p>Post content...</p>
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