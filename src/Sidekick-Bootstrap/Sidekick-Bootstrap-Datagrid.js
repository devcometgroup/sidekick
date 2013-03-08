define(["jquery", "ko"], function($, ko) {
	
	
	var update = function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext){
		var values = valueAccessor();
		
		//var options = ko.utils.unwrapObservable(values.options);
		var dataSource = ko.utils.unwrapObservable(values.dataSource);
		
		var pagination= ko.utils.unwrapObservable(values.pagination);
		
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
		
		dataSource.read(pagination.elementPerPage,ko.utils.unwrapObservable(pagination.actualPage),callback);
		
		
		
		elem.append(header);

		var tbody = $("<tbody data-bind=\"foreach: items\">");
		tbody.append(content);
		
		elem.append(tbody);
		
		//elem.append($("<div data-bind=\"pagination: pagination\">"));
		
		values.items=items;
		values.callback = function(orderBy,ascDesc){
			dataSource.read(pagination.elementPerPage,ko.utils.unwrapObservable(pagination.actualPage),callback,orderBy,ascDesc);
		};
		
		var innerBindingContext = bindingContext.extend(values);
		ko.applyBindingsToDescendants(innerBindingContext, element);
	};
	

	ko.bindingHandlers.datagrid = {
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
						var newElement=$("<div/>").append($(element)).append($("<div id=\"pagination\" data-bind=\"pagination: pagination\">"));
						$(neighboursElements[i]).replaceWith(newElement);
					
					}
				}
				
				var values = valueAccessor();
				var outerBindingContext = bindingContext.extend(valueAccessor());
				
				ko.applyBindings(outerBindingContext,element.nextSibling);
				
				return {
					controlsDescendantBindings: true
				};
			},
			update: update
	};

});