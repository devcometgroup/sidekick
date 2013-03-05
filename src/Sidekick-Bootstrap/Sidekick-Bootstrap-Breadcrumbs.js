define(["jquery", "knockout"], function ($, ko) {
	var createCallbackCreator = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
		return function (idx, item, callback) {
			return function () {
				var params = valueAccessor();
				if (ko.isWriteableObservable(params.actualPage)) {
					params.actualPage(idx);
				} else {
					params.actualPage = idx;
				}
				update(element, valueAccessor, allBindingsAccessor, viewModel);
				callback (idx, item);
			};
		};
	};
	
	var update = function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
		var elem = $(element);
		elem.empty();
		
		//no problem with this due to function scoping...
		if (elem.is("ul")) {
			var ul = elem;
		} else {
			var ul = $("<ul/>")
				.addClass("breadcrumb")
				.appendTo(elem);
		}
		
		
		var options = ko.utils.unwrapObservable(valueAccessor());
		
		var actIdx = options.actIdx;
		var maxIdx = options.items.length - 1;
		if (typeof options.hideItemsAfterActive && options.hideItemsAfterActive) {
			maxIdx = actIdx;
		}
		
		var createCallback = createCallbackCreator (element, valueAccessor, allBindingsAccessor, viewModel);
		
		for (var idx = 0; idx <= maxIdx; ++idx) {
			var liElem = $("<li/>");
			if (idx === actIdx) {
				var linkElem = options.items[idx];
				liElem.addClass("active");
			} else {
				var linkElem = $("<a href=\"#\">" + options.items[idx] + "</a>");
				linkElem.click(createCallback(idx, options.items[idx], options.callback));
			}
			
			liElem.append(linkElem);
			if (idx !== maxIdx) {
				liElem.append($("<span class=\"divider\">" + options.divider + "</span>"));
			}
			liElem.appendTo(ul);
		}
	};
	
	ko.bindingHandlers.breadcrumbs = {
		init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
			var elem = $(element);
			if (elem.is("ul")) {
				elem.addClass("breadcrumb");
			}
		},
		update: update
	};
});