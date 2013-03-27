define(["jquery", "ko", "jqueryui","colorpicker"], function($, ko){
	
		ko.bindingHandlers.colorPicker = {
			init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext){
				values=valueAccessor();
				options=values.options;
				if (values.value){
					$(element).val(values.value());
					options.close = function(event, color){
						values.value(color.formatted);
					};
				}
				
				$(element).colorpicker(options);
			
			},
			update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
				//
			}
		};
});