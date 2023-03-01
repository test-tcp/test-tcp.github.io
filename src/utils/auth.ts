
import cryptoJs from 'crypto-js'
// 加密密码
export const passwordMd5 = pwd => {
return cryptoJs.MD5(pwd).toString()
};