define(["jquery", "knockout", "jqueryui"], function($, ko){
	ko.bindingHandlers.datePicker = {
		init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext){
			$(element).datepicker({
				onSelect: function(dateText, inst) {
					var observable = valueAccessor().selectedDate;
					if (ko.isWriteableObservable(observable)){
						observable(dateText);
					}
				}
			});
			
			$(element).datepicker("option", "dateFormat", "yy-mm-dd");
			$.datepicker.setDefaults($.datepicker.regional['']);
		},
		update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
			var values = valueAccessor();
			$(element).datepicker("setDate", ko.utils.unwrapObservable(values.selectedDate));
			
			if (values.minDate){
				$(element).datepicker("option", "minDate", ko.utils.unwrapObservable(values.minDate));
			}

			if (values.maxDate){
				$(element).datepicker("option", "maxDate", ko.utils.unwrapObservable(values.maxDate));
			}
			
			if (values.startDate){
				$(element).datepicker("option", "minDate", ko.utils.unwrapObservable(values.startDate));
			}
			if (values.endDate){
				$(element).datepicker("option", "maxDate", ko.utils.unwrapObservable(values.endDate));
			}

			if (values.currentLang){
				if (ko.utils.unwrapObservable(values.currentLang)==="en") {
					$(element).datepicker("option", $.datepicker.regional[""]);
					$(element).datepicker("option", "dateFormat", "yy-mm-dd");
				} else {
					$(element).datepicker("option", $.datepicker.regional[ko.utils.unwrapObservable(values.currentLang)]);
					$(element).datepicker("option", "dateFormat", "yy-mm-dd");
				}
			}
		}
	};
});