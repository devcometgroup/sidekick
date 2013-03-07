define(["jquery", "ko"], function($, ko) {
	var update = function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext){
		var values = valueAccessor();
		
		//var options = ko.utils.unwrapObservable(values.options);
		var dataSource = ko.utils.unwrapObservable(values.dataSource);
		
		var pagination= ko.utils.unwrapObservable(values.pagination);
		
		var elem = $(element);
		
		elem.empty();
		
		var header = $(element).find('thead')[0].outerHTML;
		var content = $(element).find('tbody')[0].innerHTML;
		
		
		//GY: kesobb ez igy nem lesz jo - async requestek miatt... at kene adni neki egy callback-et, amit meghivva
		//beallithatjuk az items ertekeit...
		//Az itemsnel biztositani kene, hogy observableArray legyen, mert kulonben a foreach nem updateli a view-t miutan
		//az ajax request utan beallitottuk a callback-kel az ertekeket...
		var items = dataSource.read(pagination.elementPerPage,ko.utils.unwrapObservable(pagination.actualPage));
		
		elem.append(header);

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
				return {
					controlsDescendantBindings: true
				};
			},
			update: update
	};

});