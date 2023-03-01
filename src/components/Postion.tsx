/* eslint-disable no-nested-ternary */
import { useWeb3React} from "@web3-react/core";
import { I18nContext } from "../i18n/i18n-react";
import { useEffect, useState,useContext } from "react";
import { BigNumber, ethers } from "ethers";
import { TcpPosition } from "../types/TcpPosition";
import { IERC20 } from "../types/IERC20";

import useLocalStorage from "../hooks/useLocalStorage";
import { formatUnits,parseUnits, formatEther, parseEther } from "@ethersproject/units";
import { useWaitForTransactionHash } from 'use-wait-for-transaction-hash';
import toast, { Toaster } from 'react-hot-toast';
import {isAddress} from "@ethersproject/address";
import { MAX, ADDRESS_ZERO,TCP_PPSITION_ADDRESS,TCP_TOKEN_ADDRESS,TCP_TOKEN_DECIMAL,PROVIDER_URL } from "../utils/config";

interface Props {
  tcpPositionContract: TcpPosition;
  tcpTokenContract: IERC20;
  fee:string
}

export const Postion = function Postion({ tcpPositionContract, tcpTokenContract,fee}: Props) {
  const { library, chainId, account,error } = useWeb3React();
  const { LL } = useContext(I18nContext);

  const [positionBalance, setPositionBalance] = useState<number>(0);
  const [releasedBalance, setReleasedBalance] = useState<number>(0);
  const [tcpBalance, setTcpBalance] = useState<number>(0);
  const [tcpAllowance, setTcpAllowance] = useState<number>(0);
  const [parentAddress, setParentAddress] = useLocalStorage<string>("parent-address",null);



  useEffect(()=>{

    if(!tcpPositionContract){
      return;
    }
    if(!account){
      return;
    }
    console.log("tcpPositionContract:",tcpPositionContract);
    console.log("account:",account);
    
    tcpPositionContract.getLockAmount(account).then((r)=>setPositionBalance(Number(formatUnits(r,TCP_TOKEN_DECIMAL))));
    tcpPositionContract.getUnlockAmount(account).then((r)=>setReleasedBalance(Number(formatUnits(r,TCP_TOKEN_DECIMAL))));
    tcpPositionContract.getParentAddress(account).then((r)=>{
      if(r.toLowerCase() != ADDRESS_ZERO){
        setParentAddress(r);
      }
    });
  },[tcpPositionContract,account]);

  useEffect(()=>{
    let interval = setInterval(()=>{
      console.log("tcpPositionContract.interval");
      if(!tcpPositionContract || !account){
        return;
      }
      tcpPositionContract.getLockAmount(account).then((r)=>setPositionBalance(Number(formatUnits(r,TCP_TOKEN_DECIMAL))));
      tcpPositionContract.getUnlockAmount(account).then((r)=>setReleasedBalance(Number(formatUnits(r,TCP_TOKEN_DECIMAL))));
    },3000);
    return () => clearInterval(interval);
  },[]);

  useEffect(()=>{
    if(!tcpTokenContract){
      return;
    }
    if(!account){
      return;
    }
    tcpTokenContract.balanceOf(account).then((r)=>{setTcpBalance(Number(formatUnits(r,TCP_TOKEN_DECIMAL)))});
    tcpTokenContract.allowance(account,TCP_PPSITION_ADDRESS).then((r)=>{setTcpAllowance(Number((formatUnits(r,TCP_TOKEN_DECIMAL))))});
  },[tcpTokenContract,account]);


  useEffect(()=>{
    
    let interval = setInterval(()=>{
      console.log("tcpTokenContract.interval");
      if(!tcpTokenContract || !account){
        return;
      }
      tcpTokenContract.balanceOf(account).then((r)=>{setTcpBalance(Number(formatUnits(r,TCP_TOKEN_DECIMAL)))});
      tcpTokenContract.allowance(account,TCP_PPSITION_ADDRESS).then((r)=>{setTcpAllowance(Number(formatUnits(r,TCP_TOKEN_DECIMAL)))});
    },3000);
    return () => clearInterval(interval);
  },[]);



  const withdrawalReleased = () => {
    if(!tcpPositionContract){
      return;
    }
    if(releasedBalance <= 0){
      return;
    }
    tcpPositionContract.harvestUnlockAmount().then(()=>{tcpPositionContract.getUnlockAmount(account).then((r)=>setReleasedBalance(Number(formatUnits(r,TCP_TOKEN_DECIMAL))))});
    
  };
  const [viewNum, setViewNum] = useState<number>(0);
  const [fromInput, setFromInput] = useState<number>(0);
  const changeEvent=(e)=>{
    let value = e.target.value.replace(/[^\d]/, '')
    setFromInput(value);
  }

  //授权TCP
  const approveTCP = () => {
    if(!account){
      return;
    }
    setApproveLoading(true);
    
    tcpTokenContract.approve(TCP_PPSITION_ADDRESS,MAX).then((tx)=>{
      setApproveHash(tx.hash);
    }).catch(()=>{
      setApproveLoading(false);
      toast.error('transaction failed');
    });
  };
  const [approveLoading, setApproveLoading] = useState<boolean>(false);
  const [approveHash, setApproveHash] = useState<string>("");
  useEffect(() => {
    if(tcpAllowance >= fromInput){
      setApproveLoading(false);
    }
  }, [tcpAllowance]);

  const approveResult = useWaitForTransactionHash({
    hash: approveHash,
    providerUrl:PROVIDER_URL
  });

  // measure performance base on the transaction status
  useEffect(() => {
    
    switch (approveResult.status) {
      case 'SUCCESS':
        break;
      case 'FAILED':
        setApproveLoading(false);
        toast.error('transaction failed');
        break;
      default:
    }
  }, [approveResult.status]);

  useEffect(() => {
    if(lockLoading){
      setLockLoading(false);
      setFromInput(0);
      setViewNum(0);
    }
  }, [positionBalance]);
  
  const addPostion = () => {
    if(!isAddress(parentAddress) || !parentAddress || parentAddress.toLowerCase() == ADDRESS_ZERO){
      toast.error(LL.Postion.InviteLinkPlaceholder());
      return;
    }
    if(!fromInput){
      toast.error(LL.Postion.InputPlaceholder());
      return;
    }
    if(fromInput < 0){
      toast.error(LL.Postion.InputPlaceholder());
      return;
    }
    setLockLoading(true);
    tcpPositionContract.lock(account,parseEther(fromInput.toString()),parentAddress,{value:ethers.utils.parseEther(fee)}).then((tx)=>{
      setLockHash(tx.hash);
    }).catch(()=>{
      setLockLoading(false);
      toast.error('transaction failed');
    });
  };


  const [lockLoading, setLockLoading] = useState<boolean>(false);
  const [lockHash, setLockHash] = useState<string>("");

  const lockResult = useWaitForTransactionHash({
    hash: lockHash,
    providerUrl:PROVIDER_URL
  });
  // measure performance base on the transaction status
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


  return (
      <div className="">
        <div className="mt-10 px-1">
         <div className="w-full text-primary-content bg-opacity-10 glass rounded-box ">
            <div className="navbar  pb-10" onClick={()=>setViewNum(0)}>
              <svg xmlns="http://www.w3.org/2000/svg" className={viewNum!=0?"h-5 w-5 m-1 ":"h-5 w-5 m-1 hidden"} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              <div className="flex-1 ">
                <h1 className="text-3xl">{LL.Postion.Title()}</h1>
              </div>
            </div>
            <div className={["grid pb-10 px-5",viewNum!=0?"hidden":""].join(" ")} >
              <div className="stats  bg-opacity-20  bg-neutral text-neutral-content  stats-vertical lg:stats-horizontal shadow-2xl">
    
                <div className="stat">
                  <div className="stat-title">{LL.Postion.PositionBalance()}</div>
                  <div className="stat-value">{positionBalance.toString().match(/^\d+(?:\.\d{0,5})?/)}</div>
                  <div className="stat-actions">
                    <button className="btn btn-md" onClick={()=>setViewNum(1)}>{LL.Postion.AddPosition()}</button>
                  </div>
                </div>
                
                <div className="stat">
                  <div className="stat-title">{LL.Postion.ReleasedBalance()}</div>
                  <div className="stat-value">{releasedBalance.toString().match(/^\d+(?:\.\d{0,5})?/)}</div>
                  <div className="stat-actions">
                    <button className={releasedBalance<=0?"btn btn-md btn-disabled":"btn btn-md"} onClick={()=>withdrawalReleased}>{LL.Postion.Withdrawal()}</button>
                  </div>
                </div>
              </div>
            </div>
            <div className={["grid pb-10 px-5",viewNum!=1?"hidden":""].join(" ")}>
              {/* <div className="card-body text-center bg-opacity-20  bg-neutral text-neutral-content rounded-box"> */}
                <label className="label">
                  <span className="label-text">{LL.Postion.NumberOfTCP()}</span>
                  <span className="label-text-alt">{LL.Postion.Balance()}: {tcpBalance.toString().match(/^\d+(?:\.\d{0,5})?/)} TCP</span>
                </label>
                <label className="input-group bg-opacity-0 bg-neutral text-neutral-content  ">
                  <input type="text" placeholder={LL.Postion.InputPlaceholder()} className="input input-bordered w-full bg-opacity-0" onChange={changeEvent} value={fromInput}/>
                  <span className="" onClick={()=>setFromInput(tcpBalance)}>{LL.Postion.MAX()}</span>
                </label>
                <div className="card-actions mt-5 grid grid-cols-2 gap-5">
                  <button className={["btn btn-md ",approveLoading?"loading":"",tcpAllowance <= 0 || tcpAllowance < fromInput ?"btn-primary":"btn-disabled"].join(" ")} onClick={approveTCP}>{LL.Postion.Approve()} TCP</button>
                  <button className={["btn btn-md  ",lockLoading?"loading":"",tcpAllowance > 0 && tcpAllowance >= fromInput ?"btn-primary":"btn-disabled"].join(" ")} onClick={addPostion}>{LL.Postion.AddPosition()}</button>
                </div>
                <ul className="steps">
                    <li className={["step",tcpAllowance == 0 || tcpAllowance < fromInput ?"step-primary":""].join(" ")}></li>
                    <li className={["step",tcpAllowance > 0 && tcpAllowance >= fromInput ?"step-primary":""].join(" ")}></li>

                  </ul>
              {/* </div>       */}
            </div>
          </div>
        </div>
        

      </div>
  );
};

export default Postion;
