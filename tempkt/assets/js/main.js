/**
	Custom JS - Global Variables
**/

var defaultPageID = 'section-5' ;

/**
	Custom JS - Create Custom Events
**/

	( function ( ) {
		if ( typeof window . CustomEvent === "function" ) return false ;
		function CustomEvent ( eventName , params ) {
			params = params || { bubbles : false , cancelable : false , detail : undefined } ;
			var evt = document . createEvent ( 'CustomEvent' ) ;
			evt . initCustomEvent ( eventName , params . bubbles , params . cancelable , params . detail ) ;
			return evt ;
		}
		CustomEvent . prototype = window . Event . prototype ;
		window . CustomEvent = CustomEvent ;
	} ) ( ) ;

/**
	Custom JS - Event Handler Functions
**/

	( function ( ) {
		var customEventsHandler = {
			createCustomListenerEvent : function ( eventName , params , callback ) {
				var eventObj = new CustomEvent ( eventName , params ) ;
				if ( typeof callback === 'function' ) callback ( ) ;
				return eventObj ;
			} ,
			addListenerEvent : function ( elementObj , eventName , functionName , callback ) {
				var returnValue = elementObj . addEventListener ( eventName , functionName ) ;
				if ( typeof callback === 'function' ) callback ( ) ;
				return returnValue ;
			} ,
			removeListenerEvent : function ( elementObj , eventName , functionName , callback ) {
				if ( typeof functionName === 'function' ) var returnValue = elementObj . removeEventListener ( eventName , functionName ) ;
				else {
					elementClone = elementObj . cloneNode ( true ) ;
					elementObj . parentNode . replaceChild ( elementClone , elementObj ) ;
				}
				if ( typeof callback === 'function' ) callback ( ) ;
				return returnValue ;
			} ,
			fireListenerEvent : function ( elementObj , eventName , eventType , callback ) {
				var eventObj = null ;
				if ( eventType == 1 ) eventObj = new Event ( eventName ) ;
				else eventObj = eventName ;
				var returnValue = elementObj . dispatchEvent ( eventObj ) ;
				if ( typeof callback === 'function' ) callback ( ) ;
				return returnValue ;
			}
		} ;
		window . customEventsHandler = customEventsHandler ;
	} ) ( ) ;

/**
	Custom JS - Dynamic Event Listener Manager
**/

	( function ( ) {
		var variableListeners = {
			setListeners : function ( listenerState ) {
				animationEffects . setListeners ( listenerState ) ;
				pageSwitchHandler . setListeners ( listenerState ) ;
				pageAJAXLoaderHandler . setListeners ( listenerState ) ;
				formAJAX . setListeners ( listenerState ) ;
			}
		}
		window . variableListeners = variableListeners ;
	} ) ( ) ;

/**
	Custom JS - Show/Hide Elements
**/

	( function ( ) {
		var animationEffects = {
			easing : {
				linear : function ( progress ) {
					return progress ;
				} ,
				quadratic : function ( progress ) {
					return Math . pow ( progress , 2 ) ;
				} ,
				swing: function ( progress ) {
					return 0.5 - Math . cos ( progress * Math . PI ) / 2 ;
				} ,
				circ : function ( progress ) {
					return 1 - Math . sin ( Math . acos ( progress ) ) ;
				} ,
				back : function ( progress , x ) {
					return Math . pow ( progress , 2 ) * ( ( x + 1 ) * progress - x ) ;
				} ,
				bounce : function ( progress ) {
					for ( var a = 0 , b = 1 , result ; 1 ; a += b , b /= 2 ) {
						if ( progress >= ( 7 - 4 * a ) / 11 ) {
							return - Math . pow ( ( 11 - 6 * a - 11 * progress ) / 4 , 2 ) + Math . pow ( b , 2 ) ;
						}
					}
				} ,
				elastic : function ( progress , x ) {
					return Math . pow ( 2 , 10 * ( progress - 1 ) ) * Math . cos ( 20 * Math . PI * x / 3 * progress ) ;
				}
			} ,
			animate : function ( options ) {
				var start = new Date ;
				var animateFunc = function ( ) {
					var timePassed = new Date - start ;
					var progress = timePassed / options . duration ;
					if ( progress > 1 ) {
						progress = 1 ;
					}
					options . progress = progress ;
					var delta = options . delta ( progress ) ;
					options . step ( delta ) ;
					if ( progress < 1 ) window . requestAnimationFrame ( animateFunc ) ;
					else if ( typeof options . complete === 'function' ) options . complete ( ) ;
				} ;
				window . requestAnimationFrame ( animateFunc ) ;
			} ,
			fadeOutElement : function ( elementObj , options ) {
				var to = 1 ;
				options = options || {
					duration : 1000 ,
					animationType : 'swing' ,
					delay : 10
				}
				if ( ( typeof options . duration !== 'number' ) || ( options . duration < 0 ) ) options . duration = 1000 ;
				if ( typeof options . animationType !== 'string' ) options . animationType = 'swing' ;
				if ( ( typeof options . delay !== 'number' ) || ( options . delay < 0 ) ) options . delay = 10 ;
				if ( elementObj . style . opacity > 0 ) {
					this . animate ( {
						duration : options . duration ,
						delta : function ( progress ) {
							progress = this . progress ;
							if ( options . animationType ) {
								if ( options . animationType == 'linear' ) return animationEffects . easing . linear ( progress ) ;
								else if ( options . animationType == 'quadratic' ) return animationEffects . easing . quadratic ( progress ) ;
								else if ( options . animationType == 'circ' ) return animationEffects . easing . circ ( progress ) ;
								else if ( options . animationType == 'back' ) return animationEffects . easing . back ( progress ) ;
								else if ( options . animationType == 'bounce' ) return animationEffects . easing . bounce ( progress ) ;
								else if ( options . animationType == 'elastic' ) return animationEffects . easing . elastic ( progress ) ;
								else return animationEffects . easing . swing ( progress ) ;
							}
							else return animationEffects . easing . swing ( progress ) ;
						} ,
						complete : function ( ) {
							var classList = ( elementObj . className ) . split ( " " ) ;
							var pos = classList . indexOf ( "no-opacity" ) ;
							if ( pos != -1 ) classList . push ( "no-opacity" ) ;
							elementObj . className = classList . join ( " " ) ;
							if ( typeof options . complete === 'function' ) options . complete ( ) ;
						} ,
						step : function ( delta ) {
							elementObj . style . opacity = to - delta ;
						}
					} ) ;
				}
				else {
					var classList = ( elementObj . className ) . split ( " " ) ;
					var pos = classList . indexOf ( "no-opacity" ) ;
					if ( pos != -1 ) classList . push ( "no-opacity" ) ;
					elementObj . className = classList . join ( " " ) ;
					if ( typeof options . complete === 'function' ) options . complete ( ) ;
				}
			} ,
			hideElement : function ( elementObj , options ) {
				elementObj . style . opacity = 1 ;
				options = options || {
					duration : 1000 ,
					animationType : 'swing' ,
					delay : 10
				}
				var temp = options . complete ;
				options . complete = function ( ) {
					var classList = ( elementObj . className ) . split ( " " ) ;
					var pos = classList . indexOf ( "display-none" ) ;
					if ( pos != -1 ) classList . push ( "display-none" ) ;
					elementObj . className = classList . join ( " " ) ;
					elementObj . style . display = 'none' ;
					if ( typeof temp === 'function' ) temp ( ) ;
				} ;
				if ( ( elementObj . style . opacity > 0 ) || ( elementObj . style . display != 'none' ) ) this . fadeOutElement ( elementObj , options ) ;
				else options . complete ( ) ;
			} ,
			fadeInElement : function ( elementObj , options ) {
				var to = 0 ;
				options = options || {
					duration : 1000 ,
					animationType : 'swing' ,
					delay : 10
				}
				elementObj . style . opacity = 0 ;
				var classList = ( elementObj . className ) . split ( " " ) ;
				var pos = classList . indexOf ( "no-opacity" ) ;
				while ( pos != -1 ) {
					classList . splice ( pos , 1 ) ;
					pos = classList . indexOf ( "no-opacity" ) ;
				}
				elementObj . className = classList . join ( " " ) ;
				if ( ( typeof options . duration !== 'number' ) || ( options . duration < 0 ) ) options . duration = 750 ;
				if ( typeof options . animationType !== 'string' ) options . animationType = 'swing' ;
				if ( ( typeof options . delay !== 'number' ) || ( options . delay < 0 ) ) options . delay = 10 ;
				if ( elementObj . style . opacity <= 0 ) {
					this . animate ( {
						duration : options . duration ,
						delta : function ( progress ) {
							progress = this . progress ;
							if ( options . animationType ) {
								if ( options . animationType == 'linear' ) return animationEffects . easing . linear ( progress ) ;
								else if ( options . animationType == 'quadratic' ) return animationEffects . easing . quadratic ( progress ) ;
								else if ( options . animationType == 'circ' ) return animationEffects . easing . circ ( progress ) ;
								else if ( options . animationType == 'back' ) return animationEffects . easing . back ( progress ) ;
								else if ( options . animationType == 'bounce' ) return animationEffects . easing . bounce ( progress ) ;
								else if ( options . animationType == 'elastic' ) return animationEffects . easing . elastic ( progress ) ;
								else return animationEffects . easing . swing ( progress ) ;
							}
							else return animationEffects . easing . swing ( progress ) ;
						} ,
						complete : options . complete ,
						step : function ( delta ) {
							elementObj . style . opacity = to + delta ;
						}
					} ) ;
				}
				else if ( typeof options . complete === 'function' ) options . complete ( ) ;
			} ,
			showElement : function ( elementObj , options ) {
				elementObj . style . opacity = 0 ;
				options = options || {
					duration : 1000 ,
					displayType : 'block' ,
					animationType : 'swing' ,
					delay : 10
				}
				if ( options . displayType ) elementObj . style . display = options . displayType ;
				else elementObj . style . display = 'block' ;
				var classList = ( elementObj . className ) . split ( " " ) ;
				var pos = classList . indexOf ( "display-none" ) ;
				while ( pos != -1 ) {
					classList . splice ( pos , 1 ) ;
					pos = classList . indexOf ( "display-none" ) ;
				}
				elementObj . className = classList . join ( " " ) ;
				if ( ( elementObj . style . display == 'none' ) || ( elementObj . style . opacity <= 0 ) ) this . fadeInElement ( elementObj , options ) ;
				else if ( typeof options . complete === 'function' ) options . complete ( ) ;
			} ,
			scrollIntoView : function ( elementObj , to , options ) {
				options = options || {
					duration : 2000 ,
					to : {
						scrollTop : 0 ,
						scrollLeft : 0
					} ,
					animationType : 'swing' ,
					delay : 10
				}
				if ( ( typeof options . duration !== 'number' ) || ( options . duration < 0 ) ) options . duration = 2000 ;
				if ( window . innerHeight > window . innerWidth ) options . duration = 750 ;
				if ( typeof to === 'number' ) to = { scrollTop : to , scrollLeft : 0 } ;
				else if ( ( typeof to === 'array' || typeof to === 'object' ) && ( ( ( typeof to . scrollTop !== 'number' ) || ( to . scrollTop < 0 ) ) ) && ( typeof to . scrollLeft === 'number' ) && ( to . scrollLeft >= 0 ) ) to = { scrollTop : 0 , scrollLeft : to . scrollLeft } ;
				else if ( ( typeof to === 'array' || typeof to === 'object' ) && ( ( ( typeof to . scrollLeft !== 'number' ) || ( to . scrollLeft < 0 ) ) ) && ( typeof to . scrollTop === 'number' ) && ( to . scrollTop >= 0 ) ) to = { scrollTop : to . scrollTop , scrollLeft : 0 } ;
				else if ( ( typeof to === 'array' || typeof to === 'object' ) && ( ( ( typeof to . scrollTop !== 'number' ) || ( to . scrollTop < 0 ) ) ) && ( ( ( typeof to . scrollLeft !== 'number' ) || ( to . scrollLeft < 0 ) ) ) ) to = { scrollTop : 0 , scrollLeft : 0 } ;
				if ( typeof options . animationType !== 'string' ) options . animationType = 'swing' ;
				if ( ( typeof options . delay !== 'number' ) || ( options . delay < 0 ) ) options . delay = 10 ;
				var initialTop = elementObj . scrollTop ;
				var differenceTop = to . scrollTop - elementObj . scrollTop ;
				var initialLeft = elementObj . scrollLeft ;
				var differenceLeft = to . scrollLeft - elementObj . scrollLeft ;
				if ( ( differenceTop != 0 ) || ( differenceLeft != 0 ) ) {
					this . animate ( {
						duration : options . duration ,
						delta : function ( progress ) {
							progress = this . progress ;
							if ( options . animationType ) {
								if ( options . animationType == 'linear' ) return animationEffects . easing . linear ( progress ) ;
								else if ( options . animationType == 'quadratic' ) return animationEffects . easing . quadratic ( progress ) ;
								else if ( options . animationType == 'circ' ) return animationEffects . easing . circ ( progress ) ;
								else if ( options . animationType == 'back' ) return animationEffects . easing . back ( progress ) ;
								else if ( options . animationType == 'bounce' ) return animationEffects . easing . bounce ( progress ) ;
								else if ( options . animationType == 'elastic' ) return animationEffects . easing . elastic ( progress ) ;
								else return animationEffects . easing . swing ( progress ) ;
							}
							else return animationEffects . easing . swing ( progress ) ;
						} ,
						complete : options . complete ,
						step : function ( delta ) {
							elementObj . scrollTop = initialTop + ( differenceTop * delta ) ;
							elementObj . scrollLeft = initialLeft + ( differenceLeft * delta ) ;
						}
					} ) ;
				}
				else if ( typeof options . complete === 'function' ) options . complete ( ) ;
			} ,
			scrollBodyIntoView : function ( to , options ) {
				options = options || {
					duration : 2000 ,
					to : {
						scrollTop : 0 ,
						scrollLeft : 0
					} ,
					animationType : 'swing' ,
					delay : 10
				}
				if ( ( typeof options . duration !== 'number' ) || ( options . duration < 0 ) ) options . duration = 2000 ;
				if ( window . innerHeight > window . innerWidth ) options . duration = 750 ;
				if ( typeof to === 'number' ) to = { scrollTop : to , scrollLeft : 0 } ;
				else if ( ( typeof to === 'array' || typeof to === 'object' ) && ( ( ( typeof to . scrollTop !== 'number' ) || ( to . scrollTop < 0 ) ) ) && ( typeof to . scrollLeft === 'number' ) && ( to . scrollLeft >= 0 ) ) to = { scrollTop : 0 , scrollLeft : to . scrollLeft } ;
				else if ( ( typeof to === 'array' || typeof to === 'object' ) && ( ( ( typeof to . scrollLeft !== 'number' ) || ( to . scrollLeft < 0 ) ) ) && ( typeof to . scrollTop === 'number' ) && ( to . scrollTop >= 0 ) ) to = { scrollTop : to . scrollTop , scrollLeft : 0 } ;
				else if ( ( typeof to === 'array' || typeof to === 'object' ) && ( ( ( typeof to . scrollTop !== 'number' ) || ( to . scrollTop < 0 ) ) ) && ( ( ( typeof to . scrollLeft !== 'number' ) || ( to . scrollLeft < 0 ) ) ) ) to = { scrollTop : 0 , scrollLeft : 0 } ;
				if ( typeof options . animationType !== 'string' ) options . animationType = 'swing' ;
				if ( ( typeof options . delay !== 'number' ) || ( options . delay < 0 ) ) options . delay = 10 ;
				var initialTop = window . pageYOffset ;
				var differenceTop = to . scrollTop - window . pageYOffset ;
				var initialLeft = window . pageXOffset ;
				var differenceLeft = to . scrollLeft - window . pageXOffset ;
				if ( ( differenceTop != 0 ) || ( differenceLeft != 0 ) ) {
					this . animate ( {
						duration : options . duration ,
						delta : function ( progress ) {
							progress = this . progress ;
							if ( options . animationType ) {
								if ( options . animationType == 'linear' ) return animationEffects . easing . linear ( progress ) ;
								else if ( options . animationType == 'quadratic' ) return animationEffects . easing . quadratic ( progress ) ;
								else if ( options . animationType == 'circ' ) return animationEffects . easing . circ ( progress ) ;
								else if ( options . animationType == 'back' ) return animationEffects . easing . back ( progress ) ;
								else if ( options . animationType == 'bounce' ) return animationEffects . easing . bounce ( progress ) ;
								else if ( options . animationType == 'elastic' ) return animationEffects . easing . elastic ( progress ) ;
								else return animationEffects . easing . swing ( progress ) ;
							}
							else return animationEffects . easing . swing ( progress ) ;
						} ,
						complete : options . complete ,
						step : function ( delta ) {
							window . scroll ( ( initialLeft + ( differenceLeft * delta ) ) , ( initialTop + ( differenceTop * delta ) ) ) ;
						}
					} ) ;
				}
				else if ( typeof options . complete === 'function' ) options . complete ( ) ;
			} ,
			listenerFunction1 : function ( eventObj ) {
				eventObj . preventDefault ( ) ;
				var elementObj = this ;
				animationEffects . fadeInElement ( elementObj , { duration : 1000 } ) ;
			} ,
			listenerFunction2 : function ( eventObj ) {
				eventObj . preventDefault ( ) ;
				var elementObj = this ;
				animationEffects . fadeOutElement ( elementObj , { duration : 1000 } ) ;
			} ,
			setListeners : function ( listenerState ) {
				fadeInEnterClassObj = document . getElementsByClassName ( "fade-in-mouseenter" ) ;
				fadeOutEnterClassObj = document . getElementsByClassName ( "fade-out-mouseenter" ) ;
				fadeInLeaveClassObj = document . getElementsByClassName ( "fade-in-mouseleave" ) ;
				fadeOutLeaveClassObj = document . getElementsByClassName ( "fade-out-mouseleave" ) ;
				var temp = this ;
				if ( listenerState ) {
					for ( var i = 0 ; i < fadeInEnterClassObj . length ; i ++ ) customEventsHandler . addListenerEvent ( fadeInEnterClassObj [ i ] , "mouseenter" , temp . listenerFunction1 ) ;
					for ( var i = 0 ; i < fadeOutEnterClassObj . length ; i ++ ) customEventsHandler . addListenerEvent ( fadeOutEnterClassObj [ i ] , "mouseenter" , temp . listenerFunction2 ) ;
					for ( var i = 0 ; i < fadeInLeaveClassObj . length ; i ++ ) customEventsHandler . addListenerEvent ( fadeInLeaveClassObj [ i ] , "mouseleave" , temp . listenerFunction1 ) ;
					for ( var i = 0 ; i < fadeOutLeaveClassObj . length ; i ++ ) customEventsHandler . addListenerEvent ( fadeOutLeaveClassObj [ i ] , "mouseleave" , temp . listenerFunction2 ) ;
				}
				else {
					for ( var i = 0 ; i < fadeInEnterClassObj . length ; i ++ ) customEventsHandler . removeListenerEvent ( fadeInEnterClassObj [ i ] , "mouseenter" , temp . listenerFunction1 ) ;
					for ( var i = 0 ; i < fadeOutEnterClassObj . length ; i ++ ) customEventsHandler . removeListenerEvent ( fadeOutEnterClassObj [ i ] , "mouseenter" , temp . listenerFunction2 ) ;
					for ( var i = 0 ; i < fadeInLeaveClassObj . length ; i ++ ) customEventsHandler . addListenerEvent ( fadeInLeaveClassObj [ i ] , "mouseleave" , temp . listenerFunction1 ) ;
					for ( var i = 0 ; i < fadeOutLeaveClassObj . length ; i ++ ) customEventsHandler . addListenerEvent ( fadeOutLeaveClassObj [ i ] , "mouseleave" , temp . listenerFunction2 ) ;
				}
			}
		} ;
		window . animationEffects = animationEffects ;
	} ) ( ) ;

/**
	Custom JS - Loader Code
**/

	( function ( ) {
		var loaderHandler = {
			loaderOn : true ,
			displayText : '<img src="assets/img/loading.gif" style="display:inline;width:150px;opacity:0.5;" />' ,
			showLoader : function ( displayTextParam , options ) {
				options = options || {
					duration : 2000 ,
					displayType : 'table' ,
				} ;
				options . displayType = 'table' ;
				if ( ( typeof options . duration !== 'number' ) || ( options . duration < 0 ) ) options . duration = 2000 ;
				if ( typeof displayTextParam === 'string' ) this . displayText = displayTextParam ;
				document . getElementById ( "loader-msg" ) . innerHTML = this . displayText ;
				if ( ! this . loaderOn ) animationEffects . showElement ( document . getElementById ( "loader-div" ) , options ) ;
				else if ( typeof options . complete === 'function' ) options . complete ( ) ;
				this . loaderOn = true ;
			} ,
			hideLoader : function ( displayTextParam , options ) {
				options = options || {
					duration : 2000 ,
					displayType : 'table' ,
				} ;
				options . displayType = 'table' ;
				options . displayType = 'table' ;
				if ( ( typeof options . duration !== 'number' ) || ( options . duration < 0 ) ) options . duration = 2000 ;
				if ( typeof displayTextParam === 'string' ) this . displayText = displayTextParam ;
				document . getElementById ( "loader-msg" ) . innerHTML = this . displayText ;
				if ( this . loaderOn ) animationEffects . hideElement ( document . getElementById ( "loader-div" ) , options ) ;
				else if ( typeof options . complete === 'function' ) options . complete ( ) ;
				this . loaderOn = false ;
			}
		} ;
		window . loaderHandler = loaderHandler ;
	} ) ( ) ;

/**
	Custom JS - Initial Loader Code
**/

	( function ( ) {
		var onFullLoad = function ( ) {
			document . getElementById ( defaultPageID ) . scrollIntoView ( ) ;
			loaderHandler . hideLoader ( null , { complete : function ( ) { animationEffects . fadeInElement ( document . getElementById ( "main-div" ) ) ; } } ) ;
			window . history . replaceState ( { page : defaultPageID , title : document . title } , document . title ) ;
			customEventsHandler . removeListenerEvent ( window , "load" , onFullLoad ) ;
			window . history . scrollRestoration = 'manual' ;
		}
		customEventsHandler . addListenerEvent ( window , "load" , onFullLoad ) ;
	} ) ( ) ;

/**
	Custom JS - Page Switch And History Modifier Code
**/

	( function ( ) {
		var pageSwitchHandler = {
			currentPageID : defaultPageID ,
			goForwardToPage : function ( pageID , durationTime ) {
				variableListeners . setListeners ( false ) ;
				if ( window . innerHeight > window . innerWidth ) durationTime = durationTime || 750 ;
				else durationTime = durationTime || 2000 ;
				window . history . pushState ( { page : pageID , title : document . title } , document . title ) ;
				this . currentPageID = pageID ;
				pageAJAXLoaderHandler . currentPageID = pageID ;
				loaderHandler . hideLoader ( null ) ;
				animationEffects . scrollBodyIntoView ( { scrollTop : document . getElementById ( pageID ) . offsetTop , scrollLeft : document . getElementById ( pageID ) . offsetLeft } , { duration : durationTime , complete : function ( ) { variableListeners . setListeners ( true ) ; } } ) ;
			} ,
			goToSpecificPage : function ( pageDetails , durationTime ) {
				variableListeners . setListeners ( false ) ;
				if ( window . innerHeight > window . innerWidth ) durationTime = durationTime || 750 ;
				else durationTime = durationTime || 2000 ;
				this . currentPageID = pageDetails . page ;
				pageAJAXLoaderHandler . currentPageID = pageDetails . page ;
				loaderHandler . hideLoader ( null ) ;
				if ( typeof pageDetails . page === 'string' ) animationEffects . scrollBodyIntoView ( { scrollTop : document . getElementById ( pageDetails . page ) . offsetTop , scrollLeft : document . getElementById ( pageDetails . page ) . offsetLeft } , { duration : durationTime , complete : function ( ) { variableListeners . setListeners ( true ) ; } } ) ;
			} ,
			linkClicked : function ( eventObj , elementObj ) {
				if ( elementObj . href ) {
					var pageID = ( elementObj . href ) . replace ( ( ( window . location . href ) + '#' ) , '' ) ;
					if ( elementObj . dataset . title ) document . title = elementObj . dataset . title ;
					if ( ! elementObj . dataset . pagelink ) this . goForwardToPage ( pageID ) ;
				}
			} ,
			historyChanged : function ( eventObj ) {
				console . log ( eventObj . state ) ;
				if ( ( ! eventObj . state ) || ( typeof eventObj . state . page !== 'string' ) || ( typeof eventObj . state . title !== 'string' ) ) window . location . href = document . location ;
				if ( eventObj . state . title ) document . title = eventObj . state . title ;
				if ( ! eventObj . state . pageURL ) this . goToSpecificPage ( eventObj . state ) ;
			} ,
			listenerFunction1 : function ( eventObj ) {
				eventObj . preventDefault ( ) ;
				var elementObj = this ;
				pageSwitchHandler . linkClicked ( eventObj , elementObj ) ;
			} ,
			listenerFunction2 : function ( eventObj ) {
				if ( eventObj . state ) {
					eventObj . preventDefault ( ) ;
					pageSwitchHandler . historyChanged ( eventObj ) ;
				}
			} ,
			setListeners : function ( listenerState ) {
				linkClassObj = document . getElementsByClassName ( "page-scroll" ) ;
				var temp = this ;
				if ( listenerState ) {
					for ( var i = 0 ; i < linkClassObj . length ; i ++ ) customEventsHandler . addListenerEvent ( linkClassObj [ i ] , "click" , temp . listenerFunction1 ) ;
					customEventsHandler . addListenerEvent ( window , 'popstate' , temp . listenerFunction2 ) ;
				}
				else {
					for ( var i = 0 ; i < linkClassObj . length ; i ++ ) customEventsHandler . removeListenerEvent ( linkClassObj [ i ] , "click" , temp . listenerFunction1 ) ;
					customEventsHandler . removeListenerEvent ( window , 'popstate' , temp . listenerFunction2 ) ;
				}
			}
		} ;
		window . pageSwitchHandler = pageSwitchHandler ;
		customEventsHandler . addListenerEvent ( window , "resize" , function ( ) {
			pageSwitchHandler . goToSpecificPage ( { page : pageSwitchHandler . currentPageID , title : document . title } ) ;
		} ) ;
	} ) ( ) ;

/**
	Custom JS - Advanced Page Switching Code ( Load Other Pages Through AJAX with variety of options )
**/

	( function ( ) {
		var pageAJAXLoaderHandler = {
			currentPageID : defaultPageID ,
			AJAXRequestPage : function ( pageURL , successCallback , successParams , failureCallback , failureParams ) {
				var xmlHttp = new XMLHttpRequest ( ) ;
				customEventsHandler . addListenerEvent ( xmlHttp , "load" , function ( ) {
					if ( ( this . status == 200 ) && ( typeof successCallback === 'function' ) ) successCallback ( this . responseText , successParams ) ;
					else if ( typeof failureCallback === 'function' ) failureCallback ( { code : this . status , status : this . statusText } , this . responseText , failureParams ) ;
				} ) ;
				xmlHttp . open ( "GET" , ( pageURL + '?prevCacheTS=' + ( new Date ( ) . getTime ( ) ) ) , true ) ;
				xmlHttp . send ( ) ;
				return xmlHttp ;
			} ,
			insertPageAsHTML : function ( pageID , responseText ) {
				document . getElementById ( pageID ) . insertAdjacentHTML ( 'afterbegin' , responseText ) ;
				var tempDiv = document . createElement ( "div" ) ;
				tempDiv . insertAdjacentHTML ( 'afterbegin' , responseText ) ;
				var scriptTags = tempDiv . getElementsByTagName ( "script" ) ;
				for ( var i = 0 ; i < scriptTags . length ; i ++ ) {
					if ( scriptTags [ i ] . innerHTML ) eval ( scriptTags [ i ] . innerHTML ) ;
					else if ( scriptTags [ i ] . src ) {
						var newScriptFile = document . createElement ( 'script' ) ;
						newScriptFile . src = scriptTags [ i ] . src ;
						document . head . appendChild ( newScriptFile ) ;
					}
				}
			} ,
			clearHTMLPage : function ( pageID ) {
				var pageObj = document . getElementById ( pageID ) ;
				while ( pageObj . firstChild ) pageObj . removeChild ( pageObj . firstChild ) ;
			} ,
			AJAXRequestSuccess : function ( responseText , params ) {
				this . clearHTMLPage ( params . pageID ) ;
				this . insertPageAsHTML ( params . pageID , responseText ) ;
				return true ;
			} ,
			AJAXRequestFailure : function ( responseStatus , responseText , params ) {
				return ( ( ( responseStatus . status ) . replace ( ( ( responseStatus . code ) + ' ' ) , '' ) ) + ' [ Error ' + responseStatus . code + ' ]' ) ;
			} ,
			goForwardToPage : function ( pageID , pageAJAXURL , durationTime ) {
				variableListeners . setListeners ( false ) ;
				if ( window . innerHeight > window . innerWidth ) durationTime = durationTime || 750 ;
				else durationTime = durationTime || 2000 ;
				window . history . pushState ( { page : pageID , title : document . title , pageURL : pageAJAXURL } , document . title ) ;
				loaderHandler . showLoader ( '<img src="assets/img/loading.gif" style="display:inline;width:150px;opacity:0.5;" />' ) ;
				var temp = this ;
				this . AJAXRequestPage ( pageAJAXURL , function ( responseText ) {
					if ( temp . AJAXRequestSuccess ( responseText , { pageID : pageID } ) ) {
						temp . currentPageID = pageID ;
						pageSwitchHandler . currentPageID = pageID ;
						window . setTimeout ( function ( ) {
							loaderHandler . hideLoader ( null ) ;
							animationEffects . scrollBodyIntoView ( { scrollTop : document . getElementById ( pageID ) . offsetTop , scrollLeft : document . getElementById ( pageID ) . offsetLeft } , { duration : durationTime , complete : function ( ) { variableListeners . setListeners ( true ) ; } } ) ;
						} , 3000 ) ;
					}
				} , null , function ( responseStatus , responseText ) {
					var errorMessage = temp . AJAXRequestFailure ( responseStatus , responseText ) ;
					window . setTimeout ( function ( ) {
						loaderHandler . showLoader ( "Page could not be loaded due to error : " + errorMessage + "<br />Going Back..." ) ;
						window . setTimeout ( function ( ) { variableListeners . setListeners ( true ) ; window . history . back ( ) ; } , 5000 ) ;
					} , 3000 ) ;
				} , null ) ;
			} ,
			goToSpecificPage : function ( pageDetails , durationTime ) {
				variableListeners . setListeners ( false ) ;
				if ( window . innerHeight > window . innerWidth ) durationTime = durationTime || 750 ;
				else durationTime = durationTime || 2000 ;
				loaderHandler . showLoader ( '<img src="assets/img/loading.gif" style="display:inline;width:150px;opacity:0.5;" />' ) ;
				var temp = this ;
				if ( typeof pageDetails . page === 'string' ) {
					this . AJAXRequestPage ( pageDetails . pageURL , function ( responseText ) {
						if ( temp . AJAXRequestSuccess ( responseText , { pageID : pageDetails . page } ) ) {
							temp . currentPageID = pageDetails . page ;
							pageSwitchHandler . currentPageID = pageDetails . page ;
							document . title = pageDetails . title ;
							variableListeners . setListeners ( false ) ;
							variableListeners . setListeners ( true ) ;
							window . setTimeout ( function ( ) {
								loaderHandler . hideLoader ( null ) ;
								animationEffects . scrollBodyIntoView ( { scrollTop : document . getElementById ( pageDetails . page ) . offsetTop , scrollLeft : document . getElementById ( pageDetails . page ) . offsetLeft } , { duration : durationTime , complete : function ( ) { variableListeners . setListeners ( true ) ; } } ) ;
							} , 3000 ) ;
						}
					} , null , function ( responseStatus , responseText ) {
						var errorMessage = temp . AJAXRequestFailure ( responseStatus , responseText ) ;
						window . setTimeout ( function ( ) {
							loaderHandler . showLoader ( "Page could not be loaded due to error : " + errorMessage + "<br />Going Back..." ) ;
							window . setTimeout ( function ( ) { variableListeners . setListeners ( true ) ; window . history . back ( ) ; } , 5000 ) ;
						} , 3000 ) ;
					} , null ) ;
				}
			} ,
			linkClicked : function ( eventObj , elementObj ) {
				if ( elementObj . href ) {
					var pageID = ( elementObj . href ) . replace ( ( ( window . location . href ) + '#' ) , '' ) ;
					if ( elementObj . dataset . title ) document . title = elementObj . dataset . title ;
					if ( elementObj . dataset . pagelink ) {
						var pageURL = elementObj . dataset . pagelink ;
						this . goForwardToPage ( pageID , pageURL ) ;
					}
				}
			} ,
			historyChanged : function ( eventObj ) {
				if ( ( ! eventObj . state ) || ( typeof eventObj . state . page !== 'string' ) || ( typeof eventObj . state . title !== 'string' ) ) window . location . href = document . location ;
				if ( eventObj . state . pageURL ) this . goToSpecificPage ( eventObj . state ) ;
			} ,
			listenerFunction1 : function ( eventObj ) {
				eventObj . preventDefault ( ) ;
				var elementObj = this ;
				pageAJAXLoaderHandler . linkClicked ( eventObj , elementObj ) ;
			} ,
			listenerFunction2 : function ( eventObj ) {
				if ( eventObj . state ) {
					eventObj . preventDefault ( ) ;
					pageAJAXLoaderHandler . historyChanged ( eventObj ) ;
				}
			} ,
			listenerFunction3 : function ( eventObj ) {
				eventObj . preventDefault ( ) ;
				window . history . back ( ) ;
			} ,
			setListeners : function ( listenerState ) {
				linkClassObj = document . getElementsByClassName ( "page-scroll-ajax" ) ;
				linkClassObj2 = document . getElementsByClassName ( "page-scroll-back" ) ;
				var temp = this ;
				if ( listenerState ) {
					for ( var i = 0 ; i < linkClassObj . length ; i ++ ) customEventsHandler . addListenerEvent ( linkClassObj [ i ] , "click" , temp . listenerFunction1 ) ;
					customEventsHandler . addListenerEvent ( window , 'popstate' , temp . listenerFunction2 ) ;
					for ( var i = 0 ; i < linkClassObj2 . length ; i ++ ) customEventsHandler . addListenerEvent ( linkClassObj2 [ i ] , "click" , temp . listenerFunction3 ) ;
				}
				else {
					for ( var i = 0 ; i < linkClassObj . length ; i ++ ) customEventsHandler . removeListenerEvent ( linkClassObj [ i ] , "click" , temp . listenerFunction1 ) ;
					customEventsHandler . removeListenerEvent ( window , 'popstate' , temp . listenerFunction2 ) ;
					for ( var i = 0 ; i < linkClassObj2 . length ; i ++ ) customEventsHandler . removeListenerEvent ( linkClassObj2 [ i ] , "click" , temp . listenerFunction3 ) ;
				}
			}
		} ;
		window . pageAJAXLoaderHandler = pageAJAXLoaderHandler ;
	} ) ( ) ;

/**
	Custom JS - Validate Form Contents, Send Info By AJAX And Retrieve Results
**/

	( function ( ) {
		formAJAX = {
			submitFormAJAX : function ( eventObj , formObj , successCallback , successParams , failureCallback , failureParams ) {
				var formAJAXURL = formObj . getAttribute ( "action" ) ;
				var formResultDivID = ( formObj . id ) + '-message-result' ;
				var formLoadDivID = ( formObj . id ) + '-loading-image' ;
				formObj . insertAdjacentHTML ( 'afterbegin' , '<div id="' + formLoadDivID + '" class="full-width half-height div-absolute background-white-translucent text-align-center display-none"><img src="assets/img/loading.gif" style="display:inline;z-index:100;" class="full-height" /></div>' ) ;
				animationEffects . showElement ( document . getElementById ( formLoadDivID ) ) ;
				var formResultDiv = document . getElementById ( formResultDivID ) ;
				if ( formResultDiv ) formResultDiv . parentNode . removeChild ( formResultDiv ) ;
				var formDataEncoded = new FormData ( document . getElementById ( formObj . id ) ) ;
				var xmlHttp = new XMLHttpRequest ( ) ;
				customEventsHandler . addListenerEvent ( xmlHttp , "load" , function ( ) {
					if ( ( this . status == 200 ) && ( typeof successCallback === 'function' ) ) successCallback ( document . getElementById ( formObj . id ) , this . responseText , successParams ) ;
					else if ( typeof failureCallback === 'function' ) failureCallback ( document . getElementById ( formObj . id ) , { code : this . status , status : this . statusText } , this . responseText , failureParams ) ;
				} ) ;
				xmlHttp . open ( "POST" , ( formAJAXURL + '?prevCacheTS=' + ( new Date ( ) . getTime ( ) ) ) , true ) ;
				xmlHttp . send ( formDataEncoded ) ;
				return xmlHttp ;
			} ,
			submitFormSuccess : function  ( formObj , responseText ) {
				var formAJAXResults = JSON . parse ( responseText ) ;
				var formResultDivID = ( formObj . id ) + '-message-result' ;
				var formLoadDivID = ( formObj . id ) + '-loading-image' ;
				var formLoadDiv = document . getElementById ( formLoadDivID ) ;
				onresetGReCaptcha1 ( ) ;
				onresetGReCaptcha2 ( ) ;
				animationEffects . hideElement ( formLoadDiv , { complete : function ( ) { if ( formLoadDiv ) formLoadDiv . parentNode . removeChild ( formLoadDiv ) ; } } ) ;
				if ( formAJAXResults . success == true ) {
					var successMessage = formAJAXResults . results . message ;
					formObj . insertAdjacentHTML ( 'beforebegin' , '<div id="' + formResultDivID + '" class="block-section full-width no-overflow border-radius-xsmall" style="color: #3C763D;background-color: #DFF0D8;">' + successMessage + '</div>' ) ;
					if ( formAJAXResults . results . redirect ) {
						animationEffects . hideElement ( formObj ) ;
						var redirect_url = formAJAXResults . results . redirect ;
						window . location . href = redirect_url ;
					}
					else if ( formAJAXResults . results . hide ) animationEffects . hideElement ( formObj ) ;
				}
				else {
					var failureMessage = formAJAXResults . results . message ;
					formObj . insertAdjacentHTML ( 'beforebegin' , '<div id="' + formResultDivID + '" class="block-section full-width no-overflow border-radius-xsmall" style="color: #D8000C;background-color: #FFBABA;">' + failureMessage + '</div>' ) ;
				}
			} ,
			submitFormFailure : function  ( formObj , responseStatus , responseText ) {
				var failureMessage = ( ( ( responseStatus . status ) . replace ( ( ( responseStatus . code ) + ' ' ) , '' ) ) + ' [ Error ' + responseStatus . code + ' ]' ) ; ;
				var formResultDivID = ( formObj . id ) + '-message-result' ;
				var formLoadDivID = ( formObj . id ) + '-loading-image' ;
				onresetGReCaptcha1 ( ) ;
				onresetGReCaptcha2 ( ) ;
				animationEffects . hideElement ( document . getElementById ( formLoadDivID ) , { complete : function ( ) { if ( formLoadDivID ) formLoadDivID . parentNode . removeChild ( formLoadDivID ) ; } } ) ;
				if ( formLoadDivID ) formLoadDivID . parentNode . removeChild ( formLoadDivID ) ;
				formObj . insertAdjacentHTML ( 'beforebegin' , '<div id="' + formResultDivID + '" class="block-section full-width no-overflow border-radius-xsmall" style="color: #D8000C;background-color: #FFBABA;">Form could not be processed due to error : ' + failureMessage + '</div>' ) ;
			} ,
			listenerFunction : function ( eventObj ) {
				eventObj . preventDefault ( ) ;
				var formObj = this ;
				formAJAX . submitFormAJAX ( eventObj , formObj , formAJAX . submitFormSuccess , null , formAJAX . submitFormFailure , null ) ;
			} ,
			setListeners : function ( listenerState ) {
				formObj = document . getElementsByTagName ( "form" ) ;
				var temp = this ;
				if ( listenerState ) for ( var i = 0 ; i < formObj . length ; i ++ ) if ( ( formObj [ i ] . hasAttribute ( "action" ) ) && ( formObj [ i ] . getAttribute ( "action" ) ) ) customEventsHandler . addListenerEvent ( formObj [ i ] , "submit" , temp . listenerFunction ) ;
				else for ( var i = 0 ; i < formObj . length ; i ++ ) customEventsHandler . removeListenerEvent ( formObj [ i ] , "submit" , temp . listenerFunction ) ;
			}
		} ;
		window . formAJAX = formAJAX ;
	} ) ( ) ;

/**
	Custom JS - Initialize Dynamic Event Listeners
**/

	( function ( ) {
		variableListeners . setListeners ( true ) ;
	} ) ( ) ;
