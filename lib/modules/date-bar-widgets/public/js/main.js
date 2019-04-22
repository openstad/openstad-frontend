$(document).ready(function () {
  var $dateBar;
  var endDate;
  var endDateText;
  var daysLeft1;
  var value000;
  var value00;
  var value0;
  console.log('bbb')

  $('.date-bar').each(function() {
      console.log('aaaa')
      $dateBar = $(this);
      endDate = new Date($dateBar.attr('data-date'));

      daysLeft1 = parseInt( ( endDate.getTime() - Date.now() ) / ( 24 * 60 * 60 * 1000) ) + 1;


      if ( daysLeft1 > 0 ) {
        endDateText = $dateBar.attr('data-before-date');

       $dateBar.find('.end-date-bar-start-text-1').html(endDateText);
       $dateBar.find('.end-date-bar-end-text-1').html('dagen');

       //format the day count
       value000 = parseInt(daysLeft1/100) || 0;
       value00  = parseInt(daysLeft1/10) - value000;
       value0   = daysLeft1 - value000 * 100 - value00 * 10;
       $dateBar.find('.end-date-number-plate-00-1').html(value00);
       $dateBar.find('.end-date-number-plate-0-1').html(value0);
      } else {
        endDateText = $dateBar.attr('data-after-date');

       $dateBar.find('.end-date-bar-start-text-1').html( endDateText);
       $dateBar.find('.end-date-bar-end-text-1').html('dagen');
       $dateBar.find('.end-date-number-plate-00-1').html(0);
       $dateBar.find('.end-date-number-plate-0-1').html(0);
      }


  })
});
