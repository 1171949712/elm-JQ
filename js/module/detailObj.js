var detailObj = Object.create(searchObj);
detailObj = $.extend(detailObj,{
	name:'餐厅详情页',
	dom:$('#detail'),

	//初始化
	init:function(){
		// console.log(1)
		this.bindEvent();
		this.dom.on('touchmove',function(event){
			event.preventDefault();
		},false);

	},

	leave:function(){
		this.dom.hide();
		localStorage.removeItem('shopcar_info');
	},

	//绑定事件
	bindEvent: function(){
		// 点击跳动
		$('.cont-left').on('click', 'li', function(event){
			// console.log('我被点击了'); 	
			$(this).addClass('cont-left-active').siblings().removeClass('cont-left-active');
			var selector = '[data-title="'+ $(this).find('.left-text').html() +'"]';
			// console.log(selector);
			var curelem = $(selector).get(0);
			rightScroll.scrollToElement(curelem, 500);
		})
		// 添加商品数量

		var obj = {};
		/*if(Store('shopcar_info')){
			obj = Store('shopcar_info');
		}*/
		var me = this;
		$('.cont-right').on('click', '.plus', function(event){
			var now_num = +$(this).siblings('.num').html();	
			// console.log($(this)[0])
			$(this).siblings('.minus').css('display','inline-block');
			now_num += 1;
			// console.log($(this).parents('.food-info').find('.foodname').html());
			$(this).siblings('.num').html(now_num);
			var food_name = $(this).parents('.food-info').find('.foodname').html();
			var price = +((+$(this).parents().siblings('.pri').html() * now_num).toFixed(1));
			obj[food_name] = [now_num,price];

			// console.log(obj);
			Store('shopcar_info', obj);
			me.renderShopcar();
		})
		// 减少商品数量
		$('.cont-right').on('click', '.minus', function(event){
			var now_num = +$(this).siblings('.num').html();
			now_num -= 1;
			// console.log(now_num);
			if(now_num <= 0){
				$(this).siblings('.num').html('');
				$(this).css('display','none');
			}else{
				$(this).siblings('.num').html(now_num);
			}	
			var food_name = $(this).parents('.food-info').find('.foodname').html();
			var price = +((+$(this).parents().siblings('.pri').html() * now_num).toFixed(1));
			obj[food_name] = [now_num,price];
			// console.log(obj);
			if(now_num == 0){
				delete obj[food_name];
			}
			Store('shopcar_info', obj);	
			if($.isEmptyObject(obj)){
				// console.log('这是一个空对象')
				localStorage.removeItem('shopcar_info');
			}
			me.renderShopcar();
		})
	},

	//渲染购物车
	renderShopcar: function(){
		// console.log($('.send-fee').html())
		var localdata = Store('shopcar_info');
		// console.log(localdata);
		var sum_price = 0;
		var num = 0;
		for(var key in localdata){
			// console.log(localdata[key][1]);
			var selector = '[data-foodname="' + key + '"]';
			var name_h2 = $(selector).eq(0).parents('.singleItem').find('h2[data-title]').attr('data-title');
			var left_show = $('.leftnav').find('[data-left-title="'+ name_h2 +'"]').eq(0).find('.left-num');
			left_show.show();

			left_show.html()
			// console.log(name_h2);
			sum_price += localdata[key][1];
			num += localdata[key][0];
		}
		// console.log(num);
		$('.money').html('¥' + sum_price);
		if($('.money').html() != '¥0'){
			$('.icon-car').addClass('active_car');
			$('.topay').addClass('active_pay');
		}else{
			$('.icon-car').removeClass('active_car');
			$('.topay').removeClass('active_pay');
		}

	},

	//加载页面数据
	loadResdetail: function(hash){
		this.id = hash.split('-')[1];
		this.lat = hash.split('-')[2];
		this.lng = hash.split('-')[3];
		this.loadHeader();//加载头部数据
		this.loadContent();	//加载内容数据		
	},

	//加载头部数据
	loadHeader:function(){
		var me = this;
		$.ajax({
			url: '/shopping/restaurant/' + this.id,
			data: {
				/*extras[]:activities
				extras[]:album
				extras[]:license
				extras[]:identification
				extras[]:statistics*/
				extras: ['activities', 'album', 'license', 'identification', 'statistics'],
				latitude: this.lat,
				longitude: this.lng
			},
			type: 'get',
			success: function(res){
				console.log(res);
				var str = '';
				var img_path = res.image_path;
				var a = img_path.slice(0,1);
				var b = img_path.slice(1,3);
				var c = img_path.slice(3,32);
				var d = img_path.slice(32);
				img_path = a + '/' + b + '/' + c + d + '.' + d;
				// console.log(img_path);
				if(res.delivery_mode){
					send_method = res.delivery_mode.text;
				}else{
					send_method = '商家配送';
				}
				str = 
					'<div class="header-main">'+
						'<img src="https://fuss10.elemecdn.com/'+ img_path +'" alt="">'+
						'<div class="shop-info">'+
							'<h1>'+ res.name +'</h1>'+
							'<p>'+ send_method +'<span class="split">/</span>'+ res.order_lead_time +'分钟送达<span class="split">/</span><span class="send-fee">'+ res.piecewise_agent_fee.tips +'</span></p>'+
							'<p>'+ res.activities[0].description +'</p>'+
						'</div>'+
					'</div>'+
					'<div class="header-tip">'+
						'<span class="tolded">公告</span><p>欢迎光临，用餐高峰期请提前下单，谢谢。</p>'+
						'<span class="icon-right">></span>'+
					'</div>'
				$('.shop-header').html(str);
				$('.send-info').html(res.piecewise_agent_fee.tips);
			},
			error: function(){
				console.log('failed');
			}
		})
	},

	//加载内容数据	
	loadContent: function(){
		var me = this;
		$.ajax({
			url: '/shopping/v2/menu?restaurant_id=' + this.id,
			type: 'get',
			success: function(res){
				console.log(res);
				me.renderLeftPane(res);//渲染左边板块
				me.renderRightPane(res);//渲染右边板块
				//渲染本地缓存
				/*var localObj = Store('shopcar_info');
				if(localObj){
					// console.log('有本地缓存')
					// console.log(localObj)
					me.renderShopcar();
					for(var key in localObj){
						var selector = '[data-foodname="' + key + '"]';
						// console.log($(selector)[0]);
						$(selector).eq(0).siblings('.price').find('.num').html(localObj[key][0]);
						$(selector).siblings('.price').find('.minus').css('display', 'inline-block');
					}
				}*/
			},
			error: function(){
				console.log('failed');
			}
		})
	},

	//渲染左边板块
	renderLeftPane: function(res){
		var str = '';
		for(var i=0; i<res.length; i++){
			str += '<li data-left-title="'+ res[i].name +'"><span class="left-text">'+ res[i].name +'</span><span class="left-num"></span></li>'
		}
		$('.leftnav').html(str);
		$('.leftnav').find('li').eq(0).addClass('cont-left-active');
	},

	//渲染右边板块
	renderRightPane: function(res){
		var str = '<div class="right-wrap">';
		for(var i=0; i<res.length; i++){
			str += 
				'<div class="singleItem">'+
					'<h2 data-title="'+ res[i].name +'">'+ res[i].name +'<span class="description">'+ res[i].description +'</span></h2>'+
						this.renderSingleList(res[i].foods) + //渲染单个fooditem
				'</div>'
		}
		str += '</div>'
		$('.cont-right').html(str);
		//初始化滚动条
		window.leftScroll = new IScroll('.cont-left', {
			scrollbars: false, //不显示滚动条
			preventDefault: false, //不阻止点击事件
			bounce: false, //不让其弹动
			probeType: 2,
			mouseWheel: true
		});
		window.rightScroll = new IScroll('.cont-right', {
			scrollbars: false,
			probeType: 2,//设置滚动条的灵敏度,监听滚动的事件
			preventDefault: false, //不阻止点击事件
			bounce: true,
			mouseWheel: true
		})
		//电梯效果
		this.foodItemHeight = [];
		var sum = 0;
		var me = this;
		$('.singleItem').each(function(index, elem){
		  // console.log($(elem).height())
		  sum += $(elem).height();
		  me.foodItemHeight.push(sum);
		  // console.log(me.foodItemHeight);
		})
		var navLi = $('.leftnav').find('li');
		rightScroll.on('scroll', function(event){
			// console.log('滚动了');
			// console.log(rightScroll.y);
			for(var i=0; i<me.foodItemHeight.length; i++){
				if(Math.abs(rightScroll.y) <= me.foodItemHeight[i]){
					navLi.removeClass('cont-left-active');
					navLi.eq(i).addClass('cont-left-active');
					break;
				}
			}
		})
	},

	//渲染单个fooditem里的内容
	renderSingleList: function(list){
		var str = '';
		for(var i=0; i<list.length; i++){		
			if(list[i].image_path){
				var img_path = list[i].image_path;	
			}else{
				var img_path = '';
			}
			var a = img_path.slice(0,1);
			var b = img_path.slice(1,3);
			var c = img_path.slice(3,32);
			var d = img_path.slice(32);
			img_path = a + '/' + b + '/' + c + d + '.' + d;
			// console.log(img_path);
			str += 
				'<div class="food-item">'+
					'<div class="food-img">'+
						'<img src="//fuss10.elemecdn.com/'+ img_path +'" alt="">'+
					'</div>'+
					'<div class="food-info">'+
						'<h2 data-foodname="' + list[i].name + '" class="foodname">'+ list[i].name +'</h2>'+
						'<p class="incloud">'+ list[i].description +'</p>'+
						'<p class="month-sale">月售'+ list[i].month_sales +'份<span>好评率'+ list[i].satisfy_rate +'%</span></p>'+
						'<div class="price">'+
							'<i>¥</i><i class="pri">'+ list[i].specfoods[0].price +'</i>'+
							'<div class="count">'+
								'<span class="minus">-</span>'+
								'<em class="num"></em>'+
								'<span class="plus">+</span>'+
							'</div>'+
						'</div>'+
					'</div>'+
				'</div>'
		}
		return str;
	}

})