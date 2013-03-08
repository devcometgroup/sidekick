define(["jquery", "ko"], function($, ko) {
	ko.bindingHandlers.orderController = {
			init:function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext){
				console.log(valueAccessor());
			},
			update:function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext){
				var values = valueAccessor();
				var field = values.field;
				var ascDesc = "none";
				elem=$(element);
				elem.click(function(){
					if (ascDesc==="none"){
						ascDesc="asc";
					} else if (ascDesc==="asc"){
						ascDesc="desc";
					} else if (ascDesc=="desc"){
						ascDesc="none";
					}
					if (values.callback!==undefined){
						values.callback.callback(field,ascDesc);
					} else if(bindingContext.callback!==undefined) {
						bindingContext.callback(field,ascDesc);
							
					}
					
					});
			}
	
	};
});