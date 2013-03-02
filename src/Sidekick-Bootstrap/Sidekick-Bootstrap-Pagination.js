define(["jquery","knockout"], function($, ko) {
	var createCallbackCreator = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext){
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
	
	var alignmentClassLookupTable = {
			"pagination-centered":	"pagination-centered",
			"centered":				"pagination-centered",
			"center":				"pagination-centered",
			
			"pagination-right":		"pagination-right",
			"right":				"pagination-right"
	};
	
	var sizeClassLookupTable = {
			"pagination-large":	"pagination-large",
			"large": 			"pagination-large",
			
			"pagination-small":	"pagination-small",
			"small":			"pagination-small",
			
			"pagination-mini":	"pagination-mini",
			"mini":				"pagination-mini"
	};
	
	var addClassFromLookupTable = function (elem, key, lookup) {
		if (typeof lookup[key] !== "undefined") {
			elem.addClass(lookup[key]);
		}
	}
	
	
	var update = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
		var values = valueAccessor();
		
		var elementNumber	= ko.utils.unwrapObservable(values.elementNumber);
		var elementPerPage	= ko.utils.unwrapObservable(values.elementPerPage);
		var actualPage		= ko.utils.unwrapObservable(values.actualPage);
		var callback		= values.callback;
		var size			= ko.utils.unwrapObservable(values.size);
		var alignment		= ko.utils.unwrapObservable(values.align);
		
		
		var elem = $(element);
		
		addClassFromLookupTable(elem, alignment, alignmentClassLookupTable);
		addClassFromLookupTable(elem, size, sizeClassLookupTable);
		
		
		var ulElement = $("<ul/>");
		var length = elementNumber / elementPerPage;
		
		var createCallback = createCallbackCreator(element, valueAccessor, allBindingsAccessor, viewModel);
		
		var ulActElement = $("<li><a href=\"#\">&laquo;</a></li>");
		if (actualPage === 0){
			ulActElement.addClass("disabled");
		} else {
			ulActElement.click(createCallback(actualPage - 1, callback));
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
		init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
			$(element).addClass("pagination");
		},
		update: update
	};
});