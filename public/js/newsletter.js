$(function () {
  $('.form-horizontal').on('click',function (e) {
    e.preventDefault();
    const action = $(this).attr('action');
    const name = $('#name').val();
    const _csrf = $('#csrf').val();
    const email = $('#email').val();
    $.ajax({
      type: 'post',
      url: action,
      data: {name, email, _csrf}
    }).done(res => {
      console.log(res);
    }).fail(err => {
      console.log(err);
    })
  });
});