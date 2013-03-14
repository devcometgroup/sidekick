define(["jquery", "ko", "jqueryui"], function ($, ko, jqueryui) {
	
	ko.bindingHandlers.resizable = {
	    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
	    	$(element).resizable();
	    },
	    update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
	    	var actWidth = $(element).width();
	    	var actHeight = $(element).height();
	    	
	    	$(element).resizable("destroy");
	    	
	    	$(element).width(actWidth);
	    	$(element).height(actHeight);
	    	var value = ko.utils.unwrapObservable(valueAccessor());
    		if(value !== null) {
	    		var initObj = {};
	    		var i = 0;
	    		for(val in value) {
	    			initObj[val] = ko.utils.unwrapObservable(value[val]);
	    			i++;
	    		}
	    		if(i > 0) {
	    			$(element).resizable(initObj);
	    		} else {
	    			$(element).resizable();
	    		}
	        }
	    }
	};
	
});