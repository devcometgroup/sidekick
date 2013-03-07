define(["jquery","knockout"], function($, ko) {
	
	var alignmentClassLookupTable = {
			"pull-left":		"pull-left",
			"left":				"pull-left",
			
			"pull-right":		"pull-right",
			"right":			"pull-right"
	};
	
	var displayClassLookupTable = {
			"navbar-fixed-top":		"navbar-fixed-top",
			"fixed-top":			"navbar-fixed-top",
			
			"navbar-fixed-bottom":	"navbar-fixed-bottom",
			"fixed-bottom":			"navbar-fixed-bottom",
			
			"navbar-static-top":	"navbar-static-top",
			"static-top":			"navbar-static-top"
	};
	
	var addClassFromLookupTable = function (elem, key, lookup) {
		if (typeof lookup[key] !== "undefined") {
			elem.addClass(lookup[key]);
		}
	};
	
	var update = function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext){
		var values = valueAccessor();
		var links = ko.utils.unwrapObservable(values.links);
		var title = ko.utils.unwrapObservable(values.title);
		var search = ko.utils.unwrapObservable(values.search);
		
		var elem=$(element);
		
		var innerElement = $("<div class=\"navbar-inner\" />");
		
	
		
		if (title){
			if (!title.name){
				title.name="";
			}
			if (title.href) {
				var titleElement = $("<a class=\"brand\" href="+title.href+">"+title.name+"</a>"); 
			} else {
				var titleElement = $("<a class=\"brand\" href=\"#\" >"+title.name+"</a>");
			}
			innerElement.append(titleElement);
		}
		
		var ulElement = $("<ul class=\"nav\" />");
		
		var length = links.length;
		
		for (var i=0; i<length; i+=1) {
			var act = links[i];
			
			var hrefActElement = "<a href=\"#\" />";
			
			if (act.name) {
				hrefActElement.text(act.name);
			}
			
			if (act.href) {
				hrefActElement.attr("href", act.href);
			}
			
			if (act.callback) {
				hrefActElement.click(act.callback);
			}
			
			if (act.icon) {
				hrefActElement.prepend("<i class="+links[i].icon+"></i>");
			}
			
			var liElement = $("<li />");
			liElement.append(hrefActElement);
			ulElement.append(liElement);
		}
		
		innerElement.append(ulElement);
		
		
		if (search){
			var searchElement = $("<form class=\" navbar-search \">");
			addClassFromLookupTable(searchElement, search.alignment, alignmentClassLookupTable);
			var inputElement = $("<input type=\"text\" class=\"search-query\" placeholder="+search.placeholder+">");
			if (search.throttle){
				var timeout = null;
				inputElement.keypress(function(e) {
					
					if (inputElement.val().length>2){
					
				    if (!timeout){
				    	timeout = setTimeout(function() {
				    		search.callback(inputElement.val());
				    		timeout = null;
				    	}, search.throttle);
				    }	
					}
				    
				});
			} else {
				inputElement.keypress(function(e) {
				    if(e.which == 13) {
				        search.callback(inputElement.val());
				    }
				});
			}

			
			searchElement.append(inputElement);
			innerElement.append(searchElement);
		}
		
		
		elem.append(innerElement);
	};
	
	ko.bindingHandlers.navbar = {
			init:function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext){
				var elem = $(element);
				var values = valueAccessor();
				elem.addClass("navbar");
				addClassFromLookupTable(elem,values.display , displayClassLookupTable);
				
			},
			update: update
	};
});
	