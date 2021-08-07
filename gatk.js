/*!
 * GA event tracker JavaScript Library v0.0.2
 * http://singleview.co.kr/
 *
 * Copyright 2015, 2015 singleview.co.kr
 * Released under the commercial license
 *
 * Date: 2015-05-02T15:27Z
 */

var version = '0.0.2';
var 
	g_sPrefixViewDetail = 'vd',
	g_sPrefixBuyImmediately = 'bi',
	g_sPrefixAddToCart = 'atc',
	g_sPrefixRemoveFromCart = 'rfc',
	g_sPrefixCheckoutSelected = 'cs',
	g_sPrefixCheckoutAll = 'ca',
	g_sPrefixPurchased = 'pur',
	g_sPrefixRefunded = 'ref';

var gatkList = 
{
	_g_nListPosition : 1,
	_g_sListTitle : 'undefined',
	_g_oProductInfo : [],

	init : function( sListTitle, nCurrentPage, nItemsPerPag )
	{
		ga('require', 'ec');
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
				_sendGaEventWithoutInteraction( 'link', 'clicked', g_sPrefixViewDetail + '_' + this._g_oProductInfo[i].id+'_'+this._g_oProductInfo[i].name, '' );
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
		ga('require', 'ec');
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
		_sendGaEventWithoutInteraction( 'button', 'clicked', g_sPrefixBuyImmediately + '_' + this._g_oProductInfo[0].id + '_' + this._g_oProductInfo[0].name, nTotalPrice );
		return true;
	},
	patchAddToCart : function( nTotalQuantity )
	{
		var nTotalPrice = nTotalQuantity * this._g_oProductInfo[0].price;
		_sendGaEventWithoutInteraction( 'button', 'clicked', g_sPrefixAddToCart + '_' + this._g_oProductInfo[0].id + '_' + this._g_oProductInfo[0].name, nTotalPrice );
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
		ga('require', 'ec');
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
					_sendGaEventWithoutInteraction( 'checkout', 'started', g_sPrefixCheckoutSelected + '_' + this._g_oProductInfo[i].id+'_' + this._g_oProductInfo[i].name, this._g_oProductInfo[i].price * this._g_oProductInfo[i].quantity );
					aCartSrl.shift();
				}
			}
		}
	},
	checkoutAll : function()
	{
		//_sendGaEventWithoutInteraction( 'checkout', 'started', 'checkout_all', nTotalPrice );
		var nElement = _g_oProductInfo.length;
		var nTotalPrice = 0;
		for( var i = 0; i < nElement; i++ )
		{
			ga('ec:addProduct', { // Provide product details in an productFieldObject.
				'id': _g_oProductInfo[i].id, // Product ID (string).
				'name': _g_oProductInfo[i].name, // Product name (string).
				'category': _g_oProductInfo[i].category, // Product category (string).
				'brand': _g_oProductInfo[i].brand, // Product brand (string).
				'variant': _g_oProductInfo[i].variant, // Product variant (string).
				'price': _g_oProductInfo[i].price, // Product price (currency).
				'quantity': _g_oProductInfo[i].quantity // Product quantity (number).
			});
			nTotalPrice += _g_oProductInfo[i].price * _g_oProductInfo[i].quantity;
		}
		this._sendCheckoutAction();
		_sendGaEventWithoutInteraction( 'checkout', 'started', g_sPrefixCheckoutAll, nTotalPrice ); // Send data using an event after set ec-action
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
					_sendGaEventWithoutInteraction( 'button', 'clicked', g_sPrefixRemoveFromCart + '_' + this._g_oProductInfo[i].id + '_' + this._g_oProductInfo[i].name, nTotalPrice );
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
//console.log('checkout with step');
					ga('ec:setAction','checkout', {	'step': nStepNumber });
					return;
				}
			case 2:
				if( arguments[0] === null || arguments[0] === undefined || arguments[0].length == 0 ||
					arguments[1] === null || arguments[1] === undefined || arguments[1].length == 0 )
					break;
				else
				{
//console.log('checkout with step and option');
					ga('ec:setAction','checkout', {
						'step': nStepNumber,   // A value of 1 indicates this action is first checkout step. step number is related with ecommerce->shopping analysis -> checkout behavior
						'option': sOption   // Used to specify additional info about a checkout stage, e.g. payment method.
					});
					return;
				}
			default:
				break;
		}
//console.log('simple checkout');	
		ga('ec:setAction','checkout');
	}

}

var gatkPurchase = 
{
	_g_oProductInfo : [],
	init : function()
	{
		ga('require', 'ec');
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

			_sendGaEventWithoutInteraction( 'checkout', 'purchased', g_sPrefixPurchased + '_' + this._g_oProductInfo[i].id + '_' + this._g_oProductInfo[i].name, this._g_oProductInfo[i].price * this._g_oProductInfo[i].quantity );
		}
	}
}

var gatkMypage = 
{
	_g_oProductInfo : [],
	init : function()
	{
		ga('require', 'ec');
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
			_sendGaEventWithoutInteraction( 'checkout', 'refunded', g_sPrefixRefunded + '_' + this._g_oProductInfo[i].id + '_' + this._g_oProductInfo[i].name, nRefundedAmnt );
		}
		ga('ec:setAction', 'refund', {
			'id': nOrderSrl    // Transaction ID is only required field for full refund.
		});
	}
}

var _g_sDebugTargetHostNmae = 'lashev0an';
var _g_sOperatingHostName = window.location.hostname;
var _g_bDebug = false;
var _g_aImageElement = new Array();
var _g_aItemPosition = new Array();
var _g_oProductInfo = [];
var _g_nListPosition = 1;
var _g_sListTitle = 'undefined';

if( ~_g_sOperatingHostName.indexOf( _g_sDebugTargetHostNmae )  ) 
{
	_g_bDebug = true;
}

function loadEcommerceGatkEc()
{
	ga('require', 'ec');
}

function setItemListViewEnv( sListTitle, nCurrentPage, nItemsPerPage )
{
	if( nCurrentPage === null || nCurrentPage === undefined || nCurrentPage.length == 0 )
		nCurrentPage = 1;

	if( nCurrentPage > 1 )
		_g_nListPosition = nItemsPerPage * ( nCurrentPage - 1 ) + 1;

	if( sListTitle !== null && sListTitle !== undefined && sListTitle.length > 0 )
		_g_sListTitle = sListTitle;
}

function sendItemListViewdEventGatkEc( nItemSrl, sItemName, sCategory, sBrand, sVariant )
{
	_g_aItemPosition[ nItemSrl ] = _g_nListPosition;
	ga('ec:addImpression', {
		'id': nItemSrl, // Product details are provided in an impressionFieldObject.
		'name': sItemName,
		'category': sCategory,
		'brand': sBrand,
		'variant': sVariant,
		'list': _g_sListTitle,
		'position': _g_nListPosition++ // 'position' indicates the product position in the list.
	});
}

// Called when a link to a product is clicked.
function sendLinkToItemDetailClickedEvent( nItemSrl, sItemName, sCategory, sBrand, sVariant ) 
{
	_sendGaEventWithoutInteraction( 'link', 'clicked', 'view_detail_'+sItemName, '' );

	ga('ec:addProduct', {
		'id': nItemSrl,
		'name': sItemName,
		'category': sCategory,
		'brand': sBrand,
		'variant': sVariant,
		'position': _g_aItemPosition[ nItemSrl ]
	});
	ga('ec:setAction', 'click', { list: _g_sListTitle } );
	//_sendGaEventWithoutInteraction( 'link', 'clicked', 'view_detail_'+sItemName, '' );
}

function sendItemDetailViewdEventGatkEc( nItemSrl, sItemName, sCategory, sBrand, sVariant ) 
{
	ga('ec:addProduct', {               // Provide product details in an productFieldObject.
		'id': nItemSrl,                   // Product ID (string).
		'name': sItemName, // Product name (string).
		'category': sCategory,            // Product category (string).
		'brand': sBrand,                // Product brand (string).
		'variant': sVariant,               // Product variant (string).
		'position': 1,                    // Product position (number).
	});
	ga('ec:setAction', 'detail');      // Detail action.
}

function sendBuyimmediateEventGatkEc( sItemName, nTotalPrice ) 
{
	_sendGaEventWithoutInteraction( 'button', 'clicked', 'buy_immediate_'+sItemName, nTotalPrice );
}

function sendAddtocartEventGatkEc( nItemSrl, sItemName, sCategory, sBrand, sVariant, nItemPrice, nTotalQuantity, nTotalPrice ) 
{
	_sendGaEventWithoutInteraction( 'button', 'clicked', 'add_to_cart_'+sItemName, nTotalPrice );
	ga('ec:addProduct', {
		'id': nItemSrl,
		'name': sItemName,
		'category': sCategory,
		'brand': sBrand,
		'variant': sVariant,
		'price': nItemPrice,
		'quantity': nTotalQuantity
    });
    ga('ec:setAction', 'add');
	//_sendGaEventWithoutInteraction( 'button', 'clicked', 'add_to_cart_'+sItemName, nTotalPrice );
}
function sendRemoveFromcartEventGatkEc( nItemSrl, sItemName, sCategory, sBrand, sVariant, nItemPrice, nTotalQuantity, nTotalPrice ) 
{
	_sendGaEventWithoutInteraction( 'button', 'clicked', 'remove_from_cart_'+sItemName, nTotalPrice );
	ga('ec:addProduct', {
		'id': nItemSrl,
		'name': sItemName,
		'category': sCategory,
		'brand': sBrand,
		'variant': sVariant,
		'price': nItemPrice,
		'quantity': nTotalQuantity
    });
    ga('ec:setAction', 'remove');
	//_sendGaEventWithoutInteraction( 'button', 'clicked', 'remove_from_cart_'+sItemName, nTotalPrice );
}

function stackItemInfoGatk( nCartSrl, nItemSrl, sItemName, sCategory, sBrand, sVariant, nItemPrice, nTotalQuantity, sCoupon, nPosition )
{
	// object literal notation to create your structures
	_g_oProductInfo.push({ cartid: nCartSrl, id: nItemSrl, name: sItemName, category: sCategory, brand: sBrand, variant: sVariant, price: nItemPrice, quantity: nTotalQuantity, coupon: sCoupon, position: nPosition  });
}

function sendCheckoutSelectedEventGatkEc( aCartSrl )
{
	var nStackedCartElement = _g_oProductInfo.length;
	var nSelectedCartElement = 0;
	var nTotalPrice = 0;
	for( var i = 0; i < nStackedCartElement; i++ )
	{
		nSelectedCartElement = aCartSrl.length;
		for( var j = 0; j < nSelectedCartElement; j++ )
		{
			if( aCartSrl[j] != '' && _g_oProductInfo[i].cartid == aCartSrl[j] )
			{
				ga('ec:addProduct', { // Provide product details in an productFieldObject.
					'id': _g_oProductInfo[i].id, // Product ID (string).
					'name': _g_oProductInfo[i].name, // Product name (string).
					'category': _g_oProductInfo[i].category, // Product category (string).
					'brand': _g_oProductInfo[i].brand, // Product brand (string).
					'variant': _g_oProductInfo[i].variant, // Product variant (string).
					'price': _g_oProductInfo[i].price, // Product price (currency).
					'quantity': _g_oProductInfo[i].quantity // Product quantity (number).
				});
				nTotalPrice += _g_oProductInfo[i].price * _g_oProductInfo[i].quantity;
				aCartSrl.shift();
			}
		}
	}
	//_sendGaEventWithoutInteraction( 'checkout', 'started', 'checkout_multi', nTotalPrice );
}

function sendCheckoutAllEventGatkEc()
{
	_sendGaEventWithoutInteraction( 'checkout', 'started', 'checkout_multiple', nTotalPrice );

	var nElement = _g_oProductInfo.length;
	var nTotalPrice = 0;
	for( var i = 0; i < nElement; i++ )
	{
		ga('ec:addProduct', { // Provide product details in an productFieldObject.
			'id': _g_oProductInfo[i].id, // Product ID (string).
			'name': _g_oProductInfo[i].name, // Product name (string).
			'category': _g_oProductInfo[i].category, // Product category (string).
			'brand': _g_oProductInfo[i].brand, // Product brand (string).
			'variant': _g_oProductInfo[i].variant, // Product variant (string).
			'price': _g_oProductInfo[i].price, // Product price (currency).
			'quantity': _g_oProductInfo[i].quantity // Product quantity (number).
		});

		nTotalPrice += _g_oProductInfo[i].price * _g_oProductInfo[i].quantity;
	}

console.log( nTotalPrice );
	//_sendGaEventWithoutInteraction( 'checkout', 'started', 'checkout_multiple', nTotalPrice );
}

// will change method name to sendCheckoutSingleEventGatkEc
function sendCheckoutEventGatkEc( nItemSrl, sItemName, sCategory, sBrand, sVariant, nItemPrice, nTotalQuantity )
{
	_sendGaEventWithoutInteraction( 'checkout', 'started', 'checkout_'+sItemName, nTotalPrice );
	ga('ec:addProduct', { // Provide product details in an productFieldObject.
		'id': nItemSrl, // Product ID (string).
		'name': sItemName, // Product name (string).
		'category': sCategory, // Product category (string).
		'brand': sBrand, // Product brand (string).
		'variant': sVariant, // Product variant (string).
		'price': nItemPrice, // Product price (currency).
		'quantity': nTotalQuantity // Product quantity (number).
	});
	var nTotalPrice = nItemPrice * nTotalQuantity;
	// send pageview 전에 send event 명령 수행하면 EC 정보가 날아가버림
	//_sendGaEventWithoutInteraction( 'checkout', 'started', 'checkout_'+sItemName, nTotalPrice );
}

function sendCheckoutActionGatkEc( nStepNumber, sOption )
{
	switch( arguments.length )
	{
		case 1:
			if( arguments[0] === null || arguments[0] === undefined || arguments[0].length == 0 )
				break;
			else
			{
//console.log('checkout with step');
				ga('ec:setAction','checkout', {	'step': nStepNumber });
				return;
			}
		case 2:
			if( arguments[0] === null || arguments[0] === undefined || arguments[0].length == 0 ||
				arguments[1] === null || arguments[1] === undefined || arguments[1].length == 0 )
				break;
			else
			{
//console.log('checkout with step and option');
				ga('ec:setAction','checkout', {
					'step': nStepNumber,   // A value of 1 indicates this action is first checkout step. step number is related with ecommerce->shopping analysis -> checkout behavior
					'option': sOption   // Used to specify additional info about a checkout stage, e.g. payment method.
				});
				return;
			}
		default:
			break;
	}
//console.log('simple checkout');	
	ga('ec:setAction','checkout');
}

function sendPurchaseEventGatkEc( nItemSrl, sItemName, sCategory, sBrand, sVariant, nItemPrice, sCoupon, nTotalQuantity )
{
	_sendGaEventWithoutInteraction( 'checkout', 'purchased', 'purchase_'+sItemName, nTotalPrice );
	ga('ec:addProduct', { // Provide product details in an productFieldObject.
		'id': nItemSrl, // Product ID (string).
		'name': sItemName, // Product name (string).
		'category': sCategory, // Product category (string).
		'brand': sBrand, // Product brand (string).
		'variant': sVariant, // Product variant (string).
		'price': nItemPrice, // Product price (currency).
		'coupon': sCoupon,  // Product coupon (string).
		'quantity': nTotalQuantity // Product quantity (number).
	});
	var nTotalPrice = nItemPrice * nTotalQuantity;
	//_sendGaEventWithoutInteraction( 'checkout', 'purchased', 'purchase_'+sItemName, nTotalPrice );
}

function sendPurchaseActionGatkEc( nOrderSrl, sAffiliation, nRevenue, nShippingCost, sCoupon )
{
	var nTaxAmnt = nRevenue * 0.1;

	ga('ec:setAction', 'purchase', { // Transaction details are provided in an actionFieldObject.
		'id': nOrderSrl,             // (Required) Transaction id (string).
		'affiliation': sAffiliation, // Affiliation (string).
		'revenue': nRevenue,         // Revenue (currency).
		'tax': nTaxAmnt,             // Tax (currency).
		'shipping': nShippingCost,   // Shipping (currency).
		'coupon': sCoupon            // Transaction coupon (string).
	});
}

// Refund an entire transaction.
function sendRefundEntireActionGatkEc( nOrderSrl, nRefundedAmnt )
{
	_sendGaEventWithoutInteraction( 'checkout', 'refunded', 'refunded_'+nOrderSrl, nRefundedAmnt );
	ga('ec:setAction', 'refund', {
		'id': nOrderSrl    // Transaction ID is only required field for full refund.
	});
	//_sendGaEventWithoutInteraction( 'checkout', 'refunded', 'refunded_'+nOrderSrl, nRefundedAmnt );
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

function sendClickEventGatk( sAction, sPageTitle, sLocation, sWindow )
{
	if( sWindow === null || sWindow === undefined || sWindow.length == 0 )
		sWindow = 'self';
	_sendGaEventWithInteraction( sAction, 'clicked', sPageTitle );
	
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
	if( !_g_bDebug )
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
	//ga('send', 'event', 'button', 'clicked', 'add_to_cart', nTotalPrice, { 'hitCallback': function() { console.log('addCart_clicked'); }});
	if( _g_bDebug )
	{
		if( nEventValue === undefined )
			console.log( sEventCategory, sEventAction, sEventLabel );
		else
			console.log( sEventCategory, sEventAction, sEventLabel, nEventValue );
		
	}
}
// send pageview 명령 전에 send event 명령을 수행하면 queue에 적재된 EC 관련 정보들이 send event와 함께 pop되어버림
// Send data using an event just after set ec-action
function _sendGaEventWithoutInteraction( sEventCategory, sEventAction, sEventLabel, nEventValue )
{
	if( !_g_bDebug )
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
	
	if( _g_bDebug )
	{
		if( nEventValue === undefined )
			console.log( sEventCategory, sEventAction, sEventLabel );
		else
			console.log( sEventCategory, sEventAction, sEventLabel, nEventValue );
		
	}
}