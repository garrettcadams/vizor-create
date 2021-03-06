function AccountController(handlebars)
{
	this._handlebars = handlebars || window.Handlebars

	E2.models.user.on('change', this.renderLoginView.bind(this));

	this._bindEvents();
}

AccountController.prototype.renderLoginView = function(user)
{
	var viewTemplate = E2.views.partials.userpulldown;
	var html = viewTemplate({ user: user.toJSON() });
	$('#user-pulldown').replaceWith(html);

	this._bindEvents($('#user-pulldown'));
}

AccountController.prototype._bindEvents = function(el)
{
	var that = this;

	$('a.login', el).on('click', function(evt)
	{
		evt.preventDefault();
		that.openLoginModal();
	});

	$('a.signup', el).on('click', function(evt)
	{
		evt.preventDefault();
		that.openSignupModal();
	});
}

AccountController.prototype.openLoginModal = function()
{
	var self = this;

	var loginTemplate = E2.views.account.login;
	var bb = bootbox.dialog(
	{
		message: loginTemplate()
	});

	this._bindEvents(bb);

	var formEl = $('#login-form_id');
	formEl.submit(function( event )
	{
		event.preventDefault();

		var formData = formEl.serialize();

		$.ajax(
		{
			type: "POST",
			url: formEl.attr('action'),
			data: formData,
			error: function(err)
			{
				console.log(err);
				bootbox.alert('Login failed!');
			},
			success: function(user)
			{
				console.log('Logged in as ' + user.username);
				E2.models.user.set(user);
				bb.modal('hide');
			},
			dataType: 'json'
		});
	});
}

AccountController.prototype.openSignupModal = function()
{
	var self = this;

	var signupTemplate = E2.views.account.signup;
	var bb = bootbox.dialog(
	{
		message: signupTemplate(),
		//title: "loginDialog"
		//onEscape: function() {  }
	});

	var formEl = $('#signup-form_id');
	formEl.submit(function( event )
	{
		event.preventDefault();

		var formData = formEl.serialize();

		$.ajax(
		{
			type: "POST",
			url: formEl.attr('action'),
			data: formData,
			error: function(err, msg)
			{
				console.log(err);
				bootbox.alert('Signup failed: ' + err.responseJSON.msg);
			},
			success: function(user)
			{
				console.log('Signed up as ' + user.username);
				E2.models.user.set(user);
				bootbox.hideAll();
			},
			dataType: 'json'
		});
	});
}

if (typeof(exports) !== 'undefined')
	exports.AccountController = AccountController;
