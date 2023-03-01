import { useState, useEffect } from "react";
import {requestService} from './request'


export const Login = async(params: any) => {
    let res: any = await requestService({
        url: '/user/login',
        method: 'post',
        params: params
    })
    return res;
}



export function addZero(num: any, position: any) {
    const index:any = 0
    return (Array(position).join(index) + num).slice(-position);
    
}