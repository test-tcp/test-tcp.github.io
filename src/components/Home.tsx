/* eslint-disable no-nested-ternary */
import { useWeb3React} from "@web3-react/core";
import { I18nContext } from "../i18n/i18n-react";
import { useEffect, useState,useContext,useRef } from "react";
import { BigNumber, ethers } from "ethers";
import { DataToChain } from "../types/DataToChain";
import DataToChainArtifacts from "../artifacts/contracts/DataToChain.sol/DataToChain.json";
import { rmSync } from "fs";
import {Contract} from "@ethersproject/contracts";
import {Login} from '../request/index'
import {passwordMd5} from '../utils/auth'
import useLocalStorage from "../hooks/useLocalStorage";
import { formatUnits,parseUnits, formatEther, parseEther } from "@ethersproject/units";

//local
// const dataToChainAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
//ropsten
// const dataToChainAddress = "0x7de1c27B2F54e2b48F22157FA4C07Ede05d312d2";
//mainnet
const dataToChainAddress = "0xf374f42f32AEd0eb6a423F9A353aFd20d25ECd50";



export const Home = function Home() {
  const { library, chainId, account,error } = useWeb3React();

  const [dataToChainContract, setDataToChainContract] = useState<DataToChain>();

  const [importing, setImporting] = useState<boolean>(false);
  const [loging, setLoging] = useState<boolean>(false);
  const [isOpen, setOpen] = useState<boolean>(false);
  const [userId, setUserId] = useLocalStorage<number>("home-userId",null);
  const [parentId, setParentId] = useLocalStorage<number>("home-parentId",null);
  const [lockeBalance, setLockeBalance] = useLocalStorage<number>("home-lockeBalance",null);
  const [assetsBalance, setAssetsBalance] = useLocalStorage<number>("home-assetsBalance",null);
  const [changeBalance, setChangeBalance] = useLocalStorage<number>("home-changeBalance",null);
  const [sign, setSign] =  useLocalStorage<string>("home-sign",null);
  const [accountUp, setAccountUp] = useState<boolean>(false);
  const [userIdUp, setUserIdUp] = useState<boolean>(false);

  useEffect(()=>{

    setDataToChainContract(DataToChainContractFun());
  },[]);
  const DataToChainContractFun = () => {
    
    const provider = library && new ethers.providers.Web3Provider(window.ethereum);
    if(!provider){
      return;
    }
    const signer = provider.getSigner();
    const dataToChainContract = new ethers.Contract(dataToChainAddress, DataToChainArtifacts.abi, signer) as DataToChain;
    return dataToChainContract;
  };

  const isUp = async (address,userIdParam) => {
    if(!address){
      address = "0x0000000000000000000000000000000000000000";
    }
    if(!userIdParam){
      userIdParam = 0;
    }
    let result = await dataToChainContract.isUp(address,userIdParam);
    return result;
  };

  const getChainData = async (address) => {
    if(!address){
      address = "0x0000000000000000000000000000000000000000";
    }
    let result = await dataToChainContract.userInfos(address);
    return result;
  };

  const toLogin = async () => {
    setStep(1);
    clearData();
  };
  const clearData = async () => {
    setUserId(null);
    setParentId(null);
    setLockeBalance(null);
    setAssetsBalance(null);
    setChangeBalance(null);
    setSign(null);
  };
  const ref = useRef({ account, userId });
  //步骤
  useEffect(()=>{

    if(!dataToChainContract){
      return;
    }
    isUp(account,0).then(res=>{
      
      setAccountUp(res[0]);
      
      if(res[0]){
        getChainData(account).then((chaindata)=>{
          setUserId(Number(chaindata.userId));
          setParentId(Number(chaindata.parentId));
          setLockeBalance(Number(formatEther(chaindata.lockeBalance)));
          setAssetsBalance(Number(formatEther(chaindata.assetsBalance)));
          setChangeBalance(Number(formatEther(chaindata.changeBalance)));
        });
        //该地址上链
        setStep(3);
      }else{
        clearData();
        setStep(1);
      }
    });
  },[dataToChainContract,account]);
    //步骤
    useEffect(()=>{

      if(!dataToChainContract){
        return;
      }
      isUp(account,userId).then(res=>{
        setUserIdUp(res[1]);
      });
    },[dataToChainContract,userId]);




  const [step, setStep] = useState<number>(1);
  //step-1

  const [balanceImporting1, setBalanceImporting1] = useState<boolean>(true);
  const [balanceImporting2, setBalanceImporting2] = useState<boolean>(true);
  const [balanceImporting3, setBalanceImporting3] = useState<boolean>(true);

  const [mobile, setMobile] = useState<string>("");
  const [mobileError, setMobileError] = useState<string>();
  const [password, setPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>();
  
  //step-1
  

  const { LL } = useContext(I18nContext);


  let loginBtn = async () => {
    setLoging(true);
    if(!mobile || !password){
      if(!mobile){
        setMobileError(LL.Error.MobileEmptyError());
      }else{
        setMobileError(null);
      }
      if(!password){
        setPasswordError(LL.Error.PasswordEmptyError());
      }else{
        setPasswordError(null);
      }
      setLoging(false);
      return;
    }else{
      setMobileError(null);
      setPasswordError(null);
    }
    if(!account){
      setLoging(false);
      return;
    }
    if(accountUp){
      setMobileError(LL.Error.AccountIsUpError);
      setLoging(false);
      return;
    }
    
    let req = {
      address: account,
      mobile: mobile,
      password: passwordMd5(password)
    };
    let res = await Login(req);
    
    console.log("Login",res.data)
    if(res.data.statusCode == 101005){
      setMobileError(LL.Error.MobileNotExistError());
    }
    if(res.data.statusCode == 101003){
      setPasswordError(LL.Error.PasswordIncorrectError());
    }
    if(res.data.statusCode == 0){
      isUp(account,res.data.content.userId).then(isUpRes=>{
        setLoging(false);
        if(isUpRes[1]){
          setMobileError(LL.Error.AccountIsUpError());
        }else{
          setUserId(res.data.content.userId);
          setParentId(res.data.content.parentId);
          setLockeBalance(res.data.content.lockeBalance);
          setAssetsBalance(res.data.content.assetsBalance);
          setChangeBalance(res.data.content.changeBalance);
          setSign(res.data.content.sign);
          setStep(2);
        }
      });
    }else{
      setLoging(false);
    }
  }

  let importDate = async () => {
    setImporting(true);
    setBalanceImporting1(true);
    setBalanceImporting2(true);
    setBalanceImporting3(true);
    
    dataToChainContract.store(BigNumber.from(userId),BigNumber.from(parentId),BigNumber.from(parseEther(lockeBalance.toString())),BigNumber.from(parseEther(assetsBalance.toString())),BigNumber.from(parseEther(changeBalance.toString())),sign).then((tx)=>{
      setTimeout(()=>setBalanceImporting1(false),5000);
      let timer = setInterval(()=>{
        isUp(account,userId).then((res)=>{
          if(res[0] || res[1]){
            clearInterval(timer);
            if(res[0]){
              setAccountUp(true);
            }
            if(res[1]){
              setUserIdUp(true);
            }
            setTimeout(()=>setBalanceImporting2(false),5000);
            getChainData(account).then((chaindata)=>{
              setUserId(Number(chaindata.userId));
              setParentId(Number(chaindata.parentId));
              setLockeBalance(Number(formatEther(chaindata.lockeBalance)));
              setAssetsBalance(Number(formatEther(chaindata.assetsBalance)));
              setChangeBalance(Number(formatEther(chaindata.changeBalance)));
              setTimeout(()=>setBalanceImporting3(false),10000);
              setTimeout(()=>setOpen(true),12000);
            });
          }
        });
      },2000)
      
    });
  };

  return (
    <div>
      <div className="hero min-h-screen bg-base-200">
        <div className="flex-col justify-center hero-content lg:flex-row">
          <div className="text-center lg:text-left">
            <h1 className="mb-5 text-5xl font-bold">
                  {LL.Home.AppName()}
                </h1>
            <p className="mb-5">
                  {LL.Home.Title()}
                </p>
          </div>
          <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <ul className="w-full steps">
              <li className={step >= 1?"step step-primary":"step"} >{LL.Home.Login()}</li> 
              <li className={step >= 2?"step step-primary":"step"} >{LL.Home.ConfirmData()}</li> 
              <li className={step >= 3?"step step-primary":"step"} >{LL.Home.Imported()}</li>
            </ul>
            <div className="card-body grid-flow-row shadow stats">
              {
                step == 1 &&
                <div>
                  <div  className="form-control">
                    <label  className="label">
                      <span className="label-text">{LL.Home.Account()}</span>
                    </label>
                    
                    <input type="text" value={mobile} placeholder={LL.Home.AccountPlaceHolder()}  className={[mobileError?"input-error":"","input","input-bordered"].join(' ')}  onChange={(evt) => setMobile(evt.target.value)}/>
                    <label className={[mobileError?"":"hidden","label"].join(' ')}>
                      <span className="label-text-alt">{mobileError}</span>
                    </label>
                  </div> 
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">{LL.Home.Password()}</span>
                    </label> 
                    <input type="password" value={password} placeholder={LL.Home.PasswordPlaceHolder()} className={[passwordError?"input-error":"","input","input-bordered"].join(' ')} onChange={(evt) => setPassword(evt.target.value)}/> 
                    <label className={[passwordError?"":"hidden","label","text-er"].join(' ')}>
                      <span className="label-text-alt">{passwordError}</span>
                    </label>
                  </div> 
                  <div  className="form-control mt-6">
                    <button type="button" className={loging?"btn loading":"btn btn-primary"} onClick={loginBtn}>
                      {LL.Home.Import()}
                    </button>
                  </div>
                </div>
              }
              {
                step == 2 &&
                <div>
                  <div className="stat">
                    <div className="stat-figure text-primary">
                      
                      <button className={[importing?"":"hidden","btn","btn-circle","bg-base-200","btn-ghost",balanceImporting1?"loading":""].join(' ')}>
                        <svg className={["inline-block w-8 h-8 stroke-current",balanceImporting1?"hidden":""].join(" ")} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10486" width="20" height="20" >
                          <path d="M448.768 632.322L338.202 521.756c-10.117-10.117-26.016-10.117-36.133 0s-10.117 26.015 0 35.41l127.91 127.91s0 0.722 0.722 0.722c5.06 5.059 11.563 7.227 18.067 7.227s13.008-2.168 18.066-7.227l275.331-275.33c10.117-10.118 10.117-26.016 0-36.133s-26.015-10.118-36.133 0L448.768 632.322z" p-id="10487" fill="#e779c0"></path>
                          <path d="M919.938 498.63c-0.723-13.73-13.008-24.57-26.738-23.847-13.73 0.723-24.57 12.285-23.848 26.739 0 6.503 0.723 12.285 0.723 18.789 0 198.73-161.152 359.881-359.882 359.881S149.59 718.318 149.59 519.588s161.152-359.882 359.882-359.882c52.753 0 103.34 10.84 151.034 33.242 5.059 2.168 10.84 5.06 15.899 7.95 12.285 6.504 27.46 1.445 33.964-10.84 6.504-12.285 1.446-27.461-10.84-33.965-5.78-2.89-12.285-6.504-18.788-9.394-54.2-25.293-112.012-37.578-171.992-37.578-226.19 0-410.467 184.276-410.467 410.467s184.277 410.467 410.467 410.467 410.467-184.277 410.467-410.467c1.446-7.227 0.723-14.453 0.723-20.957z" p-id="10488" fill="#e779c0"></path>
                          <path d="M849.841 401.073a27.46 27.46 0 1 0 54.921 0 27.46 27.46 0 1 0-54.921 0zM809.372 312.909a27.46 27.46 0 1 0 54.922 0 27.46 27.46 0 1 0-54.922 0zM743.611 236.308a27.46 27.46 0 1 0 54.921 0 27.46 27.46 0 1 0-54.922 0z" p-id="10489" fill="#e779c0"></path>
                        </svg>
                      </button>
                    </div>
                    <div className="stat-title">{LL.Home.LockeBalance()}</div> 
                    <div className="stat-value text-primary">{lockeBalance}</div>
                  </div> 
                  <div className="stat">
                    <div className="stat-figure text-info">
                      <button className={[importing?"":"hidden","btn","btn-circle","bg-base-200","btn-ghost",balanceImporting2?"loading":""].join(' ')}>
                        <svg className={["inline-block w-8 h-8 stroke-current",balanceImporting2?"hidden":""].join(" ")}  viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3379" width="25" height="25" >
                          <path d="M448.768 632.322L338.202 521.756c-10.117-10.117-26.016-10.117-36.133 0s-10.117 26.015 0 35.41l127.91 127.91s0 0.722 0.722 0.722c5.06 5.059 11.563 7.227 18.067 7.227s13.008-2.168 18.066-7.227l275.331-275.33c10.117-10.118 10.117-26.016 0-36.133s-26.015-10.118-36.133 0L448.768 632.322z" p-id="10487" fill="#53c0f3"></path>
                          <path d="M919.938 498.63c-0.723-13.73-13.008-24.57-26.738-23.847-13.73 0.723-24.57 12.285-23.848 26.739 0 6.503 0.723 12.285 0.723 18.789 0 198.73-161.152 359.881-359.882 359.881S149.59 718.318 149.59 519.588s161.152-359.882 359.882-359.882c52.753 0 103.34 10.84 151.034 33.242 5.059 2.168 10.84 5.06 15.899 7.95 12.285 6.504 27.46 1.445 33.964-10.84 6.504-12.285 1.446-27.461-10.84-33.965-5.78-2.89-12.285-6.504-18.788-9.394-54.2-25.293-112.012-37.578-171.992-37.578-226.19 0-410.467 184.276-410.467 410.467s184.277 410.467 410.467 410.467 410.467-184.277 410.467-410.467c1.446-7.227 0.723-14.453 0.723-20.957z" p-id="10488" fill="#53c0f3"></path>
                          <path d="M849.841 401.073a27.46 27.46 0 1 0 54.921 0 27.46 27.46 0 1 0-54.921 0zM809.372 312.909a27.46 27.46 0 1 0 54.922 0 27.46 27.46 0 1 0-54.922 0zM743.611 236.308a27.46 27.46 0 1 0 54.921 0 27.46 27.46 0 1 0-54.922 0z" p-id="10489" fill="#53c0f3"></path>
                        </svg>
                      </button>
                    </div>
                    <div className="stat-title">{LL.Home.AssetsBalance()}</div> 
                    <div className="stat-value text-info">{assetsBalance}</div>
                  </div>  
                  <div className="stat">
                    <div className="stat-figure">
                      <button className={[importing?"":"hidden","btn","btn-circle","bg-base-200","btn-ghost",balanceImporting3?"loading":""].join(' ')}>
                        <svg className={["inline-block w-8 h-8 stroke-current",balanceImporting3?"hidden":""].join(" ")}  viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3379" width="25" height="25" >
                          <path d="M448.768 632.322L338.202 521.756c-10.117-10.117-26.016-10.117-36.133 0s-10.117 26.015 0 35.41l127.91 127.91s0 0.722 0.722 0.722c5.06 5.059 11.563 7.227 18.067 7.227s13.008-2.168 18.066-7.227l275.331-275.33c10.117-10.118 10.117-26.016 0-36.133s-26.015-10.118-36.133 0L448.768 632.322z" p-id="10487" fill="#ffffff"></path>
                          <path d="M919.938 498.63c-0.723-13.73-13.008-24.57-26.738-23.847-13.73 0.723-24.57 12.285-23.848 26.739 0 6.503 0.723 12.285 0.723 18.789 0 198.73-161.152 359.881-359.882 359.881S149.59 718.318 149.59 519.588s161.152-359.882 359.882-359.882c52.753 0 103.34 10.84 151.034 33.242 5.059 2.168 10.84 5.06 15.899 7.95 12.285 6.504 27.46 1.445 33.964-10.84 6.504-12.285 1.446-27.461-10.84-33.965-5.78-2.89-12.285-6.504-18.788-9.394-54.2-25.293-112.012-37.578-171.992-37.578-226.19 0-410.467 184.276-410.467 410.467s184.277 410.467 410.467 410.467 410.467-184.277 410.467-410.467c1.446-7.227 0.723-14.453 0.723-20.957z" p-id="10488" fill="#ffffff"></path>
                          <path d="M849.841 401.073a27.46 27.46 0 1 0 54.921 0 27.46 27.46 0 1 0-54.921 0zM809.372 312.909a27.46 27.46 0 1 0 54.922 0 27.46 27.46 0 1 0-54.922 0zM743.611 236.308a27.46 27.46 0 1 0 54.921 0 27.46 27.46 0 1 0-54.922 0z" p-id="10489" fill="#ffffff"></path>
                        </svg>
                      </button>
                    </div>
                    <div className="stat-title">{LL.Home.ChangeBalance()}</div> 
                    <div className="stat-value">{changeBalance}</div>
                  </div> 

                  <div className="form-control mt-6">
                    <button type="button"  className={importing?"btn loading disabled":"btn btn-primary"} onClick={importDate}>{LL.Home.Start()}</button>
                  </div>
                  <div className="form-control mt-6">
                    <button type="button"  className="btn btn-wide" onClick={toLogin}>{LL.Home.Previous()}</button>
                  </div>
                </div>
              }
              {
                step == 3 && 
                <div>
                  <div className="stat">
                    <div className="stat-title">{LL.Home.LockeBalance()}</div> 
                    <div className="stat-value text-primary">{lockeBalance}</div>
                  </div> 
                  <div className="stat">
                    <div className="stat-title">{LL.Home.AssetsBalance()}</div> 
                    <div className="stat-value text-info">{assetsBalance}</div>
                  </div>  
                  <div className="stat">
                    <div className="stat-title">{LL.Home.ChangeBalance()}</div> 
                    <div className="stat-value">{changeBalance}</div>
                  </div>
                </div>
              }
                
            </div>
          </div>
        </div>
      </div>
      <div id="my-modal" className={isOpen?'modal modal-open':'modal'}>
        <div className="modal-box">
          <p>{LL.Home.ImportedSuccess()}</p> 
          <div className="modal-action">
            <a onClick={()=>{setOpen(false);setStep(3)}} className="btn">{LL.Btn.Close()}</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
