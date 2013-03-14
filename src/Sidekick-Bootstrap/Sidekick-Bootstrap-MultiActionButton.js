define(["jquery", "ko", "bootstrap", "addClassMonad"], function ($, ko, bootstrap, addClassLookupMonad) {
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
	
	
	ko.bindingHandlers.multiActionButton = {
		init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
			var elem = $(element);
			elem.addClass("btn-group");
		},
		update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
			var values = valueAccessor();
			var items = ko.utils.unwrapObservable(values.items);
			var activeItem = ko.observable(null);
			
			if (typeof values.activeItem === "undefined") {
				activeItem = values.activeItem = ko.observable(items[0]);
			} else {
				if(ko.isObservable(values.activeItem)){
					var tempActItem = values.activeItem();
					if(typeof tempActItem === "undefined" || tempActItem === null){
						values.activeItem(items[0]);
						activeItem(values.activeItem());
					} else {
						activeItem(tempActItem);
					}
				} else {
					activeItem = values.activeItem;
				}
			}
			
			var activeItem = ko.utils.unwrapObservable(activeItem);

			
			
			var elem = $(element);
			elem.empty();
			
			
			var actionBtn = $("<button class=\"btn\" />");
			
			addStyleClass(actionBtn)(values.style);
			addSizeClass(actionBtn)(valueAccessor.size);
			
			actionBtn.text(activeItem.label);
			actionBtn.click(function () {
				if (typeof values.callback === "function") {
					values.callback(activeItem);
				}
			});
			
			var caretBtn = $("<button class=\"btn dropdown-toggle\" data-toggle=\"dropdown\" />")
				.append($("<span class=\"caret\"></span>"));
			
			addStyleClass(caretBtn)(values.style);
			addSizeClass(caretBtn)(values.size);
			
			caretBtn.dropdown();
			
			var dropdownUl = $("<ul class=\"dropdown-menu\" role=\"menu\" />");
			
			function addItemsToDropdown() {		
				actionBtn.text(activeItem.label);
				for (var idx = 0; idx < items.length; idx += 1) {
					var act = items[idx];
					var li = $("<li class=\"presentation\" />").appendTo(dropdownUl);
					
					var link = $("<a href=\"#\" />");		
					link.append(act.label);
					if (activeItem === act) {
						link.append ($("<i class=\"icon-ok pull-right\"></i>"));
					}
					link.appendTo(li);
					link.click((function(item) {
						return function () {
							if(ko.isWriteableObservable(values.activeItem)) {
								values.activeItem(item);
							} else {
								values.activeItem = item;
							}
							
							if(ko.isWriteableObservable(activeItem)) {
								activeItem(item);
							} else {
								activeItem = item;
							}
							
							dropdownUl.empty();
							addItemsToDropdown();
						};
					} (items[idx])));
				}
			}
			addItemsToDropdown();
			
			elem.append(actionBtn)
				.append(caretBtn)
				.append(dropdownUl);
		}
	};
});