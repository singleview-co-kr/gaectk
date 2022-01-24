/*
 * Universal Analytics, Google Analytics 4 Enhance Ecommerce with Google Tag Manager JavaScript Library
 * http://singleview.co.kr/
 */
var _g_sGaectkVersion = '1.5.1';
var _g_sGaectkVersionDate = '2022-01-23';
var _g_bUaPropertyLoaded = false; // eg., 'UA-XXXXXX-13' 
var _g_bEcRequired = false; // for UA only
var _g_bGa4DatastreamIdLoaded = false; // eg, 'G-XXXXXXXXXX'
var _g_sGa4DatastreamId = null;
var _g_bGtmIdLoaded = false; // eg, 'GTM-XXXXXXXXXX'
var _g_bGtmUaActivated = false; // GTM trigger UA
var _g_bGtmGa4Activated = false; // GTM trigger GA4
var 
	_g_sPrefixAddImpression = 'ai',
	_g_sPrefixItemClicked = 'ic',
	_g_sPrefixAddImpPromo = 'aip',
	_g_sPrefixPromoClicked = 'pc',
	_g_sPrefixViewDetail = 'vd',
	_g_sPrefixBuyNow = 'bn',
	_g_sPrefixAddToCart = 'atc',
	_g_sPrefixViewCart = 'vc',
	_g_sPrefixRemoveFromCart = 'rfc',
	_g_sPrefixCheckoutSelected = 'cs',
	_g_sPrefixCheckoutAll = 'ca',
	_g_sPrefixSettlement = 'setl',
	_g_sPrefixRefunded = 'ref';

var _g_sAffiliation = 'myshop';
var _g_sSecretPassphrase = 'Secret Passphrase';
var _g_sCurrency = 'KRW';
var _g_sViewedItemListCN = 'gaectk_viewed_items';
var _g_sSettledItemListCN = 'gaectk_settled_items';  // CN; cookie name
var _g_bSentConversionPageView = false;
var _g_aImageElement = [];

function setUtmParamsGaectk(sSource, sMedium, sCampaign, sKeyword, sContentVariation)
{
	if(_g_bGa4DatastreamIdLoaded)
	{
		if(typeof sSource === 'undefined' || sSource === null || sSource === undefined || sSource.length == 0)
			sSource = '';
		if(typeof sMedium === 'undefined' || sMedium === null || sMedium === undefined || sMedium.length == 0)
			sMedium = '';
		if(typeof sCampaign === 'undefined' || sCampaign === null || sCampaign === undefined || sMedium.length == 0)
			sCampaign = '';
		if(typeof sContentVariation === 'undefined' || sContentVariation === null || sContentVariation === undefined || sContentVariation.length == 0)
			sContentVariation = '';
		// https://stackoverflow.com/questions/50231721/how-to-track-utm-source-in-google-analytics-using-gtag
		gtag('config', _g_sGa4DatastreamId, {
			campaign: {
				source: sSource,
				medium: sMedium,
				name: sCampaign,
				content: sContentVariation  // GA v4 does not handle term
			}
		});
	}
	if(_g_bUaPropertyLoaded)
	{
		if(sSource != '')
			ga('set', 'campaignSource', sSource);
		if(sMedium != '')
			ga('set', 'campaignMedium', sMedium);
		if(sCampaign != '')
			ga('set', 'campaignName', sCampaign);
		if(sKeyword != '')
			ga('set', 'campaignKeyword', sKeyword);
		if(sContentVariation != '')
			ga('set', 'campaignContent', sContentVariation);
	}
}

function checkNonEcConversionGaectk(sVirtualUrl, sPageTitle)
{
	if(!_g_bUaPropertyLoaded) // this global method is for UA only
		return false;
	if(!_g_bSentConversionPageView)
	{
		ga('send', 'pageview', {
		  'page': sVirtualUrl, // example '/thankyou.html'
		  'title': sPageTitle
		});
		_g_bSentConversionPageView = true;
	}
}

function checkVisibilityGaectk(elm, eval) 
{
	if(!_g_bUaPropertyLoaded) // this global method is for UA only
		return false;
	eval = eval || 'visible';
	var vpH = jQuery(window).height(); // Viewport Height
	var st = jQuery(window).scrollTop(); // Scroll Top
	var y = jQuery(elm).offset().top;
	var elementHeight = jQuery(elm).height();
	var sCurObjId = jQuery(elm).attr('id');

	if(eval == 'visible')
	{
		if((y < (vpH + st)) && (y > (st - elementHeight))) // mark an object is on viewport
		{
			var bChecked = false;
			if(_g_aImageElement.length > 0)
			{
				for(var i in _g_aImageElement)
				{
					if(_g_aImageElement[i] == sCurObjId)
					{
						bChecked = true;
						break;
					}
				}
			}
			if(!bChecked)
			{
				_sendGaEventWithoutInteraction( 'banner', 'displayed', sCurObjId );
				_g_aImageElement[_g_aImageElement.length] = sCurObjId;
			}
		}
	}
	if(eval == 'above') 
		return ((y < (vpH + st)));
}

function sendDisplayEventGaectk(sDisplayedObject)
{
	if(!_g_bUaPropertyLoaded) // this global method is for UA only
		return false;
	if(sDisplayedObject === null || sDisplayedObject === undefined || sDisplayedObject.length == 0)
		return;
	_sendGaEventWithoutInteraction( 'banner', 'displayed', sDisplayedObject );
}

function sendClickEventGaectk(sCategory, sPageTitle, sLocation, sWindow)
{
	if(!_g_bUaPropertyLoaded) // this global method is for UA only
		return false;
	if(sLocation === null || sLocation === undefined || sLocation.length == 0 || sLocation == '#')
		sLocation = '#';
	if(sWindow === null || sWindow === undefined || sWindow.length == 0)
		sWindow = 'self';
	if(_g_bGa4DatastreamIdLoaded)
	{
		console.log('sendClickEventGaectk denied - use Automatic collected event and Create Event');
	}
	if(_g_bUaPropertyLoaded)
	{
		_sendGaEventWithInteraction(sCategory, 'clicked', sPageTitle);
	}
	if(sLocation != '#')
	{
		if(sWindow == 'self')
			location.href = sLocation;
		else
		{
			window.open(sLocation, sWindow);
			window.focus();
		}
	}
}

function _sendGaEventWithInteraction(sEventCategory, sEventAction, sEventLabel, nEventValue)
{
	// send pageview 명령 전에 send event 명령을 수행하면 queue에 적재된 EC 관련 정보들이 send event와 함께 pop되어버림
	// Send data using an event just after set ec-action
	if(!_g_bUaPropertyLoaded) // this global method is for UA only
		return false;
	if(nEventValue === undefined)
	{
		ga('send', 'event',  {
			'eventCategory': sEventCategory,   // Required.
			'eventAction': sEventAction,      // Required.
			'eventLabel': sEventLabel
			});
	}
	else
	{
		nEventValue = _enforceInt(nEventValue);
		ga('send', 'event',  {
			'eventCategory': sEventCategory,   // Required.
			'eventAction': sEventAction,      // Required.
			'eventLabel': sEventLabel,
			'eventValue': nEventValue // use number only, null string '' commits error.
			});
	}
}

function _sendGaEventWithoutInteraction(sEventCategory, sEventAction, sEventLabel, nEventValue)
{
	// send pageview 명령 전에 send event 명령을 수행하면 queue에 적재된 EC 관련 정보들이 send event와 함께 pop되어버림
	// Send data using an event just after set ec-action
	if(typeof sEventCategory === 'undefined' || sEventCategory === null || sEventCategory === undefined || sEventCategory.length == 0)
	{
		console.log('_sendGaEventWithoutInteraction denied: sEventCategory is required!'); 
		return false;
	}
	if(typeof sEventAction === 'undefined' || sEventAction === null || sEventAction === undefined || sEventAction.length == 0)
	{
		console.log('_sendGaEventWithoutInteraction denied: sEventAction is required!'); 
		return false;
	}
	if(_g_bGtmIdLoaded)  // GTM dataLayer Mode
	{
		;
	}
	else  // JS API mode
	{
		if(_g_bGa4DatastreamIdLoaded)  // GAv4
		{
			sCustomEventLbl = sEventCategory + '_' + sEventAction + '_' + sEventLabel;
			gtag('event', sCustomEventLbl , {
				currency: _g_sCurrency,
				value: _enforceInt(nEventValue)
				});
		}
		if(_g_bUaPropertyLoaded)  // UA
		{
			if(nEventValue === undefined)
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
				nEventValue = _enforceInt(nEventValue);
				ga('send', 'event', {
					'eventCategory': sEventCategory,   // Required.
					'eventAction': sEventAction,      // Required.
					'eventLabel': sEventLabel,
					'eventValue': nEventValue, // use number only, null string '' commits error.
					'nonInteraction': 1 // true indicates that the event hit will not be used in bounce-rate calculation.
					});
			}
		}
	}
}

function _sendCheckoutAction(nStepNumber, sOption)
{
	if(!_g_bUaPropertyLoaded) // this global method is for UA only
		return false;
	switch(arguments.length)
	{
		case 1:
			if(arguments[0] === null || arguments[0] === undefined || arguments[0].length == 0)
				break;
			else
			{
				ga('ec:setAction','checkout', {'step': nStepNumber});
				return;
			}
			break;
		case 2:
			if(arguments[0] === null || arguments[0] === undefined || arguments[0].length == 0 ||
				arguments[1] === null || arguments[1] === undefined || arguments[1].length == 0)
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

function _enforceInt(nEventValue)
{
	if(typeof nEventValue == 'undefined')
		return 0;
	nEventValue = nEventValue.toString().replace(/$|,/g,'');
	if(isNaN(nEventValue))
		return 0;
	else
		return Number(nEventValue);
}

function _parseUrl(sElem)
{
	// https://stackoverflow.com/questions/27745/getting-parts-of-a-url-regex
	const aUrlElem = ['href','protocol','host','hostname','port','pathname','search','hash'];
	if(aUrlElem.includes(sElem))
	{
		var a = document.createElement('a');
		a.href = window.location.href; 
		return a[sElem]; 
	}
	else
		return 'undefined';
}

function _triggerDataLayer(sEventName, oEcommerceInfo, oSvEventInfo)
{
	if(sEventName == null || sEventName === undefined || sEventName.length == 0)
	{
		console.log('denied to trigger GTM dataLayer - invalid event name!');
		return;
	}
	try
	{
		var sEventLbl = oSvEventInfo.sv_event_lbl;	
	}
	catch(e)
	{
		var sEventLbl = null;
	}
	try
	{
		var sEventVal = oSvEventInfo.sv_event_val;	
	}
	catch(e)
	{
		var sEventVal = null;
	}
	window.dataLayer.push({ecommerce: null}); // Clear the previous ecommerce object. combination with GTM data layer version 2
	window.dataLayer.push({
		event: sEventName,
		ecommerce: oEcommerceInfo,
		sv_event_lbl: sEventLbl,
		sv_event_val: sEventVal
	});
}

var gaectkStorage = 
{  // https://michalzalecki.com/why-using-localStorage-directly-is-a-bad-idea/
	// https://stackoverflow.com/questions/46833440/localstorage-is-null-in-chrome-mobile-android
	saveData: function(sMethod, sKeyName, oKeyVal, nExpHrs)
	{
		switch(arguments.length)
		{
			case 1:
			case 2:
				console.log('Denied to save data - invalid argument!');
				return;
			default:
				break;
		}
		// https://github.com/douglascrockford/JSON-js
		var sJsonfy = JSON.stringify(oKeyVal);
		var sEncrypted = CryptoJS.AES.encrypt(sJsonfy, _g_sSecretPassphrase);
		if(sMethod == 'storage' && typeof localStorage == 'object')
		{
			localStorage.setItem(sKeyName, sEncrypted);
		}
		else if(sMethod == 'cookie')
		{
			if(nExpHrs === null || nExpHrs === undefined)
				nExpHrs = 1;  // default; expires in an hr
			this._setCookie(sKeyName, sEncrypted, nExpHrs);
		}
	},
	loadData: function(sMethod, sKeyName)
	{
		switch(arguments.length)
		{
			case 1:
				console.log('Denied to load data - invalid argument!');
				return null;
			default:
				break;
		}
		if(sMethod == 'storage' && typeof localStorage == 'object')
		{
			sValue = localStorage.getItem(sKeyName); 
		}
		else if(sMethod == 'cookie')
		{
			sValue = this._getCookie(sKeyName);
		}
		else
			sValue == null;

		if(sValue === null)
			return null;
		if(sValue.length > 0)
		{
			var sDecrypted = CryptoJS.AES.decrypt(sValue, _g_sSecretPassphrase);
			var sTemp = sDecrypted.toString(CryptoJS.enc.Utf8);
			var oTemp = JSON.parse(sTemp);
			nElement = oTemp.length;
			if(nElement > 0)
				return oTemp;
		}
		return null;
	},
	removeData: function(sMethod, sKeyName)
	{
		switch(arguments.length)
		{
			case 1:
				console.log('Denied to load data - invalid argument!');
				return;
			default:
				break;
		}
		if(sMethod == 'storage')
		{
			sValue = localStorage.setItem(sKeyName, null); 
		}
		else if(sMethod == 'cookie')
		{
			this._setCookie(sKeyName, '', -1);
		}
	},
	_setCookie: function(cname, cvalue, nExpHrs)
	{
		var d = new Date();
		d.setTime(d.getTime() + nExpHrs*3600000); //60*60*1000
		var expires = 'expires=' + d.toUTCString();
		document.cookie = cname + '=' + cvalue + '; ' + expires;
	},
	_getCookie: function(cname)
	{
		var name = cname + '=';
		var ca = document.cookie.split(';');
		for(var i=0; i<ca.length; i++) 
		{
			var c = ca[i];
			while(c.charAt(0)==' ') 
				c = c.substring(1);
			if(c.indexOf(name) == 0)
				return c.substring(name.length, c.length);
		}
		return '';
	}
}

var gaectkItems = 
{	// https://bbaktaeho-95.tistory.com/40
	_g_aProductDetailInfo: [],
	init : function()
	{
		//localStorage.clear();
		var oRst = gaectkStorage.loadData('storage', _g_sViewedItemListCN);
		if(oRst == null)
		{
			return;
		}
		else if(oRst.length)
		{
			for(var key in oRst) 
			{
				this._g_aProductDetailInfo[oRst[key].item_id] = oRst[key];
			}
		}
	},
	register: function(nItemSrl, sItemName, nPosition, sBrand, sCategory, sVariant, sListName, nPrice, sCoupon)  //, sPromotionId, sPromotionName, sCreativeName)
	{
		sItemSrl = String(nItemSrl);
		// UA would be deprecated someday hence this construction is GAv4 biased
		if(this._g_aProductDetailInfo[sItemSrl] === undefined) // register
		{
			this._g_aProductDetailInfo[sItemSrl] = {
										item_id: nItemSrl,
										item_name: sItemName,
										affiliation: _g_sAffiliation,
										coupon: sCoupon,
										currency: _g_sCurrency,
										//discount: 2.22,
										index: nPosition,
										item_brand: sBrand,
										item_category: sCategory,
										//item_category2: 'Adult',
										//item_category3: 'Shirts',
										//item_category4: 'Crew',
										//item_category5: 'Short sleeve',
										item_list_id: sListName,
										item_list_name: sListName,
										item_variant: sVariant,
										// location_id: sLocationId,
										price: _enforceInt(nPrice),
										// quantity: 0
										// creative_slot: ''
			};
			/*if(sPromotionId != null && sPromotionId != undefined && sPromotionId.length != 0)
			{
				this._g_aProductDetailInfo[sItemSrl].promotion_id = sPromotionId;
			}
			if(sPromotionName != null && sPromotionName != undefined && sPromotionName.length != 0)
			{
				this._g_aProductDetailInfo[sItemSrl].promotion_name = sPromotionName;
			}
			if(sCreativeName != null && sCreativeName != undefined && sCreativeName.length != 0)
			{
				this._g_aProductDetailInfo[sItemSrl].creative_name = sCreativeName;
			}*/
		}
		else // update
		{
			if(nPosition != null && nPosition != undefined)
			{
				this._g_aProductDetailInfo[sItemSrl].index = nPosition;
			}
			if(sListName != null && sListName != undefined && sListName.length != 0)
			{
				this._g_aProductDetailInfo[sItemSrl].item_list_id = sListName;
				this._g_aProductDetailInfo[sItemSrl].item_list_name = sListName;
			}
			if(sVariant != null && sVariant != undefined && sVariant.length != 0)
			{
				this._g_aProductDetailInfo[sItemSrl].item_variant = sVariant;
			}
			if(sCoupon != null && sCoupon != undefined && sCoupon.length != 0)
			{
				this._g_aProductDetailInfo[sItemSrl].coupon = sCoupon;
			}
			/*if(sPromotionId != null && sPromotionId != undefined && sPromotionId.length != 0)
			{
				this._g_aProductDetailInfo[sItemSrl].promotion_id = sPromotionId;
			}
			else
			{
				delete this._g_aProductDetailInfo[sItemSrl].promotion_id;
			}
			if(sPromotionName != null && sPromotionName != undefined && sPromotionName.length != 0)
			{
				this._g_aProductDetailInfo[sItemSrl].promotion_name = sPromotionName;
			}
			else
			{
				delete this._g_aProductDetailInfo[sItemSrl].promotion_name;
			}
			if(sCreativeName != null && sCreativeName != undefined && sCreativeName.length != 0)
			{
				this._g_aProductDetailInfo[sItemSrl].creative_name = sCreativeName;
			}
			else
			{
				delete this._g_aProductDetailInfo[sItemSrl].creative_name;
			}*/
		}
	},
	getItemInfoBySrl: function(sGaVersion, nItemSrl)
	{
		switch(arguments.length)
		{
			case 1:
				console.log('Denied to load data - invalid argument!');
				return;
			default:
				break;
		}
		sItemSrl = nItemSrl.toString()
		oRst = this._g_aProductDetailInfo[sItemSrl];
		if(oRst === undefined)
			return null;
		else
		{
			if(sGaVersion == 'UA')
			{
				return {
					id: this._g_aProductDetailInfo[sItemSrl].item_id, 
					name: this._g_aProductDetailInfo[sItemSrl].item_name, 
					list: this._g_aProductDetailInfo[sItemSrl].item_list_name,
					brand: this._g_aProductDetailInfo[sItemSrl].item_brand, 
					category: this._g_aProductDetailInfo[sItemSrl].item_category,
					variant: this._g_aProductDetailInfo[sItemSrl].item_variant,
					index: this._g_aProductDetailInfo[sItemSrl].index,
					price: this._g_aProductDetailInfo[sItemSrl].price
				};
			}
			else if(sGaVersion == 'GA4')
			{	// always create new object to avoid quantity copying if same item exists with different cart id
				return {
					item_id: this._g_aProductDetailInfo[sItemSrl].item_id, 
					item_name: this._g_aProductDetailInfo[sItemSrl].item_name, 
					item_list_name: this._g_aProductDetailInfo[sItemSrl].item_list_name,
					item_brand: this._g_aProductDetailInfo[sItemSrl].item_brand, 
					item_category: this._g_aProductDetailInfo[sItemSrl].item_category,
					item_variant: this._g_aProductDetailInfo[sItemSrl].item_variant,
					index: this._g_aProductDetailInfo[sItemSrl].index,
					price: this._g_aProductDetailInfo[sItemSrl].price,
					/*promotion_id: this._g_aProductDetailInfo[sItemSrl].promotion_id,
					promotion_name: this._g_aProductDetailInfo[sItemSrl].promotion_name,
					creative_name: this._g_aProductDetailInfo[sItemSrl].creative_name*/
				};
			}
		}
	},
	saveInfo: function()
	{
		// https://kamang-it.tistory.com/entry/Web%EC%A1%B0%EA%B8%88-%EB%8D%94-%EC%9E%90%EC%84%B8%ED%9E%88cookie%EB%8A%94-%EB%84%88%EB%AC%B4-%EA%B5%AC%EC%8B%9D%EC%95%84%EB%83%90-%EC%9D%B4%EC%A0%9C%EB%B6%80%ED%84%B4-Web-Storage
		var aProductForCookie = [];
		for(var key in this._g_aProductDetailInfo) 
		{
			aProductForCookie.push(this._g_aProductDetailInfo[key]);
		}
		gaectkStorage.saveData('storage', _g_sViewedItemListCN, aProductForCookie);
	}
}

var gaectkHeader = 
{
	init : function(aTrackingId)
	{
		sUaTrackingId = false;
		if(typeof aTrackingId === 'undefined' || aTrackingId === null || aTrackingId === undefined || aTrackingId.length == 0)
		{
			console.log('invalid tracking ID array')
			return false;
		}
		for(var i = 0; i < aTrackingId.length; i++)
		{
			sTrackingId = aTrackingId[i];
			if(sTrackingId.search(/^GTM-/gm) == 0) // string like 'GTM-XXXXXXXXXX'
			{
				if(window.dataLayer)  // https://stackoverflow.com/questions/55852511/how-to-check-if-a-google-tag-is-already-loaded-on-an-html-page
				{
					_g_bGtmIdLoaded = true;
					console.log('GTM activated');
					// if GTM has loaded: https://www.simoahava.com/analytics/notify-page-google-tag-manager-loaded/
				}
				else
				{
					console.log('Warning! You activated GTM without proper initialization.');
				}
			}
			if(sTrackingId == 'GTMUA') // string GTMUA
			{
				_g_bGtmUaActivated = true;
				console.log('GTMUA activated')
			}
			if(sTrackingId == 'GTMGA4') // string GTMGA4
			{
				_g_bGtmGa4Activated = true;
				console.log('GTMGA4 activated')
			}
			if(sTrackingId.search(/^UA-/gm) == 0) // string like 'UA-XXXXXX-xx'
			{
				if(typeof ga === 'function')
				{
					_g_bUaPropertyLoaded = true;
					if(!sUaTrackingId)
					{
						sUaTrackingId = sTrackingId;
					}
					console.log('UA activated')
				}
				else
				{
					console.log('Warning! You activated UA without proper initialization.');
				}
			}
			if(sTrackingId.search(/^G-/gm) == 0) // string like 'G-XXXXXXXXXX'
			{
				if(typeof gtag === 'function')
				{
					_g_bGa4DatastreamIdLoaded = true;
					_g_sGa4DatastreamId = sTrackingId;
					console.log('GA4 activated');
				}
				else
				{
					console.log('Warning! You activated GAv4 without proper initialization.');
				}
			}
		}
		if(!_g_bGtmIdLoaded && !_g_bUaPropertyLoaded && !_g_bGa4DatastreamIdLoaded)
		{
			alert('you call gaectk.js w/o any GA or GTM account id.\nThis might occur complicated malfunction!');
			return false;
		}
		if(_g_bGtmIdLoaded && (_g_bUaPropertyLoaded || _g_bGa4DatastreamIdLoaded))
		{
			alert('Choose GA or GTM only to prevent duplicated hit!\ngaectk will deny send hit!');
			_g_bGtmIdLoaded = false;
			_g_bUaPropertyLoaded = false;
			_g_bGa4DatastreamIdLoaded = false;
			return false;
		}
		if(_g_bGtmIdLoaded)  // GTM dataLayer Mode
		{
			window.dataLayer = window.dataLayer || [];
		}
		if(_g_bUaPropertyLoaded)
		{
			ga('create', sUaTrackingId, 'auto');
			ga('require', 'linkid');
			ga('require', 'displayfeatures');
		}
		gaectkItems.init();
		return true;
	},
	close : function()
	{
		if(_g_bUaPropertyLoaded)
		{
			ga('send', 'pageview');
		}
		gaectkItems.saveInfo();
		return true;
	},
	getVersion : function()
	{
		console.log('gaectk ver ' + _g_sGaectkVersion + ' on ' + _g_sGaectkVersionDate + ' by singleview.co.kr');
	},
}

var gaectkList = 
{
	init : function(nCurrentPage, nItemsPerPage, sCatalogName)
	{
		this._g_nListPosition = 1;
		this._g_sListTitle = null;
		this._g_bImpressionPatched = false;
		this._g_aProductInfo = [];
		this._g_nItemsPerChunk = 20;
		this._g_oPromoInfo = {id:'', name:'', creative:'', location_id:''};

		if(_g_bUaPropertyLoaded && !_g_bEcRequired)
		{
			_g_bEcRequired = true;
			ga('require', 'ec');
		}
		if(nCurrentPage === null || nCurrentPage === undefined || nCurrentPage.length == 0)
			nCurrentPage = 1;
		if(nCurrentPage > 1) // 한페이지에 복수 리스트 모듈이 있는 경우는 메인페이지 혹은 첫페이지로 한정함
			this._g_nListPosition = nItemsPerPage * (nCurrentPage - 1) + 1;
		
		if(sCatalogName)
			this._g_sListTitle = sCatalogName;
		else
			this._g_sListTitle = _parseUrl('pathname');  // replace with GTM default variable Page Path?
		console.log(this._g_sListTitle);
		return true;
	},
	getCurrentPageFromUrl: function(sName)
	{  // use if page must be recognized by URL
		sUrl = window.location.href;
		sName = sName.replace(/[[]]/g, "\$&");
		var oRegex = new RegExp("[?&]" + sName + "(=([^&#]*)|&|#|$)"),
		aResults = oRegex.exec(sUrl);
		if(!aResults || !aResults[2])
			return 1;
		return decodeURIComponent(aResults[2].replace(/\+/g, " "));
	},
	loadPromoInfo: function(sId, sName, sCreatvie, sPosition)  // sId, sName, sCreatvie, sLocation 문자열 길어지면 413 status
	{ // loadPromoInfo() must precede queueItemInfo()
		if(sId.length == 0 && sName.length == 0)
		{
			alert('invalid promotion info - either id or name is mandatory!');
			return false;
		}
		// UA attrs
		this._g_oPromoInfo.id = sId;
		this._g_oPromoInfo.name = sName;
		this._g_oPromoInfo.creative = sCreatvie;
		this._g_oPromoInfo.position = sPosition;
		// GA 4 attrs
		//this._g_oPromoInfo.creative_name = sCreatvie;
		//this._g_oPromoInfo.creative_slot = sCreatvie;
		//this._g_oPromoInfo.location_id = sLocation;
		//this._g_oPromoInfo.promotion_id = sId;
		//this._g_oPromoInfo.promotion_name = sName;

	},
	queueItemInfo: function(nItemSrl, sItemName, sCategory, sBrand, sVariant, nPrice)
	{
		gaectkItems.register(nItemSrl, sItemName, this._g_nListPosition++, sBrand, sCategory, sVariant, this._g_sListTitle, _enforceInt(nPrice), null); //, this._g_oPromoInfo.id, this._g_oPromoInfo.name, this._g_oPromoInfo.creative);
		this._g_aProductInfo.push({item_id: nItemSrl});  // this should be srl array
	},
	patchImpression: function(nItemChunk, sThumbImgId)
	{
		if(sThumbImgId)  // required tag structure is <a class='sThumbImgId'><img src=''></a>
		{
			// get first thumbnail only
			try
			{
				var oClsContent = document.querySelector('.'+ sThumbImgId);
			}
			catch(e)
			{
				var oClsContent = null;
			}
			try
			{
				var oIdContent = document.querySelector('#'+ sThumbImgId);
			}
			catch(e)
			{
				var oIdContent = null;
			}
			
			oFirstThumb = null;
			if(oClsContent) 
			{
				oFirstThumb = oClsContent;  //oClsContent.getElementsByTagName('img')[0];  
			}
			if(oIdContent)
			{
				oFirstThumb = oIdContent;  //oIdContent.getElementsByTagName('img')[0];
			}
			delete oClsContent;
			delete oIdContent;
			if(oFirstThumb)
			{
				document.addEventListener('scroll', function () {
					if(gaectkList._isInViewport(oFirstThumb))
					{
						gaectkList._transmitImpData();
					}
				}, {passive: true});
			}
			else
			{
				gaectkList._transmitImpData();
			}
		}
		else
		{
			gaectkList._transmitImpData();
		}
	},
	sendClicked : function(nItemSrl)  // Trigger when click link to a product.
	{
		oSingleProductGa4 = gaectkItems.getItemInfoBySrl('GA4', nItemSrl);
		if(oSingleProductGa4 == null)
		{
			console.log('invalid clicked item srl!')
			return false;
		}
		oSingleProductGa4.quantity = 1;
		oSingleProductUa = gaectkItems.getItemInfoBySrl('UA', nItemSrl);
		delete oSingleProductUa.list;
		delete oSingleProductUa.price;
		delete oSingleProductUa.quantity;

		var sEventLbl = _g_sPrefixItemClicked + '_on_' + this._g_sListTitle +'_pos:' + oSingleProductGa4.index + '_' + oSingleProductGa4.item_id+'_'+oSingleProductGa4.item_name;
		if(_g_bGtmIdLoaded)  // GTM dataLayer Mode
		{
			if(_g_bGtmUaActivated) // GTM trigger UA
			{
				_triggerDataLayer('eec.impressionClick', {
					click: {
						actionField: {list: this._g_sListTitle},
						products: [oSingleProductUa]
					}},
					{sv_event_lbl: sEventLbl}
				);
				if(this._g_oPromoInfo.id.length || this._g_oPromoInfo.name.length)
				{
					sId = this._g_oPromoInfo.id.length ? this._g_oPromoInfo.id : '';
					sName = this._g_oPromoInfo.name.length ? this._g_oPromoInfo.name : '';
					_triggerDataLayer('eec.promotionClick', {actionField: {promo_title: _g_sPrefixPromoClicked+'_'+sId+'_'+sName}, promoClick: {promotions: [this._g_oPromoInfo]}});
				}
			}
			if(_g_bGtmGa4Activated) // GTM trigger GA4
			{
				if(!this._g_oPromoInfo.id.length && !this._g_oPromoInfo.name.length)
				{
					_triggerDataLayer('select_item', {items:[oSingleProductGa4]});
				}
				else
				{
					_triggerDataLayer('select_promotion', {items:[oSingleProductGa4]});
				}
			}
		}
		else  // JS API mode
		{
			if(_g_bGa4DatastreamIdLoaded)  // GAv4
			{
				if(!this._g_oPromoInfo.id.length && !this._g_oPromoInfo.name.length)
				{
					gtag('event', 'select_item', {
						item_list_id: this._g_sListTitle,
						item_list_name: this._g_sListTitle,
						items: [oSingleProductGa4]
					});
				}
				else
				{
					gtag('event', 'select_promotion', {
						promotion_id: this._g_oPromoInfo.id,
						promotion_name: this._g_oPromoInfo.name,
						creative_name: this._g_oPromoInfo.creative,
						creative_slot: this._g_oPromoInfo.position,
						location_id: this._g_oPromoInfo.position,
						items: [oSingleProductGa4]
					});
				}
			}
			if(_g_bUaPropertyLoaded)  // UA
			{
				ga('ec:addProduct', oSingleProductUa);
				ga('ec:setAction', 'click', {list: this._g_sListTitle});
				_sendGaEventWithoutInteraction('EEC', 'click_item', sEventLbl);
				if(this._g_oPromoInfo.id.length || this._g_oPromoInfo.name.length)
				{
					ga('ec:addPromo', this._g_oPromoInfo);
					ga('ec:setAction', 'promo_click');
					sId = this._g_oPromoInfo.id.length ? this._g_oPromoInfo.id : '';
					sName = this._g_oPromoInfo.name.length ? this._g_oPromoInfo.name : '';
					_sendGaEventWithoutInteraction('EEC', 'click_promo', _g_sPrefixPromoClicked+'_'+sId+'_'+sName, 0);
				}
			}
		}
		delete oSingleProductGa4;
		delete oSingleProductUa;
	},
	_isInViewport: function(el)
	{   // this method is for gaectkList.patchImpression()
		const rect = el.getBoundingClientRect();
		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
			rect.right <= (window.innerWidth || document.documentElement.clientWidth)
		);
	},
	_transmitImpData: function()
	{
		if(this._g_bImpressionPatched)  // allow single transmission if onscroll mode
			return true;
		console.log('transmitted');
		if(this._g_aProductInfo.length == 0)
		{
			console.log('no items on catalog');
			return false;
		}
		if(_g_bGtmIdLoaded)  // GTM dataLayer Mode
		{
			var aProduct = [];
			var nCnt = this._g_aProductInfo.length;
			if(_g_bGtmUaActivated) // GTM trigger UA
			{
				for(var i = 0; i < nCnt; i++)
				{
					oSingleProduct = gaectkItems.getItemInfoBySrl('UA', this._g_aProductInfo[i].item_id);
					aProduct.push(oSingleProduct); // attrs should be id, name, list, brand, category, variant, position, price
				}
				_triggerDataLayer('eec.impressionView', {actionField: {list: this._g_sListTitle}, impressions: aProduct});
				if(this._g_oPromoInfo.id.length || this._g_oPromoInfo.name.length)
				{
					sId = this._g_oPromoInfo.id.length ? this._g_oPromoInfo.id : '';
					sName = this._g_oPromoInfo.name.length ? this._g_oPromoInfo.name : '';
					_triggerDataLayer('eec.promotionView', {actionField: {promo_title: _g_sPrefixAddImpPromo+'_'+sId+'_'+sName}, promoView: {promotions: [this._g_oPromoInfo]}});
				}
			}
			if(_g_bGtmGa4Activated) // GTM trigger GA4
			{
				if(!this._g_oPromoInfo.id.length && !this._g_oPromoInfo.name.length)
				{
					for(var i = 0; i < nCnt; i++)
					{
						oSingleProduct = gaectkItems.getItemInfoBySrl('GA4', this._g_aProductInfo[i].item_id);
						aProduct.push(oSingleProduct);
					}
					_triggerDataLayer('view_item_list', {items: aProduct});
				}
				else
				{
					for(var i = 0; i < nCnt; i++)
					{
						oSingleProduct = gaectkItems.getItemInfoBySrl('GA4', this._g_aProductInfo[i].item_id);
						aProduct.push(oSingleProduct);
					}
					_triggerDataLayer('view_promotion', {items: aProduct});
				}
			}
			delete aProduct;
		}
		else  // JS API mode
		{
			if(typeof nItemChunk === 'undefined')
				nItemChunk = this._g_nItemsPerChunk;
			if(nItemChunk == 0)
				nItemChunk = this._g_nItemsPerChunk;
			var nLength = this._g_aProductInfo.length;
			var nPushForceCnt = nLength - 1;
			var aProduct = [];
			if(_g_bGa4DatastreamIdLoaded)  // GAv4
			{
				if(!this._g_oPromoInfo.id.length && !this._g_oPromoInfo.name.length)
				{
					for(var i=0; i < nLength; i++)
					{
						oSingleProduct = gaectkItems.getItemInfoBySrl('GA4', this._g_aProductInfo[i].item_id);
						aProduct.push(oSingleProduct);
						/*if((i > 0 && i % nItemChunk == 0) || i == nPushForceCnt)
						{
							;
						}*/
					}
					gtag('event', 'view_item_list', {
						currency: _g_sCurrency,
						item_list_id: this._g_sListTitle,
						item_list_name: this._g_sListTitle,
						items: aProduct
					});
					var aProduct = [];
				}
				else
				{
					for(var i=0; i < nLength; i++)
					{
						oSingleProduct = gaectkItems.getItemInfoBySrl('GA4', this._g_aProductInfo[i].item_id);
						aProduct.push(oSingleProduct);
					}
					gtag('event', 'view_promotion', {
						currency: _g_sCurrency,
						promotion_id: this._g_oPromoInfo.id,
						promotion_name: this._g_oPromoInfo.name,
						creative_name: this._g_oPromoInfo.creative,
						creative_slot: this._g_oPromoInfo.position,
						location_id: this._g_oPromoInfo.position,
						items: aProduct
					});
					var aProduct = [];
				}
				delete aProduct;
			}
			if(_g_bUaPropertyLoaded)  // UA
			{
				for(var i = 0; i < nLength; i++)
				{
					oSingleProduct = gaectkItems.getItemInfoBySrl('UA', this._g_aProductInfo[i].item_id);
					ga('ec:addImpression', oSingleProduct);
					if((i > 0 && i % nItemChunk == 0) || i == nPushForceCnt)
						_sendGaEventWithoutInteraction('EEC', 'add_imp', _g_sPrefixAddImpression+'_item_chunk_'+String(nItemChunk), 0);
				}
				if(this._g_oPromoInfo.id.length || this._g_oPromoInfo.name.length)
				{
					ga('ec:addPromo', this._g_oPromoInfo);
					sId = this._g_oPromoInfo.id.length ? this._g_oPromoInfo.id : '';
					sName = this._g_oPromoInfo.name.length ? this._g_oPromoInfo.name : '';
					_sendGaEventWithoutInteraction('EEC', 'add_imp_promo', _g_sPrefixAddImpPromo+'_'+sId+'_'+sName, 0);
				}
			}
		}
		this._g_bImpressionPatched = true;
		return true;
	}
}

var gaectkDetail = 
{
	_g_aProductInfo: [],
	_g_sOptionDetailPage: 'detail page',
	_g_bFacebookConvLoaded: false,
	init : function()
	{
		if(_g_bUaPropertyLoaded && !_g_bEcRequired)
		{
			_g_bEcRequired = true;
			ga('require', 'ec');
		}
		if(typeof(fbq) != 'undefined' && fbq != null) 
			this._g_bFacebookConvLoaded = true;
		return true;
	},
	loadItemInfo : function(nItemSrl, sItemName, sCategory, sBrand, sVariant, nItemPrice)
	{
		this._g_aProductInfo.push({item_id: nItemSrl});
		gaectkItems.register(nItemSrl, sItemName, null, sBrand, sCategory, sVariant, null, _enforceInt(nItemPrice), null); //, null, null, null);
		return true;
	},
	patchDetail : function()
	{
		oSingleProductGa4 = gaectkItems.getItemInfoBySrl('GA4', this._g_aProductInfo[0].item_id);
		oSingleProductGa4.quantity = 1;
		var sListTitle = oSingleProductGa4.item_list_name;
		var nItemPrice = oSingleProductGa4.price;

		oSingleProductUa = gaectkItems.getItemInfoBySrl('UA', this._g_aProductInfo[0].item_id);
		delete oSingleProductUa.list;
		delete oSingleProductUa.position;
		delete oSingleProductUa.price;
		if(_g_bGtmIdLoaded)  // GTM dataLayer Mode
		{
			if(_g_bGtmUaActivated) // GTM trigger UA
			{
				_triggerDataLayer('eec.detail', {detail: {actionField: {list: sListTitle}, products: [oSingleProductUa]}});
			}
			if(_g_bGtmGa4Activated) // GTM trigger GA4
			{
				_triggerDataLayer('view_item', {items:[oSingleProductGa4]});
			}
		}
		else  // JS API mode
		{
			if(_g_bGa4DatastreamIdLoaded)  // GAv4
			{
				gtag('event', 'view_item', {
					currency: _g_sCurrency,
					value: oSingleProductGa4.price,
					items: [oSingleProductGa4]
					});
				console.log('event - view_item - GAv4')
			}
			if(_g_bUaPropertyLoaded)  // UA
			{
				ga('ec:addProduct', oSingleProductUa);
				ga('ec:setAction', 'detail'); // Detail action.
				// Send data using an event.
				var sEventLbl = _g_sPrefixViewDetail + '_' + oSingleProductUa.id+'_'+oSingleProductUa.name;
				_sendGaEventWithoutInteraction('EEC', 'view_detail', sEventLbl, nItemPrice);
				console.log('event - view_item - UA');
			}
		}
		delete oSingleProductGa4;
		delete oSingleProductUa;
		if(this._g_bFacebookConvLoaded)
			this._fbSendViewContent();
		return true;
	},
	patchBuyNow : function(nTotalQuantity)
	{
		var nTotalQuantity = _enforceInt(nTotalQuantity);
		// trigger add to cart for shopping behavior report
		this.patchAddToCart(nTotalQuantity);

		oSingleProductGa4 = gaectkItems.getItemInfoBySrl('GA4', this._g_aProductInfo[0].item_id);
		oSingleProductGa4.quantity = nTotalQuantity;
		var nTotalPrice = nTotalQuantity * oSingleProductGa4.price;
		var sEventLbl = _g_sPrefixBuyNow + '_' + oSingleProductGa4.item_id + '_' + oSingleProductGa4.item_name;

		oSingleProductUa = gaectkItems.getItemInfoBySrl('UA', this._g_aProductInfo[0].item_id);
		delete oSingleProductUa.list;
		delete oSingleProductUa.position;
		oSingleProductUa.quantity = nTotalQuantity;
		if(_g_bGtmIdLoaded)  // GTM dataLayer Mode
		{
			if(_g_bGtmUaActivated) // GTM trigger UA
			{
				_triggerDataLayer('eec.checkout', {
						checkout: {
							actionField: {step: 1, option: this._g_sOptionDetailPage},
							products: [oSingleProductUa]  // attrs should be id, name, category, brand, variant, price, quantity
						}
					},
					{sv_event_lbl: sEventLbl, sv_event_val: nTotalPrice}
				);
			}
			if(_g_bGtmGa4Activated) // GTM trigger GA4
			{
				_triggerDataLayer('begin_checkout', {items:[oSingleProductGa4]});
			}
		}
		else  // JS API mode
		{
			if(_g_bGa4DatastreamIdLoaded)  // GAv4
			{
				gtag('event', 'begin_checkout', {
					currency: _g_sCurrency,
					value: nTotalPrice,
					//coupon: this._g_sCoupon,
					items: [oSingleProductGa4]
					});
				console.log('event - begin_checkout selected - GAv4')
				gtag('event', sEventLbl);
				console.log('event - buy now - GAv4')
			}
			if(_g_bUaPropertyLoaded)  // UA
			{
				// trigger add to cart for shopping behavior report?
				ga('ec:addProduct', oSingleProductUa); // attrs should be id, name, category, brand, variant, price, quantity
				_sendCheckoutAction(1, this._g_sOptionDetailPage);
				// Send data using an event.
				_sendGaEventWithoutInteraction('EEC', 'checkout_step_1', _g_sPrefixBuyNow, nTotalPrice); // Send data using an event after set ec-action
				console.log('event - begin_checkout selected - UA')
			}
		}
		delete oSingleProductGa4;
		delete oSingleProductUa;
		if( this._g_bFacebookConvLoaded )
			this._fbSendCheckoutInitiation();
		return true;
	},
	patchAddToCart : function(nTotalQuantity)
	{
		var nTotalQuantity = _enforceInt(nTotalQuantity);
		oSingleProductGa4 = gaectkItems.getItemInfoBySrl('GA4', this._g_aProductInfo[0].item_id);
		oSingleProductGa4.quantity = nTotalQuantity;
		var nTotalPrice = nTotalQuantity * oSingleProductGa4.price;
		var sListTitle = oSingleProductGa4.item_list_name;
		var sEventLbl = _g_sPrefixAddToCart + '_' + oSingleProductGa4.item_id + '_' + oSingleProductGa4.item_name;
		
		oSingleProductUa = gaectkItems.getItemInfoBySrl('UA', this._g_aProductInfo[0].item_id);
		oSingleProductUa.quantity = nTotalQuantity;
		delete oSingleProductUa.list;
		delete oSingleProductUa.position;

		if(_g_bGtmIdLoaded)  // GTM dataLayer Mode
		{
			if(_g_bGtmUaActivated) // GTM trigger UA
			{
				_triggerDataLayer('eec.add', {
						add: {
							actionField: {list: sListTitle},
							products: [oSingleProductUa]  // attrs should be id, name, category, brand, variant, price, quantity
						}
					},
					{sv_event_lbl: sEventLbl, sv_event_val: nTotalPrice}
				);
			}
			if(_g_bGtmGa4Activated) // GTM trigger GA4
			{
				_triggerDataLayer('add_to_cart', {items:[oSingleProductGa4]});
			}
		}
		else  // JS API mode
		{
			if(_g_bGa4DatastreamIdLoaded)  // GAv4
			{
				this._g_aProductInfo[0].quantity = nTotalQuantity;
				gtag('event', 'add_to_cart', {
					currency: _g_sCurrency,
					value: nTotalPrice / 2,  // discount event value, not sure to buy
					items: [oSingleProductGa4]  //this._g_aProductInfo
				});
				console.log('event - add_to_cart - GAv4')
			}
			if(_g_bUaPropertyLoaded)  // UA
			{
				ga('ec:addProduct', oSingleProductUa);
				ga('ec:setAction', 'add');
				// Send data using an event.
				_sendGaEventWithoutInteraction( 'EEC', 'add_cart', sEventLbl, nTotalPrice);
				console.log('event - add_to_cart - UA')
			}
		}
		delete oSingleProductGa4;
		delete oSingleProductUa;
		if(this._g_bFacebookConvLoaded)
			this._fbSendItemsToCart();
		return true;
	},
	_fbSendViewContent : function()
	{
		oSingleProduct = gaectkItems.getItemInfoBySrl('GA4', this._g_aProductInfo[0].item_id);
		fbq('track', 'ViewContent', {
			content_ids: this._g_aProductInfo[0].item_id,
			content_type: 'product',
			value: oSingleProduct.price,
			currency: _g_sCurrency
		});
		delete oSingleProduct;
	},
	_fbSendCheckoutInitiation : function() 
	{
		fbq('track', 'InitiateCheckout');
	},
	_fbSendItemsToCart : function()
	{
		oSingleProduct = gaectkItems.getItemInfoBySrl('GA4', this._g_aProductInfo[0].item_id);
		fbq('track', 'AddToCart', {
			content_ids: this._g_aProductInfo[0].item_id,
			content_type: 'product',
			value: oSingleProduct.price,
			currency: _g_sCurrency
		});
		delete oSingleProduct;
	}
}
var gaectkCart = 
{
	_g_aProductInfo: [],
	_g_bFacebookConvLoaded: false,
	_g_sOptionCartPage: 'cart page',
	_g_sCoupon: false,
	init : function()
	{
		if(_g_bUaPropertyLoaded && !_g_bEcRequired)
		{
			_g_bEcRequired = true;
			ga('require', 'ec');
		}
		if(typeof(fbq) != 'undefined' && fbq != null)
			this._g_bFacebookConvLoaded = true;
		return true;
	},
	queueItemInfo : function(nCartSrl, nItemSrl, sItemName, sCategory, sBrand, sVariant, nItemPrice, nTotalQuantity, sCoupon)
	{
		this._g_sCoupon = sCoupon;
		gaectkItems.register(nItemSrl, sItemName, null, sBrand, sCategory, sVariant, null, _enforceInt(nItemPrice), sCoupon); //, null, null, null);
		this._g_aProductInfo.push({ cartid: nCartSrl, // non GA variable
									item_id: nItemSrl,
									quantity: _enforceInt(nTotalQuantity)
								});
		return true;
	},
	viewCart : function()  // this method is for GAv4 only
	{
		var nElement = this._g_aProductInfo.length;
		if(nElement < 0)
			return;
		var aCartItem = [];
		var nTotalPrice = 0;
		for(var i = 0; i < nElement; i++)
		{
			oSingleProductGa4 = gaectkItems.getItemInfoBySrl('GA4', this._g_aProductInfo[i].item_id);
			oSingleProductGa4.quantity = this._g_aProductInfo[i].quantity;
			nTotalPrice += oSingleProductGa4.price * this._g_aProductInfo[i].quantity;
			aCartItem.push(oSingleProductGa4);
			delete oSingleProductGa4;
		}
		if(!nTotalPrice)
			return false;
		var sEventLbl = _g_sPrefixViewCart + '_item_cnt_' + String(this._g_aProductInfo.length);
		if(_g_bGtmIdLoaded)  // GTM dataLayer Mode
		{
			if(_g_bGtmUaActivated) // GTM trigger UA
			{
				_triggerDataLayer('eec.viewCart', {}, {sv_event_lbl: sEventLbl, sv_event_val: nTotalPrice});
			}
			if(_g_bGtmGa4Activated) // GTM trigger GA4
			{
				_triggerDataLayer('view_cart', {items:aCartItem});
			}
		}
		else  // JS API mode
		{
			if(_g_bGa4DatastreamIdLoaded)  // GAv4
			{
				gtag('event', 'view_cart', {
					currency: _g_sCurrency,
					value: nTotalPrice,
					items: aCartItem  // warning! bytes limit
					});
				console.log('event - view_cart - GAv4');
			}
			if(_g_bUaPropertyLoaded)  // UA
			{
				_sendGaEventWithoutInteraction( 'EEC', 'view_cart', sEventLbl, nTotalPrice);
				console.log('event - view_cart - UA')
			}
		}
		delete aCartItem;
	},
	checkoutSelected : function(aTmpCartSrl)
	{
		// aCartSrl이 배열이 아니고 정수이면 배열로 전환
		var aCartSrl = [];
		if(aTmpCartSrl instanceof Array) 
		{
			var nCartSrl;
			for(nIdx in aTmpCartSrl) 
			{
				if(aTmpCartSrl[nIdx] != '')
					aCartSrl.push(aTmpCartSrl[nIdx]);
			}
		}
		else  // aCartSrl이 배열이 아니고 정수이면 배열로 전환
		{
			var nTmpCartSrl = aTmpCartSrl;
			aCartSrl.push(nTmpCartSrl);
		}
		var nTotalPrice = 0;
		var aCartToCheckoutGa4 = [];
		var aCartToCheckoutUa = [];
		var nStackedCartElement = this._g_aProductInfo.length;
		var nSelectedCartElement = 0;
		for(var i = 0; i < nStackedCartElement; i++)
		{
			nSelectedCartElement = aCartSrl.length;
			for(var j = 0; j < nSelectedCartElement; j++)
			{
				if(this._g_aProductInfo[i].cartid == aCartSrl[j])
				{
					oSingleProductGa4 = gaectkItems.getItemInfoBySrl('GA4', this._g_aProductInfo[i].item_id);
					oSingleProductGa4.quantity = this._g_aProductInfo[i].quantity;
					aCartToCheckoutGa4.push(oSingleProductGa4);
					
					oSingleProductUa = gaectkItems.getItemInfoBySrl('UA', this._g_aProductInfo[i].item_id);
					delete oSingleProductUa.list;
					delete oSingleProductUa.position;
					oSingleProductUa.quantity = this._g_aProductInfo[i].quantity;
					aCartToCheckoutUa.push(oSingleProductUa);

					aCartSrl.shift();
					nTotalPrice += oSingleProductGa4.price * this._g_aProductInfo[i].quantity;
					delete oSingleProductGa4;
					delete oSingleProductUa;
				}
			}
		}
		if(!nTotalPrice)
			return false;
		if(_g_bGtmIdLoaded)  // GTM dataLayer Mode
		{
			if(_g_bGtmUaActivated) // GTM trigger UA
			{
				_triggerDataLayer('eec.checkout', {
						checkout: {
							actionField: {step: 1, option: this._g_sOptionCartPage},
							products: aCartToCheckoutUa // attrs should be id, name, category, brand, variant, price, quantity
						}
					},
					{sv_event_val: nTotalPrice}
				);
			}
			if(_g_bGtmGa4Activated) // GTM trigger GA4
			{
				_triggerDataLayer('begin_checkout', {items: aCartToCheckoutGa4});
			}
		}
		else  // JS API mode
		{
			if(_g_bGa4DatastreamIdLoaded)  // GAv4
			{
				gtag('event', 'begin_checkout', {
					currency: _g_sCurrency,
					value: nTotalPrice,
					coupon: this._g_sCoupon,
					items: aCartToCheckoutGa4
					});
				console.log('event - begin_checkout selected - GAv4')
			}
			if(_g_bUaPropertyLoaded)  // UA
			{
				for(var i = 0; i < aCartToCheckoutUa.length; i++)
				{
					ga('ec:addProduct', aCartToCheckoutUa[i]); // attrs should be id, name, category, brand, variant, price, quantity
				}
				_sendCheckoutAction(1, this._g_sOptionCartPage);
				// Send data using an event.
				_sendGaEventWithoutInteraction('EEC', 'checkout_step_1', _g_sPrefixCheckoutSelected, nTotalPrice); // Send data using an event after set ec-action
				console.log('event - begin_checkout selected - UA')
			}
		}
		delete aCartToCheckoutGa4;
		delete aCartToCheckoutUa;
		if(this._g_bFacebookConvLoaded)
			this._fbSendCheckoutInitiation();
	},
	checkoutAll : function()
	{
		var nElement = this._g_aProductInfo.length;
		if(nElement < 0)
			return;

		var nTotalPrice = 0;
		var aCartToCheckoutGa4 = [];
		var aCartToCheckoutUa = [];
		for(var i = 0; i < nElement; i++)
		{
			oSingleProductGa4 = gaectkItems.getItemInfoBySrl('GA4', this._g_aProductInfo[i].item_id);
			oSingleProductGa4.quantity = this._g_aProductInfo[i].quantity;
			aCartToCheckoutGa4.push(oSingleProductGa4);
			
			oSingleProductUa = gaectkItems.getItemInfoBySrl('UA', this._g_aProductInfo[i].item_id);
			delete oSingleProductUa.list;
			delete oSingleProductUa.position;
			oSingleProductUa.quantity = this._g_aProductInfo[i].quantity;
			aCartToCheckoutUa.push(oSingleProductUa); // attrs should be id, name, category, brand, variant, price, quantity

			nTotalPrice += oSingleProductGa4.price * this._g_aProductInfo[i].quantity;
			delete oSingleProductGa4;
			delete oSingleProductUa;
		}
		if(!nTotalPrice)
			return false;

		if(_g_bGtmIdLoaded)  // GTM dataLayer Mode
		{
			if(_g_bGtmUaActivated) // GTM trigger UA
			{
				_triggerDataLayer('eec.checkout', {
						checkout: {
							actionField: {step: 1, option: this._g_sOptionCartPage},
							products: aCartToCheckoutUa // attrs should be id, name, category, brand, variant, price, quantity
						}
					},
					{sv_event_val: nTotalPrice}
				);
			}
			if(_g_bGtmGa4Activated) // GTM trigger GA4
			{
				_triggerDataLayer('begin_checkout', {items: aCartToCheckoutGa4});
			}
		}
		else  // JS API mode
		{
			if(_g_bGa4DatastreamIdLoaded)  // GAv4
			{
				gtag('event', 'begin_checkout', {
					currency: _g_sCurrency,
					value: nTotalPrice,
					coupon: this._g_sCoupon,
					items: aCartToCheckoutGa4
					});
				console.log('event - begin_checkout all - GAv4')
			}
			if(_g_bUaPropertyLoaded)  // UA
			{
				for(var i = 0; i < nElement; i++)
				{
					ga('ec:addProduct', aCartToCheckoutUa[i]); // attrs should be id, name, category, brand, variant, price, quantity
				}
				_sendCheckoutAction(1, this._g_sOptionCartPage);
				// Send data using an event.
				_sendGaEventWithoutInteraction('EEC', 'checkout_step_1', _g_sPrefixCheckoutAll, nTotalPrice); // Send data using an event after set ec-action
				console.log('event - begin_checkout all - UA');
			}
		}
		delete aCartToCheckoutGa4;
		delete aCartToCheckoutUa;
		if(this._g_bFacebookConvLoaded)
			this._fbSendCheckoutInitiation();
	},
	removeAll : function()
	{
		var nElement = this._g_aProductInfo.length;
		if(nElement < 0)
			return;

		var nTotalPrice = 0;
		var aCartToCheckoutGa4 = [];
		var aCartToCheckoutUa = [];
		for(var i = 0; i < nElement; i++)
		{
			oSingleProductGa4 = gaectkItems.getItemInfoBySrl('GA4', this._g_aProductInfo[i].item_id);
			oSingleProductGa4.quantity = this._g_aProductInfo[i].quantity;
			aCartToCheckoutGa4.push(oSingleProductGa4);
			
			oSingleProductUa = gaectkItems.getItemInfoBySrl('UA', this._g_aProductInfo[i].item_id);
			delete oSingleProductUa.list;
			delete oSingleProductUa.position;
			oSingleProductUa.quantity = this._g_aProductInfo[i].quantity;
			aCartToCheckoutUa.push(oSingleProductUa); // attrs should be id, name, category, brand, variant, price, quantity

			nTotalPrice += oSingleProductGa4.price * this._g_aProductInfo[i].quantity;
			delete oSingleProductGa4;
			delete oSingleProductUa;
		}
		if(!nTotalPrice)
			return false;

		if(_g_bGtmIdLoaded)  // GTM dataLayer Mode
		{
			if(_g_bGtmUaActivated) // GTM trigger UA
			{
				_triggerDataLayer('eec.remove', {
						remove: {
							actionField: {list: this._g_sOptionCartPage},
							products: aCartToCheckoutUa
						}
					},
					{sv_event_val: nTotalPrice}
				);
			}
			if(_g_bGtmGa4Activated) // GTM trigger GA4
			{
				_triggerDataLayer('remove_from_cart', {items:aCartToCheckoutGa4});
			}
		}
		else  // JS API mode
		{
			if(_g_bGa4DatastreamIdLoaded)  // GAv4
			{
				gtag('event', 'remove_from_cart', {
					currency: _g_sCurrency,
					value: nTotalPrice,
					items: aCartToCheckoutGa4
					});
				console.log('event - remove_from_cart all - GAv4');
			}
			if(_g_bUaPropertyLoaded)  // UA
			{
				for( var i = 0; i < nElement; i++ )
				{
					ga('ec:addProduct', aCartToCheckoutUa[i]); // attrs should be id, name, category, brand, variant, price, quantity
				}
				ga('ec:setAction', 'remove');
				// Send data using an event after set ec-action  // minus value for UA event value only
				_sendGaEventWithoutInteraction( 'EEC', 'remove_cart', _g_sPrefixRemoveFromCart + '_item_cnt_' + String(nElement), -nTotalPrice);
				console.log('event - remove_from_cart all - UA');
			}
		}
		delete aCartToCheckoutGa4;
		delete aCartToCheckoutUa;
	},
	removeSelected : function(aTmpCartSrl)
	{
		var aCartSrl = [];
		if(aTmpCartSrl instanceof Array) 
		{
			var nCartSrl;
			for(nIdx in aTmpCartSrl) 
			{
				if(aTmpCartSrl[nIdx] != '')
					aCartSrl.push(aTmpCartSrl[nIdx]);
			}
		}
		else  // aCartSrl이 배열이 아니고 정수이면 배열로 전환
		{
			var nTmpCartSrl = aTmpCartSrl;
			aCartSrl.push(nTmpCartSrl);
		}
		var nTotalPrice = 0;
		var aCartToRemoveGa4 = [];
		var aCartToRemoveUa = [];
		var nStackedCartElement = this._g_aProductInfo.length;
		var nSelectedCartElement = 0;
		for(var i = 0; i < nStackedCartElement; i++)
		{
			nSelectedCartElement = aCartSrl.length;
			for(var j = 0; j < nSelectedCartElement; j++)
			{
				if(this._g_aProductInfo[i].cartid == aCartSrl[j])
				{
					oSingleProductGa4 = gaectkItems.getItemInfoBySrl('GA4', this._g_aProductInfo[i].item_id);
					oSingleProductGa4.quantity = this._g_aProductInfo[i].quantity;
					aCartToRemoveGa4.push(oSingleProductGa4);
					
					oSingleProductUa = gaectkItems.getItemInfoBySrl('UA', this._g_aProductInfo[i].item_id);
					delete oSingleProductUa.list;
					delete oSingleProductUa.position;
					oSingleProductUa.quantity = this._g_aProductInfo[i].quantity;
					aCartToRemoveUa.push(oSingleProductUa);

					aCartSrl.shift();
					nTotalPrice += oSingleProductGa4.price * this._g_aProductInfo[i].quantity;
					delete oSingleProductGa4;
					delete oSingleProductUa;
				}
			}
		}
		if(!nTotalPrice || aCartToRemoveGa4.length == 0)
		{
			console.log('nothing to remove from cart');
			return false;
		}
		if(_g_bGtmIdLoaded)  // GTM dataLayer Mode
		{
			if(_g_bGtmUaActivated) // GTM trigger UA
			{
				_triggerDataLayer('eec.remove', {
						remove: {
							actionField: {list: this._g_sOptionCartPage},
							products: aCartToRemoveUa
						}
					},
					{sv_event_val: nTotalPrice}
				);
			}
			if(_g_bGtmGa4Activated) // GTM trigger GA4
			{
				_triggerDataLayer('remove_from_cart', {items:aCartToRemoveGa4});
			}
		}
		else  // JS API mode
		{
			if(_g_bGa4DatastreamIdLoaded)  // GAv4
			{
				gtag('event', 'remove_from_cart', {
					currency: _g_sCurrency,
					value: nTotalPrice,
					items: aCartToRemoveGa4
					});
				console.log('event - remove_from_cart selected - GAv4')
			}
			if(_g_bUaPropertyLoaded)  // UA
			{
				for(var i = 0; i < aCartToRemoveUa.length; i++)
				{
					ga('ec:addProduct', aCartToRemoveUa[i]);
				}
				ga('ec:setAction', 'remove');
				// Send data using an event.   // minus value for UA event value only
				_sendGaEventWithoutInteraction('EEC', 'remove_cart', _g_sPrefixRemoveFromCart + '_item_cnt_' + String(aCartToRemoveUa.length), -nTotalPrice);
				console.log('event - remove_from_cart selected - UA');
			}
		}
		delete aCartToRemoveGa4;
		delete aCartToRemoveUa;
	},
	_fbSendCheckoutInitiation : function() 
	{
		fbq('track', 'InitiateCheckout');
	}
}

var gaectkSettlement = 
{
	_g_aProductInfo: [],
	_g_bFacebookConvLoaded: false,
	_g_sOptionSettlementPage: 'order page',
	init : function()
	{
		if(_g_bUaPropertyLoaded && !_g_bEcRequired)
		{
			_g_bEcRequired = true;
			ga('require', 'ec');
		}
		if(typeof(fbq) != 'undefined' && fbq != null) 
			this._g_bFacebookConvLoaded = true;

		return true;
	},
	queueItemInfo : function(nItemSrl, sItemName, sCategory, sBrand, sVariant, nItemPrice, nTotalQuantity)
	{
		gaectkItems.register(nItemSrl, sItemName, null, sBrand, sCategory, sVariant, null, _enforceInt(nItemPrice), null); //, null, null, null);
		this._g_aProductInfo.push({item_id: nItemSrl, quantity: _enforceInt(nTotalQuantity)});
		return true;
	},
	patch : function(nStepNumber, sOption)
	{
		var nElement = this._g_aProductInfo.length;
		if(nElement < 0)
			return;

		var nTotalPrice = 0;
		var aProductToCheckoutGa4 = [];
		var aProductToCheckoutUa = [];
		for(var i = 0; i < nElement; i++)
		{
			oSingleProductGa4 = gaectkItems.getItemInfoBySrl('GA4', this._g_aProductInfo[i].item_id);
			oSingleProductGa4.quantity = this._g_aProductInfo[i].quantity;
			aProductToCheckoutGa4.push(oSingleProductGa4);
			
			oSingleProductUa = gaectkItems.getItemInfoBySrl('UA', this._g_aProductInfo[i].item_id);
			delete oSingleProductUa.list;
			delete oSingleProductUa.position;
			oSingleProductUa.quantity = this._g_aProductInfo[i].quantity;
			aProductToCheckoutUa.push(oSingleProductUa); // attrs should be id, name, category, brand, variant, price, quantity

			nTotalPrice += oSingleProductGa4.price * this._g_aProductInfo[i].quantity;  // plus value
		}
		if(!nTotalPrice)
			return false;
		if(_g_bGtmIdLoaded)  // GTM dataLayer Mode
		{
			if(_g_bGtmUaActivated) // GTM trigger UA
			{
				_triggerDataLayer('eec.checkout', {
						checkout: {
							actionField: {
								step: 2, // 1, the first step already started from cart page
								option: this._g_sOptionSettlementPage
							},
							products: aProductToCheckoutUa
						}
					},
					{
						sv_event_lbl: _g_sPrefixSettlement + '_option_' + this._g_sOptionSettlementPage, 
						sv_event_val: nTotalPrice
					}
				);
			}
			if(_g_bGtmGa4Activated) // GTM trigger GA4
			{
				_triggerDataLayer('add_shipping_info', {shipping_tier: 'Ground', items:aProductToCheckoutGa4});
				_triggerDataLayer('add_payment_info', {payment_type: 'Internal PG', items:aProductToCheckoutGa4});
			}
		}
		else  // JS API mode
		{
			if(_g_bGa4DatastreamIdLoaded)  // GAv4
			{
				gtag('event', 'add_shipping_info', {
					currency: _g_sCurrency,
					value: nTotalPrice,
					// coupon: 'SUMMER_FUN',
					shipping_tier: 'Ground',
					items: aProductToCheckoutGa4  // this._g_aProductInfo
				});
				gtag('event', 'add_payment_info', {
					currency: _g_sCurrency,
					value: nTotalPrice,
					// coupon: 'SUMMER_FUN',
					payment_type: 'Internal PG',
					items: aProductToCheckoutGa4  // this._g_aProductInfo
				});
				console.log('event - add_shipping_info add_payment_info - GAv4')
			}
			if(_g_bUaPropertyLoaded)  // UA
			{
				for(var i = 0; i < nElement; i++)
				{
					ga('ec:addProduct', aProductToCheckoutUa[i]);
				}
				if(nStepNumber === undefined)
					nStepNumber = null;
				else if(nStepNumber.length == 0)
					nStepNumber = null;

				if(sOption === undefined)
					sOption = null;
				else if(sOption.length == 0)
					sOption = null;
				
				if(nStepNumber == null && sOption == null)
				{
					nStepNumber = 2;
					_sendCheckoutAction(nStepNumber, this._g_sOptionSettlementPage); // 1, the first step already started from cart page
					console.log('event - settlement start page - UA');
					gaectkStorage.saveData('cookie', _g_sSettledItemListCN, this._g_aProductInfo, nStepNumber);  // expire in 2 hrs
				}
				else if(nStepNumber != null && sOption == null)
					_sendCheckoutAction(nStepNumber);
				else if(nStepNumber != null && sOption != null)
					_sendCheckoutAction(nStepNumber, sOption);
				// Send data using an event after set ec-action
				_sendGaEventWithoutInteraction('EEC', 'checkout_step_'+String(nStepNumber), _g_sPrefixSettlement + '_option_' + this._g_sOptionSettlementPage, nTotalPrice); 
			}
		}
		delete aProductToCheckoutGa4;
		delete aProductToCheckoutUa;
		if(this._g_bFacebookConvLoaded)
			this._fbSendPaymentInfoAddition();
	},
	_fbSendPaymentInfoAddition : function() 
	{
		fbq('track', 'AddPaymentInfo');
	}
}

var gaectkPurchase = 
{
	_g_aProductInfo : [],
	_g_aFbItemSrls : [],
	_g_bFacebookConvLoaded : false,
	init : function()
	{
		if(_g_bUaPropertyLoaded && !_g_bEcRequired)
		{
			_g_bEcRequired = true;
			ga('require', 'ec');
		}
		if(typeof(fbq) != 'undefined' && fbq != null) 
			this._g_bFacebookConvLoaded = true;
		return true;
	},
	queueItemInfo : function(nItemSrl, sItemName, sCategory, sBrand, sVariant, nItemPrice, nTotalQuantity, sCoupon)
	{   // can be ignored if engine does not provide purchased item list in checkout result page
		gaectkItems.register(nItemSrl, sItemName, null, sBrand, sCategory, sVariant, null, _enforceInt(nItemPrice), sCoupon); //, null, null, null);
		this._g_aProductInfo.push({ item_id: nItemSrl, coupon: sCoupon, quantity: _enforceInt(nTotalQuantity)});
		this._g_aFbItemSrls.push(nItemSrl);
		return true;
	},
	patchPurchase : function(nOrderSrl, sAffiliation, nRevenue, nShippingCost, sCoupon)
	{
		nRevenue = _enforceInt(nRevenue);
		nShippingCost = _enforceInt(nShippingCost);
		var nTaxAmnt = nRevenue * 0.1;
		var nElement = this._g_aProductInfo.length;
		if(nElement > 0) // gaectkPurchase.queueItemInfo()가 실행되었으면
			aProductInfo = this._g_aProductInfo;
		else // gaectkPurchase.queueItemInfo()가 실행되지 않았으면 _g_sSettledItemListCN 쿠키를 탐색함
		{
			oTemp = gaectkStorage.loadData('cookie', _g_sSettledItemListCN);
			if(oTemp == null)
				return false;
			nElement = oTemp.length;
			if(nElement > 0)
				aProductInfo = oTemp;
		}

		var nTotalPrice = 0;
		var aProductToCheckoutGa4 = [];
		var aProductToCheckoutUa = [];
		for(var i = 0; i < nElement; i++)
		{
			oSingleProductGa4 = gaectkItems.getItemInfoBySrl('GA4', aProductInfo[i].item_id);
			oSingleProductGa4.quantity = aProductInfo[i].quantity;
			oSingleProductGa4.coupon = aProductInfo[i].coupon;
			aProductToCheckoutGa4.push(oSingleProductGa4);
			
			oSingleProductUa = gaectkItems.getItemInfoBySrl('UA', aProductInfo[i].item_id);
			delete oSingleProductUa.list;
			delete oSingleProductUa.position;
			oSingleProductUa.quantity = aProductInfo[i].quantity;
			oSingleProductUa.coupon = aProductInfo[i].coupon;
			aProductToCheckoutUa.push(oSingleProductUa); // attrs should be id, name, category, brand, variant, price, quantity

			nTotalPrice += oSingleProductGa4.price * aProductInfo[i].quantity;  // plus value
		}
		if(!nTotalPrice)
			return false;

		if(_g_bGtmIdLoaded)  // GTM dataLayer Mode
		{
			if(_g_bGtmUaActivated) // GTM trigger UA
			{
				_triggerDataLayer('eec.purchase', {
						currencyCode: _g_sCurrency,
						purchase: {
							actionField: {
								id: nOrderSrl,
								affiliation: _g_sAffiliation,
								revenue: nRevenue,
								tax: nTaxAmnt,
								shipping: nShippingCost,
								coupon: sCoupon
							},
							products: aProductToCheckoutUa
						}
					}
				);
			}
			if(_g_bGtmGa4Activated) // GTM trigger GA4
			{
				_triggerDataLayer('purchase', {
					currency: _g_sCurrency,
					transaction_id: nOrderSrl,
					value: nRevenue,
					affiliation: _g_sAffiliation,
					coupon: sCoupon,
					shipping: nShippingCost,
					tax: nTaxAmnt,
					items: aProductToCheckoutGa4
				});
			}
		}
		else  // JS API mode
		{
			if(_g_bGa4DatastreamIdLoaded)  // GAv4
			{
				gtag('event', 'purchase', {  // GA v4는 items Array없이 purchase event 전송 불가능
					currency: _g_sCurrency,
					transaction_id: nOrderSrl,
					value: nRevenue,
					affiliation: _g_sAffiliation,
					coupon: sCoupon,
					shipping: nShippingCost,
					tax: nTaxAmnt,
					items: aProductToCheckoutGa4
				});
				console.log('event - purchase - GAv4');
			}
			if(_g_bUaPropertyLoaded)  // UA
			{
				for(var i = 0; i < nElement; i++)
				{
					ga('ec:addProduct', aProductToCheckoutUa[i]);
				}
				ga('ec:setAction', 'purchase', { // Transaction details are provided in an actionFieldObject.
					id: nOrderSrl,             // (Required) Transaction id (string).
					affiliation: sAffiliation, // Affiliation (string).
					revenue: nRevenue,         // Revenue (currency).
					tax: nTaxAmnt,             // Tax (currency).
					shipping: nShippingCost,   // Shipping (currency).
					coupon: sCoupon            // Transaction coupon (string).
				});
				// Send data using an event after set ec-action
				_sendGaEventWithoutInteraction('EEC', 'purchase', 'OrderID:'+nOrderSrl, nRevenue);
				console.log('event - purchase - UA');
			}
		}
		if(this._g_bFacebookConvLoaded)
			this._fbSendPurchaseComplete(nRevenue);
		gaectkStorage.removeData('cookie', _g_sSettledItemListCN)
	},
	_fbSendPurchaseComplete : function(nRevenue)
	{
		fbq('track', 'Purchase', {
			content_ids: this._g_aFbItemSrls,
			content_type: 'product',
			value: nRevenue,
			currency: _g_sCurrency
		});
	}
}

var gaectkMypage = 
{
	_g_aProductInfo : [],
	init : function()
	{
		if(_g_bUaPropertyLoaded && !_g_bEcRequired)
		{
			_g_bEcRequired = true;
			ga('require', 'ec');
		}
		return true;
	},
	queueItemInfo : function(nItemSrl, sItemName, sCategory, sBrand, sVariant, nItemPrice, nTotalQuantity)
	{
		gaectkItems.register(nItemSrl, sItemName, this._g_nListPosition++, sBrand, sCategory, sVariant, null, _enforceInt(nItemPrice), null); //, null, null, null);
		this._g_aProductInfo.push({ item_id: nItemSrl, quantity: _enforceInt(nTotalQuantity)});
		return true;
	},
	refund : function(nOrderSrl)
	{ // Refund an entire transaction.
		var nRefundedAmnt = 0;
		var nElement = this._g_aProductInfo.length;

		var aProductToRefundGa4 = [];
		var aProductToRefundUa = [];
		for(var i = 0; i < nElement; i++)
		{
			oSingleProductGa4 = gaectkItems.getItemInfoBySrl('GA4', this._g_aProductInfo[i].item_id);
			oSingleProductGa4.quantity = this._g_aProductInfo[i].quantity;
			oSingleProductGa4.coupon = this._g_aProductInfo[i].coupon;
			aProductToRefundGa4.push(oSingleProductGa4);
			
			oSingleProductUa = gaectkItems.getItemInfoBySrl('UA', this._g_aProductInfo[i].item_id);
			delete oSingleProductUa.brand;
			delete oSingleProductUa.category;
			delete oSingleProductUa.coupon;
			delete oSingleProductUa.name;
			delete oSingleProductUa.price;
			delete oSingleProductUa.variant;
			delete oSingleProductUa.list;
			delete oSingleProductUa.position;
			oSingleProductUa.quantity = this._g_aProductInfo[i].quantity;
			aProductToRefundUa.push(oSingleProductUa); // attrs should be id, name, category, brand, variant, price, quantity

			nRefundedAmnt += oSingleProductGa4.price * this._g_aProductInfo[i].quantity;  // plus value
		}
		if(!nRefundedAmnt)
			return false;

		if(_g_bGtmIdLoaded)  // GTM dataLayer Mode
		{
			if(_g_bGtmUaActivated) // GTM trigger UA
			{
				_triggerDataLayer('eec.refund', {refund: {actionField: {id: nOrderSrl}}, products: aProductToRefundUa});
			}
			if(_g_bGtmGa4Activated) // GTM trigger GA4
			{
				_triggerDataLayer('refund', {transaction_id: nOrderSrl});
			}
		}
		else  // JS API mode
		{
			if(_g_bGa4DatastreamIdLoaded)  // GAv4
			{
				gtag('event', 'refund', {
					currency: _g_sCurrency,
					transaction_id: nOrderSrl,
					value: nRefundedAmnt,
					affiliation: _g_sAffiliation,
					//coupon: 'SUMMER_FUN',
					//shipping: 3.33,
					//tax: 1.11,
					items: aProductToRefundGa4
				  });
				console.log('event - refund - GAv4')
			}
			if(_g_bUaPropertyLoaded)  // UA
			{
				var nLength = this._g_aProductInfo.length;
				for(var i = 0; i < nLength; i++)
				{
					ga('ec:addProduct', aProductToRefundUa[i]); // Add a single product to refund
				}
				ga('ec:setAction', 'refund', {
					'id': nOrderSrl // Transaction ID is only required field for full refund.
				});
				_sendGaEventWithoutInteraction('EEC', 'refund', _g_sPrefixRefunded + '_item_cnt_' + String(nLength), -nRefundedAmnt); // minus value for UA event value only
			}
		}
		delete aProductToRefundGa4;
		delete aProductToRefundUa;
	}
}

/*
CryptoJS v3.1.2
https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS=CryptoJS||function(u,p){var d={},l=d.lib={},s=function(){},t=l.Base={extend:function(a){s.prototype=this;var c=new s;a&&c.mixIn(a);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
r=l.WordArray=t.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=p?c:4*a.length},toString:function(a){return(a||v).stringify(this)},concat:function(a){var c=this.words,e=a.words,j=this.sigBytes;a=a.sigBytes;this.clamp();if(j%4)for(var k=0;k<a;k++)c[j+k>>>2]|=(e[k>>>2]>>>24-8*(k%4)&255)<<24-8*((j+k)%4);else if(65535<e.length)for(k=0;k<a;k+=4)c[j+k>>>2]=e[k>>>2];else c.push.apply(c,e);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<
32-8*(c%4);a.length=u.ceil(c/4)},clone:function(){var a=t.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],e=0;e<a;e+=4)c.push(4294967296*u.random()|0);return new r.init(c,a)}}),w=d.enc={},v=w.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var e=[],j=0;j<a;j++){var k=c[j>>>2]>>>24-8*(j%4)&255;e.push((k>>>4).toString(16));e.push((k&15).toString(16))}return e.join("")},parse:function(a){for(var c=a.length,e=[],j=0;j<c;j+=2)e[j>>>3]|=parseInt(a.substr(j,
2),16)<<24-4*(j%8);return new r.init(e,c/2)}},b=w.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var e=[],j=0;j<a;j++)e.push(String.fromCharCode(c[j>>>2]>>>24-8*(j%4)&255));return e.join("")},parse:function(a){for(var c=a.length,e=[],j=0;j<c;j++)e[j>>>2]|=(a.charCodeAt(j)&255)<<24-8*(j%4);return new r.init(e,c)}},x=w.Utf8={stringify:function(a){try{return decodeURIComponent(escape(b.stringify(a)))}catch(c){throw Error("Malformed UTF-8 data");}},parse:function(a){return b.parse(unescape(encodeURIComponent(a)))}},
q=l.BufferedBlockAlgorithm=t.extend({reset:function(){this._data=new r.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=x.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,e=c.words,j=c.sigBytes,k=this.blockSize,b=j/(4*k),b=a?u.ceil(b):u.max((b|0)-this._minBufferSize,0);a=b*k;j=u.min(4*a,j);if(a){for(var q=0;q<a;q+=k)this._doProcessBlock(e,q);q=e.splice(0,a);c.sigBytes-=j}return new r.init(q,j)},clone:function(){var a=t.clone.call(this);
a._data=this._data.clone();return a},_minBufferSize:0});l.Hasher=q.extend({cfg:t.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){q.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(b,e){return(new a.init(e)).finalize(b)}},_createHmacHelper:function(a){return function(b,e){return(new n.HMAC.init(a,
e)).finalize(b)}}});var n=d.algo={};return d}(Math);
(function(){var u=CryptoJS,p=u.lib.WordArray;u.enc.Base64={stringify:function(d){var l=d.words,p=d.sigBytes,t=this._map;d.clamp();d=[];for(var r=0;r<p;r+=3)for(var w=(l[r>>>2]>>>24-8*(r%4)&255)<<16|(l[r+1>>>2]>>>24-8*((r+1)%4)&255)<<8|l[r+2>>>2]>>>24-8*((r+2)%4)&255,v=0;4>v&&r+0.75*v<p;v++)d.push(t.charAt(w>>>6*(3-v)&63));if(l=t.charAt(64))for(;d.length%4;)d.push(l);return d.join("")},parse:function(d){var l=d.length,s=this._map,t=s.charAt(64);t&&(t=d.indexOf(t),-1!=t&&(l=t));for(var t=[],r=0,w=0;w<
l;w++)if(w%4){var v=s.indexOf(d.charAt(w-1))<<2*(w%4),b=s.indexOf(d.charAt(w))>>>6-2*(w%4);t[r>>>2]|=(v|b)<<24-8*(r%4);r++}return p.create(t,r)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}})();
(function(u){function p(b,n,a,c,e,j,k){b=b+(n&a|~n&c)+e+k;return(b<<j|b>>>32-j)+n}function d(b,n,a,c,e,j,k){b=b+(n&c|a&~c)+e+k;return(b<<j|b>>>32-j)+n}function l(b,n,a,c,e,j,k){b=b+(n^a^c)+e+k;return(b<<j|b>>>32-j)+n}function s(b,n,a,c,e,j,k){b=b+(a^(n|~c))+e+k;return(b<<j|b>>>32-j)+n}for(var t=CryptoJS,r=t.lib,w=r.WordArray,v=r.Hasher,r=t.algo,b=[],x=0;64>x;x++)b[x]=4294967296*u.abs(u.sin(x+1))|0;r=r.MD5=v.extend({_doReset:function(){this._hash=new w.init([1732584193,4023233417,2562383102,271733878])},
_doProcessBlock:function(q,n){for(var a=0;16>a;a++){var c=n+a,e=q[c];q[c]=(e<<8|e>>>24)&16711935|(e<<24|e>>>8)&4278255360}var a=this._hash.words,c=q[n+0],e=q[n+1],j=q[n+2],k=q[n+3],z=q[n+4],r=q[n+5],t=q[n+6],w=q[n+7],v=q[n+8],A=q[n+9],B=q[n+10],C=q[n+11],u=q[n+12],D=q[n+13],E=q[n+14],x=q[n+15],f=a[0],m=a[1],g=a[2],h=a[3],f=p(f,m,g,h,c,7,b[0]),h=p(h,f,m,g,e,12,b[1]),g=p(g,h,f,m,j,17,b[2]),m=p(m,g,h,f,k,22,b[3]),f=p(f,m,g,h,z,7,b[4]),h=p(h,f,m,g,r,12,b[5]),g=p(g,h,f,m,t,17,b[6]),m=p(m,g,h,f,w,22,b[7]),
f=p(f,m,g,h,v,7,b[8]),h=p(h,f,m,g,A,12,b[9]),g=p(g,h,f,m,B,17,b[10]),m=p(m,g,h,f,C,22,b[11]),f=p(f,m,g,h,u,7,b[12]),h=p(h,f,m,g,D,12,b[13]),g=p(g,h,f,m,E,17,b[14]),m=p(m,g,h,f,x,22,b[15]),f=d(f,m,g,h,e,5,b[16]),h=d(h,f,m,g,t,9,b[17]),g=d(g,h,f,m,C,14,b[18]),m=d(m,g,h,f,c,20,b[19]),f=d(f,m,g,h,r,5,b[20]),h=d(h,f,m,g,B,9,b[21]),g=d(g,h,f,m,x,14,b[22]),m=d(m,g,h,f,z,20,b[23]),f=d(f,m,g,h,A,5,b[24]),h=d(h,f,m,g,E,9,b[25]),g=d(g,h,f,m,k,14,b[26]),m=d(m,g,h,f,v,20,b[27]),f=d(f,m,g,h,D,5,b[28]),h=d(h,f,
m,g,j,9,b[29]),g=d(g,h,f,m,w,14,b[30]),m=d(m,g,h,f,u,20,b[31]),f=l(f,m,g,h,r,4,b[32]),h=l(h,f,m,g,v,11,b[33]),g=l(g,h,f,m,C,16,b[34]),m=l(m,g,h,f,E,23,b[35]),f=l(f,m,g,h,e,4,b[36]),h=l(h,f,m,g,z,11,b[37]),g=l(g,h,f,m,w,16,b[38]),m=l(m,g,h,f,B,23,b[39]),f=l(f,m,g,h,D,4,b[40]),h=l(h,f,m,g,c,11,b[41]),g=l(g,h,f,m,k,16,b[42]),m=l(m,g,h,f,t,23,b[43]),f=l(f,m,g,h,A,4,b[44]),h=l(h,f,m,g,u,11,b[45]),g=l(g,h,f,m,x,16,b[46]),m=l(m,g,h,f,j,23,b[47]),f=s(f,m,g,h,c,6,b[48]),h=s(h,f,m,g,w,10,b[49]),g=s(g,h,f,m,
E,15,b[50]),m=s(m,g,h,f,r,21,b[51]),f=s(f,m,g,h,u,6,b[52]),h=s(h,f,m,g,k,10,b[53]),g=s(g,h,f,m,B,15,b[54]),m=s(m,g,h,f,e,21,b[55]),f=s(f,m,g,h,v,6,b[56]),h=s(h,f,m,g,x,10,b[57]),g=s(g,h,f,m,t,15,b[58]),m=s(m,g,h,f,D,21,b[59]),f=s(f,m,g,h,z,6,b[60]),h=s(h,f,m,g,C,10,b[61]),g=s(g,h,f,m,j,15,b[62]),m=s(m,g,h,f,A,21,b[63]);a[0]=a[0]+f|0;a[1]=a[1]+m|0;a[2]=a[2]+g|0;a[3]=a[3]+h|0},_doFinalize:function(){var b=this._data,n=b.words,a=8*this._nDataBytes,c=8*b.sigBytes;n[c>>>5]|=128<<24-c%32;var e=u.floor(a/
4294967296);n[(c+64>>>9<<4)+15]=(e<<8|e>>>24)&16711935|(e<<24|e>>>8)&4278255360;n[(c+64>>>9<<4)+14]=(a<<8|a>>>24)&16711935|(a<<24|a>>>8)&4278255360;b.sigBytes=4*(n.length+1);this._process();b=this._hash;n=b.words;for(a=0;4>a;a++)c=n[a],n[a]=(c<<8|c>>>24)&16711935|(c<<24|c>>>8)&4278255360;return b},clone:function(){var b=v.clone.call(this);b._hash=this._hash.clone();return b}});t.MD5=v._createHelper(r);t.HmacMD5=v._createHmacHelper(r)})(Math);
(function(){var u=CryptoJS,p=u.lib,d=p.Base,l=p.WordArray,p=u.algo,s=p.EvpKDF=d.extend({cfg:d.extend({keySize:4,hasher:p.MD5,iterations:1}),init:function(d){this.cfg=this.cfg.extend(d)},compute:function(d,r){for(var p=this.cfg,s=p.hasher.create(),b=l.create(),u=b.words,q=p.keySize,p=p.iterations;u.length<q;){n&&s.update(n);var n=s.update(d).finalize(r);s.reset();for(var a=1;a<p;a++)n=s.finalize(n),s.reset();b.concat(n)}b.sigBytes=4*q;return b}});u.EvpKDF=function(d,l,p){return s.create(p).compute(d,
l)}})();
CryptoJS.lib.Cipher||function(u){var p=CryptoJS,d=p.lib,l=d.Base,s=d.WordArray,t=d.BufferedBlockAlgorithm,r=p.enc.Base64,w=p.algo.EvpKDF,v=d.Cipher=t.extend({cfg:l.extend(),createEncryptor:function(e,a){return this.create(this._ENC_XFORM_MODE,e,a)},createDecryptor:function(e,a){return this.create(this._DEC_XFORM_MODE,e,a)},init:function(e,a,b){this.cfg=this.cfg.extend(b);this._xformMode=e;this._key=a;this.reset()},reset:function(){t.reset.call(this);this._doReset()},process:function(e){this._append(e);return this._process()},
finalize:function(e){e&&this._append(e);return this._doFinalize()},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(e){return{encrypt:function(b,k,d){return("string"==typeof k?c:a).encrypt(e,b,k,d)},decrypt:function(b,k,d){return("string"==typeof k?c:a).decrypt(e,b,k,d)}}}});d.StreamCipher=v.extend({_doFinalize:function(){return this._process(!0)},blockSize:1});var b=p.mode={},x=function(e,a,b){var c=this._iv;c?this._iv=u:c=this._prevBlock;for(var d=0;d<b;d++)e[a+d]^=
c[d]},q=(d.BlockCipherMode=l.extend({createEncryptor:function(e,a){return this.Encryptor.create(e,a)},createDecryptor:function(e,a){return this.Decryptor.create(e,a)},init:function(e,a){this._cipher=e;this._iv=a}})).extend();q.Encryptor=q.extend({processBlock:function(e,a){var b=this._cipher,c=b.blockSize;x.call(this,e,a,c);b.encryptBlock(e,a);this._prevBlock=e.slice(a,a+c)}});q.Decryptor=q.extend({processBlock:function(e,a){var b=this._cipher,c=b.blockSize,d=e.slice(a,a+c);b.decryptBlock(e,a);x.call(this,
e,a,c);this._prevBlock=d}});b=b.CBC=q;q=(p.pad={}).Pkcs7={pad:function(a,b){for(var c=4*b,c=c-a.sigBytes%c,d=c<<24|c<<16|c<<8|c,l=[],n=0;n<c;n+=4)l.push(d);c=s.create(l,c);a.concat(c)},unpad:function(a){a.sigBytes-=a.words[a.sigBytes-1>>>2]&255}};d.BlockCipher=v.extend({cfg:v.cfg.extend({mode:b,padding:q}),reset:function(){v.reset.call(this);var a=this.cfg,b=a.iv,a=a.mode;if(this._xformMode==this._ENC_XFORM_MODE)var c=a.createEncryptor;else c=a.createDecryptor,this._minBufferSize=1;this._mode=c.call(a,
this,b&&b.words)},_doProcessBlock:function(a,b){this._mode.processBlock(a,b)},_doFinalize:function(){var a=this.cfg.padding;if(this._xformMode==this._ENC_XFORM_MODE){a.pad(this._data,this.blockSize);var b=this._process(!0)}else b=this._process(!0),a.unpad(b);return b},blockSize:4});var n=d.CipherParams=l.extend({init:function(a){this.mixIn(a)},toString:function(a){return(a||this.formatter).stringify(this)}}),b=(p.format={}).OpenSSL={stringify:function(a){var b=a.ciphertext;a=a.salt;return(a?s.create([1398893684,
1701076831]).concat(a).concat(b):b).toString(r)},parse:function(a){a=r.parse(a);var b=a.words;if(1398893684==b[0]&&1701076831==b[1]){var c=s.create(b.slice(2,4));b.splice(0,4);a.sigBytes-=16}return n.create({ciphertext:a,salt:c})}},a=d.SerializableCipher=l.extend({cfg:l.extend({format:b}),encrypt:function(a,b,c,d){d=this.cfg.extend(d);var l=a.createEncryptor(c,d);b=l.finalize(b);l=l.cfg;return n.create({ciphertext:b,key:c,iv:l.iv,algorithm:a,mode:l.mode,padding:l.padding,blockSize:a.blockSize,formatter:d.format})},
decrypt:function(a,b,c,d){d=this.cfg.extend(d);b=this._parse(b,d.format);return a.createDecryptor(c,d).finalize(b.ciphertext)},_parse:function(a,b){return"string"==typeof a?b.parse(a,this):a}}),p=(p.kdf={}).OpenSSL={execute:function(a,b,c,d){d||(d=s.random(8));a=w.create({keySize:b+c}).compute(a,d);c=s.create(a.words.slice(b),4*c);a.sigBytes=4*b;return n.create({key:a,iv:c,salt:d})}},c=d.PasswordBasedCipher=a.extend({cfg:a.cfg.extend({kdf:p}),encrypt:function(b,c,d,l){l=this.cfg.extend(l);d=l.kdf.execute(d,
b.keySize,b.ivSize);l.iv=d.iv;b=a.encrypt.call(this,b,c,d.key,l);b.mixIn(d);return b},decrypt:function(b,c,d,l){l=this.cfg.extend(l);c=this._parse(c,l.format);d=l.kdf.execute(d,b.keySize,b.ivSize,c.salt);l.iv=d.iv;return a.decrypt.call(this,b,c,d.key,l)}})}();
(function(){for(var u=CryptoJS,p=u.lib.BlockCipher,d=u.algo,l=[],s=[],t=[],r=[],w=[],v=[],b=[],x=[],q=[],n=[],a=[],c=0;256>c;c++)a[c]=128>c?c<<1:c<<1^283;for(var e=0,j=0,c=0;256>c;c++){var k=j^j<<1^j<<2^j<<3^j<<4,k=k>>>8^k&255^99;l[e]=k;s[k]=e;var z=a[e],F=a[z],G=a[F],y=257*a[k]^16843008*k;t[e]=y<<24|y>>>8;r[e]=y<<16|y>>>16;w[e]=y<<8|y>>>24;v[e]=y;y=16843009*G^65537*F^257*z^16843008*e;b[k]=y<<24|y>>>8;x[k]=y<<16|y>>>16;q[k]=y<<8|y>>>24;n[k]=y;e?(e=z^a[a[a[G^z]]],j^=a[a[j]]):e=j=1}var H=[0,1,2,4,8,
16,32,64,128,27,54],d=d.AES=p.extend({_doReset:function(){for(var a=this._key,c=a.words,d=a.sigBytes/4,a=4*((this._nRounds=d+6)+1),e=this._keySchedule=[],j=0;j<a;j++)if(j<d)e[j]=c[j];else{var k=e[j-1];j%d?6<d&&4==j%d&&(k=l[k>>>24]<<24|l[k>>>16&255]<<16|l[k>>>8&255]<<8|l[k&255]):(k=k<<8|k>>>24,k=l[k>>>24]<<24|l[k>>>16&255]<<16|l[k>>>8&255]<<8|l[k&255],k^=H[j/d|0]<<24);e[j]=e[j-d]^k}c=this._invKeySchedule=[];for(d=0;d<a;d++)j=a-d,k=d%4?e[j]:e[j-4],c[d]=4>d||4>=j?k:b[l[k>>>24]]^x[l[k>>>16&255]]^q[l[k>>>
8&255]]^n[l[k&255]]},encryptBlock:function(a,b){this._doCryptBlock(a,b,this._keySchedule,t,r,w,v,l)},decryptBlock:function(a,c){var d=a[c+1];a[c+1]=a[c+3];a[c+3]=d;this._doCryptBlock(a,c,this._invKeySchedule,b,x,q,n,s);d=a[c+1];a[c+1]=a[c+3];a[c+3]=d},_doCryptBlock:function(a,b,c,d,e,j,l,f){for(var m=this._nRounds,g=a[b]^c[0],h=a[b+1]^c[1],k=a[b+2]^c[2],n=a[b+3]^c[3],p=4,r=1;r<m;r++)var q=d[g>>>24]^e[h>>>16&255]^j[k>>>8&255]^l[n&255]^c[p++],s=d[h>>>24]^e[k>>>16&255]^j[n>>>8&255]^l[g&255]^c[p++],t=
d[k>>>24]^e[n>>>16&255]^j[g>>>8&255]^l[h&255]^c[p++],n=d[n>>>24]^e[g>>>16&255]^j[h>>>8&255]^l[k&255]^c[p++],g=q,h=s,k=t;q=(f[g>>>24]<<24|f[h>>>16&255]<<16|f[k>>>8&255]<<8|f[n&255])^c[p++];s=(f[h>>>24]<<24|f[k>>>16&255]<<16|f[n>>>8&255]<<8|f[g&255])^c[p++];t=(f[k>>>24]<<24|f[n>>>16&255]<<16|f[g>>>8&255]<<8|f[h&255])^c[p++];n=(f[n>>>24]<<24|f[g>>>16&255]<<16|f[h>>>8&255]<<8|f[k&255])^c[p++];a[b]=q;a[b+1]=s;a[b+2]=t;a[b+3]=n},keySize:8});u.AES=p._createHelper(d)})();