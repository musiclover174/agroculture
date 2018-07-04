'use strict';(function(){var _this=this;window.xs=window.innerWidth<=960?true:false;window.mobile=window.innerWidth<=480?true:false;window.xsHeight=window.innerHeight<=540?true:false;window.touch=document.querySelector('html').classList.contains('touchevents');window.animation={};window.animation.fadeIn=function(elem,ms,cb){if(!elem)return;elem.style.opacity=0;elem.style.display='block';if(ms){var opacity=0;var timer=setInterval(function(){opacity+=50/ms;if(opacity>=1){clearInterval(timer);opacity=1;if(cb)cb()}elem.style.opacity=opacity},50)}else{elem.style.opacity=1;if(cb)cb()}};window.animation.fadeOut=function(elem,ms,cb){if(!elem)return;elem.style.opacity=1;if(ms){var opacity=1;var timer=setInterval(function(){opacity-=50/ms;if(opacity<=0){clearInterval(timer);opacity=0;elem.style.display='none';if(cb)cb()}elem.style.opacity=opacity},50)}else{elem.style.opacity=0;elem.style.display='none';if(cb)cb()}};window.animation.scrollTo=function(to,duration){if(duration<=0)return;var element=document.documentElement,difference=to-element.scrollTop,perTick=difference/duration*10;setTimeout(function(){element.scrollTop=element.scrollTop+perTick;window.animation.scrollTo(to,duration-10)},10)};window.agroculture={};window.agroculture.form={init:function init(){var _th=this,forms=document.querySelectorAll('form'),selectors=document.querySelectorAll('.js-select'),choicesArr=[],digitsInput=document.querySelectorAll('.js-digits');$('.js-phone').mask('+7(999) 999-9999');forms.forEach(function(form){// валидация форм
form.addEventListener('submit',function(e){return!_th.checkForm(form)&&e.preventDefault()})});var _iteratorNormalCompletion=true;var _didIteratorError=false;var _iteratorError=undefined;try{for(var _iterator=selectors[Symbol.iterator](),_step;!(_iteratorNormalCompletion=(_step=_iterator.next()).done);_iteratorNormalCompletion=true){var selector=_step.value;// навешиваем select обвес
var choice=new Choices(selector,{searchEnabled:false,itemSelectText:'',position:'bottom'});choicesArr.push(choice)}}catch(err){_didIteratorError=true;_iteratorError=err}finally{try{if(!_iteratorNormalCompletion&&_iterator.return){_iterator.return()}}finally{if(_didIteratorError){throw _iteratorError}}}var _iteratorNormalCompletion2=true;var _didIteratorError2=false;var _iteratorError2=undefined;try{for(var _iterator2=digitsInput[Symbol.iterator](),_step2;!(_iteratorNormalCompletion2=(_step2=_iterator2.next()).done);_iteratorNormalCompletion2=true){var digitInput=_step2.value;// ввод только чисел в инпуты
digitInput.addEventListener('keydown',function(e){var validArr=[46,8,9,27,13,110,190];if(validArr.indexOf(e.keyCode)!==-1||e.keyCode==65&&(e.ctrlKey===true||e.metaKey===true)||e.keyCode==67&&(e.ctrlKey===true||e.metaKey===true)||e.keyCode==88&&(e.ctrlKey===true||e.metaKey===true)||e.keyCode>=35&&e.keyCode<=39){return}if((e.shiftKey||e.keyCode<48||e.keyCode>57)&&(e.keyCode<96||e.keyCode>105)){e.preventDefault()}})}}catch(err){_didIteratorError2=true;_iteratorError2=err}finally{try{if(!_iteratorNormalCompletion2&&_iterator2.return){_iterator2.return()}}finally{if(_didIteratorError2){throw _iteratorError2}}}},checkForm:function checkForm(form){var checkResult=true;var warningElems=form.querySelectorAll('.warning');if(warningElems.length)warningElems.forEach(function(warningElem){return warningElem.classList.remove('warning')});form.querySelectorAll('input, textarea, select').forEach(function(elem){if(elem.getAttribute('data-req')){switch(elem.getAttribute('data-type')){case'tel':var re=/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;if(!re.test(elem.value)){elem.classList.add('warning');checkResult=false}break;case'email':var re=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;if(!re.test(elem.value)){elem.classList.add('warning');checkResult=false}break;default:if(elem.value.trim()===''){elem.classList.add('warning');checkResult=false}break;}}});form.querySelectorAll('input[name^=agreement]').forEach(function(item){if(!item.checked){item.classList.add('warning');checkResult=false}});return checkResult}}.init();/*window.agroculture.animator = ({

    hideBlock: function (block) {
      block.clearQueue().stop().animate({
        'opacity': 0
      }, 400, function () {
        block.removeAttr('style').removeClass('visible');
      });
    },

    showBlock: function (block, dir, duration, pause) {
      if (dir === undefined) {
        dir = 'btt';
      }
      if (duration === undefined) {
        duration = 1200;
      }
      if (pause === undefined) {
        pause = 0;
      }

      if (/Mobi/.test(navigator.userAgent)) {
        pause = 0;
        duration = 400;
      }

      setTimeout(function () {
        switch (dir) {
          case 'rtl':
            block.animate({
              'right': 0,
              'opacity': 1
            }, duration, 'linear', function () {
              $(this).addClass('visible');
            });
            break;
          case 'ltr':
            block.animate({
              'left': 0,
              'opacity': 1
            }, duration, 'linear', function () {
              $(this).addClass('visible');
            });
            break;
          case 'ttb':
            block.animate({
              'top': 0,
              'opacity': 1
            }, duration, 'linear', function () {
              $(this).addClass('visible');
            });
            break;
          case 'btt':
            block.animate({
              'bottom': 0,
              'opacity': 1
            }, duration, 'linear', function () {
              $(this).addClass('visible');
            });
            break;
          case 'fi':
            block.animate({
              'opacity': 1
            }, duration, 'linear', function () {
              $(this).addClass('visible');
            });
            break;
          default:
            break;
        }
      }, pause);
    },

    startCheckVis: function () {
      var _th = this;
      var visArea = $(window).scrollTop() + $(window).height();

      $('.animator').each(function () {
        if ($(this).offset().top >= visArea)
          $(this).removeClass('visible');
      });
    },

    checkVisibility: function (block) {

      var visArea = $(window).scrollTop() + $(window).height() * .7;

      if (block.offset().top < visArea)
        return true;
      else
        return false;

    },

    scrollVis: function () {
      var _th = this;

      $('.animator').each(function () {
        if (!$(this).hasClass('visible')) {
          if (_th.checkVisibility($(this)))
            _th.showBlock($(this), $(this).data('dir'), $(this).data('duration'), $(this).data('pause'));
        } else {
          if (!_th.checkVisibility($(this)))
            _th.hideBlock($(this));
        }
      });
    },


    init: function () {
      var _th = this;

      _th.startCheckVis();

      $(window).scroll(function () {
        _th.scrollVis();
      });

      return this;
    }

  }).init();*/window.agroculture.obj={progressUpdate:function progressUpdate(val){var progressEl=document.querySelector('.js-progress');progressEl.style.width=val+'%'},indexVertCarousel:function indexVertCarousel(){var headerEl=document.querySelector('.header'),bodyEl=document.querySelector('body'),carElemCount=document.querySelector('.js-icar .swiper-wrapper').children.length,areaOverEl=document.querySelector('.js-area-over'),_self=_this;var bodyElColor=bodyEl.getAttribute('data-color');if(window.xs&&window.touch){document.querySelector('.js-icar .swiper-no-swiping').classList.remove('swiper-no-swiping')}/*if (window.xsHeight){
        document.querySelector('.js-icar').classList.add('horizontal')
        document.querySelector('html').classList.add('horizontal')
        document.querySelectorAll('.js-icar .swiper-slide').forEach( item => {
          item.classList.add('swiper-slide-active')
        })
      } else {*/var mainVertSwiper=new Swiper('.js-icar',{loop:false,speed:800,direction:'vertical',slidesPerView:1,spaceBetween:0,mousewheel:true,//touchMoveStopPropagation: false,
allowTouchMove:window.xs&&window.touch});mainVertSwiper.on('slideChangeTransitionStart',function(){if(this.activeIndex){headerEl.classList.add('hidden');window.agroculture.obj.progressUpdate(Math.floor((this.activeIndex+1)*100/carElemCount))}else{headerEl.classList.remove('hidden');window.agroculture.obj.progressUpdate(0)}if(this.activeIndex!==1){areaOverEl.classList.remove('changed')}var slideColor=this.slides[this.activeIndex].getAttribute('data-color');if(slideColor!=bodyElColor){bodyElColor=slideColor;bodyEl.setAttribute('data-color',slideColor)}});//}
},indexBannerCarousel:function indexBannerCarousel(){var toggleHiddens=document.querySelectorAll('.js-area-toggler'),toggleOver=document.querySelector('.js-area-over');var bannerSwiper=new Swiper('.js-ibanner',{loop:true,speed:800,slidesPerView:1,spaceBetween:0,parallax:true,navigation:{nextEl:'.js-ibanner .swiper-button-next',prevEl:'.js-ibanner .swiper-button-prev'},autoplay:{delay:5000}});var _iteratorNormalCompletion3=true;var _didIteratorError3=false;var _iteratorError3=undefined;try{for(var _iterator3=toggleHiddens[Symbol.iterator](),_step3;!(_iteratorNormalCompletion3=(_step3=_iterator3.next()).done);_iteratorNormalCompletion3=true){var toggleButton=_step3.value;toggleButton.addEventListener('click',function(){toggleOver.classList.toggle('changed')})}}catch(err){_didIteratorError3=true;_iteratorError3=err}finally{try{if(!_iteratorNormalCompletion3&&_iterator3.return){_iterator3.return()}}finally{if(_didIteratorError3){throw _iteratorError3}}}},indexShowMap:function indexShowMap(){var mapButton=document.querySelector('.js-mapshower'),mapAreaOver=document.querySelector('.js-slide-mapper');function init(){var multiRoute=new ymaps.multiRouter.MultiRoute({referencePoints:[[55.727888,37.564603],[54.832774,38.294106]],params:{results:1}},{boundsAutoApply:false});var myMap=new ymaps.Map('iroad-map',{center:[55.051641,38.714763],zoom:9,controls:['smallMapDefaultSet']});myMap.geoObjects.add(multiRoute);myMap.behaviors.disable('scrollZoom')}ymaps.ready(init);mapButton.addEventListener('click',function(){mapAreaOver.classList.toggle('showmap')})},indexVegetables:function indexVegetables(){var vegHrefs=document.querySelectorAll('.js-iveg-href'),vegOver=document.querySelector('.iveg__over'),backHrefs=document.querySelectorAll('.js-iveg-back');var step=0,vegBlock=void 0,vegEl=void 0,clientX=0,vegWidth=void 0,vegFrames=void 0,vegFrameHeight=void 0,minL=Infinity,maxL=0,startWatcher=false,vegStepEnd=false;var vegListener=function vegListener(event){if(startWatcher){if(event.offsetX<minL)minL=event.offsetX;if(event.offsetX>maxL)maxL=event.offsetX;var percent=Math.floor((maxL-minL)*150/vegWidth);if(percent<0)percent=0;if(percent>100){percent=100;vegStepEnd=true}if(percent>0&&percent<=100)vegBlock.setAttribute('data-percent',percent);var newSlide=Math.floor(vegFrames*percent/100);vegEl.style.backgroundPositionY='-'+newSlide*vegFrameHeight+'px'}};var vegToStart=function vegToStart(curSlide){if(curSlide===0)return;curSlide--;vegEl.style.backgroundPositionY='-'+curSlide*vegFrameHeight+'px';setTimeout(function(){vegToStart(curSlide)},20)};var watcherSetter=function watcherSetter(){startWatcher=true};var interactiveEnd=function interactiveEnd(){minL=Infinity;maxL=0;if(!vegStepEnd){vegToStart(Math.abs(parseInt(getComputedStyle(document.querySelector('.iveg__type-anim'))['backgroundPositionY']))/vegFrameHeight)}else{step++;vegBlock.classList.add('step2-starter');setTimeout(function(){vegBlock.classList.remove('step2-starter');vegBlock.classList.add('step2')},700);docListenerRemove()}vegBlock.removeAttribute('data-percent');startWatcher=false};var docListenerRemove=function docListenerRemove(){['mousedown','touchstart'].forEach(function(e){document.removeEventListener(e,watcherSetter)});['mouseup','touchend'].forEach(function(e){document.removeEventListener(e,interactiveEnd)});['mousemove','touchmove'].forEach(function(e){vegEl.removeEventListener(e,vegListener)})};var docListener=function docListener(){['mousemove','touchmove'].forEach(function(e){vegEl.addEventListener(e,vegListener)});['mousedown','touchstart'].forEach(function(e){document.addEventListener(e,watcherSetter)});['mouseup','touchend'].forEach(function(e){document.addEventListener(e,interactiveEnd)})};if(window.xs&&window.touch){}else{var _loop=function _loop(vegHref){vegHref.addEventListener('click',function(e){var hrefType=vegHref.getAttribute('data-type');vegBlock=document.querySelector('.iveg__type[data-type="'+hrefType+'"]');vegEl=vegBlock.querySelector('.iveg__type-anim');vegWidth=vegEl.clientWidth;vegFrames=vegEl.getAttribute('data-frames');vegFrameHeight=vegEl.getAttribute('data-frameheight');docListener();vegOver.classList.add('hide');setTimeout(function(){vegOver.classList.add('absolute');vegBlock.classList.remove('absolute','hide');step++},700);e.preventDefault()})};var _iteratorNormalCompletion4=true;var _didIteratorError4=false;var _iteratorError4=undefined;try{for(var _iterator4=vegHrefs[Symbol.iterator](),_step4;!(_iteratorNormalCompletion4=(_step4=_iterator4.next()).done);_iteratorNormalCompletion4=true){var vegHref=_step4.value;_loop(vegHref)}}catch(err){_didIteratorError4=true;_iteratorError4=err}finally{try{if(!_iteratorNormalCompletion4&&_iterator4.return){_iterator4.return()}}finally{if(_didIteratorError4){throw _iteratorError4}}}var _iteratorNormalCompletion5=true;var _didIteratorError5=false;var _iteratorError5=undefined;try{for(var _iterator5=backHrefs[Symbol.iterator](),_step5;!(_iteratorNormalCompletion5=(_step5=_iterator5.next()).done);_iteratorNormalCompletion5=true){var backHref=_step5.value;backHref.addEventListener('click',function(e){if(step===1){vegBlock.classList.add('hide');setTimeout(function(){vegBlock.classList.add('absolute');vegOver.classList.remove('absolute','hide');docListenerRemove();step--},700)}if(step===2){step--;vegBlock.classList.add('step1-starter');setTimeout(function(){vegBlock.classList.remove('step1-starter');vegBlock.classList.remove('step2')},700);vegToStart(vegFrames);docListener();vegStepEnd=false}})}}catch(err){_didIteratorError5=true;_iteratorError5=err}finally{try{if(!_iteratorNormalCompletion5&&_iterator5.return){_iterator5.return()}}finally{if(_didIteratorError5){throw _iteratorError5}}}}},init:function init(){var burgerEl=document.querySelector('.js-burger'),html=document.querySelector('html');burgerEl.addEventListener('click',function(e){html.classList.toggle('burgeropen');burgerEl.classList.toggle('open');e.preventDefault()});if(document.querySelector('.js-icar'))this.indexVertCarousel();if(document.querySelector('.js-ibanner'))this.indexBannerCarousel();if(document.querySelector('.js-mapshower'))this.indexShowMap();if(document.querySelector('.js-iveg-href'))this.indexVegetables();if(window.touch&&window.xsHeight&&window.innerHeight<window.innerWidth){document.querySelector('html').classList.add('lock')}window.addEventListener('orientationchange',function(){setTimeout(function(){if(window.touch&&window.xsHeight&&window.innerHeight<window.innerWidth){document.querySelector('html').classList.add('lock')}else{document.querySelector('html').classList.remove('lock')}},350)});//shave(elem, 50); обрезка текста
//$('[data-fancybox]').fancybox(); // fancy init
/*let eventResize = new Event('resize') // триггеры событий скролла и ресайза
      window.dispatchEvent(eventResize)
      let eventScroll = new Event('scroll')
      window.dispatchEvent(eventScroll)*/return this}}.init()})();