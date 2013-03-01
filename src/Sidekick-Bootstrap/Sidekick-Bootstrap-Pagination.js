define(["jquery","knockout"], function($, ko) {
	var createCallbackCreator = function (element, valueAccessor, allBindingsAccessor, viewModel){
		return function (idx, callback) {
			return function () {
				var params = valueAccessor();
				if (ko.isWriteableObservable(params.actualPage)) {
					params.actualPage(idx);
				} else {
					params.actualPage = idx;
				}
				
				update(element, valueAccessor, allBindingsAccessor, viewModel);
				callback(idx);
			};
		};
	};
	
	var update = function (element, valueAccessor, allBindingsAccessor, viewModel) {
		var values = valueAccessor();
		
		var elementNumber = ko.utils.unwrapObservable(values.elementNumber);
		var elementPerPage = ko.utils.unwrapObservable(values.elementPerPage);
		var actualPage = ko.utils.unwrapObservable(values.actualPage);
		var callback = values.callback;
		var size = ko.utils.unwrapObservable(values.size);
		var alignment =  ko.utils.unwrapObservable(values.align);
		
		var elem = $(element);
		
		elem.addClass("pagination");
		
		if (alignment === "pagination-centered" || alignment === "centered" || alignment === "center"){
			elem.addClass("pagination-centered");
		} else if (alignment === "pagination-right" || alignment === "right"){
			elem.addClass("pagination-right");
		}
		
		if (size === "pagination-large"|| size === "large"){
			elem.addClass("pagination-large");
		} else if (size === "pagination-small" || size === "small") {
			elem.addClass("pagination-small");
		} else if (size === "pagination-mini" || size === "mini"){
			elem.addClass("pagination-mini");
		}
		
		var ulElement = $("<ul/>");
		var length = elementNumber / elementPerPage;
		
		var createCallback = createCallbackCreator(element, valueAccessor, allBindingsAccessor, viewModel);
		
		var ulActElement = $("<li><a href=\"#\">&laquo;</a></li>");
		if (actualPage === 0){
			ulActElement.addClass("disabled");
		} else {
			ulActElement.click(createCallback(actualPage - 1,callback));
		}
		ulElement.append(ulActElement);
		for (var i = 0; i < length; i += 1) {
			var ulActElement = $("<li> <a href=\"#\">" + (i + 1) + "</a></li>");
			if (i === actualPage){
				ulActElement.addClass("active");
			} else {
				ulActElement.click(createCallback(i, callback));
			}
			ulElement.append(ulActElement);
		}
		var ulActElement = $("<li><a href=\"#\">&raquo;</a></li>");	
		if (actualPage === length-1){
			ulActElement.addClass("disabled");
		} else {
			ulActElement.click(createCallback(actualPage + 1,callback));
		}
		ulElement.append(ulActElement);
		
		elem.empty();
		elem.append(ulElement);
	};
	
	ko.bindingHandlers.pagination = {
		init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
			
		},
		update: update
	};
});