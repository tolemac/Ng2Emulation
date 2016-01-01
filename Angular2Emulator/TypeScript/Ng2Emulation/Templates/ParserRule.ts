export abstract class ParserRule {
    processTemplate(template: string): string {

		const element = angular.element("<some>" + template + "</some>");
	    this.processElementRecursive(element);
	    return element.html();
    }

	processElementRecursive(elem: ng.IAugmentedJQuery) {
		this.processElement(elem);
		const self = this;
		elem.children().each(function() {
			self.processElementRecursive.apply(self, [angular.element(this)]);
		});
	}

	processElement(elem: ng.IAugmentedJQuery) {
		const self = this;
		elem.each(function () {
			const currentElem: HTMLElement = this;
			const attrList = $.map(currentElem.attributes, item => item);

			$.each(attrList, (index, attr) => {
				var result = self.processAttribute(attr);
				if (result) {
					currentElem.removeAttribute(attr.name);
					angular.element(currentElem).attr(result.name, result.value);
				}
			});
		});
		
	}

	abstract processAttribute(attr: Attr) : {name : string; value : string};
}