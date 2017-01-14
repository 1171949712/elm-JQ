/*

单个购物车的相关操作

单个购物车对象 

会产生很多个单个购物车对象

工厂模式  构造函数

author：刘政，time：2017.1.13

*/

function singleCart(obj){
	this.name = obj.name;
	this.food_id = obj.specfoods[0].food_id;
	this.image_path = obj.image_path;
	this.description = obj.description;
	this.month_sales = obj.month_sales;
	this.satisfy_rate = obj.satisfy_rate;
	this.price = obj.specfoods[0].price;
	this.num = obj.num || 0;
	this.selector = '[data-foodid="'+this.food_id+'"]';
}
singleCart.prototype.changeNum = function(){
	$(this.selector).find('.num').html(this.num);
	if(this.num === 0){
		$(this.selector).find('.minus').hide();
		$(this.selector).find('.num').html('');
		return;
	}
	$(this.selector).find('.minus').css('display','inline-block');
}
singleCart.prototype.plus = function(){
	this.num ++;
	this.changeNum();
}
singleCart.prototype.minus = function(){
	this.num --;
	this.changeNum();
}
singleCart.prototype.render = function(){
	// 渲染单个购物车的外貌
	/*if(this.image_path){
		var img_path = this.image_path;	
	}else{
		var img_path = '';
	}*/
	var img_path = this.image_path || '';
	var a = img_path.slice(0,1);
	var b = img_path.slice(1,3);
	var c = img_path.slice(3,32);
	var d = img_path.slice(32);
	img_path = a + '/' + b + '/' + c + d + '.' + d;
	// console.log(img_path);
	if(this.num === 0){
		this.num = '';
	}
	return '<div data-foodid="'+ this.food_id +'" class="food-item">'+
			'<div class="food-img">'+
				'<img src="//fuss10.elemecdn.com/'+ img_path +'" alt="">'+
			'</div>'+
			'<div class="food-info">'+
				'<h2 class="foodname">'+ this.name +'</h2>'+
				'<p class="incloud">'+ this.description +'</p>'+
				'<p class="month-sale">月售'+ this.month_sales +'份<span>好评率'+ this.satisfy_rate +'%</span></p>'+
				'<div class="price">'+
					'<i>¥</i><i class="pri">'+ this.price +'</i>'+
					'<div class="count">'+
						'<span class="minus">-</span>'+
						'<em class="num">'+ this.num +'</em>'+
						'<span class="plus">+</span>'+
					'</div>'+
				'</div>'+
			'</div>'+
		'</div>'
}
singleCart.prototype.singleRender = function(){
	//渲染购物车列表中的单个购物车的外貌
	var str = 
		'<div data-foodid="'+ this.food_id+'" class="singlefood">'+
			'<span class="foodname">'+ this.name +'</span>'+
			'<div class="price">'+
				'<i>¥</i><i class="pri">'+ this.price + '</i>'+
				'<div class="count">'+
					'<span class="minus">-</span>'+
					'<em class="num">'+ this.num +'</em>'+
					'<span class="plus">+</span>'+
				'</div>'+
			'</div>'+
		'</div>'
	return str;
}
