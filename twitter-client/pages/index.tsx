import Image from "next/image";
import { PiImageSquare } from "react-icons/pi";
import React, { useCallback, useState } from "react";
import FeedCard from "@/components/FeedCard";
import { useCurrentUser } from "@/hooks/user";
import { useCreateTweet, useGetAllTweets } from "@/hooks/tweet";
import { Tweet } from "@/gql/graphql";
import TwitterLayout from "@/components/Layout/TwitterLayout";
import { GetServerSideProps } from "next";
import { graphQLClient } from "@/clients/api";
import { getAllTweetsQuery } from "@/graphql/query/tweet";

interface HomeProps {
  tweets?: Tweet[] 
} 

export default function Home(props: HomeProps) {

  const { user } = useCurrentUser();
  
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



  

  return (
    <div>
     <TwitterLayout>
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
            props.tweets?.map(tweet => tweet? <FeedCard key={tweet?.id} data={tweet as Tweet}/> : null)
          }
     </TwitterLayout>
    </div>
  );
}

export const getServerSideProps : GetServerSideProps<HomeProps> = async(context) => {
  const getAllTweets = await graphQLClient.request(getAllTweetsQuery)
  return {
    props: {
      tweets:getAllTweets.getAllTweets as Tweet[]
    }
  }
}
