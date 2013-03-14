define(["jquery", "ko"], function($, ko) {
	var templates = [];
	
	var nextAvailableId = 0;
	
	
	var update = function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext){
		var values = valueAccessor();
		
		var dataSource = ko.utils.unwrapObservable(values.dataSource);
		 
		var pagination= ko.utils.unwrapObservable(values.options.pagination);
		var orderings =  ko.utils.unwrapObservable(values.options.orderings);
		
		var elem = $(element);
		
		var actId = parseInt ($(element).attr("__templateId__"));
		
		var header = templates[actId].__header__;
		var content =  templates[actId].__content__;
		var footer =  templates[actId].__footer__;
	
		
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
		
		elem.append(footer);
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
				var temp={};
				
				if ($(element).find('thead')[0]) {
					var header = $(element).find('thead')[0].outerHTML;
					temp.__header__ = header;
				}
				if ($(element).find('tbody')[0]) {
					var content = $(element).find('tbody')[0].innerHTML;					
					temp.__content__ = content;
				}
				if ($(element).find('tfoot')[0]){
					var footer = $(element).find('tfoot')[0].innerHTML;					
					temp.__footer__ = footer;
				}
				
				templates[nextAvailableId]=temp;
				$(element).attr("__templateId__", nextAvailableId);

				nextAvailableId+=1;
				
				
				var neighboursElements = element.parentNode.childNodes;
				
				
				$(element).after($("<div id=\"pagination\" data-bind=\"pagination: options.pagination\">"));
				
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