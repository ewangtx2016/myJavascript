/**
 * 
 * let one = new TIME();
 * one.getTimeText(id,{
 *   startTime: '2018-04-26 21:49:00',
 *   endTime: '2018-04-26 23:33:00',
 *   title: '倒计时',
 *   splitTime: true,
 *   timeType:0,
 *   timeCall:function(){
 *      //倒计时结束之后的回调函数
 *   }
 * })
 * 
 */

 ;(function(window){

    var TIME = function(){};
    TIME.prototype = {
        //主程序
        getTimeText: function(id, obj){
            this.id = id;
            this.obj = obj;
            if(!obj.splitTime){
                this.setTime()
            }else{
                this.setTimeSp()
            }
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
            for(let one of this.timeAr){
                he += parseInt(one);
            }
            if(this.obj.timeType == 0){
                let dayTxt = this.timeAr[0] > 0 ? `<span>${this.timeAr[0]}</span><em>天</em>` : '';
                txt =  `
                    <strong>${this.obj.title}</strong>
                    ${dayTxt}
                    <span>${this.timeAr[1]}</span><em>时</em>
                    <span>${this.timeAr[2]}</span><em>分</em>
                    <span>${this.timeAr[3]}</span><em>秒</em>                
                `;
              }else{
                let dayTxt = this.timeAr[0] > 0 ? `<span>${this.timeAr[0]}</span><em>:</em>` : '';
                txt =  `
                    <strong>${this.obj.title}</strong>
                    ${dayTxt}
                    <span>${this.timeAr[1]}</span><em>:</em>
                    <span>${this.timeAr[2]}</span><em>:</em>
                    <span>${this.timeAr[3]}</span>                
                `;
              }
             
              

            if(he == 0){
                // 添加dom
                document.querySelector('#'+this.id).innerHTML = '活动已结束';
                //回调函数
                this.obj.timeCall()
                return false;
            }

            setTimeout(function(){
                _this.setTime();
             },1000)
          }

          // 添加dom
          document.querySelector('#'+this.id).innerHTML = txt;
          
        },
        setTimeSp: function(){
            
        },
        getDMS: function(timeNub){
            let timeNubNow = timeNub;
            if(timeNub.is){
                timeNubNow = timeNubNow.string;
            }else{
                return false;
            }
            
            let time = timeNubNow - 1000;
            let day = ((time/(24*60*60*1000)) | 0) < 0 ? 0 : (time/(24*60*60*1000)) | 0;
                day = day < 10 ? '0' + day : day;
            let hoursLeve = time%(24*60*60*1000);
            let hours = ((hoursLeve/(60*60*1000)) | 0) < 0 ? 0 : (hoursLeve/(60*60*1000)) | 0;
                hours = hours < 10 ? '0' + hours : hours;
            let minuteLeve = time%(60*60*1000);
            let minute = ((minuteLeve/(60*1000)) | 0) < 0 ? 0 : (minuteLeve/(60*1000)) | 0;
                minute = minute < 10 ? '0' + minute : minute
            let secLeve = time%(60*1000);
            let sec = ((secLeve/1000) | 0) < 0 ? 0 : (secLeve/1000) | 0;
                sec = sec < 10 ? '0' + sec : sec
            let NYR = [day, hours, minute, sec];
            
            return NYR;
        },
        //获取时间差
        timeCha: function(){
           let start = this.gengTime(this.obj.startTime);
           let end = this.gengTime(this.obj.endTime);  
           let now = this.gengTime(new Date());
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