/* eslint-disable no-nested-ternary */

import { I18nContext } from "../i18n/i18n-react";
import { useEffect, useState,useContext } from "react";


interface Props {
  index: number;
  setIndex:any;
}




export const Menu = function Menu({index,setIndex} : Props) {
  
  

  const { LL } = useContext(I18nContext);
  

  return (
    <div className="tabs tabs-boxed grid grid-cols-4 content-center content-primary-content bg-opacity-30 text-primary-content fixed bottom-5 left-3 right-3 lg:bottom-20 lg:left-1/3 lg:right-1/3">
      <a onClick={()=>{setIndex(0)}} className={["tab",index==0?"tab-active":""].join(" ")}>{LL.Footer.Postion()}</a> 
      <a onClick={()=>{setIndex(1)}} className={["tab",index==1?"tab-active":""].join(" ")}>{LL.Footer.Interest()}</a> 
      <a onClick={()=>{setIndex(3)}} className={["tab",index==3?"tab-active":""].join(" ")}>{LL.Footer.Recharge()}</a>
      <a onClick={()=>{setIndex(2)}} className={["tab",index==2?"tab-active":""].join(" ")}>{LL.Footer.Community()}</a>
      
    </div>
  );
};

export default Menu;
