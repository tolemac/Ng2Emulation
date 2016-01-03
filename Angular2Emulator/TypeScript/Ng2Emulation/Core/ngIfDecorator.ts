import {createScope} from "../Core/ScopeCreator";

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

function decorateNgIf(app: ng.IModule) {
	app.config(["$provide", ($provide: ng.auto.IProvideService) => {
		$provide.decorator("ngIfDirective", ["$delegate", "$animate", "$parse", ($delegate, $animate, $parse : ng.IParseService) => {
			const directive = $delegate[0];
			const origLink = directive.link;

			directive.link = function($scope, $element, $attr, ctrl, $transclude) {
				var block, childScope, previousElements;

				const newScope = createScope($scope);

				$scope.$watch($parse($attr.ngIf)(newScope), function ngIfWatchAction(value) {

					if (value) {
						if (!childScope) {
							$transclude(function(clone, newScope) {
								childScope = newScope;
								clone[clone.length++] = document.createComment(' end ngIf: ' + $attr.ngIf + ' ');
								// Note: We only need the first/last node of the cloned nodes.
								// However, we need to keep the reference to the jqlite wrapper as it might be changed later
								// by a directive with templateUrl when its template arrives.
								block = {
									clone: clone
								};
								$animate.enter(clone, $element.parent(), $element);
							});
						}
					} else {
						if (previousElements) {
							previousElements.remove();
							previousElements = null;
						}
						if (childScope) {
							childScope.$destroy();
							childScope = null;
						}
						if (block) {
							previousElements = getBlockNodes(block.clone);
							$animate.leave(previousElements).then(function() {
								previousElements = null;
							});
							block = null;
						}
					}
				});

			}
			return $delegate;
		}]);
	}]);
}


export default decorateNgIf;