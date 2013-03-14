define([], function () {
	return function (obj) {
		return function (jQueryElem) {
			return function (key) {
				if (typeof obj[key] === "string") {
					jQueryElem.addClass(obj[key]);
				}
			};
		};
	};
});
