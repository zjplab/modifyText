// ==UserScript==
// @name   网站屏蔽，可以设置屏蔽知乎、微博、哔哩哔哩、优酷、youtube、twitter、facebook、iqiyi、腾讯等让人分心的网站
// @name:en      SiteBlocker，block site,block website，youtube、twitter、facebook
// @name:zh-TW   网站屏蔽，可以设置屏蔽知乎、微博、哔哩哔哩、优酷、youtube、twitter、facebook、iqiyi、腾讯等让人分心的网站
// @name:zh-HK   网站屏蔽，可以设置屏蔽知乎、微博、哔哩哔哩、优酷、youtube、twitter、facebook、iqiyi、腾讯等让人分心的网站
// @namespace    http://tampermonkey.net/
// @version      1.0.10
// @description  超强的网站屏蔽器，可以按照您的需求屏蔽不想上的网站，进入被屏蔽的网站，将会跳转到重定向网站（默认：bing.com）。在bing.com插入了一个设置入口，可以随时更改网站屏蔽设置。自己感觉这脚本挺有用的，不知道为什么安装的人好少。
// @description:en  Super website blocker, you can block the websites you don't want to go according to your needs. When you enter the blocked website, you will jump to the redirected website (default: bing.com) A setting entry is inserted in bing.com, and you can change the website blocking setting at any time.
// @description:zh-TW  超强的网站屏蔽器，可以按照您的需求屏蔽不想上的网站，进入被屏蔽的网站，将会跳转到重定向网站（默认：bing.com）。在bing.com插入了一个设置入口，可以随时更改网站屏蔽设置。
// @description:zh-HK  超强的网站屏蔽器，可以按照您的需求屏蔽不想上的网站，进入被屏蔽的网站，将会跳转到重定向网站（默认：bing.com）。在bing.com插入了一个设置入口，可以随时更改网站屏蔽设置。
// @author       桃源隐叟
// @match        *
// @match        *://*
// @match        *://*/*
// @grant GM_setValue
// @grant GM_getValue
// @run-at document-body


// ==/UserScript==
(function() {
    'use strict';

    // Your code here...
    var langSet;
    var localization={
        zh:{
            settingBtn:"打开设置",
            title:"网站屏蔽器",
            description:"一直屏蔽或者按定时安排屏蔽,被屏蔽的网站，打开后，会跳转到重定向网站，如果没有设置重定向网站，则默认跳转到bing.com",
            inputBlockTip:"输入屏蔽的网址 : ",
            blockPlaceHolder:"输入网址,一般www后面的（例如：baidu.com)",
            blockBtn:"添加",
            inputRelocateTip:"输入重定向的网址 : ",
            relocatePlaceHolder:"请输入完整网址（例如：https://www.bing.com)",
            relocateBtn:"设置",
            relocateDefault:"  默认https://www.bing.com",
            relocateCurrent:"--当前网址：",
            relocateErrorTip:"(网址不全会错误,所以自动重置为默认值）",
            planSelectTip:"输入定时屏蔽设定 ： ",
            checkPlanTip:"启动定时屏蔽 (不勾选则默认一直屏蔽）",
            monday:"星期一",
            tuesday:"星期二",
            wednesday:"星期三",
            thursday:"星期四",
            friday:"星期五",
            saturday:"星期六",
            sunday:"星期日",
            inputHourTip:"请输入时间 ： ",
            blockListTip:"已屏蔽的站点 &nbsp;&nbsp;&nbsp;&nbsp; ",
            clearBtn:"清空屏蔽站点",
            whitelistTip:"白名单(即勾选后，除下面列表中网站，其他网站都不能访问)",
            deleteUrlBtn:"删除"
        },
        en:{
            settingBtn:"setting",
            title:"Website blocker",
            description:"Block all the time or according to the schedule. After opening the blocked website, it will jump to the redirected website. If the redirected website is not set, it will jump to by default：bing.com",
            inputBlockTip:"Enter the block URL : ",
            blockPlaceHolder:"Enter the web address, (for example: Baidu. Com)",
            blockBtn:"add",
            inputRelocateTip:"Enter URL for redirection : ",
            relocatePlaceHolder:"Please enter the full website (for example: https://www.bing.com)",
            relocateBtn:"set",
            relocateDefault:"  default:https://www.bing.com",
            relocateCurrent:"--current：",
            relocateErrorTip:"(Web address error, so reset to default value automatically）",
            planSelectTip:"input schedule ： ",
            checkPlanTip:"Start schedule(if unchecked, always block)",
            monday:"monday",
            tuesday:"tuesday",
            wednesday:"wednesday",
            thursday:"thursday",
            friday:"friday",
            saturday:"saturday",
            sunday:"sunday",
            inputHourTip:"Please enter hours ： ",
            blockListTip:"Blocked Site List &nbsp;&nbsp;&nbsp;&nbsp; ",
            clearBtn:"clear list",
            whitelistTip:"White list(i.e. if checked, all websites except those listed below cannot be accessed)",
            deleteUrlBtn:"delete"
        }
    }

    if(navigator.language.toLowerCase().includes("zh")){
        langSet=localization.zh;
    }else{
        langSet=localization.en;
    }

    var injectHtml={
        trigger:`<button class="triggerBtn" style="position:fixed;top:20px;right:20px;z-index:1000">${langSet.settingBtn}</button>`,
        settingPage:`<style>
        #setting-panel{
            width:${window.screen.width}px;
            height:${window.screen.height}px;
            top:0px;
            left:0px;
            background-color:#fafafa;
            position:fixed;
            z-index:1001;

        }
        .setting-wrapper{
            margin-left:30%;
        }
        .header_main_title{
            font-size:20px;
            margin-bottom: 8px;
        }

        .header_main_subTitle{
            font-size: 14px;
        }

        .close-btn{
            float:right;
            margin:5px;
        }

        .intro{
            border-bottom:5px solid #eee;

        }

        .input-area{
            border-bottom:5px solid #eee;
        }

        .list-area{
            border-bottom:5px solid #eee;
        }

        textarea{
            width:380px;
            margin:10px 0px 5px 10px;
            height: 22px;
            vertical-align: middle;

        }

        .blocksite-url button{
            vertical-align: middle;
            margin:10px 0px 5px 10px;
        }

        .weekday-div{
            margin: 10px 10px 10px 20px;
            border-bottom: 2px solid #ddd;
            padding: 2px 10px;

        }

        .daytime-div{
            margin: 10px 10px 10px 20px;
            padding: 2px 10px;

        }

        .whitelist-div{
            float:right;
        }

        .list-area{
            margin:10px 0px;
        }

        .list-header{
            padding-bottom: 10px;
            border-bottom: 2px solid #bbb;
        }

        .list-body{
            margin: 10px 10px 10px 20px;

            padding-bottom: 10px;

        }

        .list-item{
            display:flex;
            justify-content:space-between;
            border-bottom: 2px solid #ddd;
            padding:3px 0px;
        }

    </style>


    <div id="setting-panel" style="display:none;" >
        <button class="close-btn">X</button>
        <div class="setting-wrapper">
            <div class="intro">
                <h2 class="header_main_title">${langSet.title}</h2>
                <h3 class="header_main_subTitle">${langSet.description}</h3>
            </div>
            <div class="input-area">
                <div class="blocksite-url">
                    <span>${langSet.inputBlockTip}</span><textarea rows="1" placeholder="${langSet.blockPlaceHolder}" class="ta-blocksite-url"></textarea>
                    <button class="btn-blocksite-url">${langSet.blockBtn}</button>
                </div>

                <div>
                    <span>${langSet.inputRelocateTip}
                    </span><textarea rows="1" placeholder="${langSet.relocatePlaceHolder}" class="ta-relocate-url"></textarea><button class="btn-relocate-url">${langSet.relocateBtn}</button><span>  默认https://www.bing.com</span>

                </div>

                <div>
                    <span>${langSet.planSelectTip}</span><input type="checkbox" name="turnon" value="off" id="plan"><label for="plan">${langSet.checkPlanTip}</label>
                    <div>
                        <div class="weekday-div">
                            <input type="checkbox" name="weekday" value="mon" id="mon" checked><label for="mon">${langSet.monday} </label>
                            <input type="checkbox" name="weekday" value="tue" id="tue" checked><label for="tue">${langSet.tuesday} </label>
                            <input type="checkbox" name="weekday" value="wen" id="wen" checked><label for="wen">${langSet.wednesday} </label>
                            <input type="checkbox" name="weekday" value="thu" id="thu" checked><label for="thu">${langSet.thursday} </label>
                            <input type="checkbox" name="weekday" value="fri" id="fri" checked><label for="fri">${langSet.friday} </label>
                            <input type="checkbox" name="weekday" value="sat" id="sat"><label for="sat">${langSet.saturday} </label>
                            <input type="checkbox" name="weekday" value="sun" id="sun"><label for="sun">${langSet.sunday} </label>
                        </div>
                        <div class="daytime-div">
                            ${langSet.inputHourTip}<input type="number" name="hourrange" min="0" max="23" placeholder="0" value="9">-<input type="number" name="hourrange" min="0" max="23" placeholder="23" value="18">
                        </div>
                    </div>
                </div>
            </div>

            <div class="list-area" >
                <span></span>
                <div>
                    <div class="list-header">
                        <span>${langSet.blockListTip}</span><button class="btn-clear-blocksite">${langSet.clearBtn}</button>
                        <div class="whitelist-div">
                            <input type="checkbox" name="whitelist" value="off" id="whitelist"><label for="whitelist">${langSet.whitelistTip}</label>
                        </div>
                    </div>
                    <div class="list-body">
                    </div>

                </div>
            </div>
        </div>
    </div>`,
    blockListItem:`<div class="list-item">
        <span class="item-url"></span>
        <span><button class="item-delete-btn">删除</button></span>
        </div>
    `
    }

    main();

    function main(){
        console.log(window.location.href);
        if(window.location.href.includes("bing.com" ) && !window.location.href.includes("q=") && (window.frames.length == parent.frames.length)){
            //console.log(window.location.href);
            document.body.insertAdjacentHTML("afterbegin",injectHtml.trigger);
            document.body.insertAdjacentHTML("afterbegin",injectHtml.settingPage);
            document.getElementsByClassName("triggerBtn")[0].addEventListener("click",btn_toggle);
            document.getElementsByClassName("close-btn")[0].addEventListener("click",handlerBtnClose);
            document.getElementsByClassName("btn-blocksite-url")[0].addEventListener("click",handlerAddBlockSite);
            document.getElementsByClassName("ta-blocksite-url")[0].addEventListener("keypress",keypressWrapper);
            document.getElementsByClassName("btn-clear-blocksite")[0].addEventListener("click",handlerClearBlocksite);


            initBlockSiteStr();
            
            initRelocateUrl();

            //turnon process
            initTurnon();

            initWeekdayCbs();

            initHourRange();

            initWhiteList();

            //blockByTimePlan();
        }else{
            blockByTimePlan();
        }
    }

    function initBlockSiteStr(){
        var blockSiteStr=GM_getValue("blockSiteStr");
        if(blockSiteStr==undefined){
            GM_setValue("blockSiteStr","");
        }else{
            if(blockSiteStr!="")generateBlockSiteList(blockSiteStr);
            
        } 
    }

    function initRelocateUrl(){
        document.getElementsByClassName("ta-relocate-url")[0].addEventListener("keypress",keypressWrapper);
        document.getElementsByClassName("btn-relocate-url")[0].addEventListener("click",setRelocateUrl);

        var relocateUrl=GM_getValue("relocateUrl");
        if(relocateUrl==undefined){
            GM_setValue("relocateUrl","");
            relocateUrl="";
        }

        if(!relocateUrl.includes("https") && !relocateUrl.includes("http"))relocateUrl="https://www.bing.com";
        document.getElementsByClassName("ta-relocate-url")[0].nextSibling.nextSibling.innerText+=`${langSet.relocateCurrent}`+relocateUrl+`${langSet.relocateErrorTip}`;
    }

    function setRelocateUrl(){
        var relocateUrl=document.getElementsByClassName("ta-relocate-url")[0].value;
        if(!relocateUrl.includes("https") && !relocateUrl.includes("http"))relocateUrl="https://www.bing.com";
        document.getElementsByClassName("ta-relocate-url")[0].nextSibling.nextSibling.innerText=`${langSet.relocateCurrent}`+relocateUrl+`${langSet.relocateErrorTip}`;
        GM_setValue("relocateUrl",relocateUrl);
    }

    function initWhiteList(){
        var isWhiteListOn=GM_getValue("whitelist");
        if(isWhiteListOn==undefined){
            GM_setValue("whitelist",document.getElementsByName("whitelist")[0].checked);
        }else{
            document.getElementsByName("whitelist")[0].checked=isWhiteListOn;
        }

        document.getElementsByName("whitelist")[0].onclick=handlerWhiteListCb;
    }

    function initHourRange(){
        var hourRange=GM_getValue("hourRange");
        var inputHourRange=document.getElementsByName("hourrange");
        if(hourRange==undefined){
            hourRange=inputHourRange[0].value+","+inputHourRange[1].value;
            GM_setValue("hourRange",hourRange);
        }else{
            var hourRangeArr=hourRange.split(",");
            inputHourRange[0].value=hourRangeArr[0];
            inputHourRange[1].value=hourRangeArr[1];
        }

        inputHourRange[0].onchange=handlerHourChange;
        inputHourRange[1].onchange=handlerHourChange;
    }

    function initTurnon(){
        var isTurnon=GM_getValue("turnon");
        if(isTurnon==undefined){
            GM_setValue("turnon",document.getElementsByName("turnon")[0].checked);
        }else{
            document.getElementsByName("turnon")[0].checked=isTurnon;
        }

        document.getElementsByName("turnon")[0].onclick=handlerTurnonCheckbox;
    }

    function initWeekdayCbs(){
        var weekdayCbs=document.getElementsByName("weekday");

        for(let i=0;i<weekdayCbs.length;i++){
            var isWeekdayOn=GM_getValue(weekdayCbs[i].value);
            if(isWeekdayOn==undefined){
                GM_setValue(weekdayCbs[i].value,weekdayCbs[i].checked);
            }else{
                weekdayCbs[i].checked=isWeekdayOn;
            }

            weekdayCbs[i].onclick=handlerWeekdayCb;
        }

    }

    //console.log(GM_getValue("blockSiteStr"));
    //console.log(GM_getValue("relocateUrl"));

    function handlerWhiteListCb(){
        GM_setValue("whitelist",document.getElementsByName("whitelist")[0].checked);
        //console.log(GM_getValue("whitelist"));
    }

    function handlerHourChange(){
        var inputHourRange=document.getElementsByName("hourrange");
        var hourRange=inputHourRange[0].value+","+inputHourRange[1].value;
        GM_setValue("hourRange",hourRange);
        //console.log(GM_getValue("hourRange"));
    }

    function handlerTurnonCheckbox(){
        GM_setValue("turnon",document.getElementsByName("turnon")[0].checked);
       //console.log(GM_getValue("turnon"));
    }

    function handlerWeekdayCb(e){
        GM_setValue(e.target.value,e.target.checked);
        //console.log(e.target.value);
        //console.log(GM_getValue(e.target.value));
    }



    function btn_toggle(){
        //console.log(e);
        if(document.getElementById('setting-panel').style.display=="none"){
            document.getElementsByClassName("b_searchbox")[0].disabled=true;
            document.getElementById('setting-panel').style.display="block";
        }else{
            document.getElementById('setting-panel').style.display="none";
            document.getElementsByClassName("b_searchbox")[0].disabled=false;
        }
    }

    function handlerBtnClose(){
        document.getElementById('setting-panel').style.display="none";
        document.getElementsByClassName("b_searchbox")[0].disabled=false;
    }

    function keypressWrapper(e){
        //console.log(e);
        //console.log(e.keyCode);
        if(e.keyCode==13){
            //console.log(e);
            event.preventDefault();
            if(e.target==document.getElementsByClassName("ta-blocksite-url")[0]){
                handlerAddBlockSite();
            }else if(e.target==document.getElementsByClassName("ta-relocate-url")[0]){
                setRelocateUrl();
            }else{

           }
        }
    }
    function handlerAddBlockSite(){
        //console.log(e);

        var newBlockSite=document.getElementsByClassName("ta-blocksite-url")[0].value;
        //console.log(newBlockSite);
        if(newBlockSite!=""){
            var blockSiteStr=GM_getValue("blockSiteStr");
            if(blockSiteStr.includes(newBlockSite)){
                alert("网址已经存在！");
            }else{
                if(blockSiteStr!=""){
                    blockSiteStr+=","+newBlockSite;
                }else{
                    blockSiteStr=newBlockSite;
                }
            }


            GM_setValue("blockSiteStr", blockSiteStr);
            //console.log(GM_getValue("blockSiteStr"));
            generateBlockSiteList(blockSiteStr);
        }
    }

    function handlerClearBlocksite(){
        GM_setValue("blockSiteStr",'');
        //console.log(GM_getValue("blockSiteStr"));
        document.getElementsByClassName("list-body")[0].innerHTML="";
    }

    function handlerDeteleUrlBtn(e){
        var blockSiteStr=GM_getValue("blockSiteStr");
        var currentList="";
        var currentArr=blockSiteStr.split(",");
        var currentUrl=e.target.parentElement.parentElement.firstElementChild.innerText;


        var deleteLastOne=false;
        for(let i=0;i<currentArr.length;i++){
            if(currentArr[i]==currentUrl){
                if(i==currentArr.length-1){
                    deleteLastOne=true;
                }
            }else{
                if(i==currentArr.length-1){
                    currentList+=currentArr[i];
                }else{
                    currentList+=currentArr[i]+",";
                }
            }
        }

        if(deleteLastOne)currentList=currentList.substring(0,currentList.length-1);
        //console.log(currentUrl);
        //console.log(GM_getValue("blockSiteStr"));
        GM_setValue("blockSiteStr",currentList);
        //console.log(GM_getValue("blockSiteStr"));
        generateBlockSiteList(currentList);
    }

    function generateBlockSiteList(blockSiteStr){
        var blockSiteArray=blockSiteStr.split(",");
        document.getElementsByClassName("list-body")[0].innerHTML="";

        if(blockSiteArray=="")return;
        for(let i=0;i<blockSiteArray.length;i++){
            var blockListItem=`
                <div class="list-item">
                <span class="item-url-${i}"></span>
                <span><button class="item-delete-btn-${i}">${langSet.deleteUrlBtn}</button></span>
                </div>`;

            document.getElementsByClassName("list-body")[0].insertAdjacentHTML("afterbegin",blockListItem);

            document.getElementsByClassName(`item-url-${i}`)[0].innerHTML=blockSiteArray[i];
            document.getElementsByClassName(`item-delete-btn-${i}`)[0].onclick=handlerDeteleUrlBtn;
        }

    }


    function blockByTimePlan(){
        //console.log("blockbytimeplan run");
        var dateObj=new Date();
        var weekday=dateObj.getDay();
        var currentHour=parseInt(dateObj.getHours());

        var hourRangeArr=GM_getValue("hourRange").split(",");
        var hourRangeB=parseInt(hourRangeArr[0]);
        var hourRangeT=parseInt(hourRangeArr[1]);


        if(GM_getValue("turnon")){
            if(GM_getValue(getDayEngName(weekday))){
                //console.log(getDayEngName(weekday));
                //console.log(GM_getValue(getDayEngName(weekday)));
                if(currentHour>=hourRangeB && currentHour<=hourRangeT){
                    blockSiteAction();
                }
            }
        }else{
            blockSiteAction();
        }
    }

    function blockSiteAction(){
        //console.log("block site action run");
        var blockSiteStr=GM_getValue("blockSiteStr");
        var relocateUrl=GM_getValue("relocateUrl");
        //console.log(blockSiteStr);
        //console.log(relocateUrl);
        relocateUrl=(relocateUrl==undefined)?"https://www.bing.com":relocateUrl;
        if(!relocateUrl.includes("https") && !relocateUrl.includes("http")){
            relocateUrl="https://www.bing.com";
        }

        if(blockSiteStr!=""){
            //console.log(blockSiteStr);
            var blockSiteArray=blockSiteStr.split(",");

            var whitePass=false;
            for(let i=0;i<blockSiteArray.length;i++){
                if(GM_getValue("whitelist")){
                    if(window.location.href.includes(blockSiteArray[i])){
                        whitePass=true;
                        //alert("你在网站屏蔽器中屏蔽了此网站，如需访问请前往bing.com解锁此网站。");
                        break;
                    }
                } else{
                    if(window.location.href.includes(blockSiteArray[i])){

                        window.location.href=relocateUrl;
                        //alert("你在网站屏蔽器中屏蔽了此网站，如需访问请前往bing.com解锁此网站。");
                        break;
                    }
                }

            }

            if(GM_getValue("whitelist") &&(whitePass==false)){
                window.location.href=relocateUrl;
            }
        }
    }

    function getDayEngName(day){
        var engName;
        switch(day){
            case 0:
                engName="sun";
                break;
            case 1:
                engName="mon";
                break;
            case 2:
                engName="tue";
                break;
            case 3:
                engName="wen";
                break;
            case 4:
                engName="thu";
                break;
            case 5:
                engName="fri";
                break;
            case 6:
                engName="sat";
                break;
        }

        return engName;
    }
})();
