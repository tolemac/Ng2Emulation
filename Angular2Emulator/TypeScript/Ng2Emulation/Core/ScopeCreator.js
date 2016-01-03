System.register(["../Core/Angular1Wrapper"], function(exports_1) {
    var Angular1Wrapper_1;
    var objects;
    function createScope(scope) {
        return scope;
        //const newScope = scope.hasOwnProperty(DEFAULT_CONTROLLER_AS) ? scope[DEFAULT_CONTROLLER_AS] : scope;
        //return newScope;
        //objects = [scope];
        //loadObjects(scope);
        //const result = {};
        //for (let i = objects.length - 1; i >= 0; i--) {
        //	const obj = objects[i];
        //	for (let p in obj)
        //		result[p] = obj[p];
        //}
        //return result;
    }
    exports_1("createScope", createScope);
    function loadObjects(obj) {
        if (obj.hasOwnProperty(Angular1Wrapper_1.DEFAULT_CONTROLLER_AS))
            objects.push(obj[Angular1Wrapper_1.DEFAULT_CONTROLLER_AS]);
        if (obj.$parent)
            loadObjects(obj.$parent);
    }
    return {
        setters:[
            function (Angular1Wrapper_1_1) {
                Angular1Wrapper_1 = Angular1Wrapper_1_1;
            }],
        execute: function() {
        }
    }
});
//# sourceMappingURL=C:/Users/Javier/Desarrollo/Angular/Ng2Emulation/Angular2Emulator/TypeScript/Ng2Emulation/Core/ScopeCreator.js.map