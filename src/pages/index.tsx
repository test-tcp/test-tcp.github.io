import { Web3ReactProvider } from "@web3-react/core";
import { useEffect ,useContext,useState} from "react";

import Demo, { getLibrary } from "../components/Demo";

import Content from "../components/Content";
import Menu from "../components/Menu";
import TypesafeI18n from "../i18n/i18n-react";
import useLocalStorage from "../hooks/useLocalStorage";
import { BigNumber, ethers } from "ethers";
import { I18nContext } from "../i18n/i18n-react";
import { Locales } from "../i18n/i18n-types";
import { useWeb3React} from "@web3-react/core";
import { TcpPosition } from "../types/TcpPosition";
import TcpPositionArtifacts from "../artifacts/contracts/TcpPosition.sol/TcpPosition.json";
import { IERC20 } from "../types/IERC20";
import IERC20Artifacts from "../artifacts/contracts/utils/IERC20.sol/IERC20.json";
import { MAX, ADDRESS_ZERO,TCP_PPSITION_ADDRESS,TCP_TOKEN_ADDRESS } from "../utils/config";
import toast, { Toaster } from 'react-hot-toast';
import Head from 'next/head'
declare global {
  interface Window {
    ethereum: ethers.providers.ExternalProvider;
  }
}


const App = function () {
  const [language, setLanguage] = useLocalStorage<"en" | "cht">("language", "en");

  useEffect(()=>{
    // document.title = "TCP Global";
    
    const queryParams = new URLSearchParams(window.location.search);
    const address = queryParams.get('address');
    
    if(address){
      setParentAddress(address);
    }
  },[]);
  const { LL } = useContext(I18nContext);
  const [index, setIndex] = useState<number>(0);
  const [parentAddress, setParentAddress] = useLocalStorage<string>("parent-address",null);

  // const {location: {query: {address}}} = this.props;


  return (
    
    <>
      <Head>
        <title>TCP GLOBAL</title>
        <meta name="viewport" content="width=device-width,initial-scale=1.0,user-scalable=no"></meta>
      </Head>

      <Web3ReactProvider getLibrary={getLibrary}>
        <TypesafeI18n initialLocale={language}>
        <Toaster
        position="top-right"
        reverseOrder={true}
        />
          
        <div className="container min-h-screen max-w-full bg-gradient-to-br from-pink-300 to-blue-900 relative">

          <Demo />
          <Content index={index} />
          <Menu index={index} setIndex={setIndex}/>
        </div>

          {/* <Footer/> */}
    
        </TypesafeI18n>
      </Web3ReactProvider>
    </>
  );
};

export default App;
