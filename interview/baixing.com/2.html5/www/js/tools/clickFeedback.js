define(['jquery'], function($){
	return function(jqueryObj, callback){
		if(jqueryObj instanceof $)
		{
			var attrName = 'data-autoclose-status';
			jqueryObj.hover(
				function(){
					$(this).attr(attrName, 'in');
				}, 
				function(){
					$(this).attr(attrName, 'out');
				}
			);

			var bindDocumentClick = function(){
				setTimeout(function(){
					$(document).one('click', function(){
						if('in' !== jqueryObj.attr(attrName) && 'function' === typeof callback){
							callback.call(jqueryObj);
						}
					});
				}, 100);
			};
			bindDocumentClick();

			jqueryObj.click(function(){
				bindDocumentClick();
			});
		}
	}
});