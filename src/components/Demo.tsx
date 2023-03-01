import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from "@web3-react/walletconnect-connector";
import { useEffect, useState,useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { injected, walletconnect, POLLING_INTERVAL } from "../dapp/connectors";
import { useEagerConnect, useInactiveListener } from "../dapp/hooks";
import logger from "../logger";
import { I18nContext } from "../i18n/i18n-react";
import { Locales } from "../i18n/i18n-types";



function getErrorMessage(error: Error) {
  const { LL } = useContext(I18nContext);
  if (error instanceof NoEthereumProviderError) {
    return LL.Error.NoEthereumProviderError();
  }
  if (error instanceof UnsupportedChainIdError) {
    return LL.Error.UnsupportedChainIdError();
  }
  if (error instanceof UserRejectedRequestErrorInjected || error instanceof UserRejectedRequestErrorWalletConnect) {
    return LL.Error.UserRejectedRequestErrorInjected();
  }
  logger.error(error);
  return LL.Error.UnknownError();
}

export function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = POLLING_INTERVAL;
  return library;
}

export const Demo = function () {
  const { LL } = useContext(I18nContext);

  const context = useWeb3React<Web3Provider>();
  const { connector, library, account, activate, deactivate, active, error } = context;
  const [theme, setTheme] = useLocalStorage<"dark" | "synthwave" | "aqua">("theme", "synthwave");
  const [language, setLanguage] = useLocalStorage<"en" | "cht">("language", "en");
  const { locale, isLoadingLocale, setLocale } = useContext(I18nContext);

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = useState<any>();
  const [isOpen, setOpen] = useState<boolean>(false);



  useEffect(() => {

    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  useEffect(() => {
    activate(injected);
  }, []);

  useEffect(() => {
    console.log("data-theme:",theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, []);

  useEffect(() => {
    if(error){
      setOpen(true);
    }else{
      setOpen(false);
    }
  }, [error]);
  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector);

  const activating = (connection: typeof injected | typeof walletconnect) => connection === activatingConnector;
  const connected = (connection: typeof injected | typeof walletconnect) => connection === connector;
  const disabled = !triedEager || !!activatingConnector || connected(injected) || connected(walletconnect) || !!error;
  const [tips1, setTips1] = useState<boolean>(false);
  const [tips2, setTips2] = useState<boolean>(true);

  useEffect(()=>{
    setTimeout(()=>setTips1(true),2000);
    setTimeout(()=>setTips2(true),4000);
    // setTimeout(()=>setTop(false),4000);
  },[]);

  const [top, setTop] = useState<boolean>(true);
  // window.addEventListener('scroll', bindHandleScroll);
  function onScroll(e) {
    // 滚动的高度(兼容多种浏览器)
    const scrollTop = (e.srcElement ? e.srcElement.documentElement.scrollTop : false)  || window.pageYOffset || (e.srcElement ? e.srcElement.body.scrollTop : 0);

    if(scrollTop>0&&scrollTop<=50){
      setTop(true);
    }else if(scrollTop>50){
      setTop(false);
    }
  }
  useEffect(()=>{
    
    window.addEventListener("scroll", onScroll);
  }, []); // empty dependencies array means "run this once on first mount"


  return (
    <>
    <div className="sticky top-0 z-30 flex h-16 w-full justify-center bg-opacity-90 backdrop-blur transition-all duration-100 text-primary-content">
      <nav className={[!top?"bg-base-100 text-base-content":"","navbar","w-full"].join(' ')}>

      <div className="navbar-start">
      
        <a href="/" className={["btn btn-ghost normal-case text-xl animate-pulse duration-2000",!top?"bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-blue-500":""].join(" ")}>TCP GlOBAL</a>
      </div>
      
        <div className="flex-0 navbar-end"><div className="items-center flex-none lg:block">
          <a className="btn btn-ghost drawer-button normal-case" onClick={()=>{
                  setActivatingConnector(injected);
                  activate(injected);
            }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            {!account?LL.Head.ConnectWallet():account.substring(0, 6)+`...`+account.substring(account.length - 4)}
          </a>
        </div> 
          <div title="Language" className="dropdown dropdown-end ">
            <div tabIndex={0} className="btn gap-2 normal-case btn-ghost">
              {/* <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current md:h-6 md:w-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
              </svg>  */}
              <svg width="20" height="20"  className="inline-block h-5 w-5 stroke-current md:h-6 md:w-6" xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              <span className="hidden md:inline">Language</span> 
              <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1792 1792" className="ml-1 inline-block h-4 w-4 fill-current">
                <path d="M1395 736q0 13-10 23l-466 466q-10 10-23 10t-23-10l-466-466q-10-10-10-23t10-23l50-50q10-10 23-10t23 10l393 393 393-393q10-10 23-10t23 10l50 50q10 10 10 23z"></path>
              </svg>
            </div> 
            <div className="dropdown-content bg-base-200 text-base-content rounded-t-box rounded-b-box top-px w-52 overflow-y-auto shadow-2xl mt-16">
                <ul className="menu menu-compact p-4" tabIndex={0}>
                  <li onClick={(evt) => {
              setLocale('en' as Locales);
              setLanguage('en');
            }} ><button >🇬🇧 English</button></li> 
                  <li onClick={(evt) => {
              setLocale('cht' as Locales);
              setLanguage('cht');
            }}><button >🇨🇳 中文繁体</button></li> 
                </ul>
              </div>
            </div>
            </div></nav></div>

    


    {/* <div className={tips1?"alert alert-warning  shadow-lg":"alert alert-warning  shadow-lg hidden"}>
      <div className="flex-1">
      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        <label>{LL.Home.Tips1()}</label>
      </div>
      <div className="">
        <button className="btn btn-sm btn-circle" onClick={()=>setTips1(false)}>X</button>
      </div>
    </div>

    <div className={tips2?"alert alert-warning  shadow-lg":"alert alert-warning  shadow-lg hidden"}>
      <div className="flex-1">
      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>

        <label>{LL.Home.Tips2()}</label>
      </div>
      <div className="">
        <button className="btn btn-sm btn-circle" onClick={()=>setTips2(false)}>X</button>
      </div>
    </div> */}
    
      
      <div id="my-modal" className={isOpen?'modal modal-open':'modal'}>
        <div className="modal-box">
          <p>{error ? getErrorMessage(error): ''}<a href="https://chainnugget.com/u/tcpglobal/discussions" target="_blank" className="link link-primary">{LL.Footer.Help()}</a></p> 
           
          <div className="modal-action">
            <a onClick={()=>setOpen(false)} className="btn">{LL.Btn.Close()}</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Demo;
