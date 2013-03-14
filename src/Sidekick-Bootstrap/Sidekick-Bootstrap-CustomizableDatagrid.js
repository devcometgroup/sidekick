define(["jquery", "ko"], function($, ko) {
	
	
	var update = function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext){
		var values = valueAccessor();
		
		//var options = ko.utils.unwrapObservable(values.options);
		var dataSource = ko.utils.unwrapObservable(values.dataSource);
		 
		var pagination= ko.utils.unwrapObservable(values.options.pagination);
		var orderings =  ko.utils.unwrapObservable(values.options.orderings);
		
		var elem = $(element);
		
		var header = viewModel.__header__;
		var content = viewModel.__content__;
		
	
		
		elem.empty();
		
		var items = ko.observableArray();
		
		var callback= function(newItems){
			items.removeAll();
			for (var i=0; i<newItems.length;i+=1){
				items.push(newItems[i]);
			}
			
		};
		
		var orderingKeys = Object.keys(orderings);
		
		var orderBy = "";
		var ascDesc = "none";
		
		for(var i = 0; i<orderingKeys.length; i+=1){
			if (ko.utils.unwrapObservable(orderings[orderingKeys[i]].ascDesc) !== "none"){
				orderBy = orderings[orderingKeys[i]].field;
				ascDesc = ko.utils.unwrapObservable(orderings[orderingKeys[i]].ascDesc);
				break;
			}			
		}
		
		dataSource.read(ko.utils.unwrapObservable(pagination.elementPerPage),ko.utils.unwrapObservable(pagination.actualPage),callback,orderBy,ascDesc);
		
		elem.append(header);

		var tbody = $("<tbody data-bind=\"foreach: items\">");
		tbody.append(content);
		
		elem.append(tbody);
		
		values.items=items;
		values.callback = function(orderBy,ascDesc){
			orderingKeys = Object.keys(orderings);
			for(var i = 0; i<orderingKeys.length; i+=1){
				if (orderings[orderingKeys[i]].field !== orderBy){
					orderings[orderingKeys[i]].ascDesc( "none" );
				}			
			}
			
			//dataSource.read(pagination.elementPerPage,ko.utils.unwrapObservable(pagination.actualPage),callback,ko.utils.unwrapObservable(orderBy),ko.utils.unwrapObservable(ascDesc));
		};
		
		var innerBindingContext = bindingContext.extend(values);
		ko.applyBindingsToDescendants(innerBindingContext, element);
	};
	

	ko.bindingHandlers.customizableDatagrid = {
			init:function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext){
				if ($(element).find('thead')[0]) {
					var header = $(element).find('thead')[0].outerHTML;
					viewModel.__header__ = header;
				}
				if ($(element).find('tbody')[0]) {
					var content = $(element).find('tbody')[0].innerHTML;					
					viewModel.__content__ = content;
				}
				if ($(element).find('tfoot')[0]){
					var tfoot = $(element).find('tfoot')[0].innerHTML;					
					viewModel.__footer__ = footer;
				}
				
				var neighboursElements = element.parentNode.childNodes;
				
				
				for(var i = 0; i<neighboursElements.length; i+=1){
					if (neighboursElements[i]===element){
						var newElement=$("<div/>").append($(element)).append($("<div id=\"pagination\" data-bind=\"pagination: options.pagination\">"));
						$(neighboursElements[i]).replaceWith(newElement);
					
					}
				}
				
				var values = valueAccessor();
				
				if(values.options.pagination.selectorValue){
					ko.computed(function (){
						if (values.options.pagination.selectorValue()==="all"){
							values.options.pagination.elementPerPage(values.options.pagination.elementNumber);
						} else {
							values.options.pagination.elementPerPage(ko.utils.unwrapObservable(values.options.pagination.selectorValue));
						}
					});
					
				}
				
				var outerBindingContext = bindingContext.extend(valueAccessor());
				
				ko.applyBindings(outerBindingContext,element.nextSibling);
				
				return {
					controlsDescendantBindings: true
				};
			},
			update: update
	};

});