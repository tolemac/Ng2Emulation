import {Directive, Inject} from "../Ng2Emulation";
import {DEFAULT_CONTROLLER_AS} from "../Core/Angular1Wrapper";
import ElementEvents from "../Events/ElementEvents";
import {directiveNormalize} from "../Utils/AngularHelpers";
//import {getOwnPropertyNameInsensitiveCase, indexOfInsensitiveCase} from "../Utils/Utils";
import {registerChange, SimpleChange} from "../Core/ChangeDetection"

/**
 * Directive to do Event binding.
 * Uses by template parser. EventBindingRule search in template (event)="expression" and replace 
 * by ng-event-binging="event=>expression", this way we emulate ng2 behaivor. Sample:
 *		<button (click)="addTodo()"/>
 * Parser change it by:
 *		<button ng-event-binding="event=>expression"/>
 */
@Directive({ selector: "ng-event-binding", priority: -1000 })
export class NgEventBinding {
	public expression: any;

/**
 * Copied and modified from ng-forward: https://github.com/tolemac/ng-forward/blob/master/lib/events/events.ts
 */
    constructor(
		@Inject("$parse") $parse: ng.IParseService,
	    @Inject("$element") public $element: any,
	    @Inject("$attrs") $attrs: ng.IAttributes,
	    @Inject("$scope") public $scope: ng.IScope) {

        const parts = $attrs["ngEventBinding"].split("[&&]");
        for (let i = 0; i < parts.length; i++) {
            const binding = parts[i];
            if (binding) {
                this.createBinding(binding, $parse, $element, $scope);
            }
        }
    }

    createBinding(binding, $parse, $element, $scope) {
        const attrValues = binding.split("=>");
        const event = attrValues[0];
        this.expression = $parse(attrValues[1]);

        const component: any = $element.controller(directiveNormalize($element[0].localName));
        if (component && component.constructor.$componentMetadata) {
            // Component event binding (must be in component outputs)
            if (component.constructor.$componentMetadata.outputs && component.constructor.$componentMetadata.outputs.indexOf(event) >= 0)
                component[event].subscribe(eventEmitted => {
                    this.eventHandler(eventEmitted);
                    registerChange(component, event, new SimpleChange(undefined, eventEmitted));
                });
            else
                console.log(`Error processing ${binding}`);
            return;
        }

        if (ElementEvents.exists(event)) {
            // DOM element binding.
            $element.on(event, e => this.eventHandler(e));
            $scope.$on("$destroy", () => this.onDestroy());
            return;
        }
    }

	eventHandler($event: any = {}) {
		let parameters = { $event };
		if (typeof $event === "object") {
			let detail = $event.detail;

			if (!detail && $event.originalEvent && $event.originalEvent.detail) {
				detail = $event.originalEvent.detail;
			} else if (!detail || typeof detail !== "object") {
				detail = {};
			}
			parameters = { $event: angular.extend($event, { detail }) };
		}

		const newScope = this.$scope;//this.$scope.hasOwnProperty(DEFAULT_CONTROLLER_AS) ? this.$scope[DEFAULT_CONTROLLER_AS] : this.$scope;
		this.expression(newScope, parameters);
		this.$scope.$applyAsync();
	}

	onDestroy() {
		this.$element.off(event);
	}

} 