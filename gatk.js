/*!
 * GA event tracker JavaScript Library
 * http://singleview.co.kr/
 *
 * Copyright 2015, 2016, 2017 singleview.co.kr
 * Released under the commercial license
 */

var version = '0.2.6';
var version_date = '2017-01-28';
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
var _g_aImageElement = [];
var _g_aScripts = document.getElementsByTagName('script');
var _g_sSrc = _g_aScripts[_g_aScripts.length-1].src;

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
	if( sLocation === null || sLocation === undefined || sLocation.length == 0 || sLocation == '#' )
		sLocation = '#';

	if( sWindow === null || sWindow === undefined || sWindow.length == 0 )
		sWindow = 'self';
	_sendGaEventWithInteraction( sCategory, 'clicked', sPageTitle );

	if( sLocation != '#' )
	{
		if( sWindow == 'self' )
			location.href = sLocation;
		else
		{
			window.open( sLocation, sWindow );
			window.focus();
		}
	}
}

function _setCookie( cname, cvalue, nExpHrs )
{
	var d = new Date();
	d.setTime( d.getTime() + nExpHrs*3600000 ); //60*60*1000
	var expires = 'expires=' + d.toUTCString();
	document.cookie = cname + '=' + cvalue + '; ' + expires;
}

function _getCookie( cname )
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

/**
*  Secure Hash Algorithm (SHA256)
*  http://www.webtoolkit.info/
*  Original code by Angel Marin, Paul Johnston.
**/
function _SHA256(s)
{
	var chrsz   = 8;
	var hexcase = 0;
	function safe_add (x, y) {
		var lsw = (x & 0xFFFF) + (y & 0xFFFF);
		var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
		return (msw << 16) | (lsw & 0xFFFF);
	}
	function S (X, n) { return ( X >>> n ) | (X << (32 - n)); }
	function R (X, n) { return ( X >>> n ); }
	function Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }
	function Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }
	function Sigma0256(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }
	function Sigma1256(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }
	function Gamma0256(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }
	function Gamma1256(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }
	function core_sha256 (m, l) {
		 
		var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 
			0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 
			0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 
			0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 
			0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 
			0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 
			0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 
			0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 
			0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 
			0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 
			0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);

		var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);

		var W = new Array(64);
		var a, b, c, d, e, f, g, h, i, j;
		var T1, T2;
  
		m[l >> 5] |= 0x80 << (24 - l % 32);
		m[((l + 64 >> 9) << 4) + 15] = l;
  
		for ( var i = 0; i<m.length; i+=16 ) {
			a = HASH[0];
			b = HASH[1];
			c = HASH[2];
			d = HASH[3];
			e = HASH[4];
			f = HASH[5];
			g = HASH[6];
			h = HASH[7];
  
			for ( var j = 0; j<64; j++) {
				if (j < 16) W[j] = m[j + i];
				else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
  
				T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
				T2 = safe_add(Sigma0256(a), Maj(a, b, c));
  
				h = g;
				g = f;
				f = e;
				e = safe_add(d, T1);
				d = c;
				c = b;
				b = a;
				a = safe_add(T1, T2);
			}
			HASH[0] = safe_add(a, HASH[0]);
			HASH[1] = safe_add(b, HASH[1]);
			HASH[2] = safe_add(c, HASH[2]);
			HASH[3] = safe_add(d, HASH[3]);
			HASH[4] = safe_add(e, HASH[4]);
			HASH[5] = safe_add(f, HASH[5]);
			HASH[6] = safe_add(g, HASH[6]);
			HASH[7] = safe_add(h, HASH[7]);
		}
		return HASH;
	}
  
	function str2binb (str) {
		var bin = Array();
		var mask = (1 << chrsz) - 1;
		for(var i = 0; i < str.length * chrsz; i += chrsz) {
			bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i%32);
		}
		return bin;
	}
  
	function Utf8Encode(string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
		for (var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
		}
		return utftext;
	}
  
	function binb2hex (binarray) {
		var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
		var str = "";
		for(var i = 0; i < binarray.length * 4; i++) {
			str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
			hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);
		}
		return str;
	}
  
	s = Utf8Encode(s);
	return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
}

function _reflect()
{
	// http://stackoverflow.com/questions/2255689/how-to-get-the-file-path-of-the-currently-executing-javascript-code
	var aSrc = _g_sSrc.split('/');
	for (var i in aSrc)
	{
		// http://rubular.com/r/KByADagF3Z
		if (/^[sS][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(aSrc[i]))
		{
			if( _SHA256(aSrc[i]) == 'ce79286b7fc9cf82f942b036124fb8cd5dd8e3df6083271118d7cd758b452c8a' ) // singleview.co.kr
			{
				console.log('valid server');
				return true;
			}
		}
	}
	console.log('invalid server');
	return false;
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
	_g_bFacebookConvLoaded : false,

	init : function()
	{
		if( !_g_bEcRequired )
		{
			_g_bEcRequired = true;
			ga('require', 'ec');
		}
		if (typeof(fbq) != 'undefined' && fbq != null ) 
			this._g_bFacebookConvLoaded = true;
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

		if( this._g_bFacebookConvLoaded )
			this._fbSendViewContent();
		return true;
	},
	patchBuyImmediately : function( nTotalQuantity )
	{
		nTotalQuantity = _enforceInt( nTotalQuantity );
		var nTotalPrice = nTotalQuantity * this._g_oProductInfo[0].price;
		_sendGaEventWithoutInteraction( 'button', 'clicked', _g_sPrefixBuyImmediately + '_' + this._g_oProductInfo[0].id + '_' + this._g_oProductInfo[0].name, nTotalPrice );
		if( this._g_bFacebookConvLoaded )
			this._fbSendCheckoutInitiation();
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
		if( this._g_bFacebookConvLoaded )
			this._fbSendItemsToCart();
		return true;
	},
	_fbSendViewContent : function()
	{
		fbq('track', 'ViewContent', {
			content_ids: this._g_oProductInfo[0].id,
			content_type: 'product',
			value: this._g_oProductInfo[0].price,
			currency: 'KRW'
		});
	},
	_fbSendCheckoutInitiation : function() 
	{
		fbq('track', 'InitiateCheckout');
	},
	_fbSendItemsToCart : function()
	{
		fbq('track', 'AddToCart', {
			content_ids: this._g_oProductInfo[0].id,
			content_type: 'product',
			value: this._g_oProductInfo[0].price,
			currency: 'KRW'
		});
	}
}

var gatkCart = 
{
	_g_oProductInfo : [],
	_g_bFacebookConvLoaded : false,

	init : function()
	{
		if( !_g_bEcRequired )
		{
			_g_bEcRequired = true;
			ga('require', 'ec');
		}
		if (typeof(fbq) != 'undefined' && fbq != null ) 
			this._g_bFacebookConvLoaded = true;
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
		if( this._g_bFacebookConvLoaded )
			this._fbSendCheckoutInitiation();
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
		if( this._g_bFacebookConvLoaded )
			this._fbSendCheckoutInitiation();
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
	},
	_fbSendCheckoutInitiation : function() 
	{
		fbq('track', 'InitiateCheckout');
	}
}

var gatkSettlement = 
{
	_g_oProductInfo : [],
	_g_bFacebookConvLoaded : false,
	
	init : function()
	{
		if( !_g_bEcRequired )
		{
			_g_bEcRequired = true;
			ga('require', 'ec');
		}
		if (typeof(fbq) != 'undefined' && fbq != null ) 
			this._g_bFacebookConvLoaded = true;

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
		if( _reflect() )
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
			{
				_sendCheckoutAction( 2, 'settlement start page' ); // 1, the first step already started from cart page
				// https://github.com/douglascrockford/JSON-js
				var sJsonSettlementInfo = JSON.stringify(this._g_oProductInfo);
				var sEncrypted = CryptoJS.AES.encrypt(sJsonSettlementInfo, "Secret Passphrase");
				_setCookie( 'svgatk', sEncrypted, 2 );

				if( this._g_bFacebookConvLoaded )
					this._fbSendPaymentInfoAddition();
			}
			else if( nStepNumber != null && sOption == null )
				_sendCheckoutAction( nStepNumber ); 
			else if( nStepNumber != null && sOption != null )
				_sendCheckoutAction( nStepNumber, sOption );
		}
		
		_sendGaEventWithoutInteraction( 'checkout', 'started', _g_sPrefixSettlement, nTotalPrice ); // Send data using an event after set ec-action
	},
	_fbSendPaymentInfoAddition : function() 
	{
		fbq('track', 'AddPaymentInfo');
	}
}

var gatkPurchase = 
{
	_g_oProductInfo : [],
	_g_aFbItemSrls : [],
	_g_bFacebookConvLoaded : false,

	init : function()
	{
		if( !_g_bEcRequired )
		{
			_g_bEcRequired = true;
			ga('require', 'ec');
		}
		if (typeof(fbq) != 'undefined' && fbq != null ) 
			this._g_bFacebookConvLoaded = true;
		return true;
	},
	queueItemInfo : function( nItemSrl, sItemName, sCategory, sBrand, sVariant, nItemPrice, nTotalQuantity, sCoupon )
	{
		nItemPrice = _enforceInt( nItemPrice );
		// can be ignored if engine does not provide purchased item list in checkout result page
		// object literal notation to create your structures
		this._g_oProductInfo.push({ id: nItemSrl, name: sItemName, category: sCategory, brand: sBrand, variant: sVariant, price: nItemPrice, quantity: nTotalQuantity, coupon: sCoupon  });
		this._g_aFbItemSrls.push( nItemSrl );
		return true;
	},
	patchPurchase : function( nOrderSrl, sAffiliation, nRevenue, nShippingCost, sCoupon )
	{
		if( _reflect() )
		{
			nRevenue = _enforceInt( nRevenue );
			nShippingCost = _enforceInt( nShippingCost );
			var nTaxAmnt = nRevenue * 0.1;
			var oProductInfo;
			var nElement = this._g_oProductInfo.length;
			if( nElement > 0 ) // gatkPurchase.queueItemInfo()가 실행되었으면
				oProductInfo = this._g_oProductInfo;
			else // gatkPurchase.queueItemInfo()가 실행되지 않았으면 svgatk 쿠키를 탐색함
			{
				var sCookie = _getCookie( 'svgatk' );	
				//http://stackoverflow.com/questions/18279141/javascript-string-encryption-and-decryption
				if( sCookie.length )
				{
					var sDecrypted = CryptoJS.AES.decrypt(sCookie, "Secret Passphrase");
					var sTemp = sDecrypted.toString(CryptoJS.enc.Utf8);
					var oTemp = JSON.parse( sTemp );
					nElement = oTemp.length;
					if( nElement > 0 )
						oProductInfo = oTemp;
				}
			}
			if( nElement > 0 ) 
			{
				for( var i = 0; i < nElement; i++ )
				{
					ga('ec:addProduct', { // Provide product details in an productFieldObject.
						'id': oProductInfo[i].id, // Product ID (string).
						'name': oProductInfo[i].name, // Product name (string).
						'category': oProductInfo[i].category, // Product category (string).
						'brand': oProductInfo[i].brand, // Product brand (string).
						'variant': oProductInfo[i].variant, // Product variant (string).
						'price': oProductInfo[i].price, // Product price (currency).
						'quantity': oProductInfo[i].quantity, // Product quantity (number).
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
					_sendGaEventWithoutInteraction( 'checkout', 'purchased', _g_sPrefixPurchased + '_' + oProductInfo[i].id + '_' + oProductInfo[i].name, oProductInfo[i].price * oProductInfo[i].quantity );
				}
				if( this._g_bFacebookConvLoaded )
					this._fbSendPurchaseComplete( nRevenue );
			}
			else // 최종 실패하면 ecommerce->overview->product 정보가 나오지 않음
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
		}
		_setCookie( 'svgatk', '', -1 );
		this._runSingleviewConversion( 'purchase', nRevenue );
	},
	_fbSendPurchaseComplete : function( nRevenue ) 
	{
		fbq('track', 'Purchase', {
			content_ids: this._g_aFbItemSrls,
			content_type: 'product',
			value: nRevenue,
			currency: 'KRW'
		});
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