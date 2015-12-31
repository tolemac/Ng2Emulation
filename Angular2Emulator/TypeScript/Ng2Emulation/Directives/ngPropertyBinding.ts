import {Directive, Inject} from "../Ng2Emulation";
import {DEFAULT_CONTROLLER_AS} from "../Core/Angular1Wrapper";
import {directiveNormalize} from "../Utils/AngularHelpers"

/**
 * Directive to do Property binding.
 * Uses by template parser. PropertyBindingRule search in template [property]="expression" and replace 
 * by ng-property-binging="property=>expression", this way we emulate ng2 behaivor. Sample:
 *		<button (click)="addTodo()"/>
 * Parser change it by:
 *		<button ng-property-binding="property=>expression"/>
 */
@Directive({ selector: "ng-property-binding", priority: -1000 })
export class NgPropertyBinding {
	public expression: any;

    constructor(
		//@Inject("$parse") $parse: ng.IParseService,
		@Inject("$element") public $element: any,
		@Inject("$attrs") $attrs: ng.IAttributes,
		@Inject("$scope") public $scope: ng.IScope,
		@Inject("$interpolate") public $interpolate: ng.IInterpolateService) {

		const attrValues = $attrs["ngPropertyBinding"].split("=>");
		const property = attrValues[0];
		this.expression = attrValues[1];

		const interpolateFn = (scope) => {
		    const newScope = scope.hasOwnProperty(DEFAULT_CONTROLLER_AS) ? scope[DEFAULT_CONTROLLER_AS] : scope;
		    return $interpolate("{{" + this.expression + "}}")(newScope);
		};

		// Attribute binding.
		if (property.substr(0, 5) === "attr.") {
			const attributeName = property.substr(5);
			this.$scope.$watch(interpolateFn, (newValue, oldValue) => {
				if (newValue !== $element[0].getAttribute(attributeName))
					$element[0].setAttribute(attributeName, newValue);
			});
			return;
		}

		// Class binding.
		if (property.substr(0, 6) === "class.") {
			const className = property.substr(6);
			this.$scope.$watch(interpolateFn, (newValue, oldValue) => {
				if (newValue)
					$element[0].classList.add(className);
				else
					$element[0].classList.remove(className);
			});
			return;
		}

		// Style binding.
		if (property.substr(0, 6) === "style.") {
			const [styleName, units] = property.substr(6).split(".");

			this.$scope.$watch(interpolateFn, (newValue, oldValue) => {
				if (units)
					newValue = newValue + units;

				if (newValue !== $element[0].style[styleName])
					$element[0].style[styleName] = newValue;
			});
			return;
		}

		// Component property binding.
	    const component: any = $element.controller(directiveNormalize($element[0].localName));
		if (component && component.constructor.$componentMetadata) {
			if (component.constructor.$componentMetadata.inputs && component.constructor.$componentMetadata.inputs.indexOf(property) >= 0) {

				this.$scope.$watch(interpolateFn, (newValue, oldValue) => {
					if (newValue !== component[property])
						component[property] = newValue;
				});
			} else
				console.log(`Error processing property binding ${$attrs["ngPropertyBinding"]}`);
			return;
		} else {
			this.$scope.$watch(interpolateFn, (newValue, oldValue) => {
				if (newValue !== $element[0][property])
					$element[0][property] = newValue;
			});
			return;
		}
    }
}  