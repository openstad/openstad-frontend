jQuery( document ).ready(function( $ ) {
  initTurnOffEditModeOnAddClick();
  initImagesOnHover();
});

function initTurnOffEditModeOnAddClick () {
  $('.add-button').click(function () {
    if ($('#budgeting-edit-mode').prop('checked')) {
      $('#budgeting-edit-mode').trigger('click');
    }
  });
}

function initImagesOnHover () {
  $('#budget-block').on('mouseover', '.idea-image-mask', function () {
    $('#budget-block .idea-image-mask').addClass('greyed-out');
    $('#budget-block .idea-' + $(this).attr('data-idea-id')).removeClass('greyed-out').addClass('active');
    $('#budget-block .idea-' + $(this).attr('data-idea-id')).not(this).addClass('not-target');
  });

  $('#budget-block').on('mouseout', '.idea-image-mask', function () {
    $('#budget-block .idea-' + $(this).attr('data-idea-id')).removeClass('active not-target');
    $('#budget-block .idea-image-mask.greyed-out').removeClass('greyed-out');
  });

}
