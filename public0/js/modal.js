$(document).ready(function() {
  // Get the modal
  const modal = $('#myModal');
  const modalContent = $('div.model-content');

  // Get the button that opens the modal
  const btn = $('#myBtn');

  // Get the <span> element that closes the modal
  const span = $('.close')[0];

  // When the user clicks any of the following, open the modal
  $('#nav-registerlogin').on('click', function() {
    modal.css({
      display: 'block',
      transition: '3s ease-in'
    });
  });

  $('#nav-login').on('click', function() {
    modal.css({ display: 'block' });
  });

  $('#header-register-button').on('click', function() {
    modal.css({ display: 'block' });
  });
  $('#header-login-button').on('click', function() {
    modal.css({ display: 'block' });
  });

  // When the user clicks on <span> (x), close the modal
  $('span').on('click', function() {
    modal.css({ display: 'none' });
  });

  // When the user clicks anywhere outside of the modal, close it
  // currently not working, using a js script on index.html
  // $(window).on('click', function(event) {
  //   if (event.target !== modalContent) {
  //     console.log(event.target + 'modal:' + modal + 'closing');
  //     // modal.css({ display: 'none' });
  //   } else {
  //     console.log(event.target, modal);
  //   }
  // });
});
