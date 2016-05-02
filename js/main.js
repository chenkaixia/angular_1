/**
 * bootstraps angular onto the window.document node
 * NOTE: the ng-app attribute should not be on the index.html when using ng.bootstrap
 */


define(['require_config'], function() {
	require(['domReady!','angular','app'], function (document,angular) {
		angular.bootstrap(document, ['app']);
  	});
});
