'use strict';

window.map = {};

window.map.object = {

  regionalsMap: function regionalsMap(sel) {
    var dataLat = parseFloat(sel.getAttribute('data-lat')),
        dataLng = parseFloat(sel.getAttribute('data-lng')),
        dataZoom = parseInt(sel.getAttribute('data-zoom')),
        dataArr = JSON.parse(sel.getAttribute('data-pins')),
        info = document.querySelector('.contacts__regionals-info'),
        title = document.querySelector('.js-reg-name'),
        addr = document.querySelector('.js-reg-addr'),
        phone = document.querySelector('.js-reg-phone'),
        mail = document.querySelector('.js-reg-mail');

    var regMap = new ymaps.Map(sel, {
      center: [dataLat, dataLng],
      zoom: dataZoom,
      controls: [],
      scroll: false
    });

    var myCollection = new ymaps.GeoObjectCollection();

    dataArr.forEach(function (item, i) {
      var lat = parseFloat(item.lat),
          lng = parseFloat(item.lng);

      var placemark = new ymaps.Placemark([lat, lng], {}, {
        iconLayout: 'default#image',
        iconImageHref: 'static/i/pin.png',
        iconImageSize: [19, 23],
        iconImageOffset: [-3, -23]
      });

      var placeMarkEvent = function (x) {
        placemark.events.add('click', function (e) {
          myCollection.each(function (item) {
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
    });

    regMap.geoObjects.add(myCollection);
  },

  geographyMap: function geographyMap(sel) {
    var dataLat = parseFloat(sel.getAttribute('data-lat')),
        dataLng = parseFloat(sel.getAttribute('data-lng')),
        dataZoom = parseInt(sel.getAttribute('data-zoom')),
        dataArr = JSON.parse(sel.getAttribute('data-pins')),
        masSwappers = document.querySelectorAll('.contacts__mapswapper-href'),
        mapSwapperDefault = document.querySelector('.contacts__mapswapper-href.active').getAttribute('data-map');

    var geoMap = new ymaps.Map(sel, {
      center: [dataLat, dataLng],
      zoom: dataZoom,
      controls: [],
      scroll: false
    });

    var myCollection = new ymaps.GeoObjectCollection();

    var clearCollection = function clearCollection() {
      return myCollection.removeAll();
    };

    var addCollection = function addCollection(city) {
      clearCollection();
      dataArr[0][city].forEach(function (item, i) {
        var lat = parseFloat(item.lat),
            lng = parseFloat(item.lng);

        var placemark = new ymaps.Placemark([lat, lng], {}, {
          iconLayout: 'default#image',
          iconImageHref: 'static/i/pin.png',
          iconImageSize: [19, 23],
          iconImageOffset: [-3, -23]
        });

        myCollection.add(placemark);
      });

      geoMap.geoObjects.add(myCollection);
    };

    addCollection(mapSwapperDefault);

    masSwappers.forEach(function (item) {
      item.addEventListener('click', function (e) {
        if (!item.classList.contains('active')) {
          masSwappers.forEach(function (item) {
            return item.classList.remove('active');
          });
          item.classList.add('active');
          addCollection(item.getAttribute('data-map'));
        }
        e.preventDefault();
        e.stopPropagation();
      });
    });
  },

  init: function init() {
    var regionals = document.querySelectorAll('.contacts__regionals'),
        geography = document.querySelectorAll('.contacts__geography');

    if (regionals.length) this.regionalsMap(regionals[0]);
    if (geography.length) this.geographyMap(geography[0]);

    return this;
  }

};

ymaps.ready(function () {
  window.map.object.init();
});