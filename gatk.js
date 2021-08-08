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

/*!
 * GA event tracker JavaScript Library
 * http://singleview.co.kr/
 *
 * Copyright 2015, 2016, 2017 singleview.co.kr
 * Released under the commercial license
 */

var _g_sGtakVersion = '0.3.0';
var _g_sGatkVersionDate = '2017-04-23';
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
				_sendGaEventWithoutInteraction( 'banner', 'displayed', sCurObjId );
				_g_aImageElement[_g_aImageElement.length] = sCurObjId;
			}
		}
	}
	if( eval == 'above' ) 
		return ((y < (vpH + st)));
}

function sendDisplayEventGatk( sDisplayedObject )
{
	if( sDisplayedObject === null || sDisplayedObject === undefined || sDisplayedObject.length == 0 )
		return;
	_sendGaEventWithoutInteraction( 'banner', 'displayed', sDisplayedObject );
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
	//console.log( _SHA256('svapi.co.kr:5018'));
	for (var i in aSrc)
	{
		// http://rubular.com/r/KByADagF3Z
		if (/[sS][vV][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+:[0-9]+/.test(aSrc[i])) // match 'svapi.co.kr:5018'
		{
			//if( _SHA256(aSrc[i]) == 'ce79286b7fc9cf82f942b036124fb8cd5dd8e3df6083271118d7cd758b452c8a' ) // singleview.co.kr
			if( _SHA256(aSrc[i]) == '65d88890ec2b561bf40a8f13b1e469f5e75b3cf68aa63d0e01a7605ff7ffe20f' ) // svapi.co.kr:5018
			{
//console.log('valid server');
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
		ga('require', 'linkid');
		ga('require', 'displayfeatures');
		return true;
	},
	close : function()
	{
		ga('send', 'pageview');
		this._runCollector();
		return true;
	},
	getVersion : function()
	{
		console.log( 'gatk ver ' + _g_sGtakVersion + ' on ' + _g_sGatkVersionDate + ' by singleview.co.kr' );
	},
	_runCollector : function()
	{
		var sEncodedUserAgent = encodeURI( navigator.userAgent );
		var sCurrentUrl = window.location.href.toString().split( window.location.host )[1];
		var sEncodedCurrentUri = encodeURIComponent( sCurrentUrl );
		var oImg = document.createElement( 'IMG' );
		//oImg.src = 'http://singleview.co.kr/singleview.gif?hn=' + window.location.host + '&qs=' +  sEncodedCurrentUri + '&ua=' + sEncodedUserAgent;
		oImg.src = 'https://svapi.co.kr:5018/collect?hn=' + window.location.host + '&qs=' +  sEncodedCurrentUri + '&ua=' + sEncodedUserAgent;		
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
		if( !_reflect() )
			return;

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
		//oImg.src = 'http://singleview.co.kr/conversion.gif?hn=' + window.location.host + '&at=' + sActionType  + '&rv=' + nRevenue + '&qs=' +  sEncodedCurrentUri + '&ua=' + sEncodedUserAgent;
		oImg.src = 'https://svapi.co.kr:5018/conversion?hn=' + window.location.host + '&at=' + sActionType  + '&rv=' + nRevenue + '&qs=' +  sEncodedCurrentUri + '&ua=' + sEncodedUserAgent;
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