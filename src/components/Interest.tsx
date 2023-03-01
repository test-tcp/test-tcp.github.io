/* eslint-disable no-nested-ternary */
import { useWeb3React} from "@web3-react/core";
import { I18nContext } from "../i18n/i18n-react";
import { useEffect, useState,useContext,useRef } from "react";
import { BigNumber, ethers } from "ethers";
import { TcpPosition } from "../types/TcpPosition";

import { formatUnits,parseUnits } from "@ethersproject/units";
import { IERC20 } from "../types/IERC20";
import { MAX, ADDRESS_ZERO,TCP_PPSITION_ADDRESS,TCP_TOKEN_ADDRESS,TCP_TOKEN_DECIMAL,PROVIDER_URL } from "../utils/config";
import toast, { Toaster } from 'react-hot-toast';
import { useWaitForTransactionHash } from 'use-wait-for-transaction-hash';

interface Props {
  tcpPositionContract: TcpPosition;
  tcpTokenContract: IERC20;
  fee:string
}
export const Interest = function Interest({ tcpPositionContract, tcpTokenContract,fee}: Props) {
  const { library, chainId, account,error } = useWeb3React();
  const { LL } = useContext(I18nContext);
  const [receiveInterest, setReceiveInterest] = useState<number>(0);
  const [receivedInterest, setReceivedInterest] = useState<number>(0);

  useEffect(()=>{
    if(!tcpPositionContract){
      return;
    }
    if(!account){
      return;
    }
    
    tcpPositionContract.getWaitHarvest(account).then((r)=>setReceiveInterest(Number(formatUnits(r,TCP_TOKEN_DECIMAL))));
    tcpPositionContract.userInfos(account).then((r)=>setReceivedInterest(Number(formatUnits(r.harvestAmount,TCP_TOKEN_DECIMAL))));
  },[tcpPositionContract,account]);

  useEffect(()=>{
    
    let interval = setInterval(()=>{
      console.log("tcpPositionContract.interval start");
      if(!tcpPositionContract || !account){
        return;
      }
      tcpPositionContract.getWaitHarvest(account).then((r)=>setReceiveInterest(Number(formatUnits(r,TCP_TOKEN_DECIMAL))));
      tcpPositionContract.userInfos(account).then((r)=>setReceivedInterest(Number(formatUnits(r.harvestAmount,TCP_TOKEN_DECIMAL))));
      console.log("tcpPositionContract.interval end");
    },3000);

    return () => clearInterval(interval);
  },[]);


  const [lockLoading, setLockLoading] = useState<boolean>(false);
  const [lockHash, setLockHash] = useState<string>("");
  
  const getReceiveInterest = () => {
    
    if(!receiveInterest || receiveInterest <= 0){
      toast.error(LL.Postion.InputPlaceholder());
      return;
    }
    
    setLockLoading(true);
 
    tcpPositionContract.harvest({value:ethers.utils.parseEther(fee)}).then((tx)=>{
      setLockHash(tx.hash);
    }).catch((e)=>{
      setLockLoading(false);
      console.log(e);
      toast.error('transaction failed');
    });
  };

  const lockResult = useWaitForTransactionHash({
    hash: lockHash,
    providerUrl:PROVIDER_URL
  });

  const [receiveInterestOld, setReceiveInterestOld] = useState<number>(0);
  useEffect(() => {
    if(lockLoading && receiveInterestOld > receiveInterest){
      setLockLoading(false);
    }
    if(reinvestLoading && receiveInterestOld > receiveInterest){
      setReinvestLoading(false);
    }
    setReceiveInterestOld(receiveInterest);
  }, [receiveInterest]);

  useEffect(() => {
    
    switch (lockResult.status) {
      case 'SUCCESS':
        break;
      case 'FAILED':
        setLockLoading(false);
        toast.error('transaction failed');
        break;
      default:
    }
  }, [lockResult.status]);


  const [reinvestLoading, setReinvestLoading] = useState<boolean>(false);
  const [reinvestHash, setReinvestHash] = useState<string>("");

  const reinvestResult = useWaitForTransactionHash({
    hash: reinvestHash,
    providerUrl:PROVIDER_URL
  });

  useEffect(() => {
    
    switch (reinvestResult.status) {
      case 'SUCCESS':
        break;
      case 'FAILED':
        setLockLoading(false);
        toast.error('transaction failed');
        break;
      default:
    }
  }, [reinvestResult.status]);


  const reinvest = () => {
    
    if(!receiveInterest || receiveInterest <= 0){
      toast.error(LL.Interest.ReceiveInterestZero());
      return;
    }
    setReinvestLoading(true);

    tcpPositionContract.relock({value:ethers.utils.parseEther(fee)}).then((tx)=>{
      setReinvestHash(tx.hash);
    }).catch(()=>{
      setReinvestLoading(false);
      toast.error('transaction failed');
    });
  };

  return (
      <div className="">
        <div className="mt-10 px-1">
         <div className="w-full text-primary-content bg-opacity-10 glass rounded-box ">
            
            <div className="navbar  pb-10 ">
              <div className="flex-1 ">
                <h1 className="text-3xl">{LL.Interest.Title()}</h1>
              </div>
            </div>
            <div className=" grid  pb-10  px-5">
              <div className="stats  bg-opacity-20  bg-neutral text-neutral-content stats-vertical lg:stats-horizontal shadow-2xl">
    
                <div className="stat">
                  <div className="stat-title">{LL.Interest.ReceiveInterest()}</div>
                  <div className="stat-value">{receiveInterest.toString().match(/^\d+(?:\.\d{0,5})?/)}</div>
                  <div className="stat-actions space-x-5">
                    <button className={["btn btn-md",lockLoading?"loading":"",receiveInterest<=0?"btn-disabled":""].join(" ")} onClick={getReceiveInterest}>{LL.Interest.Receive()}</button>
                    <button className={["btn btn-md",reinvestLoading?"loading":"",receiveInterest<=0?"btn-disabled":""].join(" ")} onClick={reinvest}>{LL.Interest.Reinvest()}</button>
                  </div>
                </div>
                
                <div className="stat">
                  <div className="stat-title">{LL.Interest.ReceivedInterest()}</div>
                  <div className="stat-value">{receivedInterest.toString().match(/^\d+(?:\.\d{0,5})?/)}</div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Interest;
