(function () {

  window.xs = window.innerWidth <= 1024 ? true : false
  
  window.mobile = window.innerWidth <= 480 ? true : false
  
  window.xsHeight = window.innerHeight <= 540 ? true : false
  
  window.touch = document.querySelector('html').classList.contains('touchevents')
  
	window.animation = {}
	
	window.animation.fadeIn = (elem, ms, cb, d = 'block') => {
    if (!elem)
      return;

    elem.style.opacity = 0;
    elem.style.display = d;

    if (ms) {
      var opacity = 0;
      var timer = setInterval(function () {
        opacity += 50 / ms;
        if (opacity >= 1) {
          clearInterval(timer);
          opacity = 1;
          if (cb) cb()
        }
        elem.style.opacity = opacity;
      }, 50);
    } else {
      elem.style.opacity = 1;
      if (cb) cb()
    }
  }
  
  window.animation.fadeOut = (elem, ms, cb) => {
    if (!elem)
      return;

    elem.style.opacity = 1;

    if (ms) {
      var opacity = 1;
      var timer = setInterval(function () {
        opacity -= 50 / ms;
        if (opacity <= 0) {
          clearInterval(timer);
          opacity = 0;
          elem.style.display = "none";
          if (cb) cb()
        }
        elem.style.opacity = opacity;
      }, 50);
    } else {
      elem.style.opacity = 0;
      elem.style.display = "none";
      if (cb) cb()
    }
  }
  
  window.animation.scrollTo = (to, duration) => {
    if (duration <= 0) return;
    const element = document.documentElement,
          difference = to - element.scrollTop,
          perTick = difference / duration * 10;

    setTimeout(function() {
      element.scrollTop = element.scrollTop + perTick;
      window.animation.scrollTo(to, duration - 10);
    }, 10);
  }
	
  window.animation.visChecker = (el) => {
    let rect = el.getBoundingClientRect()
    return (
      //rect.top >= 0 &&
      //rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && 
      rect.right <= (window.innerWidth || document.documentElement.clientWidth) 
    )
  }
  
  window.agroculture = {}

  window.agroculture.form = ({

    init: function () {

      const _th = this,
            inputs = document.querySelectorAll('.common__input, .common__textarea'),
						forms = document.querySelectorAll('form'),
						selectors = document.querySelectorAll('.js-select'),
            choicesArr = [],
						digitsInput = document.querySelectorAll('.js-digits');

      $('.js-phone').mask('+7(999) 999-9999');

      function emptyCheck(event){
        event.target.value.trim() === '' ? 
          event.target.classList.remove('notempty') :
          event.target.classList.add('notempty')
      }
      
      inputs.forEach( item => {
        item.addEventListener('keyup', emptyCheck)
        item.addEventListener('blur', emptyCheck)
      })
      
      if (document.querySelectorAll('.js-common-file').length) {
        let commonFile = document.querySelectorAll('.js-common-fileinput'),
            commonFileDelete = document.querySelectorAll('.js-common-filedelete')
        
        commonFile.forEach(fileInp => {
          fileInp.addEventListener('change', (e) => {
            let el = fileInp.nextElementSibling,
                path = fileInp.value.split('\\'),
                pathName = path[path.length - 1].split('');
            
            pathName.length >= 30 ? 
              pathName = pathName.slice(0, 28).join('') + '...' :
              pathName = pathName.join('')
            
            el.textContent = pathName;
            el.classList.add('choosed');
          })
        });
        
        commonFileDelete.forEach(fileDelete => {
          fileDelete.addEventListener('click', (e) => {
            let el = fileDelete.previousElementSibling,
                fileInput = fileDelete.previousElementSibling.previousElementSibling;
            el.textContent = el.getAttribute('data-default');
            fileInput.value = '';
            el.classList.remove('choosed');
          })
        });
      }
      
      forms.forEach( form => { 
        form.addEventListener('submit', e => !_th.checkForm(form) && e.preventDefault())
      })
			
			for (let selector of selectors){ 
        let choice = new Choices(selector, {
          searchEnabled: false,
          itemSelectText: '',
          position: 'bottom'
        });
        choicesArr.push(choice);
      }
			
			for (let digitInput of digitsInput){ 
        digitInput.addEventListener('keydown', (e) => {
          let validArr = [46, 8, 9, 27, 13, 110, 190];
          if (validArr.indexOf(e.keyCode) !== -1 ||
            (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
            (e.keyCode == 67 && (e.ctrlKey === true || e.metaKey === true)) ||
            (e.keyCode == 88 && (e.ctrlKey === true || e.metaKey === true)) ||
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            return;
          }
          if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
          }
        });
      }
    },

    checkForm: function (form) {
      let checkResult = true;
      const warningElems = form.querySelectorAll('.warning');
      
      if (warningElems.length)
        warningElems.forEach( warningElem => 
          warningElem.classList.remove('warning')
        )
      
      form.querySelectorAll('input, textarea, select').forEach((elem) => {
        if (elem.getAttribute('data-req')) {
          switch (elem.getAttribute('data-type')) {
            case 'tel':
              var re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
              if (!re.test(elem.value)) {
                elem.classList.add('warning')
                checkResult = false
              }
              break;
            case 'email':
              var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
              if (!re.test(elem.value)) {
                elem.classList.add('warning')
                checkResult = false
              }
              break;
            case 'file':
              if (elem.value.trim() === '') {
                elem.parentNode.classList.add('warning')
                checkResult = false
              }
              break;
            default:
              if (elem.value.trim() === '') {
                elem.classList.add('warning')
                checkResult = false
              }
              break;
          }
        }
      });
      form.querySelectorAll('input[name^=agreement]').forEach((item) => {
				if (!item.checked) {
					item.classList.add('warning')
					checkResult = false
				}
			});
      return checkResult
    }

  }).init()

  window.agroculture.obj = ({

    progressUpdate: (val) => {
      const progressEl = document.querySelector('.js-progress')
      
      progressEl.style.width = val + '%'
    },
    
    indexVertCarousel: () => {
      const headerEl = document.querySelector('.header'),
            bodyEl = document.querySelector('body'),
            carElemCount = document.querySelector('.js-icar .swiper-wrapper').children.length,
            areaOverEl = document.querySelector('.js-area-over'),
            _self = this
      
      let bodyElColor = bodyEl.getAttribute('data-color')
      
      if (window.xs && window.touch) {
        document.querySelector('.js-icar .swiper-no-swiping').classList.remove('swiper-no-swiping')
      }
      
      const mainVertSwiper = new Swiper ('.js-icar', {
        speed: 1500,
        direction: 'vertical',
        slidesPerView: 1,
        spaceBetween: 0,
        mousewheel: {
          releaseOnEdges: true
        },
        allowTouchMove: window.xs && window.touch
      })

      mainVertSwiper.on('slideChangeTransitionStart', function () {
        if (this.activeIndex) {
          headerEl.classList.add('hidden')
          window.agroculture.obj.progressUpdate(Math.floor((this.activeIndex + 1) * 100 / carElemCount))
        } else {
          headerEl.classList.remove('hidden')
          window.agroculture.obj.progressUpdate(0)
        }

        if (areaOverEl && this.activeIndex !== 1) {
          areaOverEl.classList.remove('changed')
        }

        let slideColor = this.slides[this.activeIndex].getAttribute('data-color')
        if (slideColor != bodyElColor) {
          bodyElColor = slideColor
          bodyEl.setAttribute('data-color', slideColor)
        }

      })
    },
    
    indexBannerCarousel: () => {
      const toggleHiddens = document.querySelectorAll('.js-area-toggler'),
            toggleOver = document.querySelector('.js-area-over')
      
      const bannerSwiper = new Swiper ('.js-ibanner', {
        loop: false,
        speed: 800,
        slidesPerView: 1,
        spaceBetween: 0,
        parallax: true,
        navigation: {
          nextEl: '.js-ibanner .swiper-button-next',
          prevEl: '.js-ibanner .swiper-button-prev',
        },
        autoplay: {
          delay: 5000
        }
      })
      
      for (let toggleButton of toggleHiddens) {
        toggleButton.addEventListener('click', () => {
          toggleOver.classList.toggle('changed')
        })
      }
      
    },
    
    indexShowMap: () => {
      const mapButton = document.querySelector('.js-mapshower'),
            mapAreaOver = document.querySelector('.js-slide-mapper')
      
      function init() {
        let multiRoute = new ymaps.multiRouter.MultiRoute({
          referencePoints: [
            [55.727888, 37.564603],
            [54.832774, 38.294106]
          ],
          params: {
            results: 1
          }
        }, {
          boundsAutoApply: false
        })

        const myMap = new ymaps.Map('iroad-map', {
          center: [55.051641, 38.714763],
          zoom: 9,
          controls: ['smallMapDefaultSet']
        })

        myMap.geoObjects.add(multiRoute)
        myMap.behaviors.disable('scrollZoom')
      }
      
      function wantInit() {
        mapButton.addEventListener('click', () => {
          mapAreaOver.classList.toggle('showmap')
          init()
        })
      }
      
      ymaps.ready(wantInit)
    },
    
    contactsMap: () => {
      
      function init() {
        
        const myMap = new ymaps.Map('contacts-map', {
          center: [54.830497, 38.306856],
          zoom: window.innerWidth <= 1000 ? 13 : 15,
          controls: ['smallMapDefaultSet']
        })
        
        let myPlacemark = new ymaps.Placemark([54.828410, 38.289115], {}, {
          preset: 'islands#redIcon',
          iconColor: '#ff3f33'
        })
        
        let myPlacemark2 = new ymaps.Placemark([54.827684, 38.321429], {}, {
          preset: 'islands#redIcon',
          iconColor: '#ff3f33'
        })

        myMap.behaviors.disable('scrollZoom')
        myMap.geoObjects
          .add(myPlacemark)
          .add(myPlacemark2)
      }
      
      ymaps.ready(init)
    },
    
    indexVegetables: () => {
      const vegHrefs = document.querySelectorAll('.js-iveg-href'),
            vegOver = document.querySelector('.iveg__over'),
            backHrefs = document.querySelectorAll('.js-iveg-back')
      
      let step = 0,
          vegBlock, vegEl,
          clientX = 0,
          vegWidth, vegFrames, vegFrameHeight,
          minL = Infinity, maxL = 0,
          startWatcher = false,
          vegStepEnd = false
      
      let vegListener = (event) => {
        if (startWatcher) {
          if (event.offsetX < minL)
            minL = event.offsetX
          if (event.offsetX > maxL)
            maxL = event.offsetX
          
          let percent = Math.floor((maxL - minL) * 200 / vegWidth)
          
          if (percent < 0) percent = 0
          if (percent > 100) {
            percent = 100
            vegStepEnd = true
          }
          
          if (percent > 0 && percent <= 100)
            vegBlock.setAttribute('data-percent', percent)
          
          let newSlide = Math.floor(vegFrames * percent / 100)
          
          vegEl.style.backgroundPositionY = `-${newSlide * vegFrameHeight}px`
        }
      }
      
      let vegToStart = (curSlide) => {
        if (curSlide === 0) return
        curSlide--
        vegEl.style.backgroundPositionY = `-${curSlide * vegFrameHeight}px`
        setTimeout(() => {
          vegToStart(curSlide)
        }, 10)
      }
      
      let watcherSetter = () => {
        startWatcher = true
      }
      
      let interactiveEnd = () => {
        minL = Infinity
        maxL = 0
        if (!vegStepEnd){
          vegToStart(Math.abs(parseInt(getComputedStyle(vegEl)['backgroundPositionY'])) / vegFrameHeight)
        } else {
          step++
          vegBlock.classList.add('step2-starter');
          setTimeout(() => {
            vegBlock.classList.remove('step2-starter');
            vegBlock.classList.add('step2');
          }, 700)
          docListenerRemove()
        }
        vegBlock.removeAttribute('data-percent')
        startWatcher = false
      }
      
      let docListenerRemove = () => {
        ['mousedown', 'touchstart'].forEach(function(e) {
          document.removeEventListener(e, watcherSetter)
        });
          
        ['mouseup', 'touchend'].forEach(function(e) {
          document.removeEventListener(e, interactiveEnd);
        });
        
        ['mousemove', 'touchmove'].forEach(function(e) {
          vegEl.removeEventListener(e, vegListener)
        })
      }
      
      let docListener = () => {
        ['mousemove', 'touchmove'].forEach(function(e) {
          vegEl.addEventListener(e, vegListener)
        });

        ['mousedown', 'touchstart'].forEach(function(e) {
          document.addEventListener(e, watcherSetter)
        });

        ['mouseup', 'touchend'].forEach(function(e) {
          document.addEventListener(e, interactiveEnd);
        })
      }
      
      // && window.touch
      if (!window.xs) {
        for (let vegHref of vegHrefs) {
          vegHref.addEventListener('click', (e) => {
            const hrefType = vegHref.getAttribute('data-type')

            vegBlock = document.querySelector(`.iveg__type[data-type="${hrefType}"]`)

            vegEl = vegBlock.querySelector('.iveg__type-anim')
            vegWidth = vegEl.clientWidth
            vegFrames = vegEl.getAttribute('data-frames')
            vegFrameHeight = vegEl.getAttribute('data-frameheight');

            docListener()

            vegOver.classList.add('hide')
            setTimeout(() => {
              vegOver.classList.add('absolute')
              vegBlock.classList.remove('absolute', 'hide')
              step++
            }, 700)
            e.preventDefault()
          })
        }
      
        for (let backHref of backHrefs) {
          backHref.addEventListener('click', (e) => {
            if (step === 1) {
              vegBlock.classList.add('hide')
              setTimeout(() => {
                vegBlock.classList.add('absolute')
                vegOver.classList.remove('absolute', 'hide');
                docListenerRemove()
                step--
              }, 700)
            }
            if (step === 2) {
              step--
              vegBlock.classList.add('step1-starter');
              setTimeout(() => {
                vegBlock.classList.remove('step1-starter');
                vegBlock.classList.remove('step2');
              }, 700)
              vegToStart(vegFrames)
              docListener()
              vegStepEnd = false
            }
          })
        }
      }
      
    },
    
    catalogCars: () => {
      const catalogCars = document.querySelectorAll('.js-catalog-car'),
            headerEl = document.querySelector('.header'),
            bodyEl = document.querySelector('body'),
            carElemCount = document.querySelector('.js-car .swiper-wrapper').children.length,
            hrefToSlide = document.querySelectorAll('.js-catalog-toslide')
      
      let bodyElColor = bodyEl.getAttribute('data-color')
      
      catalogCars.forEach(item => {
        let parentSlide = item.closest('.swiper-slide'),
            carElemCount = item.querySelector('.swiper-wrapper').children.length
        let bannerSwiper = new Swiper (item, {
          loop: carElemCount > 1 ? true : false,
          speed: 800,
          slidesPerView: 2,
          spaceBetween: 42,
          navigation: {
            nextEl: parentSlide.querySelector('.swiper-button-next'),
            prevEl: parentSlide.querySelector('.swiper-button-prev'),
          },
          breakpoints: {
            960: {
              slidesPerView: 1
            }
          },
          allowTouchMove: window.xs && window.touch
        })
      })
      
      const carVertSwiper = new Swiper ('.js-car', {
        speed: 1500,
        direction: 'vertical',
        slidesPerView: 1,
        spaceBetween: -1,
        mousewheel: {
          releaseOnEdges: true
        },
        allowTouchMove: window.xs && window.touch
      })

      carVertSwiper.on('slideChangeTransitionStart', function () {
        if (this.activeIndex) {
          headerEl.classList.add('hidden')
          window.agroculture.obj.progressUpdate(Math.floor((this.activeIndex + 1) * 100 / carElemCount))
        } else {
          headerEl.classList.remove('hidden')
          window.agroculture.obj.progressUpdate(0)
        }
        
        let slideColor = this.slides[this.activeIndex].getAttribute('data-color')
        if (slideColor != bodyElColor) {
          bodyElColor = slideColor
          bodyEl.setAttribute('data-color', slideColor)
        }
      })
      
      hrefToSlide.forEach(item => {
        item.addEventListener('click', () => {
          let type = item.getAttribute('data-type'),
              slideIndex = $(`.js-car .swiper-slide[data-slide="${type}"]`).index()
          carVertSwiper.slideTo(slideIndex, 1500)
        })
      })
      
    },
    
    catalogVegetables: () => {
      const hrefs = document.querySelectorAll('.js-catalog-toslide'),
            vegs = document.querySelectorAll('.js-catalog-veg');

      for (let href of hrefs) {
        href.addEventListener('mouseover', () => {
          let curType = href.getAttribute('data-type')
          vegs.forEach(item => item.classList.remove('hidden'))
          vegs.forEach(item => {
            if (item.getAttribute('data-type') !== curType) {
              item.classList.add('hidden')
            }
          })
        })
        href.addEventListener('mouseout', () => {
          vegs.forEach(item => item.classList.remove('hidden'))
        })
      }
    },
    
    resizeWatcher: () => {
      const tableSel = document.querySelectorAll('table'),
            scrollArray = [];
      if (tableSel.length){
        tableSel.forEach((item, i) => {
          let orgHtml = item.outerHTML,
              def = 'default';
          
          if (item.getAttribute('class')) def = '';
          
          item.outerHTML = `<div class='table-scroller${i} ${def}'>${orgHtml}</div>`;
          let ps = new PerfectScrollbar(`.table-scroller${i}`, {
            wheelPropagation: true
          });
          scrollArray.push(ps);
        });
        window.addEventListener('resize', () => {
          if (scrollArray.length)
            scrollArray.forEach((item, i) => {
              item.update()
            });
        });
      }
      
    },
    
    aboutCar: () => {
      const personalSwiper = new Swiper ('.js-about-car', {
        loop: true,
        speed: 800,
        slidesPerView: 1,
        spaceBetween: 0,
        navigation: {
          nextEl: '.js-about-car ~ .swiper-buttons .swiper-button-next',
          prevEl: '.js-about-car ~ .swiper-buttons .swiper-button-prev',
        },
        breakpoints: {
          960: {
            autoHeight: true
          }
        }
      })
    },
    
    aboutLines: () => {
      const lines = document.querySelectorAll('.js-about-line'),
            koef = .45
      
      lines.forEach(line => {
        line.setAttribute('data-width', getComputedStyle(line)['background-position'].split('px ')[0])
      })
      
      window.addEventListener('scroll', () => {
        lines.forEach(line => {
          let rect = line.getBoundingClientRect()
          if (
            rect.top >= 0 && 
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
          ) {
            let diff = rect.bottom - (window.innerHeight || document.documentElement.clientHeight)
            
            line.style.backgroundPositionX = +line.getAttribute('data-width') + diff * koef + 'px'
          }
        })
      })
    },
    
    aboutTheatre: () => {
      const tabs = document.querySelectorAll('.js-about-tab'),
            cars = document.querySelectorAll('.about__cars-truck')
      
      for (let tab of tabs) {
        tab.addEventListener('click', (e) => {
          if (tab.classList.contains('active')){
            e.preventDefault()
            return
          }
          
          let curTab = document.querySelector('.js-about-tab.active'),
              curTabYear = curTab.getAttribute('data-year'),
              newTabYear = tab.getAttribute('data-year'),
              curInfoTab = document.querySelector(`.about__cars-infotab[data-year="${curTabYear}"]`),
              newInfoTab = document.querySelector(`.about__cars-infotab[data-year="${newTabYear}"]`)
          
          for (let car of cars) {
            let carYear = car.getAttribute('data-year')
            
            if (+carYear > +newTabYear) {
              window.animation.fadeOut(car, 200)
            } else if (car.offsetParent === null) {
              window.animation.fadeIn(car, 200)
            }
          }
          
          window.animation.fadeOut(curInfoTab, 200, () => {
            window.animation.fadeIn(newInfoTab, 200, () => {}, 'flex')
          })
          
          curTab.classList.remove('active')
          tab.classList.add('active')
          
          e.preventDefault()
        })
      }
    },
    
    init: function () {

      const burgerEl = document.querySelector('.js-burger'),
            html = document.querySelector('html'),
            elemsToCheck = ['.news__grid_page .news__elem-imgover', '.js-scroll-imgover', '.about__steps-elem']
      
      burgerEl.addEventListener('click', (e) => {
        html.classList.toggle('burgeropen')
        if (burgerEl.classList.contains('open')) {
          burgerEl.classList.add('remove')
          setTimeout(() => {
            burgerEl.classList.remove('open', 'remove')
          }, 1000)
        } else {
          burgerEl.classList.add('open')
        }
        e.preventDefault()
      })
      
      if (document.querySelector('.js-icar')) this.indexVertCarousel()
      
      if (document.querySelector('.js-ibanner')) this.indexBannerCarousel()
      
      if (document.querySelector('.js-mapshower')) this.indexShowMap()
      
      if (document.querySelector('.js-iveg-href')) this.indexVegetables()
      
      if (!window.mobile && document.querySelector('.js-catalog-veg')) this.catalogVegetables()
      
      if (document.querySelector('.js-catalog-car')) this.catalogCars()
      
      if (document.querySelector('.js-contacts-map')) this.contactsMap()
      
      if (document.querySelector('.js-about-car')) this.aboutCar()
      
      if (document.querySelector('.js-about-line')) this.aboutLines()
      
      if (document.querySelector('.js-about-tab')) this.aboutTheatre()

      if (document.querySelector('.js-aside-sticky')) {
        const sidebar = new StickySidebar('.js-aside-sticky',{
          containerSelector: '.page__withside',
          innerWrapperSelector: '.page__aside-sticky',
          topSpacing: 20,
          bottomSpacing: 0
        });
      }
      
      if ((document.querySelector('.js-icar') || document.querySelector('.js-car')) && window.touch && window.xsHeight && window.innerHeight < window.innerWidth) {
        document.querySelector('html').classList.add('lock')
			}
      
      window.addEventListener('resize', () => {
        window.xs = window.innerWidth <= 960 ? true : false
        window.mobile = window.innerWidth <= 480 ? true : false
        window.xsHeight = window.innerHeight <= 540 ? true : false
      })
      
			window.addEventListener('orientationchange', () => {
				setTimeout(function(){
					if (document.querySelector('.js-icar') && window.touch && window.xsHeight && window.innerHeight < window.innerWidth) {
						document.querySelector('html').classList.add('lock')
					} else {
						document.querySelector('html').classList.remove('lock')
					}
				}, 500);
			})
      
      window.addEventListener('scroll', () => {
        elemsToCheck.forEach(item => {
          document.querySelectorAll(item).forEach(elem => {
            if (window.animation.visChecker(elem)) {
              elem.classList.add('visible')
            }
          })
        })
      })
      
			//shave(elem, 50); обрезка текста
			
      //$('[data-fancybox]').fancybox(); // fancy init

      this.resizeWatcher()
      
      let eventResize = new Event('resize')
      window.dispatchEvent(eventResize)
      let eventScroll = new Event('scroll')
      window.dispatchEvent(eventScroll)
      
      return this
    }
  });
  
  Pace.on('hide', () => {
    setTimeout(() => {
      window.agroculture.obj.init()
    }, 200)
  })

})();
