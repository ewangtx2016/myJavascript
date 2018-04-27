/**
 * ********
 * 
 * FROM CHINA
 * name||email||wechart  : OLD`LV||18664698@qq.com||big_lv_
 * 
 * 
 * @{id} *必填 {string} dom的id选择器 例如 ('DOM_NAME',
 * @{title} 选填 {string} 显示在倒计时前面的标题，默认为空
 * @{splitTime} 选填 {bool} 是否将天、时、分、秒拆分成单个元素
 * @{timeType} 选填 {number} 显示倒计时的样式 0-'**时**分**秒'  1-'**:**:**'
 *  
 * 
 * let one = new TIME();
 * one.getTimeText(id,{
 *   startTime: '2018-04-26 21:49:00',  //* 可选 可以为时间戳
 *   endTime: '2018-04-26 23:33:00',    //* 可选 可以为时间戳
 *   title: 'title',                    //* 可选  
 *   splitTime: true,                   //* 可选 
 *   timeType:0,                        //* 可选 
 *   timeCall:function(){               
 *      //* 可选 倒计时结束之后的回调函数
 *   }
 * })
 * 
 * ********
 */

 ;(function(window){

    var TIME = function(){};
    TIME.prototype = {
        //主程序
        getTimeText: function(id, obj){
            this.id = id;
            this.obj = obj;
            this.tim = 0;
            this.setTime()
        },
        setTime: function(){
          this.cha = this.timeCha(); //object 类型 {is:false/true,string:''}
          this.timeAr = this.getDMS(this.cha); //返回 [d,h,m,s]或false
          let txt = '';
          
          if(!this.timeAr){
             txt = `<ins>${this.cha.string}</ins>`;
          }else{
            // 计算d\h\m\s 的和
            let he = 0;
            let _this = this;
            //默认标题
            let title = this.obj.title ? `<strong>${this.obj.title}</strong>` : '';
            //默认样式
            this.obj.timeType = this.obj.timeType ? this.obj.timeType : 0;
            for(let one of this.timeAr){
                he += parseInt(one);
            }
            if(!this.obj.splitTime){
            	if(this.obj.timeType == 0){
	                let dayTxt = this.timeAr[0] > 0 ? `<span>${this.timeAr[0]}</span><i>天</i>` : '';
	                txt =  `
	                    ${title}
	                    ${dayTxt}
	                    <span>${this.timeAr[1]}</span><i>时</i>
	                    <span>${this.timeAr[2]}</span><i>分</i>
	                    <span>${this.timeAr[3]}</span><i>秒</i>                
	                `;
	              }else{
	                let dayTxt = this.timeAr[0] > 0 ? `<span>${this.timeAr[0]}</span><i>:</i>` : '';
	                txt =  `
	                    ${title}
	                    ${dayTxt}
	                    <span>${this.timeAr[1]}</span><i>:</i>
	                    <span>${this.timeAr[2]}</span><i>:</i>
	                    <span>${this.timeAr[3]}</span>                
	                `;
	              }
            }else{
            	let splitTimeAr = this.getTimeNewArr();
            	if(this.obj.timeType == 0){
	                let dayTxt = this.timeAr[0] > 0 ? `<span>${splitTimeAr[0][0]}</span><span>${splitTimeAr[0][1]}</span><i>天</i>` : '';
	                txt =  `
	                    ${title}
	                    ${dayTxt}
	                    <span>${splitTimeAr[1][0]}</span><span>${splitTimeAr[1][1]}</span><i>时</i>
	                    <span>${splitTimeAr[2][0]}</span><span>${splitTimeAr[2][1]}</span><i>分</i>
	                    <span>${splitTimeAr[3][0]}</span><span>${splitTimeAr[3][1]}</span><i>秒</i>                
	                `;
	              }else{
	                let dayTxt = splitTimeAr[0] > 0 ? `<span>${splitTimeAr[0][0]}</span><span>${splitTimeAr[0][1]}</span><i>:</i>` : '';
	                txt =  `
	                    ${title}
	                    ${dayTxt}
	                    <span>${splitTimeAr[1][0]}</span><span>${splitTimeAr[1][1]}</span><i>:</i>
	                    <span>${splitTimeAr[2][0]}</span><span>${splitTimeAr[2][1]}</span><i>:</i>
	                    <span>${splitTimeAr[3][0]}</span><span>${splitTimeAr[3][1]}</span>               
	                `;
	              }
            }

            if(he == 0){
                // 添加dom
                document.querySelector('#'+this.id).innerHTML = '活动已结束';
                //回调函数
                this.obj.timeCall && this.obj.timeCall();
                return false;
            }

            setTimeout(function(){
                _this.setTime();
             },1000)
          }

          // 添加dom
          document.querySelector('#'+this.id).innerHTML = txt;
          
        },
        getTimeNewArr: function(){
        	// 把d,h,m,s拆分成数组
        	let newArr = [];
            for(let one of this.timeAr){
            	one += '';
            	newArr.push(one.split(''));
            }
            return newArr;
        },
        getDMS: function(timeNub){
            let timeNubNow = timeNub;
            if(timeNub.is){
                timeNubNow = timeNubNow.string;
            }else{
                return false;
            }
            
            let time = timeNubNow;
            let day = ((time/(24*60*60*1000)) | 0) < 0 ? 0 : (time/(24*60*60*1000)) | 0;
                day = day < 10 ? '0' + day : day;
            let hoursLeve = time%(24*60*60*1000);
            let hours = ((hoursLeve/(60*60*1000)) | 0) < 0 ? 0 : (hoursLeve/(60*60*1000)) | 0;
                hours = hours < 10 ? '0' + hours : hours;
            let minuteLeve = time%(60*60*1000);
            let minute = ((minuteLeve/(60*1000)) | 0) < 0 ? 0 : (minuteLeve/(60*1000)) | 0;
                minute = minute < 10 ? '0' + minute : minute
            let secLeve = time%(60*1000);
            //这里非常重要，计算剩余的秒数的时候要用round()不能用向上取舍或者向下取舍，会有问题
            let sec = Math.round((secLeve/1000)) < 0 ? 0 : Math.round((secLeve/1000));
                sec = sec < 10 ? '0' + sec : sec
            let NYR = [day, hours, minute, sec];
                time = timeNubNow - 1000;
            return NYR;
        },
        //获取时间差
        timeCha: function(){
           let now = this.gengTime(new Date());
           let start = this.obj.startTime ? this.gengTime(this.obj.startTime) : now;
           let end = this.obj.endTime ? this.gengTime(this.obj.endTime) : now;  
           let timeObj = null;
           if((start - now) > 0){
                timeObj = {
                    is: false,
                    string: '活动未开始'
                }
           }else{
                timeObj = {
                    is: true,
                    string: (end - now)
                }
           }    
           return timeObj;
        },
        //解析obj中的start和end时间为时间戳
        gengTime: function(time){
            if(time && typeof time!= 'undefined'){
                return new Date(time).getTime();
            }else{
                return false;
            }
        }
    }
    //将方法赋给全局变量
    window.TIME = TIME;
 })(window,undefined)