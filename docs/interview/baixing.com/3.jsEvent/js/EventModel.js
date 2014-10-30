(function( window, undefined ) {

    var gid = 0,
        gCache = {},
        doc = window.document,
        w3c = !! doc.addEventListener,
        expando = 'event_' + (''+Math.random()).replace(/\D/g, ''),

        addListener = w3c ?
            function(el, type, fn) { el.addEventListener(type, fn, false); } :
            function(el, type, fn) { el.attachEvent('on' + type, fn); },

        removeListener = w3c ?
            function(el, type, fn) { el.removeEventListener(type, fn, false); } :
            function(el, type, fn) { el.detachEvent('on' + type, fn); },

        dispatch = w3c ?
            function( el, type ){
                try{
                    var evt = doc.createEvent('Event');
                    evt.initEvent( type, true, true );
                    el.dispatchEvent( evt );
                }catch( e ){ alert( e ); };
            } :
            function( el, type ){
                try{
                    el.fireEvent( 'on' + type );
                }catch( e ){ alert( e ); }
            },

        dataManager = {
            data : function ( elem, name, data ) {
                if(elem.nodeType){
                    //如果是字符串则说明是get操作，返回指定key的data
                    var getByName = typeof name === 'string', 

                        thisCache,

                        cache =  gCache,

                        id = elem[ expando ];

                    if( ! id ) {
                        elem[expando] = id = ++gid;
                    }

                    if( ! cache[id]){
                        cache[id] = {};
                    }

                    thisCache = cache[id];

                    //如果存在data则赋值
                    if(data !== undefined) {
                        thisCache[name] = data;
                    }

                    return getByName ? thisCache[name] : thisCache;
                }
            },
            removeData : function  ( elem, name ) {
                var id = elem[expando],
                    thisCache = gCache[id];

                if( ! id || ! thisCache){
                    return;
                }

                if(typeof name === 'string') {
                    delete thisCache[name];
                }else{
                    delete gCache[id];
                }
            }
        };

    function returnFalse() {
        return false;
    }

    function returnTrue() {
        return true;
    }

    function now() {
        return (new Date).getTime();
    }

    function isEmptyObject( obj ){
        for( var i in obj ){
            return false;
        }
        return true;
    }
    
    function addEvent (elem, types, handler, data) {

        /* text和comment元素不作处理*/
        if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
            return;
        }

        /* 当回调函数是false时，使用使用一个return false的函数 */
        if ( handler === false ) {
            handler = returnFalse;
        } else if ( ! handler ) {
            return;
        }

        var elemData = dataManager.data( elem ),
            events   = elemData.events,
            eventHandle = elemData.handle;
            
        //允许 一次性事件绑定多个事件'click mouseover blur'
        types = types.split(' ');

        if ( ! events ) {
            elemData.events = events = {};
        }

        if ( ! eventHandle ) {
            elemData.handle = eventHandle = function ( e ) {
                return evtHandle.call( eventHandle.elem, e );
            };
        }

        eventHandle.elem = elem;

        var type, i = 0;
        for(i; i<types.length; i++){
            type = types[i];
            var handleObj = {handler : handler, data : data},
                handlers  = events[type];
        
            if ( ! handlers ) {
                handlers = events[type] = [];
                addListener( elem, type, eventHandle );
            }

            handlers.push( handleObj );
        }

        elem = null;
    }

    function evtHandle ( event ) {
        event = fixEvent( event || window.event );
        
        //取得对应事件的处理函数数组 slice(0）
        var handlers = ((dataManager.data(this, 'events') || {})[event.type] || []).slice(0);
        event.currentTarget = this;

        for( var j = 0, l = handlers.length; j < l; j++ ) {
            var handleObj = handlers[j];
            event.handler = handleObj.handler;
            event.data = handleObj.data;
            event.handleObj = handleObj;

            var ret = handleObj.handler.call( this, event );

            //如果时间处理函数返回false则阻止浏览器默认行为，停止事件冒泡
            if( ret !== undefined ) {
                if( ret === false ) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            }

            //如果调用过event.stopImmediatePropagation(), 则不再处理其他监听
            if( event.isImmediatePropagationStopped() ) {
                break;
            }
        }
    }

    function removeEvent( elem, types, handler ) {
         /* text和comment元素不作处理*/
        if( elem.nodeType === 3 || elem.nodeType === 8 ) {
            return;
        }

        if( handler === false ) {
            handler = returnFalse;
        }

        var type, origType, i = 0, j,
            elemData = dataManager.data( elem ),
            events = elemData && elemData.events;

        if( ! elemData || ! events ) {
            return;
        }

        // Unbind all events for the element
        if( ! types ) {
            types = types || '';
            for ( type in events ) {
                removeEvent( elem, type );
            }
            return;
        }

        //unbind(el, 'mouseover mouseout', fn);
        types = types.split(' ');

        while( (type = types[ i++ ]) ) {
            origType = type;
            handleObj = null;

            eventType = events[ type ];

            if( ! eventType ) {
                continue;
            }

            if( ! handler ) {
                for ( j = 0; j < eventType.length; j++ ) {
                    handleObj = eventType[ j ];
                    removeEvent( elem, origType, handleObj.handler );
                    eventType.splice( j--, 1 );
                }
                continue;
            }

            for( j = 0; j < eventType.length; j++ ) {
                handleObj = eventType[ j ];

                if( handler === handleObj.handler ) {
                    // remove the given handler for the given type
                    eventType.splice( j--, 1 );

                }
            }

        }

        // remove generic event handler if no more handlers exist
        if ( eventType.length === 0 ) {
            delete events[ origType ];
        }

        // Remove the expando if it's no longer used
        if ( isEmptyObject( events ) ) {
            var handle = elemData.handle;
            if ( handle ) {
                handle.elem = null;
            }

            delete elemData.events;
            delete elemData.handle;

            if ( isEmptyObject( elemData ) ) {
                dataManager.removeData( elem, 'events' );
            }
        }


    }

    function Event( src ) {
        this.originalEvent = src;
        this.timeStamp = now();
    }
    Event.prototype = {
        //阻止事件默认行为
        preventDefault: function() {
            this.isDefaultPrevented = returnTrue;
            var e = this.originalEvent;
            if( e.preventDefault ) {
                e.preventDefault();
            }
            e.returnValue = false;
        },
        //阻止事件冒泡
        stopPropagation: function() {
            this.isPropagationStopped = returnTrue;
            var e = this.originalEvent;
            if( e.stopPropagation ) {
                e.stopPropagation();
            }		
            e.cancelBubble = true;
        },
        //阻止掉同一事件的其他优先级较低的侦听器的处理
        stopImmediatePropagation: function() {
            this.isImmediatePropagationStopped = returnTrue;
            this.stopPropagation();
        },
        isDefaultPrevented: returnFalse,
        isPropagationStopped: returnFalse,
        isImmediatePropagationStopped: returnFalse
    };	

    //Event对象跨浏览器兼容
    function fixEvent( evt ) {
        var props = 'altKey type attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which'.split(' '),
            len   = props.length;

        var originalEvent = evt;
        evt = new Event(originalEvent);

        for(var i = len, prop; i;) {
            prop = props[ --i ];
            evt[ prop ] = originalEvent[ prop ];
        }
        if( ! evt.target) {
            evt.target = evt.srcElement || document;
        }
        if( evt.target.nodeType === 3 ) {
            evt.target = evt.target.parentNode;
        }
        if( ! evt.relatedTarget && evt.fromElement ) {
            evt.relatedTarget = evt.fromElement === evt.target ? evt.toElement : evt.fromElement;
        }
        if( evt.pageX == null && evt.clientX != null ) {
            var doc = document.documentElement, body = document.body;
            evt.pageX = evt.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
            evt.pageY = evt.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0);
        }
        if( ! evt.which && ((evt.charCode || evt.charCode === 0) ? evt.charCode : evt.keyCode) ) {
            evt.which = evt.charCode || evt.keyCode;
        }
        if( ! evt.metaKey && evt.ctrlKey ) {
            evt.metaKey = evt.ctrlKey;
        }
        if( ! evt.which && evt.button !== undefined ) {
            evt.which = (evt.button & 1 ? 1 : ( evt.button & 2 ? 3 : ( evt.button & 4 ? 2 : 0 ) ));
        }

        return evt;
    }

    //绑定事件
    function bind ( el, type, fn, data ) {
        /*
         * bind(el, {'click': function(){}, 'blur': function(){}});
         */
        if( typeof type === 'object' ) {
            for( var key in type ) {
                bind(el, key, type[key], data);
            }
            return;
        }
        addEvent( el, type, fn, data );
    }

    //取消绑定
    function unbind ( el, type, fn ) {
        if( typeof type === 'object' ) {
            for ( var key in type ) {
                unbind( el, key, type[key] );
            }

        }else {
            removeEvent( el, type, fn );
        }
    }


    //公开接口
    window.EventModel = {
        'bind' : bind,
        'unbind' : unbind
    };

})( window );
