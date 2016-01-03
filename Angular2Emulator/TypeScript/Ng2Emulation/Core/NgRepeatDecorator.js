System.register([], function(exports_1) {
    var uid, ngRepeatDirective;
    function minErr(module, ErrorConstructor) {
        ErrorConstructor = ErrorConstructor || Error;
        return function () {
            var SKIP_INDEXES = 2;
            var templateArgs = arguments, code = templateArgs[0], message = '[' + (module ? module + ':' : '') + code + '] ', template = templateArgs[1], paramPrefix, i;
            message += template.replace(/\{\d+\}/g, function (match) {
                var index = +match.slice(1, -1), shiftedIndex = index + SKIP_INDEXES;
                if (shiftedIndex < templateArgs.length) {
                    return (templateArgs[shiftedIndex]).toString();
                }
                return match;
            });
            message += '\nhttp://errors.angularjs.org/1.4.8/' +
                (module ? module + '/' : '') + code;
            for (i = SKIP_INDEXES, paramPrefix = '?'; i < templateArgs.length; i++, paramPrefix = '&') {
                message += paramPrefix + 'p' + (i - SKIP_INDEXES) + '=' +
                    encodeURIComponent((templateArgs[i]).toString());
            }
            return new ErrorConstructor(message);
        };
    }
    function createMap() {
        return Object.create(null);
    }
    function isArrayLike(obj) {
        // `null`, `undefined` and `window` are not array-like
        if (obj == null || obj === window)
            return false;
        // arrays, strings and jQuery/jqLite objects are array like
        // * jqLite is either the jQuery or jqLite constructor function
        // * we have to check the existance of jqLite first as this method is called
        //   via the forEach method when constructing the jqLite object in the first place
        if (angular.isArray(obj) || angular.isString(obj))
            return true;
        // Support: iOS 8.2 (not reproducible in simulator)
        // "length" in obj used to prevent JIT error (gh-11508)
        var length = "length" in Object(obj) && obj.length;
        // NodeList objects (with `item` method) and
        // other objects with suitable length characteristics are array-like
        return angular.isNumber(length) &&
            (length >= 0 && (length - 1) in obj || typeof obj.item == 'function');
    }
    function getBlockNodes(nodes) {
        // TODO(perf): update `nodes` instead of creating a new object?
        var node = nodes[0];
        var endNode = nodes[nodes.length - 1];
        var blockNodes;
        for (var i = 1; node !== endNode && (node = node.nextSibling); i++) {
            if (blockNodes || nodes[i] !== node) {
                if (!blockNodes) {
                    blockNodes = $([].slice.call(nodes, 0, i));
                }
                blockNodes.push(node);
            }
        }
        return blockNodes || nodes;
    }
    function nextUid() {
        return ++uid;
    }
    function hashKey(obj, nextUidFn) {
        var key = obj && obj.$$hashKey;
        if (key) {
            if (typeof key === 'function') {
                key = obj.$$hashKey();
            }
            return key;
        }
        var objType = typeof obj;
        if (objType == 'function' || (objType == 'object' && obj !== null)) {
            key = obj.$$hashKey = objType + ':' + (nextUidFn || nextUid)();
        }
        else {
            key = objType + ':' + obj;
        }
        return key;
    }
    function decorateNgRepeat(app) {
        app.config(["$provide", function ($provide) {
                $provide.decorator("ngRepeatDirective", ["$delegate", "$injector", function ($delegate, $injector) {
                        var directive = $delegate[0];
                        $delegate[0] = $injector.invoke(ngRepeatDirective);
                        return $delegate;
                    }]);
            }]);
    }
    return {
        setters:[],
        execute: function() {
            uid = 0;
            ngRepeatDirective = ['$parse', '$animate', function ($parse, $animate) {
                    var NG_REMOVED = '$$NG_REMOVED';
                    var ngRepeatMinErr = minErr('ngRepeat');
                    var updateScope = function (scope, index, valueIdentifier, value, keyIdentifier, key, arrayLength) {
                        // TODO(perf): generate setters to shave off ~40ms or 1-1.5%
                        scope[valueIdentifier] = value;
                        if (keyIdentifier)
                            scope[keyIdentifier] = key;
                        scope.$index = index;
                        scope.$first = (index === 0);
                        scope.$last = (index === (arrayLength - 1));
                        scope.$middle = !(scope.$first || scope.$last);
                        // jshint bitwise: false
                        scope.$odd = !(scope.$even = (index & 1) === 0);
                        // jshint bitwise: true
                    };
                    var getBlockStart = function (block) {
                        return block.clone[0];
                    };
                    var getBlockEnd = function (block) {
                        return block.clone[block.clone.length - 1];
                    };
                    return {
                        restrict: 'A',
                        multiElement: true,
                        transclude: 'element',
                        priority: 1000,
                        terminal: true,
                        $$tlb: true,
                        compile: function ngRepeatCompile($element, $attr) {
                            var expression = $attr.ngRepeat;
                            var ngRepeatEndComment = document.createComment(' end ngRepeat: ' + expression + ' ');
                            var match = expression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);
                            if (!match) {
                                throw ngRepeatMinErr('iexp', "Expected expression in form of '_item_ in _collection_[ track by _id_]' but got '{0}'.", expression);
                            }
                            var lhs = match[1];
                            var rhs = match[2];
                            var aliasAs = match[3];
                            var trackByExp = match[4];
                            match = lhs.match(/^(?:(\s*[\$\w]+)|\(\s*([\$\w]+)\s*,\s*([\$\w]+)\s*\))$/);
                            if (!match) {
                                throw ngRepeatMinErr('iidexp', "'_item_' in '_item_ in _collection_' should be an identifier or '(_key_, _value_)' expression, but got '{0}'.", lhs);
                            }
                            var valueIdentifier = match[3] || match[1];
                            var keyIdentifier = match[2];
                            if (aliasAs && (!/^[$a-zA-Z_][$a-zA-Z0-9_]*$/.test(aliasAs) ||
                                /^(null|undefined|this|\$index|\$first|\$middle|\$last|\$even|\$odd|\$parent|\$root|\$id)$/.test(aliasAs))) {
                                throw ngRepeatMinErr('badident', "alias '{0}' is invalid --- must be a valid JS identifier which is not a reserved name.", aliasAs);
                            }
                            var trackByExpGetter, trackByIdExpFn, trackByIdArrayFn, trackByIdObjFn;
                            var hashFnLocals = { $id: hashKey };
                            if (trackByExp) {
                                trackByExpGetter = $parse(trackByExp);
                            }
                            else {
                                trackByIdArrayFn = function (key, value) {
                                    return hashKey(value);
                                };
                                trackByIdObjFn = function (key) {
                                    return key;
                                };
                            }
                            return function ngRepeatLink($scope, $element, $attr, ctrl, $transclude) {
                                if (trackByExpGetter) {
                                    trackByIdExpFn = function (key, value, index) {
                                        // assign key, value, and $index to the locals so that they can be used in hash functions
                                        if (keyIdentifier)
                                            hashFnLocals[keyIdentifier] = key;
                                        hashFnLocals[valueIdentifier] = value;
                                        hashFnLocals.$index = index;
                                        return trackByExpGetter($scope, hashFnLocals);
                                    };
                                }
                                // Store a list of elements from previous run. This is a hash where key is the item from the
                                // iterator, and the value is objects with following properties.
                                //   - scope: bound scope
                                //   - element: previous element.
                                //   - index: position
                                //
                                // We are using no-proto object so that we don't need to guard against inherited props via
                                // hasOwnProperty.
                                var lastBlockMap = createMap();
                                //watch props
                                $scope.$watchCollection(rhs, function ngRepeatAction(collection) {
                                    var index, length, previousNode = $element[0], // node that cloned nodes should be inserted after
                                    // initialized to the comment node anchor
                                    nextNode, 
                                    // Same as lastBlockMap but it has the current state. It will become the
                                    // lastBlockMap on the next iteration.
                                    nextBlockMap = createMap(), collectionLength, key, value, // key/value of iteration
                                    trackById, trackByIdFn, collectionKeys, block, // last object information {scope, element, id}
                                    nextBlockOrder, elementsToRemove;
                                    if (aliasAs) {
                                        $scope[aliasAs] = collection;
                                    }
                                    if (isArrayLike(collection)) {
                                        collectionKeys = collection;
                                        trackByIdFn = trackByIdExpFn || trackByIdArrayFn;
                                    }
                                    else {
                                        trackByIdFn = trackByIdExpFn || trackByIdObjFn;
                                        // if object, extract keys, in enumeration order, unsorted
                                        collectionKeys = [];
                                        for (var itemKey in collection) {
                                            if (window.hasOwnProperty.call(collection, itemKey) && itemKey.charAt(0) !== '$') {
                                                collectionKeys.push(itemKey);
                                            }
                                        }
                                    }
                                    collectionLength = collectionKeys.length;
                                    nextBlockOrder = new Array(collectionLength);
                                    // locate existing items
                                    for (index = 0; index < collectionLength; index++) {
                                        key = (collection === collectionKeys) ? index : collectionKeys[index];
                                        value = collection[key];
                                        trackById = trackByIdFn(key, value, index);
                                        if (lastBlockMap[trackById]) {
                                            // found previously seen block
                                            block = lastBlockMap[trackById];
                                            delete lastBlockMap[trackById];
                                            nextBlockMap[trackById] = block;
                                            nextBlockOrder[index] = block;
                                        }
                                        else if (nextBlockMap[trackById]) {
                                            // if collision detected. restore lastBlockMap and throw an error
                                            angular.forEach(nextBlockOrder, function (block) {
                                                if (block && block.scope)
                                                    lastBlockMap[block.id] = block;
                                            });
                                            throw ngRepeatMinErr('dupes', "Duplicates in a repeater are not allowed. Use 'track by' expression to specify unique keys. Repeater: {0}, Duplicate key: {1}, Duplicate value: {2}", expression, trackById, value);
                                        }
                                        else {
                                            // new never before seen block
                                            nextBlockOrder[index] = { id: trackById, scope: undefined, clone: undefined };
                                            nextBlockMap[trackById] = true;
                                        }
                                    }
                                    // remove leftover items
                                    for (var blockKey in lastBlockMap) {
                                        block = lastBlockMap[blockKey];
                                        elementsToRemove = getBlockNodes(block.clone);
                                        $animate.leave(elementsToRemove);
                                        if (elementsToRemove[0].parentNode) {
                                            // if the element was not removed yet because of pending animation, mark it as deleted
                                            // so that we can ignore it later
                                            for (index = 0, length = elementsToRemove.length; index < length; index++) {
                                                elementsToRemove[index][NG_REMOVED] = true;
                                            }
                                        }
                                        block.scope.$destroy();
                                    }
                                    // we are not using forEach for perf reasons (trying to avoid #call)
                                    for (index = 0; index < collectionLength; index++) {
                                        key = (collection === collectionKeys) ? index : collectionKeys[index];
                                        value = collection[key];
                                        block = nextBlockOrder[index];
                                        if (block.scope) {
                                            // if we have already seen this object, then we need to reuse the
                                            // associated scope/element
                                            nextNode = previousNode;
                                            // skip nodes that are already pending removal via leave animation
                                            do {
                                                nextNode = nextNode.nextSibling;
                                            } while (nextNode && nextNode[NG_REMOVED]);
                                            if (getBlockStart(block) != nextNode) {
                                                // existing item which got moved
                                                $animate.move(getBlockNodes(block.clone), null, $(previousNode));
                                            }
                                            previousNode = getBlockEnd(block);
                                            updateScope(block.scope, index, valueIdentifier, value, keyIdentifier, key, collectionLength);
                                        }
                                        else {
                                            // new item which we don't know about
                                            $transclude(function ngRepeatTransclude(clone, scope) {
                                                block.scope = scope;
                                                // http://jsperf.com/clone-vs-createcomment
                                                var endNode = ngRepeatEndComment.cloneNode(false);
                                                clone[clone.length++] = endNode;
                                                // TODO(perf): support naked previousNode in `enter` to avoid creation of jqLite wrapper?
                                                $animate.enter(clone, null, $(previousNode));
                                                previousNode = endNode;
                                                // Note: We only need the first/last node of the cloned nodes.
                                                // However, we need to keep the reference to the jqlite wrapper as it might be changed later
                                                // by a directive with templateUrl when its template arrives.
                                                block.clone = clone;
                                                nextBlockMap[block.id] = block;
                                                updateScope(block.scope, index, valueIdentifier, value, keyIdentifier, key, collectionLength);
                                            });
                                        }
                                    }
                                    lastBlockMap = nextBlockMap;
                                });
                            };
                        }
                    };
                }];
            exports_1("default",decorateNgRepeat);
        }
    }
});
//# sourceMappingURL=C:/Users/Javier/Desarrollo/Angular/Ng2Emulation/Angular2Emulator/TypeScript/Ng2Emulation/Core/NgRepeatDecorator.js.map