import Image from "next/image";

import { BsTwitterX } from "react-icons/bs";
import { RiHome7Fill } from "react-icons/ri";
import { IoSearch } from "react-icons/io5";
import { IoNotificationsOutline } from "react-icons/io5";
import { FiMail } from "react-icons/fi";
import { PiBookmarkSimple } from "react-icons/pi";
import { RiFileListLine } from "react-icons/ri";
import { GrCurrency } from "react-icons/gr";
import { CiUser } from "react-icons/ci";
import { CiCircleMore } from "react-icons/ci";
import { PiImageSquare } from "react-icons/pi";
import React, { useCallback, useState } from "react";
import { link } from "fs";
import FeedCard from "@/components/FeedCard";
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import toast from "react-hot-toast";
import { graphQLClient } from "@/clients/api";
import { verifyUserGoogleTokenQuery } from "../graphql/query/user";
import { useCurrentUser } from "@/hooks/user";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateTweet, useGetAllTweets } from "@/hooks/tweet";
import { Tweet } from "@/gql/graphql";


interface TwitterSidebarButton{
  title:string,
  icon:React.ReactNode
}

const sidebarMenuItems : TwitterSidebarButton[] = [
  {
    title:'Home',
    icon: <RiHome7Fill />
  },
  {
    title:'Explore',
    icon:<IoSearch/>
  },
  {
    title:'Notifications',
    icon: <IoNotificationsOutline/>
  },
  {
    title:'Messages',
    icon:<FiMail />
  },
  {
    title:'Bookmarks',
    icon:<PiBookmarkSimple />
  },
  {
    title:'Lists',
    icon:<RiFileListLine />
  },
  {
    title:'Monetization',
    icon:<GrCurrency />
  },
  {
    title:'Profile',
    icon:<CiUser />
  },
  {
    title:'More',
    icon:<CiCircleMore />
  }
]

export default function Home() {

  const { user } = useCurrentUser();
  const { tweets=[] } = useGetAllTweets();
  const queryClient = useQueryClient();
  const { mutate } = useCreateTweet();
  //console.log(user);
  const [content,setContent] = useState('')

  const handleCreateTweet = useCallback(() => {
    mutate({
      content,
    })
  },[content, mutate])

  const handleImageSelector = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type','file');
    input.setAttribute('accept','image/*')
    input.click();
  },[])

  const handleLoginWithGoogle = useCallback(async(credential : CredentialResponse) => {
    const googleToken = credential.credential
    if(!googleToken){
      return toast.error(`Google token not found`);
    }
    try{
      const { verifyGoogleToken } = await graphQLClient.request(verifyUserGoogleTokenQuery, {token: googleToken})
      toast.success('login with google');
      //console.log(verifyGoogleToken);
      if(verifyGoogleToken)
      {
        window.localStorage.setItem('__twitter_token', verifyGoogleToken);
        await queryClient.invalidateQueries({queryKey: ["current-user"]});
      }
      
    }catch(error){
      console.error('Error verifying Google token:', error);
      toast.error('Error verifying Google token');
    }
   
  }, [queryClient])

  

  return (
    <div>
      <div className="grid grid-cols-12 h-screen w-screen px-56">
        <div className="col-span-3 justify-start pt-1 px-4 relative">
          {/* X Icon */}
          <div className="text-2xl hover:bg-slate-800 h-fit w-fit p-2 rounded-full cursor-pointer transition-all">
          <BsTwitterX/>
          </div>
          {/* Menu Item List */}
          <div className="mt-1 text-lg pr-4 font-small">
            <ul>
              {sidebarMenuItems.map(item => <li key={item.title} className="flex justify-start items-center gap-4 hover:bg-slate-800 rounded-full h-fit w-fit px-3 py-2 cursor-pointer"><span className="text-2xl">{item.icon}</span><span>{item.title}</span></li>)}
            </ul>
            <div className="mt-4">
              <button className="bg-[#1d9bf0] rounded-full w-full px-2 py-1 text-s font-semibold">Post</button>
            </div>
          </div>
          {/* user profile toggle button */}
          { user &&
            (<div className="absolute bottom-2 flex gap-2 items-center bg-slate-800 px-3 py-1 rounded-full cursor-pointer">
              {user && user.profileImageUrl && <Image src={user?.profileImageUrl} height={30} width={30} alt="Profile" className="rounded-full"/>}
             <div>
             <h3 className="text-sm">{user.firstName}{user.lastName}</h3>
             </div>
            </div>

          )}
        </div>
        <div className="col-span-6 border-r-[1px] border-l-[1px] border-gray-600 pt-1 h-screen overflow-scroll">
          <div>
            <div className='border border-r-0 border-l-0 border-b-0 border-gray-600 p-5 hover:bg-slate-900 transition-all cursor-pointer'>
              <div className="grid grid-cols-12 gap-3">
                <div className='col-span-1'>
                   {user?.profileImageUrl && <Image src={user?.profileImageUrl} alt='userAvatar' width={40} height={40} className='rounded-full'/>}
                </div>
                <div className="col-span-11">
                  <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full bg-transparent px-3 border-b border-slate-700" rows={4} placeholder="What's happening?" ></textarea>
                  <div className="mt-2 flex justify-between items-center">
                    <PiImageSquare onClick={handleImageSelector} className="text-xl"/>
                    <button onClick={handleCreateTweet} className="bg-[#1d9bf0] font-semibold text-sm py-2 px-4 rounded-full">Tweet</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {
            tweets?.map(tweet => tweet? <FeedCard key={tweet?.id} data={tweet as Tweet}/> : null)
          }
         
      
        </div>
        <div className="col-span-3 p-5">
          { !user && (<div className="p-5 bg-slate-800 rounded-lg w-fit">
            <GoogleLogin
              onSuccess={handleLoginWithGoogle}
              onError={() => {
                console.log('Login Failed');
              }}
            />
          </div>)}
        
        </div>
      </div>
    </div>
  );
}
