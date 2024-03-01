import React, { useCallback, useMemo} from "react";
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
import { useCurrentUser } from "@/hooks/user";
import Image from "next/image";
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import toast from "react-hot-toast";
import { graphQLClient } from "@/clients/api";
import { verifyUserGoogleTokenQuery } from "../../graphql/query/user";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

interface TwitterLayoutProps {
    children : React.ReactNode
}

interface TwitterSidebarButton{
    title:string,
    icon:React.ReactNode,
    link: string
  }



const TwitterLayout:React.FC<TwitterLayoutProps> = (props) => {
    const { user } = useCurrentUser();
    const queryClient = useQueryClient();

    const sidebarMenuItems:TwitterSidebarButton[] = useMemo(()=>[
        {
          title:'Home',
          icon: <RiHome7Fill />,
          link: '/'
        },
        {
          title:'Explore',
          icon:<IoSearch/>,
          link: '/'
        },
        {
          title:'Notifications',
          icon: <IoNotificationsOutline/>,
          link: '/'
        },
        {
          title:'Messages',
          icon:<FiMail />,
          link: '/'
        },
        {
          title:'Bookmarks',
          icon:<PiBookmarkSimple />,
          link: '/'
        },
        {
          title:'Lists',
          icon:<RiFileListLine />,
          link: '/'
        },
        {
          title:'Monetization',
          icon:<GrCurrency />,
          link: '/'
        },
        {
          title:'Profile',
          icon:<CiUser />,
          link: `/${user?.id}`
        },
        {
          title:'More',
          icon:<CiCircleMore />,
          link: '/'
        }
      ],[user?.id])

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
        <div className="grid grid-cols-12 h-screen w-screen sm:px-56">
        <div className="col-span-2 sm:col-span-3 pt-1 px-4 flex sm:justify-end pr-4 relative">
        <div>
            {/* X Icon */}
          <div className="text-2xl hover:bg-slate-800 h-fit w-fit p-2 rounded-full cursor-pointer transition-all">
          <BsTwitterX/>
          </div>
          {/* Menu Item List */}
          <div className="mt-1 text-lg pr-4 font-small">
            <ul>
              {sidebarMenuItems.map(item =>
                 <li key={item.title} >
                    <Link href={item.link} className="flex justify-start items-center gap-4 hover:bg-slate-800 rounded-full h-fit w-fit px-3 py-2 cursor-pointer">
                        <span className="text-2xl">{item.icon}</span>
                        <span className="hidden sm:inline">{item.title}</span>
                    </Link>
                </li>)}
            </ul>
            <div className="mt-4">
              <button className="hidden sm:block bg-[#1d9bf0] rounded-full w-full px-2 py-1 text-s font-semibold">Post</button>
              <button className="block sm:hidden bg-[#1d9bf0] rounded-full w-full px-2 py-1 text-s font-semibold">
              <BsTwitterX/>
              </button>
            </div>
          </div>
        </div>
          {/* user profile toggle button */}
          { user &&
            (<div className="absolute bottom-2 flex gap-2 items-center bg-slate-800 px-3 py-1 rounded-full cursor-pointer">
              {user && user.profileImageUrl && <Image src={user?.profileImageUrl} height={30} width={30} alt="Profile" className="rounded-full"/>}
             <div className="hidden sm:block">
             <h3 className="text-sm">{user.firstName}{user.lastName}</h3>
             </div>
            </div>

          )}
        </div>

        <div className="col-span-10 sm:col-span-6 border-r-[1px] border-l-[1px] border-gray-600 pt-1 h-screen overflow-scroll">
          {props.children}
        </div>

        <div className="col-span-0 sm:col-span-3 p-5">
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
  )
}

export default TwitterLayout