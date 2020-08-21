var path=require('path');
const { resolve } = require('path');
module.exports={
    lintOnSave:false,
    chainWebpack:(config)=>{
        config.resolve.alias
            .set('@com',resolve('./src/components'))
            .set("@views",resolve('./src/views'))
            .set("@type",resolve("./src/types"))
            .set("@util",resolve("./src/utils"))
            .set("@style",resolve("./src/style"))
            .set("@mixins",resolve('./src/mixins'))
        
    },
    configureWebpack:config=>{
        config.plugins.forEach((item,i)=>{
            if(item.tsconfig){
                config.plugins.splice(i,1);
            }
        })
    }
    
}