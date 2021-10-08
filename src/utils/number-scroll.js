/* eslint-disable */
import $ from 'jquery';

//数字滚动
;(function($, window, document) {
  "use strict";
  const defaults = {
    deVal: 0,       //传入值
    className:'',   //样式名称
    digit:''    //默认显示几位数字
  };
  function rollNumDaq(obj, options){
    this.obj = obj;
    this.options = $.extend(defaults, options);
    this.init = function(){
      this.initHtml(obj,defaults);
    }
  }
  rollNumDaq.prototype = {
    initHtml: function(obj,options){
      let strHtml = '<ul class="' + options.className + ' inrow">';
      const valLen = options.digit ||  (options.deVal + '').length;
      if(obj.find('.'+options.className).length <= 0){
        for(let i = 0; i<  valLen; i++){
          strHtml += '<li class="dataOne "><div class="dataBoc"><div class="tt" t="38"><span class="num0">0</span> <span class="num1">1</span> <span class="num2">2</span> <span class="num3">3</span> <span class="num4">4</span><span class="num5">5</span> <span class="num6">6</span> <span class="num7">7</span> <span class="num8">8</span> <span class="num9">9</span><span class="num0">0</span> <span class="num1">1</span> <span class="num2">2</span> <span class="num3">3</span> <span class="num4">4</span><span class="num5">5</span> <span class="num6">6</span> <span class="num7">7</span> <span class="num8">8</span> <span class="num9">9</span></div></div></li>';
        }
        strHtml += `</ul><span class="scroll-prefix">${options.prefix}</span>`;
        obj.html(strHtml);
        $('.scroll-prefix').css({
          position: 'absolute',
          left: $('.number-scroll-scroll-focus').width() + 8,
        })
      }
      this.scroNum(options);
    },
    scroNum: function(options){
      let number = options.deVal;
      let $num_item = $('.' + options.className).find('.tt');
      let h = $('.dataBoc').height();
      $num_item.css('transition','all 2s ease-in-out');
      let numberStr = number.toString();
      if(numberStr.length <= $num_item.length - 1){
        let tempStr = '';
        for(let a = 0; a < $num_item.length - numberStr.length; a++){
          tempStr += '0';
        }
        numberStr = tempStr + numberStr;
      }

      let numberArr = numberStr.split('');
      $num_item.each(function(i, item) {
        let index = $num_item.length - 1 - i;
        setTimeout(function(){
          $num_item.eq(index).css('top',-parseInt(numberArr[index])*h - h*10 + 'px');
        },i*100)
      });
    }
  }
  $.fn.rollNumDaq = function(options){
    const $that = this;
    const rollNumObj = new rollNumDaq($that, options);
    rollNumObj.init();
  };
})($, window, document);

const numScroll = (el, num, prefix) => {
  $(() => {
    $(el).rollNumDaq({
      deVal: num,
      prefix: prefix || '',
      className: `number-scroll-${el.replace('#', '')}`
    });
  });
};
export default numScroll;
