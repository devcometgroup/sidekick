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
						values.options.pagination.elementPerPage(ko.utils.unwrapObservable(values.options.pagination.elementNumber));
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
			
			var deleteButton = ko.utils.unwrapObservable(values.options.deleteButton);
			var insertButton = ko.utils.unwrapObservable(values.options.insertButton);
			
			
			var elem = $(element);

			elem.empty();
			
			var items = ko.observableArray();
	
			values.callback = function(orderBy,ascDesc){
				orderingKeys = Object.keys(values.options.orderings);
				for(var i = 0; i<orderingKeys.length; i+=1){
					if (values.options.orderings[orderingKeys[i]].field !== orderBy){
						values.options.orderings[orderingKeys[i]].ascDesc= "none" ;
					}			
				}
				

				dataSource.read(ko.utils.unwrapObservable(pagination.elementPerPage),ko.utils.unwrapObservable(pagination.actualPage),callbackRead,orderBy,ascDesc);
				
			};
			

			
			var table = $("<table class=\"table table-bordered\" style=\"table-layout:fixed; word-wrap:break-word; \"/>");
			
			var thead = $("<thead />");
			
			var createHeader = function(actThead){
				actThead.empty();
				for (var i = 0; i<header.length; i+=1){
					if(header[i].orderable || header[i].orderable ==="" ){
						
						actHeader = header[i];
						
						//var th = $("<th data-bind=\"orderController: options.orderings.by"+header[i].prop+"\"></th>");
						if (!values.options.orderings["by"+actHeader.prop]){
							values.options.orderings["by"+actHeader.prop]={field:actHeader.prop,ascDesc:"none",label:actHeader.label};						
						}
						var th = $("<th />");
						
						
						var label = values.options.orderings["by"+actHeader.prop].label;
						var ascDesc = values.options.orderings["by"+actHeader.prop].ascDesc;
						var field = values.options.orderings["by"+actHeader.prop].field;
						
						var link = $("<button class=\"btn btn-link\">").append(label);
	
						if (ascDesc === "asc") {
							link = link.append($("<i class=\" icon-chevron-up\">"));
						} else if (ascDesc === "desc") {
							link = link.append($("<i class=\" icon-chevron-down\">"));
						} else if (ascDesc === "none") {
							link = link.append($("<i class=\" icon-minus\">"));
						}
						
						link.click (function(actElement) {
							return function(){
								if (actElement.ascDesc === "none") {
									actElement.ascDesc="asc";
								} else if (actElement.ascDesc === "asc") {
									actElement.ascDesc="desc";
								} else if (actElement.ascDesc === "desc") {
									actElement.ascDesc ="none";
								}
								
								values.callback(actElement.field,actElement.ascDesc);
							
							};
						}(values.options.orderings["by"+actHeader.prop]));
						link.appendTo(th);
						
					} else {
						var th = $("<th>"+header[i].label+"</th>");
					}
					th.appendTo(actThead);
				}
				
				if(updateButton || deleteButton || insertButton){
					actThead.append($("<th/>"));
				}
			};
			
			createHeader(thead);
			
			var createNormalCell = function(item,actHeader,cell){
				if (actHeader.type!=="bool"){
					cell.append( item[actHeader.prop]);						
				}
				else {
					if (item[actHeader.prop]){
						cell.append("<input type=\"checkbox\" checked=\"checked\" disabled=\"true\">");
					} else {
						cell.append("<input type=\"checkbox\" disabled=\"true\">");
					}
				}
			};
			
			var createEditableCell = function(actHeader,cell,item){
				
				if (actHeader.type==="number"){
					var input = $("<input class=\"input-block-level\" type=number name=\""+actHeader.prop+"\"/>");
					if (item!==null && item!==undefined && item[actHeader.prop]!== undefined){
						input[0].value=item[actHeader.prop];
					}
					
				} else if (actHeader.type==="text"){
					var input =$("<input class=\"input-block-level\" type=text name=\""+actHeader.prop+"\" />");

					if (item!==null && item!==undefined && item[actHeader.prop]!== undefined){
						input[0].value=item[actHeader.prop];
					}
				} else if (actHeader.type==="bool"){
					if (item!==null && item!==undefined && item[actHeader.prop]){
						var input = $("<input type=\"checkbox\" checked=\"checked\" name=\""+actHeader.prop+"\"  >");
					} else {
						var input = $("<input type=\"checkbox\" name=\""+actHeader.prop+"\"  >");
					}
				}
				
				cell.append(input);
			};
			
			
			var createRow = function(item,actTr){
				for (var j = 0; j<header.length; j+=1){
					var td= $("<td/>");
					createNormalCell(item,header[j],td);
					td.appendTo(actTr);
				}
				if (updateButton || deleteButton || insertButton){
					var buttonsTemp= $("<td/>");
					
					
					if (updateButton){
						
						var updateTemp=$("<button>");
						if (updateButton.icon){
							if (updateButton.label){
								updateTemp.append($("<i class=\""+updateButton.icon+"\"></i>")).append(updateButton.label);
							} else {
								updateTemp.append($("<i class=\""+updateButton.icon+"\"/>"));
							}
						} else if (updateButton.label){
							updateTemp.append(updateButton.label);
						} else {
							updateTemp.append($("<i class=\"icon-edit\"/>"));
						}
						
						
						var callback  = function(item,actTr){
							
							return function(){
								actTr.empty();
								for (var j = 0; j<header.length; j+=1){
									if (header[j].editable!==false){
										
									var td = $("<td/>");
									createEditableCell(header[j],td,item);
									
									
									} else {
										var td = $("<td/>");
										createNormalCell(item,header[j],td);
									}
									
									
									
									td.appendTo(actTr);
	
									
									
									
								}
								
								var td=$("<td/>");
								var ok = $("<button />").append($("<i class=\"icon-ok\">"));
								var updateAct = function(item,actTr){
									return function(){
									for(var i = 0; i<orderingKeys.length; i+=1){
										if (values.options.orderings[orderingKeys[i]].ascDesc !== "none"){
											values.options.orderings[orderingKeys[i]].ascDesc = "none";
											createHeader(thead);
										} 
									}
									for (var j = 0; j<header.length; j+=1){
										if (header[j].editable!==false){
											
											if (header[j].type!=="bool"){
												item[header[j].prop] = actTr.find("input[name=\""+header[j].prop+"\"]")[0].value;										
											} else {
												item[header[j].prop] = $(actTr.find("input[name=\""+header[j].prop+"\"]")[0]).prop('checked');
											}
										}
									}
											
									dataSource.update(item);
									actTr.empty();
									createRow(item,actTr);
									};
								};
								ok.click(updateAct(item,actTr));
								ok.appendTo(td);
								
								var cncl =  $("<button/>").append($("<i class=\"icon-remove\">"));
								var cancel = function(actTr){
									return function(){
										actTr.empty();
										createRow(item,actTr);
									};
								};
								cncl.click(cancel(actTr));
								cncl.appendTo(td);
								
								td.appendTo(actTr);
							};
						};
						
						updateTemp.click(callback(item,actTr));
						updateTemp.appendTo(buttonsTemp);
					}
				
				if(deleteButton){
					var deleteTemp=$("<button>");
					if (deleteButton.icon){
						if (deleteButton.label){
							deleteTemp.append($("<i class=\""+deleteButton.icon+"\"></i>")).append(deleteButton.label);
						} else {
							deleteTemp.append($("<i class=\""+deleteButton.icon+"\"/>"));
						}
					} else if (deleteButton.label){
						deleteTemp.append(deleteButton.label);
					} else {
						deleteTemp.append($("<i class=\"icon-trash\"/>"));
					}
					
					var del = function(actItem){
						return function(){
							
						buttonsTemp.empty();
						buttonsTemp.append("<p>"+deleteButton.question+"</p>");
						var ok = $($("<button />").append($("<i class=\"icon-ok\">")).append(deleteButton.yes));
						var delcall = function(item,actTr){
							return function(){
								dataSource.del(actItem);
								//actTr.empty();
								dataSource.read(ko.utils.unwrapObservable(pagination.elementPerPage),ko.utils.unwrapObservable(pagination.actualPage),callbackRead,orderBy,ascDesc);
								
							};
						};
						ok.click(delcall(item,actTr));
						ok.appendTo(buttonsTemp);
						
						var cncl =  $($("<button/>").append($("<i class=\"icon-remove\">")).append(deleteButton.cancel));
						var delcancel = function(actTr){
							return function(){
								actTr.empty();
								createRow(item,actTr);
							};
						};
						cncl.click(delcancel(actTr));
						cncl.appendTo(buttonsTemp);
						
						//td.appendTo(actTr);
						
						};
					};
					
					deleteTemp.click(del(item));
					deleteTemp.appendTo(buttonsTemp);
					
				}
				
				buttonsTemp.appendTo(actTr);
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
			
			
			
			
			
			thead.appendTo(table);
			

			dataSource.read(ko.utils.unwrapObservable(pagination.elementPerPage),ko.utils.unwrapObservable(pagination.actualPage),callbackRead,orderBy,ascDesc);
			
			
			if (insertButton){
				tfoot = $("<tfoot/>");
				var createFooter = function (actTr){
					actTr.empty();
					for (var j = 0; j<header.length; j+=1){
						var td = $("<td/>");
						td.appendTo(tfoot);
					}
					var buttonsTemp= $("<td/>");
				
					
					var insertTemp=$("<button>");
					if (insertButton.icon){
						if (insertButton.label){
							insertTemp.append($("<i class=\""+insertButton.icon+"\"></i>")).append(insertButton.label);
						} else {
							insertTemp.append($("<i class=\""+insertButton.icon+"\"/>"));
						}
					} else if (insertButton.label){
						insertTemp.append(insertButton.label);
					} else {
						insertTemp.append($("<i class=\"icon-edit\"/>"));
					}
					
					var insertcallback = function (actTr){
						return function(){
	
							actTr.empty();
							for (var j = 0; j<header.length; j+=1){
						
								if (header[j].insertable!==false){
									
									var td = $("<td/>");
									createEditableCell(header[j],td);
								} else {
									var td = $("<td/>");
								}
								td.appendTo(tfoot);
		
							}
							
		
							var td=$("<td/>");
							var ok = $("<button />").append($("<i class=\"icon-ok\">"));
							var insertNew = function(actTr){
								return function(){
									var item={};
									
									for (var j = 0; j<header.length; j+=1){
										if (header[j].insertable!==false){
												
											if (header[j].type!=="bool"){
												item[header[j].prop] = actTr.find("input[name=\""+header[j].prop+"\"]")[0].value;										
											} else {
												item[header[j].prop] = $(actTr.find("input[name=\""+header[j].prop+"\"]")[0]).prop('checked');
											}
										}
									}
									
									
									
								dataSource.insert(item);
								};
							};
							ok.click(insertNew(actTr));
							ok.appendTo(td);
							
							var cncl =  $("<button/>").append($("<i class=\"icon-remove\">"));
							var cancel = function(actTr){
								return function(){
									createFooter(actTr);
								};
							};
							cncl.click(cancel(actTr));
							cncl.appendTo(td);
							
							td.appendTo(actTr);
						};
					};
					
					insertTemp.click(insertcallback(actTr));
					
					insertTemp.appendTo(buttonsTemp);
					
					buttonsTemp.appendTo(actTr);
				};
				
			createFooter(tfoot);
				
			tfoot.appendTo(table);
			}
				
				
			
			
			
			

			table.appendTo(elem);
			values.items=items;
			
			var innerBindingContext = bindingContext.extend(values);
			ko.applyBindingsToDescendants(innerBindingContext, element);
			
			
		}
	};
});