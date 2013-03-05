define(["jquery","knockout"], function($, ko) {
	
	
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
		
		for (var i=0; i<length; i+=1){
			if (!links[i].name){
				links[i].name="";
			}
			if (links[i].href){
				var hrefActElement = $( "<a href="+links[i].href+">"+links[i].name+"</a>");
			} else if (links[i].callback) {
				var hrefActElement = $( "<a href=\"#\">"+links[i].name+"</a>");
				hrefActElement.click(links[i].callback);
			} else {
				var hrefActElement = $( "<a href=\"#\">"+links[i].name+"</a>");
			}
			if (links[i].icon){
				hrefActElement.prepend("<i class="+links[i].icon+"></i>");
			}
			var liElement = $("<li />");
			liElement.append(hrefActElement);
			ulElement.append(liElement);
		}
		
		innerElement.append(ulElement);
		
		
		
		elem.append(innerElement);
		
		
		
		
	};
	
	ko.bindingHandlers.navbar = {
			init:function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext){
				var elem = $(element);
				elem.addClass("navbar");
			},
			update: update
	};
});
	