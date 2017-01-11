var detailObj = Object.create(searchObj);
detailObj = $.extend(detailObj,{
	name:'餐厅详情页',
	dom:$('#detail'),
	//初始化
	init:function(){
		this.bindEvent();
		this.dom.on('touchmove',function(event){
			event.preventDefault();
		},false)
	},
	//绑定事件
	bindEvent: function(){
		$('.leftnav').on('click', 'li', function(event){
			// console.log('我被点击了'); 	
			$(this).addClass('cont-left-active').siblings().removeClass('cont-left-active');
			var selector = '[data-title="'+ this.innerHTML +'"]';
			// console.log(selector);
			var curelem = $(selector).get(0);
			rightScroll.scrollToElement(curelem,500);
		})
		// 添加商品数量
		$('.cont-right').on('click', '.plus', function(event){
			var now_num = +$(this).siblings('.num').html();
			// console.log($(this)[0])
			$(this).siblings('.minus').css('display','inline-block');
			now_num += 1;
			// console.log($(this).parents('.food-info').find('.foodname').html());
			$(this).siblings('.num').html(now_num);
			Store('shopcar_info',{
				food_name: $(this).parents('.food-info').find('.foodname').html(),
				price: 
			})
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
		})
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
							'<p>'+ send_method +'<span class="split">/</span>'+ res.order_lead_time +'分钟送达<span class="split">/</span>'+ res.piecewise_agent_fee.tips +'</p>'+
							'<p>'+ res.activities[0].description +'</p>'+
						'</div>'+
					'</div>'+
					'<div class="header-tip">'+
						'<span class="tolded">公告</span><p>欢迎光临，用餐高峰期请提前下单，谢谢。</p>'+
						'<span class="icon-right">></span>'+
					'</div>'
				$('.shop-header').html(str);
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
			str += '<li>'+ res[i].name +'</li>'
		}
		$('.leftnav').html(str);
		$('.leftnav').find('li').eq(0).addClass('cont-left-active');
		//初始化左边滚动条
		window.leftScroll = new IScroll('.cont-left', {
			scrollbars: false, //不显示滚动条
			preventDefault: false, //不阻止点击事件
			bounce: false, //不让其弹动
			mouseWheel: true
		});
	},
	//渲染右边板块
	renderRightPane: function(res){
		var str = '';
		for(var i=0; i<res.length; i++){
			str += 
				'<div class="singleItem">'+
					'<h2 data-title="'+ res[i].name +'">'+ res[i].name +'<span class="description">'+ res[i].description +'</span></h2>'+
						this.renderSingleList(res[i].foods) + //渲染单个fooditem
				'</div>'
		}
		$('.cont-right').html(str);
		//初始化右边滚动条
		window.rightScroll = new IScroll('.right-wrap', {
			scrollbars: false,
			probeType: 2,
			preventDefault: false, //不阻止点击事件
			bounce: true,
			mouseWheel: true,

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
			var img_path = list[i].image_path;
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
						'<h2 class="foodname">'+ list[i].name +'</h2>'+
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