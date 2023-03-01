/* eslint-disable no-nested-ternary */
import { useWeb3React} from "@web3-react/core";
import { I18nContext } from "../i18n/i18n-react";
import { useEffect, useState,useContext,useRef } from "react";
import { BigNumber, ethers } from "ethers";
import { TcpPosition } from "../types/TcpPosition";
import TcpPositionArtifacts from "../artifacts/contracts/TcpPosition.sol/TcpPosition.json";
import C2CMarketArtifacts from "../artifacts/contracts/c2c/C2CMarketUpgradeable.sol/C2CMarketUpgradeable.json";
import { IERC20 } from "../types/IERC20";
import IERC20Artifacts from "../artifacts/contracts/utils/IERC20.sol/IERC20.json";
import { rmSync } from "fs";
import {Contract} from "@ethersproject/contracts";
import {Login} from '../request/index'
import {passwordMd5} from '../utils/auth'
import useLocalStorage from "../hooks/useLocalStorage";
import { formatUnits,parseUnits, formatEther, parseEther } from "@ethersproject/units";
import { useWaitForTransactionHash } from 'use-wait-for-transaction-hash';
import toast, { Toaster } from 'react-hot-toast';
import {isAddress} from "@ethersproject/address";
import { MAX, ADDRESS_ZERO,TCP_PPSITION_ADDRESS,TCP_TOKEN_ADDRESS, UDST_TOKEN_ADDRESS, C2C_MARKET_ADDRESS } from "../utils/config";
import Home from "../components/Home";
import Postion from "../components/Postion";
import Recharge from "../components/Recharge";
import Community from "../components/Community";
import Interest from "../components/Interest";
import Advertise from "../components/Advertise"
import { C2CMarketUpgradeable } from "../types";
interface Props {
  index: number;
}

export const Content = function Content({ index}: Props) {
  
  const [tcpPositionContract, setTcpPositionContract] = useState<TcpPosition>();
  const [tcpTokenContract, setTcpTokenContract] = useState<IERC20>();
  const [usdtTokenContract, setUsdtTokenContract] = useState<IERC20>();
  const [c2cMarketContract, setC2CMarketContract] = useState<C2CMarketUpgradeable>();
  const [tcpFee, setTcpFee] = useState<string>("0");
  const { library, chainId, account,error } = useWeb3React();

  useEffect(()=>{
    setTcpPositionContract(TcpPositionContractFun());
    setTcpTokenContract(TcpTokenContractFun());
    setUsdtTokenContract(UsdtTokenContractFun());
    setC2CMarketContract(C2CMarketContractFun())
  },[library]);    

  useEffect(()=>{
    fetch('/fortcp.json', {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
        },
    
    })
    .then(response => response.json())//解析为Promise
    .then(data => {
      setTcpFee(data.fee);
    })
  },[]);    
  


  const TcpPositionContractFun = () => {
    
    const provider = library && new ethers.providers.Web3Provider(window.ethereum);
    if(!provider){
      return;
    }
    const signer = provider.getSigner();
    const tcpPositionContract = new ethers.Contract(TCP_PPSITION_ADDRESS, TcpPositionArtifacts.abi, signer) as TcpPosition;
    return tcpPositionContract;
  };

  const C2CMarketContractFun = () => {
    
    const provider = library && new ethers.providers.Web3Provider(window.ethereum);
    if(!provider){
      return;
    }
    const signer = provider.getSigner();
    const c2cMarketContract = new ethers.Contract(C2C_MARKET_ADDRESS, C2CMarketArtifacts.abi, signer) as C2CMarketUpgradeable;
    return c2cMarketContract;
  };

  const TcpTokenContractFun = () => {
    
    const provider = library && new ethers.providers.Web3Provider(window.ethereum);
    if(!provider){
      return;
    }
    const signer = provider.getSigner();
    const tcpTokenContract = new ethers.Contract(TCP_TOKEN_ADDRESS, IERC20Artifacts.abi, signer) as IERC20;
    return tcpTokenContract;
  };

  const UsdtTokenContractFun = () => {
    
    const provider = library && new ethers.providers.Web3Provider(window.ethereum);
    if(!provider){
      return;
    }
    const signer = provider.getSigner();
    const usdtTokenContract = new ethers.Contract(UDST_TOKEN_ADDRESS, IERC20Artifacts.abi, signer) as IERC20;
    return usdtTokenContract;
  };

  return (
    <div className="pb-20 lg:w-4/6 mx-auto">
      {index==0 && <Postion tcpPositionContract={tcpPositionContract} tcpTokenContract={tcpTokenContract} fee={tcpFee}/>}
      {index==1 && <Interest tcpPositionContract={tcpPositionContract} tcpTokenContract={tcpTokenContract} fee={tcpFee}/>}
      {index==2 && <Community tcpPositionContract={tcpPositionContract} tcpTokenContract={tcpTokenContract} />}
      {index==3 && <Recharge tcpPositionContract={tcpPositionContract} tcpTokenContract={tcpTokenContract} c2cMarketContract={c2cMarketContract} usdtTokenContract={usdtTokenContract} fee={tcpFee}/>}
      <Advertise/>
    </div>
    
  );
};

export default Content;
