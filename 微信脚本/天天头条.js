function jsclick(way,txt,clickKey,n){
    if(!n){n=1};//当n没有传值时,设置n=1
    var res = false;
    if(!clickKey){clickKey=false}; //如果没有设置点击项,设置为false
    if (way == "text"){
        res = text(txt).findOne(200);
    }else if(way == "id"){
        res = id(txt).findOne(200);
    }else if(way == "desc"){
        res = desc(txt).findOne(200);
    }
    if(res){
        if ( clickKey ){
            log('准备点击->',txt,"x:",res.bounds().centerX(),"y:",res.bounds().centerY());
            click(res.bounds().centerX(),res.bounds().centerY());
            sleep(1000*n);
        }else{
            log("找到->",txt);
        }
        return true;
    }else{
        // log("没有找到->",txt)
    }
}

function nextPage(){
    if (random(1,100)> 50){
        log("滑动1次")
        swipe(device.width/2,device.height*4/5,device.width/2,device.height*2/7,random(1000,3000));
    }else{
        log("滑动2次")
        swipe(device.width/2,device.height*4/5,device.width/2,device.height*2/7,random(1000,3000));
        swipe(device.width/2,device.height*4/5,device.width/2,device.height*2/7,random(1000,3000));
    }
}

function newPage(){
    log("下拉刷新")
    swipe(device.width/2,device.height*1/5,device.width/2,device.height*3/7,random(1000,3000));
}

function killApp(appbids){
    var text = "am force-stop " + appbids
    var result = shell(text, true);
    log(result);
}

function download(url_) {
    app.openUrl(url_);
    var data_frequency = 0;
    while(data_frequency <= 180 ){
        if(jsclick("text","普通下载",true,2)){
        }else if(jsclick("text","安装",true,2)){
        }else if(jsclick("text","立即下载",true,2)){ 
        }else if(jsclick("text","确定",true,2)){
        }else if(jsclick("text","仅允许一次",true,2)){    
        }else if(jsclick("text","完成",true,2)){
            return true;
        }else{
            jsclick("text","允许",true,2);
            jsclick("text","授权",true,2);
        }
        data_frequency++;
        sleep(1000); 
    }
}

function remove_Sms(){
    var storage = storages.read();
    storage.remove("sms");
}
function get_PhoneNumber(){
    var storage = storages.read();
    return storage.get("phoneNumber");
}
function get_Sms(){
    try {
        var storage = storages.read();
        var res= storage.get("sms");
        if (res){
            remove_Sms();
            var content = res.content;
            return content;
        }
    } catch (error) {

    }
}

function sms_get_unmber(sms){
    var check_sms = sms.match(/\【天天头条\】/)
    // log(check_sms)
    if(check_sms[0]== "【天天头条验证码】"){
        sms = sms.match(/\d{4,6}/)
        log(sms[0])
        return sms[0]
    }
}

/////////////////////////////////////////////////////////


function Tips(){
    log("非正常页面");
    var textTips = {}
    textTips["允许"]="text";
    textTips["好"]="text";
    textTips["确定"]="text";
    textTips["继续赚钱"]="text";
    textTips["确定"]="desc";
    textTips["忽略"]="text";
    textTips["ll_quit"]="id";
    for(var k in textTips){
        if (jsclick(textTips[k],k,true,2)){
            return false
        }
    }
    return true
}

function reg() {

    launchApp(app_name);
    sleep(1000*6)
    var get_sms_button = true;
    var get_password = true;
    var tips_times = 0;
    // var app_bid = "com.ss.android.article.lite"

    var data_time_line = 0;
    while(data_time_line < 180){
        var UI = currentActivity()
        log("UI->",UI)
        switch(UI){
            case "com.tencent.mm.plugin.webview.ui.tools.SDKOAuthUI":
                jsclick("text","确认登录",true,2)
                jsclick("text","同意",true,3)
                break;
            case "com.color365.headlines.ui.activity.ReuseActivity":
                if(jsclick("text","登录",false,4) && jsclick("id","btn_register",true,4)){
                }else if (jsclick("text","手机号",false,2)){
                    // var truePhone = "17775127804";
                    var truePhone = get_PhoneNumber();
                    if (truePhone){
                        setText(0,truePhone);
                        sleep(1000)
                        setText(2,"AaDd112211");
                        info["password"] = "AaDd112211";
                    }
                }else if(jsclick("text","获取验证码",true,4)){
                }else if(jsclick("text","请输入验证码",false,4)){
                    // var sms = "【"+app_name+"验证码】验证码743534"
                    var sms = get_Sms();
                    if (sms){
                        var sms_ = sms_get_unmber(sms);
                        if (sms_){
                            setText(1,sms_)
                            sleep(1000*2)
                            // sleep(1000*30)
                        }
                    }else{
                        sleep(1000*5)
                    }
                }else if(jsclick("text","注册并领取红包",true,5)){
                }else{
                    back();
                }
                break;
            case "com.color365.headlines.ui.activity.MainActivity":
                if(jsclick("text","天天",true,2)){
                }else if (jsclick("text","赚钱",true,2)){
                    if (jsclick("id","user_id",false,2)){
                        var d = className("TextView").id("today_icon").findOne(2000);
                        if(d){
                            info["gold"] = d.text();
                            log(d.text())
                        }
                        var d = className("TextView").id("user_money").findOne(2000);
                        if(d){
                            info["money"] = d.text();
                            log(d.text())
                            log("注册成功");
                            return true
                        }
                    }
                }else if (jsclick("text","未登录",true,2)){
                }else{
                    Back();
                }
            break;
            default:
                log("预计有弹窗");
                launchApp(app_name);
                sleep(1000*8);
                jsclick("text","一键登录",true,2);
                tips_times++;
                if (tips_times > 10){
                    killApp(app_bid)
                    tips_times = 0;
                }else if(tips_times%3 ==0){
                    Tap(device.width*1/2,device.height*5/10)
                    sleep(2000)
                }   
                Back();
            break;
        }

        // jsclick("text","一键登录",true,2);
        jsclick("text","允许",true,2)
        jsclick("text","好",true,2)

        jsclick("id","action_close",true,2)

        data_time_line++;
        sleep(1000); 
    }
}


function read(){

    var loginKey = true
    var call_back_key = false
    var check_look = false
    var look_timesKey = 0
    var look_times = 0
    var look_news = 0
    var zan = true
    var tips_times = 0

    var data_time_line = 0;
    while(data_time_line < 40){
        var UI = currentActivity()
        log("UI->",UI,"data_time_line->",data_time_line)
        switch(UI){
            case "com.color365.headlines.ui.activity.NewsActivity":
                if(look_times < look_timesKey ){
                    log("阅读文章","继续", look_timesKey-look_times );
                    jsclick("text","展开全文",true,2);
                    Swipe(device.width/2,device.height*2/3,device.width/2,device.height*1/3)
                    sleep(1000 * random(2,5))
                    look_times++
                }else{
                    log("非主动进入阅读,退出")
                    Back();
                }
            break;
            case "com.color365.headlines.ui.activity.MainActivity":
                if( jsclick("text","赚钱",false,2) && jsclick("text","推荐",false,2) && jsclick("text","头条",false,5)){
                    Swipe(device.width/2,device.height*1/3,device.width/2,device.height*2/3)
                    sleep(1000*8)

                    Tap(device.width*1/2,device.height*1/2)
                    check_look = true
                    look_timesKey = random(15,25)
                    look_times = 0
                    sleep(1000*random(3,5))
                    look_news++
    
    
                }else if(jsclick("text","头条",true,5)){
                    Tap(device.width*1/10,device.height*9.8/10)
                    sleep(2000);
                }else{
                    Back()
                }
            break;
            default:
                launchApp(app_name);
                sleep(1000*8)
                /////////////////////////
                tips_times++;
                if (tips_times > 10){
                    killApp(app_bid)
                    tips_times = 0;
                }else if(tips_times%3 ==0){
                    Tap(device.width*1/2,device.height*5/10)
                    sleep(2000)
                }   
                ///////////////////////////
                Back();
                sleep(2000)
                jsclick("text","继续赚钱",true,2)
            break;
        }

        jsclick("text","允许",true,2)
        jsclick("text","好",true,2)
        jsclick("id","action_close",true,2)

        jsclick("text","继续阅读",true,2)


        data_time_line++;
        sleep(1000); 
    }
    log("阅读完成");
    killApp(app_bid);
}


function sendBroadcast(appName,data){
    app.launchPackage( "com.flow.factory");
    sleep(2000)
    var mapObject = {
            appName:appName,
            data:data
        }
    app.sendBroadcast(
        {
            packageName: "com.flow.factory",
            className: "com.flow.factory.trafficfactory.broadcast.TaskBroadCast",
            extras:mapObject
        }   
    );
}



var apk_url = "img.wenfree.cn/apk/com.color365.tttt.apk"
var app_name = "天天头条";
var app_bid = "com.color365.tttt"
var info={};


function main(){
    if (launchApp(app_name) ){
        if (reg()){
            log(info)
            read()
            sendBroadcast(app_name,JSON.stringify(info))
        }else{
            sendBroadcast(app_name,JSON.stringify(info))
        }
    }else if ( download(apk_url) ){
        if (reg()){
            log(info)
            read()
            sendBroadcast(app_name,JSON.stringify(info))
        }else{
            sendBroadcast(app_name,JSON.stringify(info))
        }
    }    
}


// if(!launchApp(app_name) ){
//     download(apk_url)
// }

log(
    currentActivity()
)

main();
