define(["jquery", "ko", "bootstrap", "SidekickCommon/AddClassLookupMonad"], function ($, ko, bootstrap, addClassLookupMonad) {
	var addStyleClass = addClassLookupMonad ({
		"btn-primary":	"btn-primary",
		"primary":		"btn-primary",
		"btn-info":		"btn-info",
		"info":			"btn-info",
		"btn-success":	"btn-success",
		"success":		"btn-success",
		"btn-warning":	"btn-warning",
		"warning":		"btn-warning",
		"btn-danger":	"btn-danger",
		"danger":		"btn-danger",
		"btn-inverse":	"btn-inverse",
		"inverse":		"btn-inverse",
		"btn-link":		"btn-link",
		"link":			"btn-link"
	});
	
	var addSizeClass = addClassLookupMonad ({
		"btn-large":	"btn-large",
		"large": 		"btn-large",
		
		"btn-small":	"btn-small",
		"small":		"btn-small",
		
		"btn-mini":		"btn-mini",
		"mini":			"btn-mini"
	});
	
	var createMenuItem = function(item) {
		var li = $("<li/>");
		
		if (typeof item.separator !== "undefined" && item.separator) {
			li.addClass("divider");
		} else if (typeof item.items !== "undefined") {
			li.addClass("dropdown-submenu");
			var a = $("<a href=\"#\" tabindex=\"-1\" />")
				.text(item.label)
				.appendTo(li);
			
			createDropdownMenu(item.items).appendTo(li);
		} else {
			if (typeof item.disabled !== "undefined" && item.disabled) {
				li.addClass("disabled");
			}
			
			var a = $("<a href=\"#\" tabindex=\"-1\" />")
				.text(item.label)
				.appendTo(li);
			if (typeof item.href !== "undefined") {
				a.attr("href", item.href);
			} else if (typeof item.callback === "function") {
				a.click(function () {
					item.callback(item);
				});
			}
		}
		
		return li;
	};
	
	var createDropdownMenu = function (items, submenu) {
		var ul = $("<ul/>")
			.addClass("dropdown-menu")
			.attr("role", "menu")
			.attr("aria-labelledby", "dLabel");
	
		for (var idx = 0; idx < items.length; idx += 1) {
			ul.append(createMenuItem(items[idx]));
		}
		
		return ul;
	};
	
	ko.bindingHandlers.dropdown = {
		init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
			$(element).addClass("dropdown");
		},
		update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
			var elem = $(element);
			elem.empty();
			
			var dropdown = valueAccessor();
			var dropdownLabel = ko.utils.unwrapObservable(dropdown.label);
			var dropdownItems = ko.utils.unwrapObservable(dropdown.items);
			
			elem.append($("<a href=\"#\" class=\"dropdown-toggle\" id=\"dLabel\" role=\"button\" data-toggle=\"dropdown\" />")
					.text(dropdownLabel + " ")
					.append("<b class=\"caret\"></b>")
			);
			
			createDropdownMenu(dropdownItems).appendTo(elem);
		}
	};
	
	ko.bindingHandlers.buttonDropdown = {
		init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
			var options = ko.utils.unwrapObservable(valueAccessor().options);
			if (options && typeof options.dropup !== "undefined" && ko.utils.unwrapObservable(options.dropup)) {
				$(element).addClass("dropup");
			} else {
				$(element).addClass("dropdown");
			}
			
		},
		update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
			var elem = $(element);
			elem.empty();
			
			var dropdown = valueAccessor();
			var dropdownLabel	= ko.utils.unwrapObservable(dropdown.label);
			var dropdownItems	= ko.utils.unwrapObservable(dropdown.items);
			var dropdownOptions	= ko.utils.unwrapObservable(dropdown.options);
			
			var actionBtn = $("<a href=\"#\" class=\"btn dropdown-toggle\" id=\"dLabel\" role=\"button\" data-toggle=\"dropdown\" />")
				.text(dropdownLabel + " ")
				.append("<b class=\"caret\"></b>");
			
			elem.append(actionBtn);
			
			addStyleClass(actionBtn)(dropdownOptions.style);
			addSizeClass(actionBtn)(dropdownOptions.size);
			
			createDropdownMenu(dropdownItems).appendTo(elem);
		}
	};
});