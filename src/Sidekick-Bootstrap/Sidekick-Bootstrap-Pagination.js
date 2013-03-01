define(["jquery","knockout"], function($, ko) {
	var createCallbackCreator = function (element, valueAccessor, allBindingsAccessor, viewModel){
		return createCallback = function (i, callback) {
			return 	function () {
				valueAccessor().actualPage(i+1);
				callback(i+1);
			};
		};
	};
	
	ko.bindingHandlers.pagination = {
		init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
			
		},
		update:function(element, valueAccessor, allBindingsAccessor, viewModel) {
			var values = valueAccessor();
			
			var elementNumber = ko.utils.unwrapObservable(values.elementNumber);
			var elementPerPage = ko.utils.unwrapObservable(values.elementPerPage);
			var actualPage = values.actualPage;
			var callback = values.callback;
			var size = ko.utils.unwrapObservable(values.size);
			var alignment =  ko.utils.unwrapObservable(values.align);
			
			var elem = $(element);
			
			elem.addClass("pagination");
			
			if (alignment == "pagination-centered" || alignment == "centered" || alignment == "center"){
				elem.addClass("pagination-centered");
			} else if (alignment == "pagination-right" || alignment == "right"){
				elem.addClass("pagination-right");
			}
			
			if (size == "pagination-large"|| size == "large"){
				elem.addClass("pagination-large");
			} else if (size == "pagination-small" || size == "small") {
				elem.addClass("pagination-small");
			} else if (size == "pagination-mini" || size == "mini"){
				elem.addClass("pagination-mini");
			}
			
			var ulElement = $("<ul/>");
			var length = elementNumber / elementPerPage;
			
			var cretateCallback = createCallbackCreator(element, valueAccessor, allBindingsAccessor, viewModel);
			
			for (var i = 0; i < length; i += 1) {
				if (i==0 && actualPage()==1){
					var ulActElement = $("<li class=\"disabled\"><a href=\"#\">&laquo;</a></li>"); 
					ulElement.append(ulActElement);
				} else if(i==0) {
					var ulActElement = $("<li><a href=\"#\">&laquo;</a></li>");
					ulActElement.click(createCallback(actualPage()-2,callback));
					ulElement.append(ulActElement);
				}
				if (i == actualPage() - 1){
					var ulActElement = $("<li class=\"active\" > <a href=\"#\">" + (i + 1) + "</a></li>");
					ulElement.append(ulActElement);
				} else {
					var ulActElement = $("<li> <a href=\"#\">" + (i + 1) + "</a></li>");
					ulActElement.click(createCallback(i, callback));
					ulElement.append(ulActElement);
				}
				if (i==length-1 && actualPage() == length){
					var ulActElement = $("<li class=\"disabled\"><a href=\"#\">&raquo;</a></li>");
				
					ulElement.append(ulActElement);
				} else if(i==length-1) {
					var ulActElement = $("<li><a href=\"#\">&raquo;</a></li>");	
					ulActElement.click(createCallback(actualPage(),callback));
					ulElement.append(ulActElement);
				}
			}
			//divElement.append(ulElement);
			
			elem.empty();
			elem.append(ulElement);
		}
	}
});