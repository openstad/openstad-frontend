(function () {
    $(document).ready(function () {
        
        if ($('.slider').length) {
            
            $('.slider').each(function () {

                var $ul = $(this).find('.slide-items');

                var afterFirst = $ul.find('li:not(:first)');
                
                afterFirst.hide();
                
                var $slides = $(this).find('li.slide-item');
                
                if ($slides.length < 2) {
                    $(this).find('.button').hide();
                } else {/*
                    $(this).find('li.slide-item:not(:first)').hide();
                    $(this).find('li.slide-item:first').show();*/
                    $(this).find('.button-left').on('click', goToPreviousSlide);
                    $(this).find('.button-right').on('click', goToNextSlide);
                }
                
            });
            
            function goToPreviousSlide () {
                var $ul = $(this).closest('.slide-items');
                
                var $currLi = $ul.find('li:visible');
                $currLi.hide();
                
                var $prevLi = $currLi.prev('li');
                
                if ($prevLi.length) {
                    $prevLi.show();
                } else {
                    $ul.find('li:last').show();
                }
            }
            
            function goToNextSlide () {
                var $ul = $(this).closest('.slide-items');
                
                var $currLi = $ul.find('li:visible');
                $currLi.hide();
                
                var $nextLi = $currLi.next('li');
                
                if ($nextLi.length) {
                    $nextLi.show();
                } else {
                    $ul.find('li:first').show();
                }

            }
            
        }
        
    });
})();