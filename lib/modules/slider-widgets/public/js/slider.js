(function () {
    $(document).ready(function () {
        
        console.log ($('.slider').length);
        
        if ($('.slider').length) {
            
            /*var height = 0;
            
            $('.slide-item').each(function () {
                height = Math.max(height, $(this).height());
            });
            
            $('.slider').css({height: height});*/
            
            $('.slider').each(function () {
                
                var $slides = $(this).find('li.slide-item');
                
                console.log ($slides.length);
                
                if ($slides.length < 2) {
                    $(this).find('.button').hide();
                } else {/*
                    $(this).find('li.slide-item:not(:first)').hide();
                    $(this).find('li.slide-item:first').show();*/
                    $(this).find('.button-left').on('click', goToPreviousSlide);
                    $(this).find('.button-right').on('click', goToNextSlide);
                    console.log ($(this).find('.button-right'));
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
                
                console.log (this, e);
            }
            
        }
        
    });
})();