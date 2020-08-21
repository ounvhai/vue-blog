import Axios, { AxiosResponse } from 'axios'
//枚举
import {ServerRespond} from '../types/index';

var instance=Axios.create({
    baseURL:'http://2105x16c88.imwork.net/',
    timeout:5000,
})

export default instance;

// 添加返回信息的拦截器
//返回服务端返回的内容
instance.interceptors.response.use((respond:AxiosResponse<any>)=>{
    var serverRespond:ServerRespond=respond.data;
    if(serverRespond.IsErr) return Promise.reject();
    return respond;
},(err)=>{
    return Promise.reject(err);
})