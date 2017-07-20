$(function () {
  $('#submit').on('click',function (e) {
    // e.preventDefault();
    const action = $(this).attr('action');
    const name = $('#name').val();
    const _csrf = $('#csrf').val();
    // console.log(_csrf);
    const email = $('#email').val();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('_csrf', _csrf);
    formData.append('email', email);
    formData.append('photo', $('#photo')[0].files[0]);
    $.ajax({
      type: 'post',
      url: '/process',
      data: formData,
      processData : false,
      contentType : false,
    }).done(res => {
      console.log(res);
    }).fail(err => {
      console.log(err);
    })
  });
});