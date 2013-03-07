define(["jquery","ko"], function($, ko) {
	var content;
	var header;
	
	
	var update = function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext){
		var values = valueAccessor();
		//var options = ko.utils.unwrapObservable(values.options);
		var dataSource = ko.utils.unwrapObservable(values.dataSource);
		
		var pagination= ko.utils.unwrapObservable(values.pagination);
		
		var elem=$(element);
		
		elem.empty();
		
		
		
		var items = dataSource.read(pagination.elementPerPage,ko.utils.unwrapObservable(pagination.actualPage));
		
		elem.append(header);
		var display = content; 
		/*
		var tbody = $("<tbody />");
		
		for (var i = 0; i<items.length; i+=1){
			row= $("<tr />");
			for (var j = 0; j<display.length; j=j+1){
				$("<td />").append(items[i][display[j]]).appendTo(row);
				
			}
			row.appendTo(tbody);
		}
		elem.append(tbody);*/
		var tbody = $("<tbody data-bind=\"foreach: items\">");
		tbody.append(content);
		
		elem.append(tbody);
		
		
		elem.append($("<div data-bind=\"pagination: pagination\">"));
		
		values.items=items;
		
		var innerBindingContext = bindingContext.extend(values);
		ko.applyBindingsToDescendants(innerBindingContext, element);
	};
	

	ko.bindingHandlers.datagrid = {
			init:function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext){
			
				header = $(element).find('thead')[0].outerHTML;

				content = $(element).find('tbody')[0].innerHTML;
							
				return { 'controlsDescendantBindings': true };
			},
			update: update
	};

});