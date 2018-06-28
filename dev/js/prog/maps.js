window.map = {}

window.map.object = ({

  regionalsMap: function(sel){
    const dataLat = parseFloat(sel.getAttribute('data-lat')),
          dataLng = parseFloat(sel.getAttribute('data-lng')),
          dataZoom = parseInt(sel.getAttribute('data-zoom')),
          dataArr = JSON.parse(sel.getAttribute('data-pins')),
          info = document.querySelector('.contacts__regionals-info'),
          title = document.querySelector('.js-reg-name'),
          addr = document.querySelector('.js-reg-addr'),
          phone = document.querySelector('.js-reg-phone'),
          mail = document.querySelector('.js-reg-mail');

    const regMap = new ymaps.Map(sel, {
      center: [dataLat, dataLng],
      zoom: dataZoom,
      controls: [],
      scroll: false
    });
       
    let myCollection = new ymaps.GeoObjectCollection();
    
    dataArr.forEach((item, i) => {
      let lat = parseFloat(item.lat),
          lng = parseFloat(item.lng);
      
      let placemark = new ymaps.Placemark([lat, lng], {}, {
          iconLayout: 'default#image',
          iconImageHref: 'static/i/pin.png',
          iconImageSize: [19, 23],
          iconImageOffset: [-3, -23]
      });
      
      let placeMarkEvent = function(x) {
        placemark.events.add('click', (e) => {
          myCollection.each( item => {
            item.options.set({
              iconImageHref: 'static/i/pin.png',
              iconImageSize: [19, 23],
              iconImageOffset: [-3, -23]
            });
          });

          e.get('target').options.set({
            iconImageHref: 'static/i/pin_clicked.png',
            iconImageSize: [33, 40],
            iconImageOffset: [-11, -40]
          });
          
          info.classList.remove('hidden');
          
          title.innerHTML = x.name;
          addr.innerHTML = x.addr;
          phone.innerHTML = x.phone;
          mail.innerHTML = x.mail;
        });
      }(item.data);
      
      myCollection.add(placemark);
    })
    
    regMap.geoObjects.add(myCollection);
    
  },
  
  geographyMap: function(sel){
    const dataLat = parseFloat(sel.getAttribute('data-lat')),
          dataLng = parseFloat(sel.getAttribute('data-lng')),
          dataZoom = parseInt(sel.getAttribute('data-zoom')),
          dataArr = JSON.parse(sel.getAttribute('data-pins')),
          masSwappers = document.querySelectorAll('.contacts__mapswapper-href'),
          mapSwapperDefault = document.querySelector('.contacts__mapswapper-href.active').getAttribute('data-map');

    const geoMap = new ymaps.Map(sel, {
      center: [dataLat, dataLng],
      zoom: dataZoom,
      controls: [],
      scroll: false
    });
    
    let myCollection = new ymaps.GeoObjectCollection();
    
    let clearCollection = () => myCollection.removeAll();
    
    let addCollection = city => {
      clearCollection();
      dataArr[0][city].forEach((item, i) => {
        let lat = parseFloat(item.lat),
            lng = parseFloat(item.lng);

        let placemark = new ymaps.Placemark([lat, lng], {}, {
            iconLayout: 'default#image',
            iconImageHref: 'static/i/pin.png',
            iconImageSize: [19, 23],
            iconImageOffset: [-3, -23]
        });

        myCollection.add(placemark);
      })

      geoMap.geoObjects.add(myCollection);
    }
    
    addCollection(mapSwapperDefault);
    
    masSwappers.forEach(item => {
      item.addEventListener('click', (e) => {
        if (!item.classList.contains('active')){
          masSwappers.forEach(item => item.classList.remove('active'));
          item.classList.add('active');
          addCollection(item.getAttribute('data-map'));
        } 
        e.preventDefault();
        e.stopPropagation();
      });
    })
  },
  
  init: function(){
    let regionals = document.querySelectorAll('.contacts__regionals'),
        geography = document.querySelectorAll('.contacts__geography');

    if (regionals.length) this.regionalsMap(regionals[0]);
    if (geography.length) this.geographyMap(geography[0]);

    return this;
  }

});

ymaps.ready(function(){
  window.map.object.init();
});
  
