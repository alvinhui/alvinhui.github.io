/*!
 * mPopup - jQuery Plugin
 * version: 0.1.0 (FIR, 31 May 2013)
 * @requires jQuery v1.6 or later
 *
 * Examples at ......
 * License: MIT
 *
 * Copyright 2013 Alvin Xu - alvinxu@outlook.com
 *
 */

;(function(window, document, $){
    var W = $(window),
		D = $(document),
        M = $.mPopup = function(){
            M.open.apply( this, arguments );
        },
        isIOS6X	= function(){
             // Used for a temporary fix for ios6 timer bug when using zoom/scroll 
            return (/OS 6(_\d)+/i).test(navigator.userAgent);
        };
    
    var Mpopup = function(options, key){
        var PERFIX = '__m-popup';
        var SUFFIX = '__';
        var BUFFER = 20;
        var DEBOUNCE;
        var CLOSS_BUTTON_CLASS = 'm_close';
        
        this.key = key;
        this.element = $;
        
        this.defaults = {
            appendTo: 'body', 
            escClose: true, 
            
            followEasing: 'swing', 
            followSpeed: 500 , 
            
            opacity: 0.7, 
            scrollBar: true, 
            speed: 250,
            zIndex: 8000,
            
            wrapClass: '',
            padding: 15,
            
            addModal: true, 
            clickModalToClose: true , 
            modalClass: 'm_modal',
            
            closeClass: [],
            
            addCloseButton: true,
            closeButtonClass: [], 
            closeButtonTitle: 'Close Window',
            closeButtonHtml: '<a title="" class="'+CLOSS_BUTTON_CLASS+'" style="background: #dc1010; display: block; width: 17px;height: 17px; line-height: 17px;top: -8px; right: -8px; position: absolute; color: #fff; text-align: center; font-weight: bold; border-radius: 4px; font-size: 12px; text-decoration: none;" href="javascript:;">x</a>'
        };
        
        this.opts = $.extend({}, this.defaults, options || {});
        this.callback = {
            'beforeOpen': [],
            'afterOpen': [],
            'beforeClose': [],
            'afterClose': [],
            'afterUpdate': []
        };

        this.getId = function(){
            return PERFIX + this.getKey() + SUFFIX;
        };
        
        this.getKey = function(){
            return parseInt(this.key);
        };
        
        this.trigger = function(event){
            var events = this.callback[event];
            if($.isArray(events) && events.length>0)
            {
                for(var i in events)
                {
                    if($.isFunction(events[i])){
                        events[i]();
                    }
                }
            }
		};
        
        this.setElement = function(param){
            var isJquery = 'object'===typeof(param) && param instanceof $ && param.length>0;
            var isString = 'string'===typeof(param);
            var isElement = 'object'===typeof(param) && 1===param.nodeType;
            
            if(isJquery || isString || isElement)
            {
                var jqueryElement;
                if(isJquery){
                    jqueryElement = param.clone(true);
                }
                else if(isElement){
                    jqueryElement = $(param);
                }
                else
                    jqueryElement = $('<div>'+param+'</div>');
               
                jqueryElement.css({'display': 'block', 'visibility': 'visible'});
                
                var wrap = $('<div class="bpopup_wrap '+this.opts.wrapClass+'"></div>');
                wrap.html(jqueryElement);
                
                if(this.opts.addCloseButton)
                {
                    var btEl = $(this.opts.closeButtonHtml);
                    if($.isArray(this.opts.closeButtonClass) && this.opts.closeButtonClass.length>0){
                        btEl.addClass(this.opts.closeButtonClass.join(' '));
                    }
                    if('string'===typeof(this.opts.closeButtonTitle)){
                        btEl.attr('title', this.opts.closeButtonTitle);
                    }
                    wrap.prepend(btEl);
                }
                this.element = wrap;
            }
            else{
                throw('Incoming parameter must be a string or an Jquery Element.');
            }
        };
        
        this.appendWrap = function(){
            if (this.opts.addModal) 
            {
                $('<div class="'+this.opts.modalClass+' '+this.getId()+'"></div>')
                .css({
                    backgroundColor: '#fff', 
                    position: 'fixed', 
                    top: 0, 
                    right:0, 
                    bottom:0, 
                    left: 0, 
                    opacity: 0, 
                    zIndex: parseInt(this.opts.zIndex) + this.getKey()
                })
                .appendTo(this.opts.appendTo)
                .fadeTo(this.opts.speed, this.opts.opacity);
            }
        };
        
        this.show = function(){
            this.trigger('beforeOpen');
            var self = this;
            
            if ( ! this.opts.scrollBar){
                $('html').css('overflow', 'hidden');
            }
            
            this.element.css({
                'position': 'absolute', 
                'backgroundColor': '#fff', 
                'display': 'none',
                'padding': this.opts.padding,
                'z-index': parseInt(this.opts.zIndex) + this.getKey()  + 1
            }).appendTo(this.opts.appendTo);
            
            var ct = 0;
            
            var run = function(){
                self.rePostion();
                self.element.stop().fadeTo(self.opts.speed, true, function(){
                    self.trigger('afterOpen');
                    self.bindEvents();
                });
            };
            
            var setTimeoutToCheck = function(){
                if(6>ct)
                {
                    ct++;
                    setTimeout(function(){
                        if(self.isRenderReady()){
                           run();
                        }
                        else{
                            setTimeoutToCheck();
                        }
                    }, 500);
                }
                else{
                    run();
                }
            };
            setTimeoutToCheck();
        };
        
        this.hide = function(){
            var self = this;
            
            if ( ! this.opts.scrollBar){
                $('html').css('overflow', 'auto');
            }
            
            var afterClose = function(){
                M.deleted(self.getKey());
                self.trigger('afterClose');
            };
            this.element.stop().
                fadeTo(this.opts.speed, 0, function(){
                    self.unbindEvents();
                    $(this).remove();
                    if (self.opts.addModal) {
                        $('.'+self.opts.modalClass+'.'+self.getId())
                            .fadeTo(self.opts.speed, 0, function() {
                                $(this).remove();
                                afterClose();
                            });
                    }
                    else
                        afterClose();
                });
        };
        
        this.isRenderReady = function(){
            return this.getElementWidth() > 0 && this.getElementHeight() > 0;
        };

        this.rePostion = function(){
            this.element
				.css({
                    'left': this.getElementPotionLeft(), 
                    'top': this.getElementPostionTop()
                });
        };
        
        this.getElementPotionLeft = function(){
			return ((this.getWindowWidth() - this.getElementWidth()) / 2) + D.scrollLeft();
		};
        
		this.getElementPostionTop = function(){
            var coord;
            if(this.isElementInsideWindow())
            {
                var y = (((this.getWindowHeight()- this.getElementHeight()) / 2) - 50);
                coord = (y < BUFFER ? BUFFER : y);
            }
            else
                coord = BUFFER;
            
			return coord + D.scrollTop();
		};
        
        this.isElementInsideWindow = function(){
            return  (this.getWindowHeight() > this.getElementHeight()+BUFFER) && (this.getWindowWidth() > this.getElementWidth()+BUFFER);
        };
        
		this.getWindowHeight =function(){
			return window.innerHeight || W.height();
		};
        
		this.getWindowWidth = function(){
			return window.innerWidth || W.width();
		};
        
        this.getElementHeight = function(){
            return this.element.outerHeight(true);
        };
        
        this.getElementWidth = function(){
            return this.element.outerWidth(true);
        };
        
        this.bindEvents = function(){
            var self = this;
            
            if(this.opts.addCloseButton)
            {
                this.element.delegate(
                    '.' + CLOSS_BUTTON_CLASS+this._getCloseClassString(), 
                    'click.'+this.getId(), 
                    function(e) {
                        self.close();
                    }
                );
            }
            
            if (this.opts.clickModalToClose) 
            {
                $('.'+self.opts.modalClass+'.'+this.getId()).
                        css('cursor', 'pointer').
                        bind('click',  function(e) {
                            self.close();
                        });
            }
			
			// Temporary disabling scroll/resize events on devices with IOS6+
			// due to a bug where events are dropped after pinch to zoom
            if ( ! isIOS6X()) 
            {
                W.bind('scroll.'+this.getId(), function(){
                    if(self.isElementInsideWindow())
                    {
                        self.element
                            .dequeue()
                            .animate(
                                {
                                    'left': self.getElementPotionLeft(),
                                    'top': self.getElementPostionTop() 
                                }, 
                                self.opts.followSpeed,
                                self.opts.followEasing
                            );
                    }
            	}).bind('resize.'+this.getId(), function(){
                    if($.isFunction(DEBOUNCE)){
                        clearTimeout(DEBOUNCE);
                    }

                    DEBOUNCE = setTimeout(function(){
                        if(self.isElementInsideWindow())
                        {
                            self.element
                                .dequeue()
                                .each(function(){
                                    $(this).animate(
                                        {
                                            'left': self.getElementPotionLeft(),
                                            'top':  self.getElementPostionTop()
                                        }, 
                                        self.opts.followSpeed, 
                                        self.opts.followEasing
                                    );
                                });
                        }
                    }, 50);					
                });
            }
            
            if(this.opts.escClose) 
            {
                D.bind('keydown.'+this.getId(), function(e){
                    if(e.which === 27){
                        self.close();
                    }
                });
            }
        };
        
        this.unbindEvents = function(){
            if(this.opts.addCloseButton)
            {
                this.element.undelegate(
                    '.' +CLOSS_BUTTON_CLASS+this._getCloseClassString(), 
                    'click.'+this.getId(), 
                    this.close
                );
            }
                
            if(this.opts.clickModalToClose){
                $('.'+this.opts.modalClass+'.'+this.getId()).unbind('click');
            }
            
            if( ! isIOS6X()){
                W.unbind('scroll.'+this.getId()).unbind('resize.'+this.getId());
            }
            
            if(this.opts.escClose){
                D.unbind('keydown.'+this.getId());
            }
        };
        
        this._getCloseClassString = function(){
            var str = '';
            if($.isArray(this.opts.closeClass) && this.opts.closeClass.length>0)
            {
                 var delimiter = ', .';
                 str = delimiter+this.opts.closeClass.join(delimiter);
            }
            return str;
        };
        
        
        // Provide external interfaces
        this.bindAll = function(events){
            for(var i in events)
                this.bindOne(i, events[i]);
         };
        
        this.bindOne = function(event, fun){
            if($.isFunction(fun)){
                this.callback[event].push(fun);
            }
         };
         
        this.open = function(element){
            this.setElement(element);
            this.appendWrap();
            this.show();
         };
         
        this.close = function(callback){
            this.bindOne('afterClose', callback);
            
            this.trigger('beforeClose');
            
            this.hide();
        };
        
        this.update = function(){
            this.rePostion();
            this.trigger('afterUpdate');
        };
    };
        
    $.extend(M, {
        // The current version of mpopup
		version: '0.1.0',
        
        popups: [],
        
        _getPopups: function(){
            return M.popups || [];
        },
        _getPopup: function(k){
            var Popups = M._getPopups();
            if(Object.prototype.toString.call(k) === '[object Number]'){
                return Popups[k];
            }
            else{
                return Popups[Popups.length - 1];
            }
        },
        _close: function(k, callback){
            if($.isFunction(k))
            {
                callback = k;
                k = null;
            }
    
            var nowPopup = this._getPopup(k);
            if(nowPopup){
                nowPopup.close(callback);
            }
        },
        _update: function(k, callback){
            if($.isFunction(k))
            {
                callback = k;
                k = null;
            }
    
            var nowPopup = this._getPopup(k);
            if(nowPopup){
                nowPopup.update(callback);
            }
        },
                
        deleted: function(k){
            M._getPopups().splice(k, 1);
        },
                
        open: function(element, options){
            var Popups = M._getPopups();
            
            var nowPopUp = new Mpopup(options, Popups.length);
            if('object'===typeof(options) && $.isArray(options.callback) && options.callback.length>0){
                nowPopUp.bindAll(options.callback);
            }
            nowPopUp.open(element);
            
            Popups.push(nowPopUp);
        },
        update: function (isUpdateAll, callback){
            var self = this;
            
            if($.isFunction(isUpdateAll))
            {
                callback = isUpdateAll;
                isUpdateAll = false;
            }
            
            var Popups = M._getPopups();
            if(true===isUpdateAll)
            {
                $.each(Popups, function(k, popup){
                    self._update(k, callback);
                });
            }
            else
                this._update(callback);
            
			return false;
        },
        close: function(isCloseAll, callback){
            var self = this;
            var Popups = M._getPopups();
            
            if($.isFunction(isCloseAll))
            {
                callback = isCloseAll;
                isCloseAll = false;
            }
            
            if(true===isCloseAll)
            {
                $.each(Popups, function(k, popup){
                    self._close(k, callback);
                });
            }
            else
                this._close(callback);
            
			return false;
        }
    });
})(window, document, jQuery);
