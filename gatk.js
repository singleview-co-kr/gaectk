/*!
 * GA event tracker JavaScript Library
 * http://singleview.co.kr/
 *
 * Copyright 2015, 2016 singleview.co.kr
 * Released under the commercial license
 */

var version = '0.2.1';
var version_date = '2016-03-22';
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
	return;
}

function getCookie( cname )
{
	return;
}

function checkCookie() 
{
	return;
}
/************* temporary methods end *************/

function setUtmParamsGatk( sSource, sMedium, sCampaign, sKeyword, sContentVariation ) 
{
	if( sSource != '' )
		ga('set', 'campaignSource', sSource );
	if( sMedium != '' )
		ga('set', 'campaignMedium', sMedium );
	if( sCampaign != '' )
		ga('set', 'campaignName', sCampaign );
	if( sKeyword != '' )
		ga('set', 'campaignKeyword', sKeyword );
	if( sContentVariation != '' )
		ga('set', 'campaignContent', sContentVariation );
}

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
	var vpH = jQuery(window).height(); // Viewport Height
	var st = jQuery(window).scrollTop(); // Scroll Top
	var y = jQuery(elm).offset().top;
	var elementHeight = jQuery(elm).height();
	var sCurObjId = jQuery(elm).attr('id');

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
		nEventValue = _enforceInt( nEventValue );
		ga('send', 'event',  {
			'eventCategory': sEventCategory,   // Required.
			'eventAction': sEventAction,      // Required.
			'eventLabel': sEventLabel,
			'eventValue': nEventValue // use number only, null string '' commits error.
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
			'nonInteraction': 1 // true indicates that the event hit will not be used in bounce-rate calculation.
			});	
	}
	else
	{
		nEventValue = _enforceInt( nEventValue );
		ga('send', 'event', {
			'eventCategory': sEventCategory,   // Required.
			'eventAction': sEventAction,      // Required.
			'eventLabel': sEventLabel,
			'eventValue': nEventValue, // use number only, null string '' commits error.
			'nonInteraction': 1 // true indicates that the event hit will not be used in bounce-rate calculation.
			});
	}
}

function _sendCheckoutAction( nStepNumber, sOption )
{
	switch( arguments.length )
	{
		case 1:
			if( arguments[0] === null || arguments[0] === undefined || arguments[0].length == 0 )
				break;
			else
			{
				ga('ec:setAction','checkout', {	'step': nStepNumber });
//console.log( nStepNumber );
				return;
			}
			break;
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
//console.log( nStepNumber + ':' +  sOption );
				return;
			}
			break;
		default:
			ga('ec:setAction','checkout');
			return;
			break;
	}
	return;
}

function _enforceInt( nEventValue )
{
	nEventValue = nEventValue.toString().replace( /$|,/g,'' );
	if( isNaN( nEventValue ) )
		return 0;
	else
		return nEventValue;
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
		//this._runSingleviewTracker();
		//return true;
	},
	getVersion : function()
	{
		console.log( 'gatk ver ' + version + ' on ' + version_date + ' by singleview.co.kr' );
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

	init : function( sListTitle, nCurrentPage, nItemsPerPage )
	{
		if( !_g_bEcRequired )
		{
			_g_bEcRequired = true;
			ga('require', 'ec');
		}
		if( nCurrentPage === null || nCurrentPage === undefined || nCurrentPage.length == 0 )
			nCurrentPage = 1;
		if( nCurrentPage > 1 ) // 한페이지에 복수 리스트 모듈이 있는 경우는 메인페이지 혹은 첫페이지로 한정함
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
	patchImpression : function( nItemChunk )
	{
		if( typeof nItemChunk === 'undefined' )
			nItemChunk = 30;

		if( nItemChunk == 0 )
			nItemChunk = 30;

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
			if( i > 0 && i % nItemChunk == 0 )
				_sendGaEventWithoutInteraction( 'eec', 'send', 'eec_addImp', 0 );
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
				_sendGaEventWithoutInteraction( 'button', 'clicked', _g_sPrefixViewDetail + '_on_' + this._g_sListTitle +'_pos:' + this._g_oProductInfo[i].position + '_' + this._g_oProductInfo[i].id+'_'+this._g_oProductInfo[i].name );
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
		nItemPrice = _enforceInt( nItemPrice );
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
		nTotalQuantity = _enforceInt( nTotalQuantity );
		var nTotalPrice = nTotalQuantity * this._g_oProductInfo[0].price;
		_sendGaEventWithoutInteraction( 'button', 'clicked', _g_sPrefixBuyImmediately + '_' + this._g_oProductInfo[0].id + '_' + this._g_oProductInfo[0].name, nTotalPrice );
		return true;
	},
	patchAddToCart : function( nTotalQuantity )
	{
		nTotalQuantity = _enforceInt( nTotalQuantity );
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
	queueItemInfo : function( nCartSrl, nItemSrl, sItemName, sCategory, sBrand, sVariant, nItemPrice, nTotalQuantity, sCoupon )
	{
		nItemPrice = _enforceInt( nItemPrice );
		// object literal notation to create your structures
		this._g_oProductInfo.push({ cartid: nCartSrl, id: nItemSrl, name: sItemName, category: sCategory, brand: sBrand, variant: sVariant, price: nItemPrice, quantity: nTotalQuantity, coupon: sCoupon });
		return true;
	},
	checkoutSelected : function( aTmpCartSrl )
	{
		// aCartSrl이 배열이 아니고 정수이면 배열로 전환
		var aCartSrl = [];
		if( aTmpCartSrl instanceof Array ) 
		{
			var nCartSrl;
			for( nIdx in aTmpCartSrl ) 
			{
				if( aTmpCartSrl[nIdx] != '' )
					aCartSrl.push( aTmpCartSrl[nIdx] );
			}
		}
		else  // aCartSrl이 배열이 아니고 정수이면 배열로 전환
		{
			var nTmpCartSrl = aTmpCartSrl;
			aCartSrl.push( nTmpCartSrl );
		}

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
					_sendCheckoutAction( 1, 'cart page' );
					_sendGaEventWithoutInteraction( 'checkout', 'started', _g_sPrefixCheckoutSelected + '_' + this._g_oProductInfo[i].id+'_' + this._g_oProductInfo[i].name, this._g_oProductInfo[i].price * this._g_oProductInfo[i].quantity );
					aCartSrl.shift();
				}
			}
		}
	},
	checkoutAll : function()
	{
		var nElement = this._g_oProductInfo.length;
		if( nElement < 0 )
			return;

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
		_sendCheckoutAction( 1, 'cart page' );
		_sendGaEventWithoutInteraction( 'checkout', 'started', _g_sPrefixCheckoutAll, nTotalPrice ); // Send data using an event after set ec-action
	},
	removeAll : function()
	{
		var nElement = this._g_oProductInfo.length;
		if( nElement < 0 )
			return;

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
			nTotalPrice = this._g_oProductInfo[i].price * this._g_oProductInfo[i].quantity * -1;
			ga('ec:setAction', 'remove');
			_sendGaEventWithoutInteraction( 'button', 'clicked', _g_sPrefixRemoveFromCart + '_' + this._g_oProductInfo[i].id + '_' + this._g_oProductInfo[i].name, nTotalPrice ); // Send data using an event after set ec-action
		}
	},
	removeFromCart : function( aTmpCartSrl )
	{
		var aCartSrl = [];
		if( aTmpCartSrl instanceof Array ) 
		{
			var nCartSrl;
			for( nIdx in aTmpCartSrl ) 
			{
				if( aTmpCartSrl[nIdx] != '' )
					aCartSrl.push( aTmpCartSrl[nIdx] );
			}
		}
		else  // aCartSrl이 배열이 아니고 정수이면 배열로 전환
		{
			var nTmpCartSrl = aTmpCartSrl;
			aCartSrl.push( nTmpCartSrl );
		}

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
		nItemPrice = _enforceInt( nItemPrice );
		// object literal notation to create your structures
		this._g_oProductInfo.push({ id: nItemSrl, name: sItemName, category: sCategory, brand: sBrand, variant: sVariant, price: nItemPrice, quantity: nTotalQuantity });
		return true;
	},
	patch : function( nStepNumber, sOption ) // 기본세팅대로 했다면, user define stepnumber는 3부터 시작해야 함
	{
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
	
		if( nStepNumber === undefined )
			nStepNumber = null;
		else if( nStepNumber.length == 0 )
			nStepNumber = null;

		if( sOption === undefined )
			sOption = null;
		else if( sOption.length == 0 )
			sOption = null;
		
		if( nStepNumber == null && sOption == null )
			_sendCheckoutAction( 2, 'settlement start page' ); // 1, the first step already started from cart page
		else if( nStepNumber != null && sOption == null )
			_sendCheckoutAction( nStepNumber ); 
		else if( nStepNumber != null && sOption != null )
			_sendCheckoutAction( nStepNumber, sOption );
		
		_sendGaEventWithoutInteraction( 'checkout', 'started', _g_sPrefixSettlement, nTotalPrice ); // Send data using an event after set ec-action
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
		nItemPrice = _enforceInt( nItemPrice );
		// can be ignored if engine does not provide purchased item list in checkout result page
		// object literal notation to create your structures
		this._g_oProductInfo.push({ id: nItemSrl, name: sItemName, category: sCategory, brand: sBrand, variant: sVariant, price: nItemPrice, quantity: nTotalQuantity, coupon: sCoupon  });
		return true;
	},
	patchPurchase : function( nOrderSrl, sAffiliation, nRevenue, nShippingCost, sCoupon )
	{
		nRevenue = _enforceInt( nRevenue );
		nShippingCost = _enforceInt( nShippingCost );
		var nElement = this._g_oProductInfo.length;
		var nTaxAmnt = nRevenue * 0.1;

		if( nElement > 0 ) // gatkPurchase.queueItemInfo()가 실행되었으면
		{
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
				
				// purchase action should be sent for every single item
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
		else // gatkPurchase.queueItemInfo()가 실행되지 않았으면 ecommerce->overview->product 정보가 나오지 않음
		{
			// purchase action should be sent for every single item
			ga('ec:setAction', 'purchase', { // Transaction details are provided in an actionFieldObject.
				'id': nOrderSrl,             // (Required) Transaction id (string).
				'affiliation': sAffiliation, // Affiliation (string).
				'revenue': nRevenue,         // Revenue (currency).
				'tax': nTaxAmnt,             // Tax (currency).
				'shipping': nShippingCost,   // Shipping (currency).
				'coupon': sCoupon            // Transaction coupon (string).
			});
		}
		this._runSingleviewConversion( 'purchase', nRevenue );
	},
	_runSingleviewConversion : function( sActionType, nRevenue )
	{
		var sEncodedUserAgent = encodeURI( navigator.userAgent );
		var sCurrentUrl = window.location.href.toString().split( window.location.host )[1];
		var sEncodedCurrentUri = encodeURIComponent( sCurrentUrl );
		var oImg = document.createElement( 'IMG' );
		oImg.src = 'http://singleview.co.kr/conversion.gif?hn=' + window.location.host + '&at=' + sActionType  + '&rv=' + nRevenue + '&qs=' +  sEncodedCurrentUri + '&ua=' + sEncodedUserAgent;
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
		nItemPrice = _enforceInt( nItemPrice );
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