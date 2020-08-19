apos.define('counter-widgets', {
  extend: 'openstad-widgets',
  construct: function(self, options) {
    self.play = function($widget, data, options) {

      self.setNumberPlates(data.count || 0, $widget.find('.counter'));

      if(data.statsUrl) {
        self.fetchStats(data.statsUrl);
      }
    };

    self.setNumberPlates = function(count, el) {
      var len = count.toString().length;
      if (len < 3) len = 3;
      count = ('000' + count).slice(-len);
      var html = '<span class="margin-right-s">';
      for (i=0; i<len; i++) {
        html += '<span id="counter-number-plate-'+i+'" class="number-plate">'+count[i]+'</span>'
      }
      html += '</span>';
      el.innerHTML = html;
    };

    self.fetchStats = function(statsUrl) {
      var url = statsUrl;
      $.ajax({
        url: url,
        dataType: "json",
        crossDomain: true,
        beforeSend: function(request) {
          request.setRequestHeader("Accept", "application/json");
        },
        success: function(result) {
          let count = result.count;
          if ( count == -1 ) count = 0;
          self.setNumberPlates(count);
        },
        error: function(error) {
          console.log('Niet goed');
          console.log(err);
        }
      });
    }
  }
});
