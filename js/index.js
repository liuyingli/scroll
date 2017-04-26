"use strict";
/*
*本插件功能所应用的公式
*滑块移动的距离 / 滑块可移动的距离 = 内容滚动的高度/内容可滚动的高度 = 比率
*滑块可移动的距离 / 内容可滚动的高度 = 滑块移动的距离 / 内容滚动的距离 = 比率 (本次开发使用此比率)
*/
(function (win,doc,$) {
    function CusScrollBar(options){
        /*CusScrollBar 中this就代表示例本身*/
        this._init(options);
    }
    $.extend(CusScrollBar.prototype,{
        _init:function(options){
            var self=this;//this代表的是CusScrollBar这个实例
            self.opt={
                scrolDir:'y',//滚动的方向
                contSelector:'',//滚动内容区选择器
                barSelector:'',//滚动条选择器
                sliderSelector:'',//滚动滑块选择器
                tabItemSelector:'.tab-item',
                tabActive:'tab-active',
                anchorSelector:'.anchor',
                wheelStep:25,//滚动一次滑动的距离（数值越大滚动的滚动一次的距离越远 20~30之间是比较正常的速度）
                isScrollTab:true,//是否添加滚动的时候切换table
                addHeight:0,//滚动或tab切换到某个位置的时候预留的高度
                isAnimate:true,//是否开启动画
            }
            $.extend(true,self.opt,options||{});//有true的extend合并返回的是前一个和后一个的合并
            self._initDomEvent();
            return self;//self代表的是CusScrollBar这个实例
        },
        /*
        *设置滑块的高度
        */
        _setScrollSliderHeight:function(){
            var self = this;
            self.$slider.css({'height':self.getScrollSliderHeight()});
            return self;
        },
        /*
        *计算滑块当前位置
        */
        getSliderPosition:function(){
            var self=this,
                maxSliderPosition=self.getMaxSliderPosition();
            return Math.min(maxSliderPosition,maxSliderPosition * self.$cont.scrollTop()/self.getMaxScrollPosition());
        },
        /*
        *内容可以滚动的高度
        */
        getMaxScrollPosition:function(){
            var self=this;
            //取可视区的高度和可视区内容的高度的最大值 - 可视区的高度 = 内容可滚动高度  （可视区内容的高度=可视区高度的scrollHeight）
            return Math.max(self.$cont.height(),self.$cont[0].scrollHeight)-self.$cont.height();
        },
        /*
        *滑块可移动的距离
        */
        getMaxSliderPosition:function(){
            var self=this;
            return self.$bar.height() - self.$slider.height();//self.$slider.height() == 可视区的高度
        },
        /*
        *内容要移动到的距离
        *param 
        *positionVal(要滚到的位置) 
        *isShow 是否有tab切换功能
        */
        scrollTo:function(positionVal,isAnimate){
            var self = this;
            if(self.opt.isScrollTab){
                var posArr=self.getAllAnchorPosition();
                function getIndex(positionVal){
                    for(var i = posArr.length -1; i>=0; i--){
                        if(positionVal >= posArr[i]){
                            return i;
                        }
                        else{
                            continue;
                        }
                    }
                }
                //锚点数与标签数相同
                if(posArr.length == self.$tabItem.length){
                    self.changeTabSelect(getIndex(positionVal));
                }
            }
            if(isAnimate){
                self.$cont.animate({
                    'scrollTop':positionVal
                });
            }
            else{
                self.$cont.scrollTop(positionVal);
            }
        },
        /*
        *设置滑块的高度
        *可是区域的高度 / 实际内容的高度 = 滑块的高度 / 滚动条的高度(即可视区域的高度)
        */
        getScrollSliderHeight:function(){
            var self = this;
            return self.$cont.height()*self.$cont.height() / self.$cont[0].scrollHeight;
        },
        /*
        *获取每个锚点的位置信息的数据
        */
        getAllAnchorPosition:function(){
            var self = this,
                allPositionArr=[];
            for(var i = 0; i<self.$anchor.length; i++){
                allPositionArr.push(self.$cont[0].scrollTop+self.getAnchorPosition(i));
            }
            return allPositionArr;  
        },
        /*
        *获取锚点到上最上面顶部的高度
        */
        getAnchorPosition:function(index){
            return this.$anchor.eq(index).position().top;
        },
        /*
        *初始化标签切换功能
        */
        _initTabEvent:function (){
            var self = this;
            self.$tabItem.off('click').on('click',function(e){
                e.preventDefault();
                var indexAttr = $(this).attr('attrtab');
                if(indexAttr!=undefined){
                    var index = indexAttr.substr(9);
                    self.changeTabSelect(index-1);//点击 切换点击的样式
                    //定位到tab对应的文章
                    self.scrollTo(self.$cont.scrollTop()+self.getAnchorPosition(index-1),self.opt.isAnimate);
                }
                else{
                    alert('tab切换缺少attr属性名 attrtab="tab-item-1"');
                }
            })
            return self;
        },
        /*
        *切换标签的选中
        */
        changeTabSelect : function(index){
            var self = this,
                active = self.opt.tabActive;
            return self.$tabItem.eq(index).addClass(active).siblings().removeClass(active);
        },
        /*
        *监听鼠标滚轮事件(jQuery 不提供鼠标滚轮事件要自己封装)
        */
        _bindMousewheel:function(){
            var self = this;
            //Firefox 的滚轮事件是 DOMMouseScroll ,其他浏览器的滚轮事件是 mousewhell
            self.$cont.off('mousewheel DOMMouseScroll').on('mousewheel DOMMouseScroll',function(e){
                e.preventDefault();
                //获取js的原始事件
                var oEv=e.originalEvent;
                //1.Firefox中使用 event.detail属性返回鼠标滚轮的值 其他浏览器中使用wheeldelta返回鼠标滚轮的值 
                //2.Firefox 中 负值表示滚轮向上 其他浏览器正值表示滚轮向上
                //3.Firefox 返回的滚动的值都是 3的倍数 其他浏览器都是120的倍数
                var wheelRange = oEv.wheelDelta ? -oEv.wheelDelta/120 : (oEv.detail || 0)/3;
                self.scrollTo(self.$cont.scrollTop()+wheelRange*self.opt.wheelStep);
            });
            return self;
        },
        /*
        *监听内容的滚动，同步滑动的位置
        */
        _bindContScroll:function(){
            var self=this;
            self.$cont.off('scroll').on('scroll',function(){
                var  sliderEl=self.$slider;
                if(sliderEl){
                    sliderEl.css({'top':self.getSliderPosition()});
                }
            })
            return self;
        },
        /*
        *给选择器重新命名
        */
        _initDomEvent:function(){
            var opts=this.opt;
            //滚动区域对象，必填
            this.$cont=$(opts.contSelector);
            //滚动条滑块对象，必填
            this.$slider=$(opts.sliderSelector);
            //滚动条对象
            this.$bar=opts.barSelector ? $(opts.barSelector) : this.$slider.parent();
            //标签项
            this.$tabItem = $(opts.tabItemSelector);
            //锚点项
            this.$anchor = $(opts.anchorSelector);
            //获取文档对象
            this.$doc=$(doc);
            //绑定事件
            this._setScrollSliderHeight()._initSliderDragEvent()._bindContScroll()._bindMousewheel()._initTabEvent();
        },
        /*
        *初始化滑块拖动功能
        */
        _initSliderDragEvent:function(){
            var self=this;
            var slider=self.$slider,
                sliderEl=slider[0];
            if(sliderEl){
                var doc=self.$doc,
                    dragStartPagePosition,
                    dragStartScrollPosition,
                    dragContBarRate;
                function mousemoveHandle(e){
                    e.preventDefault();
                    if(dragStartPagePosition==null){
                        return;
                    }
                    //内容的滚动高度
                    var contentScrollHeihgt=dragStartScrollPosition + (e.pageY - dragStartPagePosition)*dragContBarRate;
                    self.scrollTo(contentScrollHeihgt);
                }
                slider.on('mousedown',function(e){
                    e.preventDefault();
                    dragStartPagePosition=e.pageY;
                    //内容移出可视区域的高度
                    dragStartScrollPosition=self.$cont[0].scrollTop;
                    //内容可移动的距离 和 滑块可移动距离 的比率
                    dragContBarRate=self.getMaxScrollPosition()/self.getMaxSliderPosition();
                    doc.on('mousemove.scroll',mousemoveHandle).on('mouseup.scroll',function(e){
                        doc.off('.scroll');
                    })
                })
            }
            return self;
        },
    })
    win.CusScrollBar=CusScrollBar;
})(window,document,jQuery);
var bar= new CusScrollBar({
    contSelector:'.scroll-cont',//滚动内容区选择器
    barSelector:'.scroll-bar',//滚动条选择器
    sliderSelector:'.scroll-slider'//滚动滑块选择器
});