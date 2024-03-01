import Image from "next/image";
import { PiImageSquare } from "react-icons/pi";
import React, { useCallback, useEffect, useState } from "react";
import FeedCard from "@/components/FeedCard";
import { useCurrentUser } from "@/hooks/user";
import { useCreateTweet, useGetAllTweets } from "@/hooks/tweet";
import { Tweet } from "@/gql/graphql";
import TwitterLayout from "@/components/Layout/TwitterLayout";
import { GetServerSideProps } from "next";
import { graphQLClient } from "@/clients/api";
import { getAllTweetsQuery, getSignedURLForTweetQuery } from "@/graphql/query/tweet";
import axios from "axios";
import toast from "react-hot-toast";

interface HomeProps {
  tweets?: Tweet[] 
} 

export default function Home(props: HomeProps) {

  const { user } = useCurrentUser();
  const {tweets = props.tweets as Tweet[]} = useGetAllTweets()
  const { mutateAsync } = useCreateTweet();
  //console.log(user);
  const [content,setContent] = useState('')
  const [imageUrl, setImageURL] = useState('')
  



  const handleInputChangeFile = useCallback((input:HTMLInputElement) => {
    return async (event:Event) => {
      event.preventDefault();
      const file:File | null | undefined = input.files?.item(0);
      if(!file)return;
      const {getSignedURLForTweet} = await graphQLClient.request(getSignedURLForTweetQuery,{
        imageName: file.name,
        imageType: file.type
      })

      if(getSignedURLForTweet){
        toast.loading('Uploading...', {id:'2'});
        try{
          await axios.put(getSignedURLForTweet,file,{
            headers:{
              'Content-Type': file.type
            },
          })
          toast.success("Upload Successfully!", { id: '2' });
          const url = new URL(getSignedURLForTweet)
          const  myFilePath = `${url.origin}${url.pathname}`
          setImageURL(myFilePath)
        }catch(error){
          console.log(error);
          toast.error('Some issue while uploading image')
        }
     
        
      }
    }
  },[])

  const handleCreateTweet = useCallback(async() => {
    await mutateAsync({
      content,
      imageUrl
    })
   setContent("");
   setImageURL("");
  },[content, mutateAsync,imageUrl])

  const handleImageSelector = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type','file');
    input.setAttribute('accept','image/*')

    const handlerFn = handleInputChangeFile(input)

    input.addEventListener( 'change', handlerFn)
    input.click();
  },[handleInputChangeFile])



  

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
                  {
                    imageUrl && <Image src={imageUrl} alt="uploadedTweetImageByUser" height={300} width={300} />
                  }
                  <div className="mt-2 flex justify-between items-center">
                    <PiImageSquare onClick={handleImageSelector} className="text-xl"/>
                    <button onClick={handleCreateTweet} className="bg-[#1d9bf0] font-semibold text-sm py-2 px-4 rounded-full">Tweet</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {
            tweets?.map((tweet) => tweet? <FeedCard key={tweet?.id} data={tweet as Tweet}/> : null)
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
