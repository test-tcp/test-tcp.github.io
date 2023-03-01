/* eslint-disable no-nested-ternary */

import { useEffect, useState,useContext,useRef } from "react";

interface AdItem {
  time: number;
  url: string;
  img:string
}
export const Advertise = function Advertise() {
  const [adIndex, setAdIndex] = useState(0);
  const [ads, setAds] = useState<[AdItem]>([{
    img:"/ad/4de7c2275f921e919fa4d67b1dd991de.jpg",
    url:"https://1xbit1.com/cn/line?tag=d_33760m_1732c_2745fc76e8799f44232",
    time:2000
}]);
  
  useEffect(()=>{
    fetch('/ad.json', {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
        },
    })
    .then(response => response.json())//解析为Promise
    .then(data => {
      setAds(data);
    })
  },[]);
  useEffect(()=>{
    if(ads){
      let times = ads[adIndex].time;
      setTimeout(()=>{
        let index = adIndex+1
        if(index >= ads.length){
          setAdIndex(0)
        }else{
          setAdIndex(index)
        }
      },times)
    }
    
  },[ads,adIndex])

  return (
    <div className="w-full mt-5 px-1">
      <div className="w-full h-full rounded relative" >
        <div className="absolute bg-white text-sky-400 text-sm right-0 top-0">Google 广告 </div>
        <a href={ads[adIndex].url} target={"_blank"}>
          <img src={ads[adIndex].img} className={"w-full h-36"} alt="" />
        </a>
      </div>
    </div>
  );
};

export default Advertise;
