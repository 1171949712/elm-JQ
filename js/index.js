/*if(location.hash) {
	var hash = location.hash; //hash = #rlist
	$(hash).show();
	$(hash).siblings().hide();
}
window.onhashchange = function(){
	var hash = location.hash;
	$(hash).show();
	$(hash).siblings().hide();
}*/

var hashMap = {
	'address':searchObj,
	'citylist':citylistObj,
	'rlist':rlistObj,
	'detail':detailObj
};

var cacheMap = {};

var prevModule = null;
var curModule = null;

function routeController(hash){
	var khash = '';
	var module = hashMap[hash] || hashMap['address'];

	if(hash.indexOf('address') != -1){
		khash = 'address';
		module = searchObj;
		module.changeCity(hash);
	}
	if(hash.indexOf('rlist') != -1){
		khash = 'rlist';
		module = rlistObj;
		module.loadReslist(hash);
	}

	prevModule = curModule;
	curModule = module;
	if(prevModule){
		prevModule.leave();
	}
	curModule.enter();
	if(!cacheMap[khash]){
		curModule.init();
		cacheMap[khash] = true;
	}
	
}  

if(location.hash){
	var hash = location.hash.slice(1);
	routeController(hash);
}else{
	routeController('address');
}

//hash值改变就调用路由函数展示页面
window.onhashchange = function(){
	var hash = location.hash.slice(1);
	routeController(hash);
}

var swiper = new Swiper('.swiper-container', {
    pagination: '.swiper-pagination',
    slidesPerView: 1,
    paginationClickable: true,
    spaceBetween: 30,
    loop: true
});

