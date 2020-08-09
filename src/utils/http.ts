import Axios, { AxiosResponse } from 'axios';

//枚举
import {ServerRespond} from '../types/index';

var instance=Axios.create({
    baseURL:'http://192.168.1.9/',
    timeout:5000,
    withCredentials:true,
})

export default instance;

// 添加返回信息的拦截器
//返回服务端返回的内容
instance.interceptors.response.use((respond:AxiosResponse<any>)=>{
    var serverRespond:ServerRespond=respond.data;
    // ???需要吗
    if(serverRespond.IsErr) return Promise.reject();
    return respond;
    return respond;
},(err)=>{
    return Promise.reject(err);
})