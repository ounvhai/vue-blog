// 类型
import {User } from '../../types/index'; 

let user:User=<User>{};





//更新User信息
export function update(newUser:User):User{
    return Object.assign(user,newUser); 
}

export function latestUser():User{
    return Object.assign({},user);
}


