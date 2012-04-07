---
layout: default
title: "Wage intergalactic war on your Titanium Mobile apps with TiFighter"
published: true
categories:
short_description: |
  <p>
    Over the last 10 months, I've had the opportunity to work with Titanium
    Mobile for a few different projects. I was immediately drawn to Titanium
    because projects are written in JavaScript (which I know) as opposed to
    Objective C or Java (which I don't know). JavaScript is all well and good,
    but I still found myself missing things from jQuery, like
    <code>$.each</code>, <code>$.map</code> and friends.
  </p>
---

Over the last 10 months, I've had the opportunity to work with Titanium
Mobile for a few different projects. I was immediately drawn to Titanium
because projects are written in JavaScript (which I know) as opposed to
Objective C or Java (which I don't know). JavaScript is all well and good,
but I still found myself missing things from jQuery, like `$.each`, `$.map`
and friends.

While writing my first app, I found myself slowly adding helpers I needed. I
created [this extraction](https://github.com/itspriddle/titanium_mobile-helpers)
and added bits and pieces to it over a few more projects.

When I started work on DotBlock mobile, there was one last jQuery pattern I
really wanted to use in Titanium, `$(el).fn`. Stuff like
`$(el).attr('height')`. So, I set out to create something that worked
similarly with Titanium objects.

Thus was born [TiFighter](https://github.com/itspriddle/ti-fighter). Here's
the login window right from DotBlock mobile (with a few extra comments added),
which shows some of TiFighter's usage (note that I've aliased `$` to
`TiFighter` outside of this script):

{% highlight javascript %}
/**
 * DotBlock Mobile
 *
 * @package     DotBlock
 * @author      Joshua Priddle <jpriddle@nevercraft.net>
 * @copyright   Copyright (c) 2011, DotBlock, Inc
 * @version     1.0
 * @url         http://www.dotblock.com/
 */

Ti.include('../includes/dotblock.js');

// Set specific margins for Android or iPhone
var margin_top = $.android() ? 30 : 15;

var username = Ti.UI.createTextField({
  autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
  width:              300,
  height:             $.android() ? 80 : 40,  // We need a different height for android
  top:                $.android() ? 100 : 80, // We need a different top for android
  borderStyle:        Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
  hintText:           'Email',
  returnKeyType:      Ti.UI.RETURNKEY_NEXT,
  keyboardType:       Ti.UI.KEYBOARD_EMAIL
});

var password = Ti.UI.createTextField({
  autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
  width:              $(username).attr('width'),  // Make password the same width as username
  height:             $(username).attr('height'), // Make password the same height as username
  top:                $(username).attr('top') + $(username).attr('height') + margin_top, // Push password down under username
  borderStyle:        Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
  passwordMask:       true,
  hintText:           'Password',
  returnKeyType:      Ti.UI.RETURNKEY_DONE
});

var login_button = Ti.UI.createButton({
  title:           'Login',
  top:             $(password).attr('top') + $(password).attr('height') + margin_top,
  height:          $(username).attr('height'),
  width:           $(username).attr('width'),
  font:            { fontSize: 16, fontWeight: 'bold' },
  backgroundColor: '#ffffff',
  borderRadius:    8,
  color:           '#000000'
});

// Add an event listener 'toggle-disabled' to login_button
// This is a wrapper for login_button.addEventListener
$(login_button).bind('toggle-disabled', function() {
  if ( ! login_button.disabled) {
    login_button.disabled = true;
    login_button.title = "Please wait...";
  } else {
    login_button.disabled = false;
    login_button.title = "Login";
  }
});


// Add a click event to login button
// This is the same as login_button.addEventListener('click')
$(login_button).click(function() {
  password.focus(); // keep focused on password so the kb doesnt disappear
  var login = { username: username.value, password: password.value };
  if (login.username == "" || login.password == "") {
    $.alert("Please enter your email and password to continue.");
    return;
  }
  if ( ! login_button.disabled) {
    // Fire login_button's toggle-disabled event,
    // this is the same as login_button.fireEvent('toggle-disabled')
    $(login_button).trigger('toggle-disabled');
    DotBlock.authenticate({
      username: login.username,
      password: login.password,
      onload: function() {
        var response = JSON.parse(this.responseText);
        if (response.status == 200) {
          DotBlock.saveCredentials(login);
          current_window.close();
          $(Ti.App).trigger('init-app');
        } else {
          $(login_button).trigger('toggle-disabled');
          $.alert("Invalid email/password, please try again!");
        }
      },
      onerror: function(e) {
        $(login_button).trigger('toggle-disabled');
        $.alert("Invalid email/password, please try again!");
      }
    });
  }
});

// Bind the return event for username
// This is fired when the user hits "Next"
// on the keyboard while username is focused
$(username).bind('return', function() {
  password.focus(); // focus the password field
});

// Bind the return event for username
// This is fired when the user hits "Done"
// on the keyboard while password is focused
$(password).bind('return', function() {
  $(login_button).click(); // Click the login button for them
  password.focus(); // hack: focus on the password again so the keyboard doesnt disappear
});

// Add elements to the window
current_window.add(username);
current_window.add(password);
current_window.add(login_button);

username.focus(); // Autofocus on the username field when the window opens
{% endhighlight %}

TiFighter has been an awesome time saver while working on DotBlock Mobile,
and I'm sure it will prove useful in my Titanium apps as well. I hope it
is useful to other developers as well.
