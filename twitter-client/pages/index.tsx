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
import React from "react";
import { link } from "fs";
import FeedCard from "@/components/FeedCard";


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
  return (
    <div>
      <div className="grid grid-cols-12 h-screen w-screen px-56">
        <div className="col-span-3 justify-start pt-1 px-4">
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

        </div>
        <div className="col-span-6 border-r-[1px] border-l-[1px] border-gray-600 pt-1 h-screen overflow-scroll">
          <FeedCard/>
          <FeedCard/>
          <FeedCard/>
          <FeedCard/>
        </div>
        <div className="col-span-3 pt-1">
          col-3
        </div>
      </div>
    </div>
  );
}
