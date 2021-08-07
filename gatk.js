/*!
 * GA event tracker JavaScript Library v0.0.8
 * http://singleview.co.kr/
 *
 * Copyright 2015, 2015 singleview.co.kr
 * Released under the commercial license
 *
 * Date: 2015-29-02T15:27Z
 */

var version = '0.0.8';
var 
	_g_sPrefixViewDetail = 'vd',
	_g_sPrefixBuyImmediately = 'bi',
	_g_sPrefixAddToCart = 'atc',
	_g_sPrefixRemoveFromCart = 'rfc',
	_g_sPrefixCheckoutSelected = 'cs',
	_g_sPrefixCheckoutAll = 'ca',
	_g_sPrefixSettlement = 'setl',
	_g_sPrefixPurchased = 'pur',
	_g_sPrefixRefunded = 'ref';

var _g_bEcRequired = false;
var _g_bSentConversionPageView = false;
var _g_aImageElement = new Array();

/************* temporary methods begin *************/
function setCookie( cname, cvalue, exdays )
{
	var d = new Date();
	d.setTime( d.getTime() + ( exdays*24*60*60*1000 ) );
	var expires = 'expires=' + d.toUTCString();
	document.cookie = cname + '=' + cvalue + '; ' + expires;
}

function getCookie( cname )
{
	var name = cname + '=';
	var ca = document.cookie.split( ';' );
	for( var i=0; i<ca.length; i++ ) 
	{
		var c = ca[i];
		while( c.charAt(0)==' ' ) 
			c = c.substring(1);
		if( c.indexOf(name) == 0 )
			return c.substring(name.length, c.length);
	}
	return '';
}

function checkCookie() 
{
	var user = getCookie( 'username' );
	if( user != '' ) 
		alert( 'Welcome again ' + user );
	else 
	{
		user = prompt( 'Please enter your name:', '');
		if( user != '' && user != null ) 
			setCookie( 'username', user, 365 );
	}
}
/************* temporary methods end *************/

function checkNonEcConversionGatk( sVirtualUrl, sPageTitle ) 
{
	if( !_g_bSentConversionPageView )
	{
		ga('send', 'pageview', {
		  'page': sVirtualUrl, // example '/thankyou.html'
		  'title': sPageTitle
		});
		_g_bSentConversionPageView = true;
	}
}

function checkVisibilityGatk( elm, eval ) 
{
	eval = eval || 'visible';
	var vpH = $(window).height(); // Viewport Height
	var st = $(window).scrollTop(); // Scroll Top
	var y = $(elm).offset().top;
	var elementHeight = $(elm).height();
	var sCurObjId = $(elm).attr('id');

	if( eval == 'visible' )
	{
		// mark an object is on viewport
		if( (y < (vpH + st)) && (y > (st - elementHeight)) )
		{
			var bChecked = false;
			
			if( _g_aImageElement.length > 0 )
			{
				for( var i in _g_aImageElement )
				{
					if( _g_aImageElement[i] == sCurObjId )
					{
						bChecked = true;
						break;
					}
				}
			}
			
			if( !bChecked )
			{
//console.log(sCurObjId );
				_sendGaEventWithoutInteraction( 'banner', 'viewed', sCurObjId );
				_g_aImageElement[_g_aImageElement.length] = sCurObjId;
			}
		}
	}
	if( eval == 'above' ) 
		return ((y < (vpH + st)));
}

function sendClickEventGatk( sCategory, sPageTitle, sLocation, sWindow )
{
	if( sWindow === null || sWindow === undefined || sWindow.length == 0 )
		sWindow = 'self';
	_sendGaEventWithInteraction( sCategory, 'clicked', sPageTitle );
	
	if( sWindow == 'self' )
	{
		if( sLocation != '#' )
			location.href = sLocation;
	}
	else
	{
		if( sLocation != '#' )
		{
			window.open( sLocation, sWindow );
			window.focus();
		}
	}
}

// send pageview 명령 전에 send event 명령을 수행하면 queue에 적재된 EC 관련 정보들이 send event와 함께 pop되어버림
// Send data using an event just after set ec-action
function _sendGaEventWithInteraction( sEventCategory, sEventAction, sEventLabel, nEventValue )
{
	if( nEventValue === undefined )
	{
		ga('send', 'event',  {
			'eventCategory': sEventCategory,   // Required.
			'eventAction': sEventAction,      // Required.
			'eventLabel': sEventLabel
			});
	}
	else
	{
		ga('send', 'event',  {
			'eventCategory': sEventCategory,   // Required.
			'eventAction': sEventAction,      // Required.
			'eventLabel': sEventLabel,
			'eventValue': nEventValue
			});
	}
}
// send pageview 명령 전에 send event 명령을 수행하면 queue에 적재된 EC 관련 정보들이 send event와 함께 pop되어버림
// Send data using an event just after set ec-action
function _sendGaEventWithoutInteraction( sEventCategory, sEventAction, sEventLabel, nEventValue )
{
	if( nEventValue === undefined )
	{
		ga('send', 'event', {
			'eventCategory': sEventCategory,   // Required.
			'eventAction': sEventAction,      // Required.
			'eventLabel': sEventLabel,
			'nonInteraction': 1
			});	
	}
	else
	{
		ga('send', 'event', {
			'eventCategory': sEventCategory,   // Required.
			'eventAction': sEventAction,      // Required.
			'eventLabel': sEventLabel,
			'eventValue': nEventValue,
			'nonInteraction': 1
			});
	}
}

var gatkHeader = 
{
	init : function( sTrackingId )
	{
		ga('create', sTrackingId, 'auto');
		ga('require', 'linkid', 'http://www.google-analytics.com/plugins/ua/linkid.js');
		ga('require', 'displayfeatures');
		return true;
	},
	close : function()
	{
		ga('send', 'pageview');
		this._runSingleviewTracker();
		return true;
	},
	_runSingleviewTracker : function()
	{
		var sEncodedUserAgent = encodeURI( navigator.userAgent );
		var sCurrentUrl = window.location.href.toString().split( window.location.host )[1];
		var sEncodedCurrentUri = encodeURIComponent( sCurrentUrl );
		var oImg = document.createElement( 'IMG' );
		oImg.src = 'http://singleview.co.kr/singleview.gif?hn=' + window.location.host + '&qs=' +  sEncodedCurrentUri + '&ua=' + sEncodedUserAgent;
	}
}

var gatkList = 
{
	_g_nListPosition : 1,
	_g_sListTitle : 'undefined',
	_g_oProductInfo : [],

	init : function( sListTitle, nCurrentPage, nItemsPerPag )
	{
		if( !_g_bEcRequired )
		{
			_g_bEcRequired = true;
			ga('require', 'ec');
		}
		if( nCurrentPage === null || nCurrentPage === undefined || nCurrentPage.length == 0 )
			nCurrentPage = 1;
		if( nCurrentPage > 1 )
			this._g_nListPosition = nItemsPerPage * ( nCurrentPage - 1 ) + 1;
		if( sListTitle !== null && sListTitle !== undefined && sListTitle.length > 0 )
			this._g_sListTitle = sListTitle;
		return true;
	},
	queueItemInfo : function( nItemSrl, sItemName, sCategory, sBrand, sVariant )
	{
		this._g_oProductInfo.push({ id: nItemSrl, name: sItemName, category: sCategory, brand: sBrand, variant: sVariant, position: this._g_nListPosition });
		this._increasePosition();
		return true;
	},
	patchImpression : function()
	{
		var nStackedCartElement = this._g_oProductInfo.length;
		for( var i = 0; i < nStackedCartElement; i++ )
		{
			ga('ec:addImpression', {
				'id': this._g_oProductInfo[i].id, // Product ID (string).
				'name': this._g_oProductInfo[i].name, // Product name (string).
				'category': this._g_oProductInfo[i].category, // Product category (string).
				'brand': this._g_oProductInfo[i].brand, // Product brand (string).
				'variant': this._g_oProductInfo[i].variant, // Product variant (string).
				'list': this._g_sListTitle,
				'position': this._g_oProductInfo[i].position // 'position' indicates the product position in the list.
			});
		}
		return true;
	},
	// Called when a link to a product is clicked.
	sendClicked : function( nItemSrl ) 
	{
		var nStackedCartElement = this._g_oProductInfo.length;
		for( var i = 0; i < nStackedCartElement; i++ )
		{
			if( this._g_oProductInfo[i].id == nItemSrl )
			{
				ga('ec:addProduct', {
					'id': this._g_oProductInfo[i].id, // Product ID (string).
					'name': this._g_oProductInfo[i].name, // Product name (string).
					'category': this._g_oProductInfo[i].category, // Product category (string).
					'brand': this._g_oProductInfo[i].brand, // Product brand (string).
					'variant': this._g_oProductInfo[i].variant, // Product variant (string).
					'list': this._g_sListTitle,
					'position': this._g_oProductInfo[i].position // 'position' indicates the product position in the list.
				});
				ga('ec:setAction', 'click', { list: this._g_sListTitle } );
				_sendGaEventWithoutInteraction( 'link', 'clicked', _g_sPrefixViewDetail + '_' + this._g_oProductInfo[i].id+'_'+this._g_oProductInfo[i].name, '' );
				break;
			}
		}
	},
	_increasePosition : function()
	{
		this._g_nListPosition++;
		return true;
	}
}

var gatkDetail = 
{
	_g_oProductInfo : [],

	init : function()
	{
		if( !_g_bEcRequired )
		{
			_g_bEcRequired = true;
			ga('require', 'ec');
		}
		return true;
	},
	loadItemInfo : function( nItemSrl, sItemName, sCategory, sBrand, sVariant, nItemPrice )
	{
		this._g_oProductInfo.push({ id: nItemSrl, name: sItemName, category: sCategory, brand: sBrand, variant: sVariant, price: nItemPrice });
		return true;
	},
	patchDetail : function()
	{
		ga('ec:addProduct', { // Provide product details in an productFieldObject.
			'id': this._g_oProductInfo[0].id, // Product ID (string).
			'name': this._g_oProductInfo[0].name, // Product name (string).
			'category': this._g_oProductInfo[0].category, // Product category (string).
			'brand': this._g_oProductInfo[0].brand, // Product brand (string).
			'variant': this._g_oProductInfo[0].variant, // Product variant (string).
			'position': 1, // Product position (number).
		});
		ga('ec:setAction', 'detail'); // Detail action.
		return true;
	},
	patchBuyImmediately : function( nTotalQuantity )
	{
		var nTotalPrice = nTotalQuantity * this._g_oProductInfo[0].price;
		_sendGaEventWithoutInteraction( 'button', 'clicked', _g_sPrefixBuyImmediately + '_' + this._g_oProductInfo[0].id + '_' + this._g_oProductInfo[0].name, nTotalPrice );
		return true;
	},
	patchAddToCart : function( nTotalQuantity )
	{
		var nTotalPrice = nTotalQuantity * this._g_oProductInfo[0].price;
		_sendGaEventWithoutInteraction( 'button', 'clicked', _g_sPrefixAddToCart + '_' + this._g_oProductInfo[0].id + '_' + this._g_oProductInfo[0].name, nTotalPrice );
		ga('ec:addProduct', {
			'id': this._g_oProductInfo[0].id, // Product ID (string).
			'name': this._g_oProductInfo[0].name, // Product name (string).
			'category': this._g_oProductInfo[0].category, // Product category (string).
			'brand': this._g_oProductInfo[0].brand, // Product brand (string).
			'variant': this._g_oProductInfo[0].variant, // Product variant (string).
			'price': this._g_oProductInfo[0].price,
			'quantity': nTotalQuantity
		});
		ga('ec:setAction', 'add');
		return true;
	}
}

var gatkCart = 
{
	_g_oProductInfo : [],
	init : function()
	{
		if( !_g_bEcRequired )
		{
			_g_bEcRequired = true;
			ga('require', 'ec');
		}
		return true;
	},
	queueItemInfo : function( nCartSrl, nItemSrl, sItemName, sCategory, sBrand, sVariant, nItemPrice, nTotalQuantity, sCoupon, nPosition )
	{
		// object literal notation to create your structures
		this._g_oProductInfo.push({ cartid: nCartSrl, id: nItemSrl, name: sItemName, category: sCategory, brand: sBrand, variant: sVariant, price: nItemPrice, quantity: nTotalQuantity, coupon: sCoupon, position: nPosition  });
		return true;
	},
	checkoutSelected : function( aCartSrl )
	{
		// aCartSrl이 배열이 아니고 정수이면 배열로 전환하는 코드 필요
		var nStackedCartElement = this._g_oProductInfo.length;
		var nSelectedCartElement = 0;
		for( var i = 0; i < nStackedCartElement; i++ )
		{
			nSelectedCartElement = aCartSrl.length;
			for( var j = 0; j < nSelectedCartElement; j++ )
			{
				if( aCartSrl[j] != '' && this._g_oProductInfo[i].cartid == aCartSrl[j] )
				{
					ga('ec:addProduct', { // Provide product details in an productFieldObject.
						'id': this._g_oProductInfo[i].id, // Product ID (string).
						'name': this._g_oProductInfo[i].name, // Product name (string).
						'category': this._g_oProductInfo[i].category, // Product category (string).
						'brand': this._g_oProductInfo[i].brand, // Product brand (string).
						'variant': this._g_oProductInfo[i].variant, // Product variant (string).
						'price': this._g_oProductInfo[i].price, // Product price (currency).
						'quantity': this._g_oProductInfo[i].quantity // Product quantity (number).
					});
					this._sendCheckoutAction();
					_sendGaEventWithoutInteraction( 'checkout', 'started', _g_sPrefixCheckoutSelected + '_' + this._g_oProductInfo[i].id+'_' + this._g_oProductInfo[i].name, this._g_oProductInfo[i].price * this._g_oProductInfo[i].quantity );
					aCartSrl.shift();
				}
			}
		}
	},
	checkoutAll : function()
	{
		//_sendGaEventWithoutInteraction( 'checkout', 'started', 'checkout_all', nTotalPrice );
		var nElement = this._g_oProductInfo.length;
		var nTotalPrice = 0;
		for( var i = 0; i < nElement; i++ )
		{
			ga('ec:addProduct', { // Provide product details in an productFieldObject.
				'id': this._g_oProductInfo[i].id, // Product ID (string).
				'name': this._g_oProductInfo[i].name, // Product name (string).
				'category': this._g_oProductInfo[i].category, // Product category (string).
				'brand': this._g_oProductInfo[i].brand, // Product brand (string).
				'variant': this._g_oProductInfo[i].variant, // Product variant (string).
				'price': this._g_oProductInfo[i].price, // Product price (currency).
				'quantity': this._g_oProductInfo[i].quantity // Product quantity (number).
			});
			nTotalPrice += this._g_oProductInfo[i].price * this._g_oProductInfo[i].quantity;
		}
		this._sendCheckoutAction();
		_sendGaEventWithoutInteraction( 'checkout', 'started', _g_sPrefixCheckoutAll, nTotalPrice ); // Send data using an event after set ec-action
	},
	removeFromCart : function( aCartSrl ) //nItemSrl, sItemName, sCategory, sBrand, sVariant, nItemPrice, nTotalQuantity, nTotalPrice ) 
	{
		// aCartSrl이 배열이 아니고 정수이면 배열로 전환하는 코드 필요
		var nStackedCartElement = this._g_oProductInfo.length;
		var nSelectedCartElement = 0;
		var nTotalPrice = 0;
		for( var i = 0; i < nStackedCartElement; i++ )
		{
			nSelectedCartElement = aCartSrl.length;
			for( var j = 0; j < nSelectedCartElement; j++ )
			{
				if( aCartSrl[j] != '' && this._g_oProductInfo[i].cartid == aCartSrl[j] )
				{
					ga('ec:addProduct', { // Provide product details in an productFieldObject.
						'id': this._g_oProductInfo[i].id, // Product ID (string).
						'name': this._g_oProductInfo[i].name, // Product name (string).
						'category': this._g_oProductInfo[i].category, // Product category (string).
						'brand': this._g_oProductInfo[i].brand, // Product brand (string).
						'variant': this._g_oProductInfo[i].variant, // Product variant (string).
						'price': this._g_oProductInfo[i].price, // Product price (currency).
						'quantity': this._g_oProductInfo[i].quantity // Product quantity (number).
					});
					nTotalPrice = ( this._g_oProductInfo[i].price * this._g_oProductInfo[i].quantity ) * -1;
					ga('ec:setAction', 'remove');
					_sendGaEventWithoutInteraction( 'button', 'clicked', _g_sPrefixRemoveFromCart + '_' + this._g_oProductInfo[i].id + '_' + this._g_oProductInfo[i].name, nTotalPrice );
					aCartSrl.shift();
				}
			}
		}
	},
	_sendCheckoutAction : function( nStepNumber, sOption )
	{
		switch( arguments.length )
		{
			case 1:
				if( arguments[0] === null || arguments[0] === undefined || arguments[0].length == 0 )
					break;
				else
				{
					ga('ec:setAction','checkout', {	'step': nStepNumber });
					return;
				}
			case 2:
				if( arguments[0] === null || arguments[0] === undefined || arguments[0].length == 0 ||
					arguments[1] === null || arguments[1] === undefined || arguments[1].length == 0 )
					break;
				else
				{
					ga('ec:setAction','checkout', {
						'step': nStepNumber,   // A value of 1 indicates this action is first checkout step. step number is related with ecommerce->shopping analysis -> checkout behavior
						'option': sOption   // Used to specify additional info about a checkout stage, e.g. payment method.
					});
					return;
				}
			default:
				break;
		}
		ga('ec:setAction','checkout');
	}
}
var gatkSettlement = 
{
	_g_oProductInfo : [],
	init : function()
	{
		if( !_g_bEcRequired )
		{
			_g_bEcRequired = true;
			ga('require', 'ec');
		}
		return true;
	},
	queueItemInfo : function( nItemSrl, sItemName, sCategory, sBrand, sVariant, nItemPrice, nTotalQuantity )
	{
		// object literal notation to create your structures
		this._g_oProductInfo.push({ id: nItemSrl, name: sItemName, category: sCategory, brand: sBrand, variant: sVariant, price: nItemPrice, quantity: nTotalQuantity });
		return true;
	},
	patch : function()
	{
		//_sendGaEventWithoutInteraction( 'checkout', 'started', 'checkout_all', nTotalPrice );
		var nElement = this._g_oProductInfo.length;
		var nTotalPrice = 0;
		for( var i = 0; i < nElement; i++ )
		{
			ga('ec:addProduct', { // Provide product details in an productFieldObject.
				'id': this._g_oProductInfo[i].id, // Product ID (string).
				'name': this._g_oProductInfo[i].name, // Product name (string).
				'category': this._g_oProductInfo[i].category, // Product category (string).
				'brand': this._g_oProductInfo[i].brand, // Product brand (string).
				'variant': this._g_oProductInfo[i].variant, // Product variant (string).
				'price': this._g_oProductInfo[i].price, // Product price (currency).
				'quantity': this._g_oProductInfo[i].quantity // Product quantity (number).
			});
			nTotalPrice += this._g_oProductInfo[i].price * this._g_oProductInfo[i].quantity;
		}
		this._sendCheckoutAction();
		_sendGaEventWithoutInteraction( 'checkout', 'started', _g_sPrefixSettlement, nTotalPrice ); // Send data using an event after set ec-action
	},

	_sendCheckoutAction : function( nStepNumber, sOption )
	{
		switch( arguments.length )
		{
			case 1:
				if( arguments[0] === null || arguments[0] === undefined || arguments[0].length == 0 )
					break;
				else
				{
					ga('ec:setAction','checkout', {	'step': nStepNumber });
					return;
				}
			case 2:
				if( arguments[0] === null || arguments[0] === undefined || arguments[0].length == 0 ||
					arguments[1] === null || arguments[1] === undefined || arguments[1].length == 0 )
					break;
				else
				{
					ga('ec:setAction','checkout', {
						'step': nStepNumber,   // A value of 1 indicates this action is first checkout step. step number is related with ecommerce->shopping analysis -> checkout behavior
						'option': sOption   // Used to specify additional info about a checkout stage, e.g. payment method.
					});
					return;
				}
			default:
				break;
		}
		ga('ec:setAction','checkout');
	}
}
var gatkPurchase = 
{
	_g_oProductInfo : [],
	init : function()
	{
		if( !_g_bEcRequired )
		{
			_g_bEcRequired = true;
			ga('require', 'ec');
		}
		return true;
	},
	queueItemInfo : function( nItemSrl, sItemName, sCategory, sBrand, sVariant, nItemPrice, nTotalQuantity, sCoupon )
	{
		// object literal notation to create your structures
		this._g_oProductInfo.push({ id: nItemSrl, name: sItemName, category: sCategory, brand: sBrand, variant: sVariant, price: nItemPrice, quantity: nTotalQuantity, coupon: sCoupon  });
		return true;
	},
	patchPurchase : function( nOrderSrl, sAffiliation, nRevenue, nShippingCost, sCoupon )
	{
		var nElement = this._g_oProductInfo.length;
		var nTaxAmnt = nRevenue * 0.1;
		for( var i = 0; i < nElement; i++ )
		{
			ga('ec:addProduct', { // Provide product details in an productFieldObject.
				'id': this._g_oProductInfo[i].id, // Product ID (string).
				'name': this._g_oProductInfo[i].name, // Product name (string).
				'category': this._g_oProductInfo[i].category, // Product category (string).
				'brand': this._g_oProductInfo[i].brand, // Product brand (string).
				'variant': this._g_oProductInfo[i].variant, // Product variant (string).
				'price': this._g_oProductInfo[i].price, // Product price (currency).
				'quantity': this._g_oProductInfo[i].quantity, // Product quantity (number).
				'coupon': sCoupon  // Product coupon (string).
			});
			
			ga('ec:setAction', 'purchase', { // Transaction details are provided in an actionFieldObject.
				'id': nOrderSrl,             // (Required) Transaction id (string).
				'affiliation': sAffiliation, // Affiliation (string).
				'revenue': nRevenue,         // Revenue (currency).
				'tax': nTaxAmnt,             // Tax (currency).
				'shipping': nShippingCost,   // Shipping (currency).
				'coupon': sCoupon            // Transaction coupon (string).
			});

			_sendGaEventWithoutInteraction( 'checkout', 'purchased', _g_sPrefixPurchased + '_' + this._g_oProductInfo[i].id + '_' + this._g_oProductInfo[i].name, this._g_oProductInfo[i].price * this._g_oProductInfo[i].quantity );
		}
	}
}

var gatkMypage = 
{
	_g_oProductInfo : [],
	init : function()
	{
		if( !_g_bEcRequired )
		{
			_g_bEcRequired = true;
			ga('require', 'ec');
		}
		return true;
	},
	queueItemInfo : function( nItemSrl, sItemName, sCategory, sBrand, sVariant, nItemPrice, nTotalQuantity )
	{
		// object literal notation to create your structures
		this._g_oProductInfo.push({ id: nItemSrl, name: sItemName, category: sCategory, brand: sBrand, variant: sVariant, price: nItemPrice, quantity: nTotalQuantity });
		return true;
	},
	refund : function( nOrderSrl )
	{
		// Refund an entire transaction.
		var nElement = this._g_oProductInfo.length;
		var nRefundedAmnt = 0;
		for( var i = 0; i < nElement; i++ )
		{
			nRefundedAmnt = this._g_oProductInfo[i].price * this._g_oProductInfo[i].quantity * -1;
			// Refund a single product.
			ga('ec:addProduct', {
			  'id': this._g_oProductInfo[i].id, // Product ID is required for partial refund.
			  'quantity': this._g_oProductInfo[i].quantity // Quantity is required for partial refund.
			});
			_sendGaEventWithoutInteraction( 'checkout', 'refunded', _g_sPrefixRefunded + '_' + this._g_oProductInfo[i].id + '_' + this._g_oProductInfo[i].name, nRefundedAmnt );
		}
		ga('ec:setAction', 'refund', {
			'id': nOrderSrl    // Transaction ID is only required field for full refund.
		});
	}
}