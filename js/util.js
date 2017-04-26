// const $ = require('../lib/jquery.min');
// const hm = require('../common/hm_popBox');
var kyUtil = { 
    getJson: function(url, infoData, getOrPost) {
        // var url='/room/getList';
        // var data='';
        // var getOrPost='get';
        var results = '';
        $.ajax({
            'cache': false,
            'async': false,
            'url': url,
            'type': getOrPost,
            'dataType': 'json',
            'data': infoData,
            success: function(result) {
                results = result;
            }
        });
        return results;
    },
    getJsonP: function(url, datas, getOrPost) {
        var results = '';
        $.ajax({
            cache: false,
            async: false,
            type: getOrPost,
            url: url,
            data:datas,
            dataType:'jsonp',
            jsonp:'callback',
            success: function(result) {
                results = result;
            }
        });
        return results;
    },
    //截取.jpg .text .doc等后缀(截取特殊符号到最后之间的字符)
    subStrLast: function(oldStr, speStr) {
        var localStr = oldStr.lastIndexOf(speStr);
        var lastStr='';
        if(localStr!=-1){
            lastStr = oldStr.substring(localStr + 1);
        }
        return lastStr;
    },
    //截取字符串（从头到特殊符号）
    subStrStart:function(oldStr, speStr){
        var localStr = oldStr.indexOf(speStr);
        var lastStr='';
        if(localStr!=-1){
            var lastStr = oldStr.substr(0,localStr);
        }
        return lastStr;
    },
    addComma:function(moneyTotal){
        var len = moneyTotal.length;
        var step=3;
        var splitor=",";
        if(len > step) {
            var l1 = len%step,l2 = parseInt(len/step),arr = [],first = moneyTotal.substr(0, l1);
            if(first != '') {
                arr.push(first);
            };
            for(var i=0; i<l2 ; i++) {
                arr.push(moneyTotal.substr(l1 + i*step, step));    
            };
            moneyTotal = arr.join(splitor);
        }; 
        return moneyTotal;
    },
    showLastComma:function(oldStr,speStr){
        var startStr=this.subStrStart(oldStr,speStr);
        var lastStr=this.subStrLast(oldStr,speStr);
        var strComma=this.addComma(startStr);
        var endStr=strComma+'.'+lastStr;
        return endStr;
    },
    getUrlParam:function(name){
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return unescape(r[2]); return null; //返回参数值
    },
    /* 将数据用特殊符号链接起来
     **@argument arrays(数组) symbol(特殊符号) 
     **
     */
    strJoin: function(arrays, symbol) {
        var str = '';
        if (arrays.length > 0) {
            for (var i; i < arrays.length; i++) {
                if (i == (arrays.length - 1)) {
                    str += arrays[i];
                } else {
                    str += arrays[i] + symbol;
                }
            }
        }
        return str;
    },
    /*去掉开头和结尾的空格*/
    removeBlankLR:function(str){
        return str.replace(/(^\s*)|(\s*$)/g, "");
    },
    /*将空格替换成特殊符号（如将空格替换成,等）*/
    replaceBlankLR:function(str){
        return str.replace(/(^\s*)|(\s*$)/g, "");
    },
    getFamatDate:function(now,strY){
        var year=now.getFullYear(); 
        var week=now.getDay();//星期几
        var month=now.getMonth()+1; 
        var date=now.getDate(); 
        var hour=now.getHours(); 
        var minute=now.getMinutes(); 
        var seconds=now.getSeconds();
        if(month<10){
            month='0'+month;
        }
        if(date<10){
            date='0'+date;
        }
        if(hour<10){
            if(hour==0){
                hour='00';
            }
            else{
                hour='0'+hour;
            }
        }
        if(minute<10){
            if(minute==0){
                minute='00';
            }
            else{
                minute='0'+minute;
            }
        }
        if(seconds<10){
            if(seconds==0){
                seconds='00';
            }
            else{
                seconds='0'+seconds;
            }
        }
        //年
        if(strY=='y'){
            return year;
        }
        //月
        if(strY=='mt'){
            return month;
        }
        //日（几号）
        if(strY=='d'){
            return date;
        }
        //小时
        if(strY=='h'){
            return hour;
        }
        //分钟
        if(strY=='ms'){
            return minute;
        }
        //秒
        if(strY=='s'){
            return seconds;
        }
        //年-月-日
        if(strY=='ymd'){
            return year+"-"+month+"-"+date;
        }
        if(strY=='ym'){
            return year+"-"+month;
        }
        if(strY=='hm'){
            return hour+":"+minute;
        }
        //时分秒
        if(strY=='hms'){
            return hour+":"+minute+":"+seconds;
        }
        if(strY=='w'){
            return week;
        }
        if(strY=='all'){
            return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+seconds;
        }
    },
    getNowAllTime:function(){
        var lastTime='';
        var nowTime=new Date();
        var yearMd=this.getFamatDate(nowTime,'ymd');
        var hourMS=this.getFamatDate(nowTime,'hms');
        lastTime=yearMd+' '+hourMS;
        return lastTime;
    },
    //近12个月月份
    recent12Month:function(){
        var nowTime=new Date();
        var month=nowTime.getMonth()+1;
        var startMonth=0;
        var year=nowTime.getFullYear();
        if(month==12){
            time=year+'01'+','+year+'12';
        }
        else{
            startMonth=parseInt(month)+1;
            if(startMonth<10){
                startMonth='0'+startMonth;
            }
            if(month<10){
                month='0'+month;
            }
            time=(year-1)+''+startMonth+','+year+month;
        }
        return time;
    },
    //将时间转换成毫秒值(时间戳)
    timeStamp:function(time){
        return Date.parse(new Date(time))/1000;
    },
    stampToTime:function(timestamp){
        return new Date(timestamp*1000);
    },
    /*
    **@contains判断数据中是否包含某个字符串,
    **@param array 数组 obj判断的字符串
    */
    contains:function(array,obj){
        for(var i=0;i<array.length;i++){
            if(array[i]===obj){
                return true;
            }
            else{
                return false;
            }
        }
    },
    /*验证非空*/
    checkTextNull:function(){
        var inputIndex='';
        $('input.must-input').each(function(index){
            if($.trim($(this).val())==''){
                $(this).addClass('check-null');
                inputIndex=0;
                return false;
            }
            else{
                $(this).removeClass('check-null');
            }
        });
        if(inputIndex!==''){
            hm.alert({
                text:'请输入必填项',
                icontype:'info'
            },function(){
                $('.check-null').eq(inputIndex).focus();
            });
            return false;
        }
        else{
            return true;
        }
    },
    checkButtonNull:function(){
        var inputIndex='';
        if($('a.dropdown-toggle').size()>0){
            $('.must-btn').each(function(index){
                if($(this).val()==''){
                    $(this).parent('a').addClass('borderRed');
                    inputIndex=0;
                    return false;
                }
                else{
                    $(this).parent('a').removeClass('borderRed');
                }
            });
        }
        if(inputIndex!==''){
            hm.alert({
                text:'请选择',
                icontype:'info'
            });
            return false;
        }
        else {
            return true;
        }
    },
    getToken:function(){
        return $('meta[name="_token"]').attr('content');
    },
    //替换特殊符号
    replaceSym:function(str){
        if(str==''){
            return '';
        }
        else{
            var cc=str.replace(/(&quot;)/g,"\"");
            var bb=cc.replace(/(&rdquo;)/g,"\“");
            var dd=bb.replace(/(&ldquo;)/g,"\”");
            var ee=dd.replace(/(&lsquo;)/g,"\‘");
            var ff=ee.replace(/(&rsquo;)/g,"\’");
            var gg=ff.replace(/(&lt;)/g,"\<");
            var hh=gg.replace(/(&gt;)/g,"\>");
            var ii=hh.replace(/(&#039;)/g,"\'");
            return ii;
        }
    },
    /*按对象里的某一项排序*/
    sortArrObj:function(arr,obj,ordOrdes){
        // if(ordOrdes=='ord'){//降序排列
        //     arr.sort((a,b)=>a.obj-b.obj);
        // }
        // else if(ordOrdes=='des'){//生序排列
        //     arr.sort((a,b)=>b.obj-a.obj);
        // }
    },
    isEmptyObj:function(obj){
        if(obj!=undefined){
            for(var key in obj){
                return false;
            }
            return true;
        }
        return false;
    },
    
}
exports.kyUtil=kyUtil;




