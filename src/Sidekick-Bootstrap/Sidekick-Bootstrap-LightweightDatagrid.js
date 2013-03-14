define(["jquery", "ko"], function($, ko) {
	ko.bindingHandlers.lightweightDatagrid = {
		init:function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext){
			
			var values = valueAccessor();
			
			values.options.pagination.actualPage= ko.observable(0);
			values.options.pagination.elementPerPage= ko.observable(2);
			values.options.pagination.size= "small";
			values.options.pagination.align= "center";
			values.options.pagination.callback = function(i){
				
			};

			values.options.orderings={};
			
			if(values.options.pagination.selectorValue){
				ko.computed(function (){
					if (values.options.pagination.selectorValue()==="all"){
						values.options.pagination.elementPerPage(values.options.pagination.elementNumber);
					} else {
						values.options.pagination.elementPerPage(ko.utils.unwrapObservable(values.options.pagination.selectorValue));
					}
			});
			}	
			
		
			$(element).after($("<div id=\"pagination\" data-bind=\"pagination: options.pagination\">"));
				
			
			var outerBindingContext = bindingContext.extend(valueAccessor());
			
			ko.applyBindings(outerBindingContext,element.nextSibling);
			
			return {
				controlsDescendantBindings: true
			};
		},	
		update:function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext){
			var values = valueAccessor();
			
			
			var dataSource = ko.utils.unwrapObservable(values.dataSource);
			 
			var pagination= ko.utils.unwrapObservable(values.options.pagination);
			var header =  ko.utils.unwrapObservable(values.options.header);
			var updateButton = ko.utils.unwrapObservable(values.options.updateButton);
			
			var elem = $(element);

			elem.empty();
			
			var items = ko.observableArray();
			
			ko.computed(function(){
				var newItems = items();
				for (var i = 0; i<newItems.length;i+=1){
					newItems[i].edit=ko.observable(false);
				}
				items = ko.observableArray(newItems);
			});
			
			
			values.callback = function(orderBy,ascDesc){
				orderingKeys = Object.keys(values.options.orderings);
				for(var i = 0; i<orderingKeys.length; i+=1){
					if (values.options.orderings[orderingKeys[i]].field !== orderBy){
						values.options.orderings[orderingKeys[i]].ascDesc( "none" );
					}			
				}
				

				dataSource.read(ko.utils.unwrapObservable(pagination.elementPerPage),ko.utils.unwrapObservable(pagination.actualPage),callback,orderBy,ascDesc);
				
			};
			
			var callback= function(newItems){
				items.removeAll();
				for (var i=0; i<newItems.length;i+=1){
					items.push(newItems[i]);
				}
				
				var itemsTemp = items();
				for (var i = 0; i<itemsTemp.length;i+=1){
					itemsTemp[i].edit=ko.observable(false);
				}
				items = ko.observableArray(itemsTemp);
				
			};
			
			var orderingKeys = Object.keys(values.options.orderings);
			
			var orderBy = "";
			var ascDesc = "none";
			
			for(var i = 0; i<orderingKeys.length; i+=1){
				if (ko.utils.unwrapObservable(values.options.orderings[orderingKeys[i]].ascDesc) !== "none"){
					orderBy = values.options.orderings[orderingKeys[i]].field;
					ascDesc = ko.utils.unwrapObservable(values.options.orderings[orderingKeys[i]].ascDesc);
					break;
				}			
			}
			
			dataSource.read(ko.utils.unwrapObservable(pagination.elementPerPage),ko.utils.unwrapObservable(pagination.actualPage),callback,orderBy,ascDesc);
			
			
			var table = $("<table class=\"table table-bordered\" />");
			
			var thead = $("<thead />");
			
			
			for (var i = 0; i<header.length; i+=1){
				if(header[i].orderable){
					var th = $("<th data-bind=\"orderController: options.orderings.by"+header[i].prop+"\"></th>");
					if (!values.options.orderings["by"+header[i].prop]){
						values.options.orderings["by"+header[i].prop]={field:header[i].prop,ascDesc:ko.observable("none"),label:header[i].label};						
					}
				} else {
					var th = $("<th>"+header[i].label+"</th>");
				}
				th.appendTo(thead);
			}
			
			if(updateButton){
				thead.append($("<th/>"));
			}
			
			thead.appendTo(table);
			
			
			var tbody = $("<tbody data-bind=\"foreach:items\"/>");
			
			
				var tr = $("<tr/>");
				
				for (var j = 0; j<header.length; j+=1){
					var td = $("<td data-bind=\"text:"+header[j].prop+"\"></td>");
					td.appendTo(tr);
				}
				if (updateButton){
					var updateTemp= $("<td/>");
					var buttonTemp=$("<button data-bind=\"click: function(place){console.log(place);place.edit(!place.edit)}\"/>");
					if (updateButton.icon){
						if (updateButton.label){
							buttonTemp.append($("<i class=\""+updateButton.icon+"\"></i>")).append(updateButton.label);
						} else {
							buttonTemp.append($("<i class=\""+updateButton.icon+"\"/>"));
						}
					} else if (updateButton.label){
						buttonTemp.append(updateButton.label);
					} else {
						buttonTemp.append($("<i class=\"icon-edit\"/>"));
					}
					buttonTemp;
					updateTemp.append(buttonTemp);
					updateTemp.appendTo(tr);
					
				}
				tr.appendTo(tbody);
				
			tbody.appendTo(table);

			table.appendTo(elem);
			values.items=items;
			
			var innerBindingContext = bindingContext.extend(values);
			ko.applyBindingsToDescendants(innerBindingContext, element);
			
			
		}
	};
});