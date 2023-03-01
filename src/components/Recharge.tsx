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
import { MAX, ADDRESS_ZERO,TCP_PPSITION_ADDRESS,TCP_TOKEN_ADDRESS,TCP_TOKEN_DECIMAL,PROVIDER_URL, C2C_MARKET_ADDRESS, USDT_TOKEN_DECIMAL, CHAIN_ID } from "../utils/config";
import { Contract, Provider, setMulticallAddress } from 'ethers-multicall';
import { C2CMarketUpgradeable } from "../types";
import C2CMarketUpgradeableAbi from "../artifacts/contracts/c2c/C2CMarketUpgradeable.sol/C2CMarketUpgradeable.json"
import moment from "moment";



const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL)



interface Props {
  tcpPositionContract: TcpPosition;
  tcpTokenContract: IERC20;
  c2cMarketContract : C2CMarketUpgradeable;
  usdtTokenContract : IERC20;
  fee:string
}

interface Item {
  id:number,
  owner:string,
  name: string,
  turnover:number,
  price:number,
  total:number,
  min:number,
  max:number,
  sellToken:string,
  receiveToken: string,

}


interface OrderItem {
  createTime: Date;//创建时间
  lumpSum:number;//总额
  price:number;//价格
  total:number;//总量
  otherName:string;//对方名称
  otherAddress:string;//对方地址
}




export const Recharge = function Recharge({ tcpPositionContract, tcpTokenContract,c2cMarketContract,usdtTokenContract,fee}: Props) {
  const { library, chainId, account,error } = useWeb3React();
  const { LL } = useContext(I18nContext);

  const [positionBalance, setPositionBalance] = useState<number>(0);
  const [releasedBalance, setReleasedBalance] = useState<number>(0);
  const [usdtBalance, setUsdtBalance] = useState<number>(0);
  const [usdtAllowance, setUsdtAllowance] = useState<number>(0);
  const [tcpBalance, setTcpBalance] = useState<number>(0);
  const [tcpAllowance, setTcpAllowance] = useState<number>(0);
  const [parentAddress, setParentAddress] = useLocalStorage<string>("parent-address",null);

  const [list, setList] = useState<Item[]>([]);
  const [orderList, setOrderList] = useState<OrderItem[]>([]);

  const [currentSeller, setCurrentSeller] = useState<number>(-1);
  
  async function itemListFn() {
    const ethcallProvider = new Provider(provider);

    // setMulticallAddress(CHAIN_ID,"0x5FbDB2315678afecb367f032d93F642f64180aa3");
    await ethcallProvider.init(); // Only required when `chainId` is not provided in the `Provider` constructor
  
    const c2CMarketUpgradeable = new Contract(C2C_MARKET_ADDRESS, C2CMarketUpgradeableAbi.abi);
    

    const advertiseIdsCall = c2CMarketUpgradeable.advertiseIds();
    const [advertiseIds] = await ethcallProvider.all([advertiseIdsCall])
    console.log("advertiseIds:",advertiseIds)
    var pageCalls = [];

    for (let index = 0; index < advertiseIds.length; index++) {
      pageCalls.push(c2CMarketUpgradeable.c2CAdvertiseMap(advertiseIds[index]))
    }
    if(pageCalls.length > 0){
      const resulstList = await ethcallProvider.all(pageCalls);
      let addItems:Item[] = [];
      for (let index = 0; index < resulstList.length; index++) {
        const element = resulstList[index];
        let id = element.id as BigNumber;
        let owner = element.owner;
        let nickName = element.nickName;
        let total = element.total as BigNumber;
        let sold = element.sold as BigNumber;
        let price = element.price as BigNumber;
        let min = element.min as BigNumber;
        let max = element.max as BigNumber;
        let sellToken = element.sellToken;
        let receiveToken = element.receiveToken;
        addItems.push({
          id:id.toNumber(),
          owner,//地址
          name: nickName,//昵称
          turnover:parseFloat(ethers.utils.formatEther(sold)),//销量
          price: parseFloat(ethers.utils.formatEther(price)),//价格
          total:parseFloat(ethers.utils.formatEther(total.sub(sold))) ,//总量
          min:parseFloat(ethers.utils.formatEther(min)),//最小
          max:parseFloat(ethers.utils.formatEther(max)),//最大
          sellToken,
          receiveToken,
        })
      }
      setList([...addItems])
    }

    // for (let i = 0; i < Math.ceil(advertiseLength/10); i++) {
    //   var pageCalls = [];
    //   for (let j = 0; j < 10; j++) {
    //     const index = i*10+j;
    //     if(advertiseLength > index){
    //       pageCalls.push(c2CMarketUpgradeable.c2CAdvertiseMap(index))
    //     }
    //   }
    //   if(pageCalls.length > 0){
    //     const resulstList = await ethcallProvider.all(pageCalls);
    //     console.log(resulstList)
    //     let addItems:Item[] = [];
    //     for (let index = 0; index < resulstList.length; index++) {
    //       const element = resulstList[index];
    //       let id = element.id as BigNumber;
    //       let owner = element.owner;
    //       let nickName = element.nickName;
    //       let total = element.total as BigNumber;
    //       let sold = element.sold as BigNumber;
    //       let price = element.price as BigNumber;
    //       let min = element.min as BigNumber;
    //       let max = element.max as BigNumber;
    //       let sellToken = element.sellToken;
    //       let receiveToken = element.receiveToken;
    //       addItems.push({
    //         id:id.toNumber(),
    //         owner,
    //         name: nickName,
    //         turnover:sold.toNumber(),
    //         price: price.toNumber(),
    //         total:parseFloat(ethers.utils.formatEther(total.sub(sold))) ,
    //         min:parseFloat(ethers.utils.formatEther(min)),
    //         max:parseFloat(ethers.utils.formatEther(max)),
    //         sellToken,
    //         receiveToken,
    //       })
    //     }
    //     setList([...addItems])
    //   }
    // }
  
    
  
    
  
    
  }

  async function orderListFn() {
    const ethcallProvider = new Provider(provider);

    setMulticallAddress(CHAIN_ID,"0x5FbDB2315678afecb367f032d93F642f64180aa3");
    await ethcallProvider.init(); // Only required when `chainId` is not provided in the `Provider` constructor
  
    const c2CMarketUpgradeable = new Contract(C2C_MARKET_ADDRESS, C2CMarketUpgradeableAbi.abi);
    

    const ownerC2COrderIdsCall = c2CMarketUpgradeable.ownerC2COrderIds(account);
    const [ownerC2COrderIds] = await ethcallProvider.all([ownerC2COrderIdsCall])
    console.log("ownerC2COrderIds:",ownerC2COrderIds)
    var pageCalls = [];
    for (let index = 0; index < ownerC2COrderIds.length; index++) {
      const element = ownerC2COrderIds[index];
      const ownerC2COrderIdsCall = c2CMarketUpgradeable.c2COrderMap(element);
      pageCalls.push(ownerC2COrderIdsCall);
    }
    let resulstList = await ethcallProvider.all(pageCalls);
    if(resulstList.length <= 0){
      return;
    }
    resulstList = resulstList.reverse();
    let adIds = []
    for (let j = 0; j < resulstList.length; j++) {
      
      const element = resulstList[j];
      console.log("element:",element)
      console.log("adIds:",adIds)

      let adIndex = adIds.indexOf(element.adId.toNumber())
      console.log("adIndex:",adIndex)

      if(adIndex < 0){
        adIds.push(element.adId.toNumber());
      }
    }
    
    let adListCall = [];
    for (let j = 0; j < adIds.length; j++) {
      adListCall.push(c2CMarketUpgradeable.c2CAdvertiseMap(adIds[j]))
    }
    
    const adList = await ethcallProvider.all(adListCall);
    console.log("adList:",adList)
    let orders = [];
    for (let j = 0; j < resulstList.length; j++) {
      const element = resulstList[j];

      const adId = element.adId;
      const adIndex = adIds.indexOf(adId.toNumber());
      let adObj = adList[adIndex];
      orders.push({
        createTime: new Date(parseInt(element.createTime+"000")),
        lumpSum:parseFloat(ethers.utils.formatEther(element.amount)),//总额
        price:parseFloat(ethers.utils.formatEther(element.price)),//价格
        total:parseFloat(ethers.utils.formatEther(element.quantity)),//总量
        otherName:adObj.nickName,//对方名称
        otherAddress:adObj.owner//对方地址
      })
    }
    setOrderList([...orders]);
  }
  // useEffect(()=>{

  //   if(!tcpPositionContract){
  //     return;
  //   }
  //   if(!account){
  //     return;
  //   }
  //   console.log("tcpPositionContract:",tcpPositionContract);
  //   console.log("account:",account);
    
  //   tcpPositionContract.getLockAmount(account).then((r)=>setPositionBalance(Number(formatUnits(r,TCP_TOKEN_DECIMAL))));
  //   tcpPositionContract.getUnlockAmount(account).then((r)=>setReleasedBalance(Number(formatUnits(r,TCP_TOKEN_DECIMAL))));
  //   tcpPositionContract.getParentAddress(account).then((r)=>{
  //     if(r.toLowerCase() != ADDRESS_ZERO){
  //       setParentAddress(r);
  //     }
  //   });
  // },[tcpPositionContract,account]);

  useEffect(()=>{
    itemListFn();
    orderListFn();
    // return () => clearInterval(interval);
  },[]);

  useEffect(()=>{
    if(!usdtTokenContract){
      return;
    }
    if(!account){
      return;
    }
    usdtTokenContract.balanceOf(account).then((r)=>{setUsdtBalance(Number(formatUnits(r,USDT_TOKEN_DECIMAL)))});
    usdtTokenContract.allowance(account,C2C_MARKET_ADDRESS).then((r)=>{setUsdtAllowance(Number((formatUnits(r,USDT_TOKEN_DECIMAL))))});
  },[usdtTokenContract,account]);

  useEffect(()=>{
    if(!tcpTokenContract){
      return;
    }
    if(!account){
      return;
    }
    tcpTokenContract.balanceOf(account).then((r)=>{setTcpBalance(Number(formatUnits(r,TCP_TOKEN_DECIMAL)))});
    tcpTokenContract.allowance(account,C2C_MARKET_ADDRESS).then((r)=>{setTcpAllowance(Number((formatUnits(r,TCP_TOKEN_DECIMAL))))});
  },[tcpTokenContract,account]);


  useEffect(()=>{
    
    let interval1 = setInterval(()=>{
      if(!usdtTokenContract || !account){
        return;
      }
      usdtTokenContract.balanceOf(account).then((r)=>{setUsdtBalance(Number(formatUnits(r,USDT_TOKEN_DECIMAL)))});
      usdtTokenContract.allowance(account,C2C_MARKET_ADDRESS).then((r)=>{setUsdtAllowance(Number(formatUnits(r,USDT_TOKEN_DECIMAL)))});

      
    },3000);

    let interval2 = setInterval(()=>{
      if(!tcpTokenContract || !account){
        return;
      }
      tcpTokenContract.balanceOf(account).then((r)=>{setTcpBalance(Number(formatUnits(r,TCP_TOKEN_DECIMAL)))});
      tcpTokenContract.allowance(account,C2C_MARKET_ADDRESS).then((r)=>{setTcpAllowance(Number(formatUnits(r,TCP_TOKEN_DECIMAL)))});
    },3000);

    return () => {clearInterval(interval1);clearInterval(interval2);}
  },[]);




  const [viewNum, setViewNum] = useState<number>(0);
  const [fromInput, setFromInput] = useState<number>();
  
  const changeEvent=(e)=>{
    let value = e.target.value.replace(/[^\d]/, '')
    setFromInput(value);
  }

  useEffect(()=>{
    if(viewNum == 0){
      itemListFn();
    }
    if(viewNum == 2){
      orderListFn();
    }
    
  },[viewNum]);

  //授权TCP
  const approveUSDT = () => {
    if(!account){
      return;
    }
    setApproveLoading(true);
    
    usdtTokenContract.approve(C2C_MARKET_ADDRESS,MAX).then((tx)=>{
      setApproveHash(tx.hash);
    }).catch(()=>{
      setApproveLoading(false);
      toast.error('transaction failed');
    });
  };
  const [approveLoading, setApproveLoading] = useState<boolean>(false);
  const [approveHash, setApproveHash] = useState<string>("");
  let needPay = currentSeller >= 0 ? fromInput ? fromInput*list[currentSeller].price : 0 : 0;
  useEffect(() => {
    if(usdtAllowance >= needPay){
      setApproveLoading(false);
    }
  }, [usdtAllowance]);

  const approveResult = useWaitForTransactionHash({
    hash: approveHash,
    providerUrl:PROVIDER_URL
  });

  // measure performance base on the transaction status
  useEffect(() => {
    
    switch (approveResult.status) {
      case 'SUCCESS':
        toast.success('transaction success');
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
    
    if(!fromInput){
      toast.error(LL.Recharge.InputPlaceholder());
      return;
    }
    if(fromInput < 0){
      toast.error(LL.Recharge.InputPlaceholder());
      return;
    }
    setLockLoading(true);
    c2cMarketContract.createC2COrder(list[currentSeller].id,ethers.utils.parseEther(fromInput+""),{value:ethers.utils.parseEther(fee)}).then((tx)=>{
      setLockHash(tx.hash);
    }).catch(()=>{
      setLockLoading(false);
      toast.error('transaction failed');
    });
  };


  const [lockLoading, setLockLoading] = useState<boolean>(false);
  const [lockHash, setLockHash] = useState<string>("");
  const maxValue = currentSeller < 0 ? 0 : list[currentSeller].max > list[currentSeller].total ? list[currentSeller].total : list[currentSeller].max;
  const lockResult = useWaitForTransactionHash({
    hash: lockHash,
    providerUrl:PROVIDER_URL
  });
  // measure performance base on the transaction status
  useEffect(() => {
    console.log("transaction status",lockResult)
    switch (lockResult.status) {
      case 'SUCCESS':
        setLockLoading(false);
        setViewNum(2);
        toast.success('transaction success');
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
            <div className="navbar  pb-10" >
              <div className="flex-1" onClick={()=>setViewNum(0)}>
                <svg xmlns="http://www.w3.org/2000/svg" className={viewNum!=0?"h-5 w-5 m-1 ":"h-5 w-5 m-1 hidden"} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                <div className="flex-1 ">
                  <h1 className="text-3xl">{LL.Recharge.Title()}</h1>
                </div>
              </div>
              <div className={viewNum==0?'flex':'hidden'} onClick={()=>setViewNum(2)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>

            </div>
            {/* 列表内容 */}
            <div className={["grid pb-10 px-5",viewNum!=0?"hidden":""].join(" ")} >
              <div className="  bg-opacity-20  bg-neutral text-neutral-content  shadow-2xl rounded-lg">
                {/* {
                  list.length
                } */}
                {
                  list.map((item,index)=>{
                    return (
                    <div className="p-3">
                      {/* 头部 */}
                      <div className="flex justify-between">
                        <div className="flex gap-1 items-center">
                          <div className="avatar online placeholder">
                            <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
                              <span className="text-xl">{item.name.at(0)}</span>
                            </div>
                          </div> 
                          <div className="text-lg">{item.name}</div>
                        </div>
                        <div className="text-sm text-slate-300">
                        {LL.Recharge.Turnover()} {item.turnover}
                        </div>
                      </div>
                      <div className="text-lg pt-2 text-emerald-300">
                        $ <span className="text-3xl font-bold">{item.price}</span>
                      </div>
                      <div className="text-sm pt-1">
                        <span className="text-slate-300">{LL.Recharge.Quantity()}</span>
                        <span className="ml-2">{item.total} TCP</span>
                      </div>
                      { (item.min > 0 || item.max > 0) &&
                        <div className="text-sm pt-1">
                        <span className="text-slate-300">{LL.Recharge.Quota()}</span>
                        <span className="ml-2">{item.min}-{item.max} TCP</span>
                      </div>
                      }
                      
                      <div className="flex justify-between ">
                        <div className="flex items-end text-emerald-300	text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                          </svg>
                          <span className="text-slate-100">{LL.Recharge.Safety()}</span>
                        </div>
                        { (account == item.owner && tcpAllowance <= 10) &&
                          <div onClick={()=>{tcpTokenContract.approve(C2C_MARKET_ADDRESS,MAX)}} className="btn btn-md">{LL.Recharge.Allowed()} TCP</div>
                        }
                        <div onClick={()=>{setCurrentSeller(index);setViewNum(1);}} className="btn btn-md">{LL.Recharge.Buy()}</div>
                      </div>
                       <div className="divider"></div> 
                    </div>
                    )
                  })
                }
              </div>
            </div>
            {/* item内容 */}
            <div className={["grid pb-10 px-5 text-neutral-content",viewNum!=1?"hidden":""].join(" ")}>
              {/* 头部 */}
              <div className="flex justify-between	">
                <div className="flex gap-2">
                  <div className="avatar  placeholder">
                    <div className="bg-emerald-300 text-neutral-content rounded-full w-10 h-10">
                      <span className="text-sm">TCP</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs	 text-slate-200">{LL.Recharge.UnitPrice()}</div>
                    <div className="text-lg">$ { currentSeller >= 0 ? list[currentSeller].price : 0}</div>
                  </div>
                </div>
                
                
                
                <div className="divider divider-horizontal"></div>
                <div className="flex gap-2">
                  <div className="avatar online placeholder">
                    <div className="bg-neutral-focus text-neutral-content rounded-full w-10 h-10">
                      <span className="text-sm">{currentSeller >= 0 ? list[currentSeller].name.at(0):"商家"}</span>
                    </div>
                  </div>
                  <div className="">
                    <div className="flex items-center text-xs	 text-slate-200">
                    {LL.Recharge.BusinessNickname()}
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 text-emerald-300">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                    </div>
                    <div className="text-lg">
                      {currentSeller >= 0 ? list[currentSeller].name : "商家"}
                    </div>
                  </div>
                  
                </div>
                
              </div>
              {/* <div className="card-body text-center bg-opacity-20  bg-neutral text-neutral-content rounded-box"> */}
                {/* <label className="label">
                  <span className="label-text">{LL.Recharge.NumberOfTCP()}</span>
                  <span className="label-text-alt">{LL.Recharge.Balance()}: {tcpBalance.toString().match(/^\d+(?:\.\d{0,5})?/)} TCP</span>
                </label> */}
                <label className="input-group bg-opacity-0 bg-neutral text-neutral-content mt-2">
                  <input type="text" placeholder={LL.Recharge.InputPlaceholder()} className="w-full text-white bg-transparent focus:border-none focus:outline-none placeholder:text-slate-200 text-4xl font-bold" onChange={changeEvent} value={fromInput}/>
                  <span className="bg-transparent">TCP</span>
                  <div className="divider divider-horizontal"></div>
                  <span className="bg-transparent text-primary-content" onClick={()=>setFromInput(maxValue)}>{LL.Recharge.MAX()}</span>
                </label>
                <div className="divider m-0"></div>
                <div className="text-sm mt-1 text-slate-200">
                  <span className="">{LL.Recharge.AvailableBalance()}</span>
                  <span className="ml-2">{usdtBalance} USDT</span>
                </div>
                { ( currentSeller >= 0 &&  (list[currentSeller].min > 0 || list[currentSeller].max > 0)) &&
                  <div className="text-sm mt-1 text-slate-200">
                    <span className="">{LL.Recharge.Quota()}</span>
                    <span className="ml-2">{currentSeller >= 0 ? list[currentSeller].min : 0}-{currentSeller >= 0 ? list[currentSeller].max : 0} TCP</span>
                  </div>
                }
                
                <div className="mt-4">
                  <span className="text-2xl text-primary-content">{LL.Recharge.NeedToPay()}</span>
                  <span className="ml-2 text-slate-200">{needPay} USDT</span>
                </div>
                <div className="card-actions mt-5 grid grid-cols-2 gap-5">
                  <button className={["btn btn-md ",approveLoading?"loading":"",usdtAllowance <= 0 || usdtAllowance < needPay ?"btn-primary":"btn-disabled"].join(" ")} onClick={approveUSDT}>{LL.Recharge.WithPermission()} USDT</button>
                  <button className={["btn btn-md  ",lockLoading?"loading":"",usdtAllowance > 0 && usdtAllowance >= needPay ?"btn-primary":"btn-disabled"].join(" ")} onClick={addPostion}>{LL.Recharge.Buy()}TCP</button>
                </div>
                <ul className="steps">
                    <li className={["step",usdtAllowance == 0 || usdtAllowance < needPay ?"step-primary":""].join(" ")}></li>
                    <li className={["step",usdtAllowance > 0 && usdtAllowance >= needPay ?"step-primary":""].join(" ")}></li>

                  </ul>
                <div className="divider"></div>
                <div className="mt-4 text-slate-300">
                  <span className="">{LL.Recharge.KindTips()}</span>
                  <br />
                  <span className="">{LL.Recharge.KindTipsContent()}</span>
                </div>
                {/* <div className="card-actions mt-5 grid grid-cols-2 gap-5">
                  <button className={["btn btn-md ",approveLoading?"loading":"",usdtAllowance <= 0 || usdtAllowance < fromInput ?"btn-primary":"btn-disabled"].join(" ")} onClick={approveTCP}>{LL.Recharge.Approve()} TCP</button>
                  <button className={["btn btn-md  ",lockLoading?"loading":"",usdtAllowance > 0 && usdtAllowance >= fromInput ?"btn-primary":"btn-disabled"].join(" ")} onClick={addPostion}>{LL.Recharge.AddPosition()}</button>
                </div>
                <ul className="steps">
                    <li className={["step",usdtAllowance == 0 || usdtAllowance < fromInput ?"step-primary":""].join(" ")}></li>
                    <li className={["step",usdtAllowance > 0 && usdtAllowance >= fromInput ?"step-primary":""].join(" ")}></li>

                  </ul> */}
              {/* </div>       */}
            </div>
            {/* 订单列表 */}
            <div className={["grid pb-10 px-5",viewNum!=2?"hidden":""].join(" ")} >
              <div className="bg-opacity-20  bg-neutral text-neutral-content  shadow-2xl rounded-lg">
                {
                  orderList.map((item,index)=>{
                    return (
                    <div className="p-3">
                      {/* 头部 */}
                      <div className="flex justify-between">
                        <div className="flex gap-1 font-bold">
                          <span className="text-emerald-300">{LL.Recharge.Buy()}</span>
                          <span>TCP</span>
                        </div>
                      </div>
                      {/* 内容 */}
                      <div className="flex flex-col mt-2 gap-1 text-sm">
                        <div className="flex justify-between w-full">
                          <div className="text-slate-200">
                          {LL.Recharge.CreateTime()}
                          </div>
                          <div>
                            { moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')}
                          </div>
                        </div>
                        <div className="flex justify-between w-full">
                          <div className="text-slate-200 ">
                          {LL.Recharge.LumpSum()}
                          </div>
                          <div className="font-bold">
                          {item.lumpSum} USDT
                          </div>
                        </div>
                        <div className="flex justify-between w-full">
                          <div className="text-slate-200">
                          {LL.Recharge.UnitPrice()}
                          </div>
                          <div>
                          {item.price} USDT
                          </div>
                        </div>
                        <div className="flex justify-between w-full">
                          <div className="text-slate-200">
                          {LL.Recharge.Quantity()}
                          </div>
                          <div>
                            {item.total} TCP
                          </div>
                        </div>
                        <div className="flex justify-between w-full">
                          <div className="text-slate-200">
                          {LL.Recharge.BusinessNickname()}
                          </div>
                          <div>
                            {item.otherName}
                          </div>
                        </div>
                      </div>
                      <div className="divider"></div> 
                      
                    </div>
                    )
                  })
                }
              </div>
            </div>
          </div>
        </div>
        

      </div>
  );
};

export default Recharge;
