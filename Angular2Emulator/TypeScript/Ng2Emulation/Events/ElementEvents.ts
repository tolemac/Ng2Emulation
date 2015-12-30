/**
 * Copied and modified from ng-forward: https://github.com/tolemac/ng-forward/blob/master/lib/events/events.ts
 */
import {Directive, Inject} from '../Ng2Emulation';
import {dasherize, parseSelector} from '../Utils/AngularHelpers';
import {DEFAULT_CONTROLLER_AS} from "../Core/Angular1Wrapper";

let events = [
    'click',
    'dblclick',
    'mousedown',
    'mouseup',
    'mouseover',
    'mouseout',
    'mousemove',
    'mouseenter',
    'mouseleave',
    'keydown',
    'keyup',
    'keypress',
    'submit',
    { selector: '(ngsubmit)', event: "submit"},
    'focus',
    'blur',
    'copy',
    'cut',
    'paste',
    'change',
    'dragstart',
    'drag',
    'dragenter',
    'dragleave',
    'dragover',
    'drop',
    'dragend',
    'error',
    'input',
    'load',
    'wheel',
    'scroll'
];

function resolve(): any[] {
    let directives: any[] = [];

    events.forEach(eventItem => {
        const event = typeof eventItem === "object" ? eventItem.event : eventItem;
        const selector = typeof eventItem === "object" ? eventItem.selector : `(${dasherize(<any>eventItem)})`;
        @Directive({ selector })        
        class EventHandler {
            public expression: any;

            constructor(
                @Inject("$parse") $parse: ng.IParseService,
                @Inject("$element") public $element: JQuery,
                @Inject("$attrs") $attrs: ng.IAttributes,
                @Inject("$scope") public $scope: ng.IScope) {

                let { name: attrName } = parseSelector(selector);
                this.expression = $parse($attrs[attrName]);
                $element.on(event, e => this.eventHandler(e));
                $scope.$on('$destroy', () => this.onDestroy());
            }

            eventHandler($event: any = {}) {
                let detail = $event.detail;

                if (!detail && $event.originalEvent && $event.originalEvent.detail) {
                    detail = $event.originalEvent.detail;
                }
                else if (!detail || typeof detail !== "object") {
                    detail = {};
                }

                this.expression(this.$scope[DEFAULT_CONTROLLER_AS], angular.extend($event, { detail }));
                this.$scope.$applyAsync();
            }

            onDestroy() {
                this.$element.off(event);
            }
        }

        directives.push(EventHandler);
    });

    return directives;
}

function add(...customEvents: string[]) {
    customEvents.forEach(event => events.push(event));
}

export default { resolve, add };