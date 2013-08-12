define(function() {
    
    // testInputAttr
    // --------
    // 判断浏览器的html5 input新属性支持情况
    // Thanks to
    // - http://modernizr.com/
    
    return function(attr){
        var testInputAttr = {};
        var inputElem  = document.createElement('input');
        var attrs = {};

        testInputAttr = (function( props ) {
            for ( var i = 0, len = props.length; i < len; i++ ) {
                attrs[ props[i] ] = !!(props[i] in inputElem);
            }
            if (attrs.list){
                attrs.list = !!(document.createElement('datalist') && window.HTMLDataListElement);
            }
            return attrs;
        })('autocomplete autofocus list placeholder max min multiple pattern required step'.split(' '));

        return testInputAttr[attr];
    };
});
