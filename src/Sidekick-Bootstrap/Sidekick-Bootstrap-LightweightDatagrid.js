define(["jquery", "ko"], function($, ko) {
	ko.bindingHandlers.lightweightDatagrid = {
		init:function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext){
			
			var values = valueAccessor();
			
			values.options.pagination.actualPage= ko.observable(0);
			values.options.pagination.elementPerPage= ko.observable(2);
			values.options.pagination.size= "small";
			values.options.pagination.align= "center";
			values.options.pagination.callback = function(i){
				//the changing of the current page does the work
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
	
			values.callback = function(orderBy,ascDesc){
				orderingKeys = Object.keys(values.options.orderings);
				for(var i = 0; i<orderingKeys.length; i+=1){
					if (values.options.orderings[orderingKeys[i]].field !== orderBy){
						values.options.orderings[orderingKeys[i]].ascDesc( "none" );
					}			
				}
				

				dataSource.read(ko.utils.unwrapObservable(pagination.elementPerPage),ko.utils.unwrapObservable(pagination.actualPage),callbackRead,orderBy,ascDesc);
				
			};
			

			
			var table = $("<table class=\"table table-bordered\" />");
			
			
			
			var createRow = function(item,actTr){
				for (var j = 0; j<header.length; j+=1){
					var td = $("<td/>").append( item[header[j].prop]);
					td.appendTo(actTr);
				}
				if (updateButton){
					var updateTemp= $("<td/>");
					var buttonTemp=$("<button />");
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
					
					
					var callback  = function(item,actTr){
						
						return function(){
							
							/*for(var i = 0; i<orderingKeys.length; i+=1){
								values.options.orderings[orderingKeys[i]].ascDesc( "none" );
										
							}*/
							
							actTr.empty();
							for (var j = 0; j<header.length; j+=1){
								if (header[j].type==="number"){
									var input = $("<input type=number name=\""+header[j].prop+"\"/>");
									input[0].value=item[header[j].prop];
									
									//.append( items()[i][header[j].prop]);
								} else if (header[j].type==="text"){
									var input =$("<input type=text name=\""+header[j].prop+"\" />");
									//.append( items()[i][header[j].prop]);
									input[0].value=item[header[j].prop];
								}
								var td = $("<td/>").append(input);
								td.appendTo(actTr);

								
								
								
							}
							
							var td=$("<td/>");
							var ok = $("<button/>").append($("<i class=\"icon-ok\">"));
							var updateAct = function(item,actTr){
								return function(){		
									for (var j = 0; j<header.length; j+=1){
										item[header[j].prop] = actTr.find("input[name=\""+header[j].prop+"\"]")[0].value;
									}
									
							dataSource.update(item);
							actTr.empty();
							createRow(item,actTr);
								};
							};
							ok.click(updateAct(item,actTr));
							ok.appendTo(td);
							
							var cncl =  $("<button/>").append($("<i class=\"icon-remove\">"));
							var cancel = function(){
								return function(){
									actTr.empty();
									createRow(item,actTr);
								};
							};
							cncl.click(cancel());
							cncl.appendTo(td);
							
							td.appendTo(actTr);
						};
					};
					
					buttonTemp.click(callback(item,actTr));
					updateTemp.append(buttonTemp);
					updateTemp.appendTo(actTr);
					
				}
				
			};
			
			
			var callbackRead = function(newItems){
				items.removeAll();
				for (var i=0; i<newItems.length;i+=1){
					items.push(newItems[i]);
				}
				
				var tbody = $("<tbody/>");
				for(var i = 0; i < items().length; i+=1){
					var tr = $("<tr/>");
					createRow(items()[i],tr);
					tr.appendTo(tbody);
					
				}
				tbody.appendTo(table);
				
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
			
			dataSource.read(ko.utils.unwrapObservable(pagination.elementPerPage),ko.utils.unwrapObservable(pagination.actualPage),callbackRead,orderBy,ascDesc);
			
			
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
			

			table.appendTo(elem);
			values.items=items;
			
			var innerBindingContext = bindingContext.extend(values);
			ko.applyBindingsToDescendants(innerBindingContext, element);
			
			
		}
	};
});