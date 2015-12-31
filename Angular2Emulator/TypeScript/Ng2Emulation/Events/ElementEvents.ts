/**
 * Copied and modified from ng-forward: https://github.com/tolemac/ng-forward/blob/master/lib/events/events.ts
 */

let events = [
    "click",
    "dblclick",
    "mousedown",
    "mouseup",
    "mouseover",
    "mouseout",
    "mousemove",
    "mouseenter",
    "mouseleave",
    "keydown",
    "keyup",
    "keypress",
    "submit",
    "focus",
    "blur",
    "copy",
    "cut",
    "paste",
    "change",
    "dragstart",
    "drag",
    "dragenter",
    "dragleave",
    "dragover",
    "drop",
    "dragend",
    "error",
    "input",
    "load",
    "wheel",
    "scroll"
];

function add(...customEvents: string[]) {
    customEvents.forEach(event => events.push(event));
}

function exists(eventName) {
	return events.indexOf(eventName) >= 0;
}

export default { add, exists };