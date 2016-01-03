//function(scope, locals, assign, inputs) {
//	var v0, v1, v2, v3 = locals && ('onSelect' in locals), v4, v5 = locals && ('hero' in locals);
//	v2 = v3 ? locals : scope;
//	if (!(v3)) {
//		if (scope) {
//			v1 = scope.onSelect;
//		}
//	} else {
//		v1 = locals.onSelect;
//	}
//	if (v1 != null) {
//		ensureSafeFunction(v1, text);
//		if (!(v5)) {
//			if (scope) {
//				v4 = scope.hero;
//			}
//		} else {
//			v4 = locals.hero;
//		}
//		ensureSafeObject(v2, text);
//		v0 = ensureSafeObject(v2.onSelect(ensureSafeObject(v4, text)), text);
//	} else {
//		v0 = undefined;
//	}
//	return v0;
//}