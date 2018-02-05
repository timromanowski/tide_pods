const formatUrl = (location) => `https://www.tide-forecast.com/locations/${location}/tides/latest`;
let cheerio = require("cheerio");
let axios = require('axios');
var TideEvent = require( '../data/TideEvent')
class Builder {
    
  constructor(){}
  get(location) {
    let fullUrl = formatUrl(location.url);
    return new Promise((resolve, reject) => {
      axios.get(fullUrl).then(
        (response) => {
          var tideData = [];
          var $ = cheerio.load(response.data);
          var table = $('.tide-events table' );
          var dates = $('.tide-events table td.date');
          var rowsInTable = $('.tide-events table tr');

          console.log( "Rows in table " + rowsInTable.length);

          dates.each(function(index, element){
            var date = $(this).text();
            var nextDateTd = dates.eq(index + 1);
            var myDateRowIndex = $(this).parent().index(); //table.index($(this).parent());
            var nextDateRowIndex = ( nextDateTd.parent().index() >= 0 ) ? nextDateTd.parent().index() : rowsInTable.length;
            var rowsForDate = rowsInTable.slice(myDateRowIndex, nextDateRowIndex);
            
            var sunrise = -1;
            var sunset = -1;
            
            rowsForDate.each(function(index, element){
                var time = $(this).children( 'td.time').text()
                var height = $(this).children( 'td.level').children('span').text();
                var type = $(this).children().last().text();
                if( type === 'Sunset'){
                    sunset = index;
                } else if( type === 'Sunrise') {
                    sunrise = index;
                } else if( type === 'Low Tide' && (sunrise > 0 && index > sunrise) && (sunset < 0)) {
                    let t = new TideEvent(date, time, height, type)
                    tideData.push(t)
                }
                
            });
          });
          resolve( {sourceUrl: fullUrl, tideData: tideData} );
        },
        (error) => {reject()}
      )
    });
  }
}

module.exports = Builder;