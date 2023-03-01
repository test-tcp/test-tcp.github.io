
/* eslint-disable no-nested-ternary */
import { useWeb3React} from "@web3-react/core";
import { I18nContext } from "../i18n/i18n-react";
import { useEffect, useState,useContext } from "react";

import { TcpPosition } from "../types/TcpPosition";
import { IERC20 } from "../types/IERC20";

import useLocalStorage from "../hooks/useLocalStorage";
import { formatUnits,parseUnits, formatEther, parseEther } from "@ethersproject/units";
import { useWaitForTransactionHash } from 'use-wait-for-transaction-hash';
import toast, { Toaster } from 'react-hot-toast';
import {isAddress} from "@ethersproject/address";
import { MAX, ADDRESS_ZERO,TCP_PPSITION_ADDRESS,TCP_TOKEN_ADDRESS,TCP_TOKEN_DECIMAL,PROVIDER_URL } from "../utils/config";
import QRCode from 'qrcode.react';
import copy from 'copy-to-clipboard';

interface Props {
  tcpPositionContract: TcpPosition;
  tcpTokenContract: IERC20;
}

export const Community = function Community({ tcpPositionContract, tcpTokenContract}: Props) {
  const { library, chainId, account,error } = useWeb3React();
  const { LL } = useContext(I18nContext);

  const [referralUser, setReferralUser] = useState<number>(0);
  const [referralReward, setReferralReward] = useState<number>(0);

  const [markerLevel, setMarkerLeve] = useState<number>(0);
  const [markerReward, setMarkerReward] = useState<number>(0);
  

  const [parentAddress, setParentAddress] = useLocalStorage<string>("parent-address",null);


  useEffect(()=>{
    if(!tcpPositionContract){
      return;
    }
    if(!account){
      return;
    }
    tcpPositionContract.getUserInfo(account).then((r)=>{
      console.log(r.recommendUser);console.log(r.recommendReward);console.log(r.level);console.log(r.levelReward);
      setReferralUser(Number(r.recommendUser));
      setReferralReward(Number(formatUnits(r.recommendReward,TCP_TOKEN_DECIMAL)));
      setMarkerLeve(Number(r.level));
      setMarkerReward(Number(formatUnits(r.levelReward,TCP_TOKEN_DECIMAL)));
    });
  },[tcpPositionContract,account]);

  useEffect(()=>{
    let interval = setInterval(()=>{
      
      if(!tcpPositionContract || !account){
        return;
      }
      tcpPositionContract.getUserInfo(account).then((r)=>{
        console.log(r.recommendUser);console.log(r.recommendReward);console.log(r.level);console.log(r.levelReward);
        setReferralUser(Number(r.recommendUser));
        setReferralReward(Number(formatUnits(r.recommendReward,TCP_TOKEN_DECIMAL)));
        setMarkerLeve(Number(r.level));
        setMarkerReward(Number(formatUnits(r.levelReward,TCP_TOKEN_DECIMAL)));
      });
      console.log("tcpPositionContract.interval end");
    },3000);
    return () => clearInterval(interval);
  },[]);

  const [viewNum, setViewNum] = useState<number>(0);
  
  return (
      <div className="">
        <div className="mt-10 px-1">
         <div className="w-full text-primary-content bg-opacity-10 glass rounded-box ">
            <div className="navbar  pb-10" onClick={()=>setViewNum(0)}>
              <svg xmlns="http://www.w3.org/2000/svg" className={viewNum!=0?"h-5 w-5 m-1 ":"h-5 w-5 m-1 hidden"} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              <div className="flex-1 ">
                <h1 className="text-3xl">{LL.Community.Title()}</h1>
              </div>
            </div>
            <div className={["grid pb-10 px-5",viewNum!=0?"hidden":""].join(" ")} >
              <div className="stats  bg-opacity-20  bg-neutral text-neutral-content  stats-vertical lg:stats-horizontal shadow-2xl">
    
                <div className="stat">
                  <div className="stat-title">{LL.Community.ReferralUser()}</div>
                  <div className="stat-value">{referralUser}</div>
                  <div className="stat-actions">
                      <button onClick={()=>setViewNum(1)}  className="btn ">{LL.Community.Invite()}</button>
                  </div>
                </div>
                
                <div className="stat">
                  <div className="stat-title">{LL.Community.ReferralReward()}</div>
                  <div className="stat-value">{referralReward.toString().match(/^\d+(?:\.\d{0,5})?/)}</div>
                </div>
              </div>
              <div className="stats  bg-opacity-20  bg-neutral text-neutral-content  stats-vertical lg:stats-horizontal shadow-2xl">
    
                <div className="stat">
                  <div className="stat-title">{LL.Community.MarkerLevel()}</div>
                  <div className="stat-value">{markerLevel}</div>
                </div>
                
                <div className="stat">
                  <div className="stat-title">{LL.Community.MarkerReward()}</div>
                  <div className="stat-value">{markerReward.toString().match(/^\d+(?:\.\d{0,5})?/)}</div>
                </div>
              </div>
            </div>
            <div className={["grid pb-10 px-5",viewNum!=1?"hidden":""].join(" ")}>
              
              <div className="card-body items-center">
              <h2 className="card-title">{LL.Community.Scanit()}</h2>
                <figure className="">
                  <QRCode
                      value={window.location.origin+"?address="+account}
                      size={225}
                      fgColor="#000000"
                      imageSettings={{ 
                        src: "/icon.png",
                        height: 20,
                        width: 20,
                        excavate: true
                      }}
                      className="rounded-xl"
                  />
                </figure>
                <h2 className="card-title">{LL.Community.CopyLink()}</h2>
                <div className="w-full">
                  <div className="whitespace-pre-line break-all underline text-white">{(window.location.origin+"?address="+account)}</div>
                </div>
                {/* <p className="max-w-full text-left"></p> */}
                <div className="card-actions">
                  <button className="btn " onClick={()=>{
                    copy(window.location.origin+"?address="+account);
                    toast.success(LL.Community.CopySuccess());
                    }}>{LL.Community.Copy()}</button>
                </div>
              </div>      
            </div>
          </div>
        </div>
        

      </div>
  );
};

export default Community;
