function submitSignUpForm(formElementId, emailElementId, passwordElementId, errorMessagesElementId, successMessagesElementId, additionalSuccessMessage) {
   var messages = new com.cattfish.Messages();
   var form = $("#" + formElementId);
   var errorMessagesElement = $("#" + errorMessagesElementId);
   var successMessagesElement = $("#" + successMessagesElementId);
   errorMessagesElement.empty().hide();
   successMessagesElement.empty().hide();

   var emailElement = $("#" + emailElementId);
   var passwordElement = $("#" + passwordElementId);
   var email = emailElement.val().trim();
   var password = passwordElement.val();

   var user = {
      email : email,
      password : password
   };

   // perform simple validation
   if (user.password.length <= 0) {
      messages.add("Password is required.");
      passwordElement.focus();
   }
   if (user.email.length <= 0) {
      messages.add("Email address is required.");
      emailElement.focus();
   }

   additionalSuccessMessage = additionalSuccessMessage || "";

   if (messages.isEmpty()) {
      setFormEnabled(form, false);
      superagent
            .post("/api/v1/users")
            .send(user)
            .end(function(err, res) {
                    setFormEnabled(form, true);
                    if (res.status == 201) {
                       form.hide();
                       messages.add('Welcome! We have sent you email with instructions to activate your account. ' + additionalSuccessMessage);
                       messages.render(successMessagesElement);
                    }
                    else {
                       if (res.status == 409) {
                          messages.add("Sorry, a user with that email address already exists.");
                          emailElement.focus();
                       }
                       else if (res.status == 422) {
                          if (res.body.data && res.body.data.length > 0) {
                             var emailErrors = [];
                             var passwordErrors = [];
                             res.body.data.forEach(function(item) {
                                var field = item.instanceContext;
                                var constraintName = item.constraintName;
                                if (field == '#/email') {
                                   if (constraintName == 'minLength') {
                                      emailErrors.push("The email address must be at least " + item.constraintValue + " characters.");
                                   }
                                   if (constraintName == 'format') {
                                      emailErrors.push("The email address must be a valid email address.");
                                   }
                                }
                                else if (field == '#/password') {
                                   if (constraintName == 'minLength') {
                                      passwordErrors.push("The password must be at least " + item.constraintValue + " characters.");
                                   }
                                }
                             });
                             emailErrors.map(messages.add);
                             passwordErrors.map(messages.add);
                             if (passwordErrors.length > 0) {
                                passwordElement.focus();
                             }
                             if (emailErrors.length > 0) {
                                emailElement.focus();
                             }
                          }
                       }
                       else {
                          messages.add("Sorry, an unexpected error occurred while trying create your account.  Please contact us for help.");
                       }
                       messages.render(errorMessagesElement);
                    }
                 });
   }
   else {
      messages.render(errorMessagesElement);
   }

   return false;
}
