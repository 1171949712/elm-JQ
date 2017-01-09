var rlistObj = Object.create(searchObj);
rlistObj = $.extend(rlistObj,{
	name:'餐厅列表页',
	dom:$('#rlist'),
	init: function(){

	},

	loadMoreList: function(){
		var me = this;
		var LastTop = $('.item-list').last().offset().top;
		var cHeight = $(window).height();
		var now_load = LastTop - cHeight;
		var offset = $('.item-list').length;
		console.log(offset);
		$(window).on('scroll',function(){
			var scroll = $(window).scrollTop();
			// console.log(scroll)
			if(scroll>now_load){
				console.log('该加载数据了') 

				$.ajax({
					url: '/shopping/restaurants',
					data: {
						latitude:me.lat,
						longitude:me.lng,
						offset:offset,
						limit:20,
						extras:['activities']
					},
					success: function(res){
						// console.log(res)
						me.resList(res);
					},
					error: function(){
						console.log('后台出错了');
					}
				})
			}
		})
	},

	resList: function(res){
		var str = '';
		for(var i=0; i<res.length; i++){
			var img_path = res[i].image_path;
			img_path = img_path.split('');
			img_path.splice(1,0,'/');
			img_path.splice(4,0,'/');
			img_path = img_path.join('');
			// console.log(img_path)
			switch (true){
				case (img_path.indexOf('jpeg') != -1):
				img_path = img_path.concat('.jpeg');
				break;
				case (img_path.indexOf('png') != -1):
				img_path = img_path.concat('.png');
				break;
				case (img_path.indexOf('jpg') != -1):
				img_path = img_path.concat('.jpg');
				break;
			}
			// console.log(img_path)
			str += 
			'<div class="item-list">' +
				'<div class="left-wrap"><img src="//fuss10.elemecdn.com/'+ img_path +'" /></div>' +
				'<div class="right-wrap">' +
					'<div class="line">' +
						'<h3><span class="brand">品牌</span><span class="name">'+ res[i].name +'</span></h3>' +
						'<i>票</i>' +
					'</div>' +
					'<div class="line">' +
						'<p class="left">' +
							'<span class="rate">'+ res[i].rating +'</span>月售'+ res[i].recent_order_num +'单' +
						'</p>' +
						'<div class="info-send">' +
							'<span class="fniao">蜂鸟专送</span><span class="zsd">准时达</span>' +
						'</div>' +
					'</div>' +
					'<div class="line">' +
						'<p class="left">¥<span>'+ res[i].float_minimum_order_amount +'</span>起送<em>/</em>配送费¥'+ res[i].float_delivery_fee +'</p>' +
						'<p class="info-d-t">' +
							'<span class="distance">'+ res[i].distance +'m</span>' +
							'<em>/</em>' +
							'<span class="time">'+ res[i].order_lead_time +'分钟</span>' +
						'</p>' +
					'</div>' +
				'</div>' +
			'</div>' 
		}
		$('.shoplist').append(str);
	},

	loadReslist: function(hash){
		var me = this;
		me.lat = hash.split('-')[1];
		me.lng = hash.split('-')[2];
		var address = hash.split('-')[3];
		address = decodeURI(address);
		$('.detail-addr').html(address);//获取地址
	
		//第一次请求餐厅列表数据
		$.ajax({
			url: '/shopping/restaurants',
			data: {
				latitude:me.lat,
				longitude:me.lng,
				offset:0,
				limit:20,
				extras:['activities']
			},
			success: function(res){
				// console.log(res)
				me.resList(res);
				// me.loadMoreList();
			},
			error: function(){
				console.log('后台出错了');
			}
		})
	}
})