define(["jquery", "ko", "../common/AddClassLookupMonad"], function($, ko, addClassLookupMonad) {
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
	
	var addAlignmentClass = addClassLookupMonad ({
			"pagination-centered":	"pagination-centered",
			"centered":				"pagination-centered",
			"center":				"pagination-centered",
			
			"pagination-right":		"pagination-right",
			"right":				"pagination-right"
	});
	
	var addSizeClass = addClassLookupMonad ({
			"pagination-large":	"pagination-large",
			"large": 			"pagination-large",
			
			"pagination-small":	"pagination-small",
			"small":			"pagination-small",
			
			"pagination-mini":	"pagination-mini",
			"mini":				"pagination-mini"
	});
	
	
	var update = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
		var values = valueAccessor();
		
		var elementNumber	= ko.utils.unwrapObservable(values.elementNumber);
		var elementPerPage	= ko.utils.unwrapObservable(values.elementPerPage);
		var actualPage		= ko.utils.unwrapObservable(values.actualPage);
		var callback		= values.callback;
		var size			= ko.utils.unwrapObservable(values.size);
		var alignment		= ko.utils.unwrapObservable(values.align);
		
		
		var elem = $(element);
		
		addAlignmentClass(elem)(alignment);
		addSizeClass(elem)(size);
		
		
		var ulElement = $("<ul/>");
		var length = elementNumber / elementPerPage;
		
		var createCallback = createCallbackCreator(element, valueAccessor, allBindingsAccessor, viewModel);
		
		var hrefActElement = $("<a href=\"#\">&laquo;</a>");
		var liElement = $("<li />");
		
		if (actualPage === 0){
			liElement.addClass("disabled");
		} else {
			hrefActElement.click(createCallback(actualPage - 1, callback));
		}
		liElement.append(hrefActElement);
		ulElement.append(liElement);
		
		for (var i = 0; i < length; i += 1) {
			var hrefActElement = $( "<a href=\"#\">" + (i + 1) + "</a>");
			var liElement = $("<li />");
			if (i === actualPage){
				liElement.addClass("active");
			} else {
				hrefActElement.click(createCallback(i, callback));
			}
			
			liElement.append(hrefActElement);
			ulElement.append(liElement);
		}
		
		var hrefActElement = $("<a href=\"#\">&raquo;</a>");
		var liElement = $("<li />");
		if (actualPage === length-1){
			liElement.addClass("disabled");
		} else {
			hrefActElement.click(createCallback(actualPage + 1,callback));
		}
		liElement.append(hrefActElement);
		ulElement.append(liElement);
		
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