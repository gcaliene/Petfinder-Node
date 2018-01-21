$(document).ready(function() {
  // Get the modal
  const modal = $('#myModal');
  const modalContent = $('div.model-content');

  // Get the button that opens the modal
  const btn = $('#myBtn');

  // Get the <span> element that closes the modal
  const span = $('.close')[0];

  // When the user clicks the button, open the modal
  $('#myBtn').on('click', function() {
    modal.css({ display: 'block' });
  });

  // When the user clicks on <span> (x), close the modal
  $('span').on('click', function() {
    modal.css({ display: 'none' });
  });

  // When the user clicks anywhere outside of the modal, close it
  // currently not working
  // $(window).on('click', function(event) {
  //   if (event.target !== modalContent) {
  //     console.log(event.target + 'modal:' + modal + 'closing');
  //     // modal.css({ display: 'none' });
  //   } else {
  //     console.log(event.target, modal);
  //   }
  // });
});
