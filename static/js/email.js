const serivceID = "service_irmiak4";
const templateID = "template_3uzwyg6";
const userID = "user_IZexurD0xkQkoR2UK3flk";

$(document).ready(function() {
  var data = {
    service_id: serivceID,
    template_id: templateID,
    user_id: userID,
    template_params: {
      'from_name': "",
      'from_email': "",
      'contact_reason': "",
      'message': ""
    }
  };
  
  $("#contactForm").on("change", function() {
    data.template_params.from_name = $("#fname").val() + " " + $("#lname").val();
    data.template_params.from_email = $("#email").val();
    data.template_params.contact_reason = $("#reason").val();
    data.template_params.message = $("#message").val();
  });

  $("#contactForm").submit(function(event) {
    $.ajax('https://api.emailjs.com/api/v1.0/email/send', {
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json'
    }).done(function() {
      $("#success-msg").removeClass("d-none").delay(2000).fadeOut();
      $("#contactForm").trigger("reset");
    }).fail(function(error) {
      alert(JSON.stringify(error));
      $("#contactForm").trigger("reset");
    });
    event.preventDefault();
  });
});
