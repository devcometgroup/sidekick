define(["jquery", "ko"], function($, ko) {
	ko.bindingHandlers.orderController = {
		init:function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
			//
		},
		update:function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
			var values = valueAccessor();
			var field = values.field;
			var ascDesc = ko.utils.unwrapObservable(values.ascDesc);
			var label= values.label;
			
			var link = $("<button class=\"btn btn-link\">").append(label);
			
			if (ascDesc === "asc") {
				link = link.append($("<i class=\" icon-chevron-up\">"));
			} else if (ascDesc === "desc") {
				link = link.append($("<i class=\" icon-chevron-down\">"));
			} else if (ascDesc === "none") {
				link = link.append($("<i class=\" icon-minus\">"));
			}
	
			elem = $(element);
			elem.empty();
			elem.append(link);
			elem.click(function() {
				if (ascDesc === "none") {
					ascDesc = "asc";
				} else if (ascDesc === "asc") {
					ascDesc = "desc";
				} else if (ascDesc === "desc") {
					ascDesc = "none";
				}
				
				values.ascDesc(ascDesc);
				if (typeof values.callback !== "undefined") {
					values.callback.callback(field,ascDesc);
				} else if (typeof bindingContext.callback !== undefined) {
					bindingContext.callback(field,ascDesc);
				}
			});
		}
	};
});