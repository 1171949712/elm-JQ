var detailObj = Object.create(searchObj);
detailObj = $.extend(detailObj,{
	name:'餐厅详情页',
	dom:$('#detail'),

	//初始化
	init:function(){
		// console.log(1)
		this.bindEvent();
		cartListObj.init();//购物车列表初始化工作
		this.dom.on('touchmove',function(event){
			event.preventDefault();
		},false);
	},

	enter: function(){
		this.dom.show();
		this.cartSelectedMap = {};
		$('.cartList-foods').html('');
		$('#cartSum').html(0);
	},

	showFoodStatus: function(){
		if(this.cacheData){
			this.cartSelectedMap = this.cacheData;
			for(var key in this.cartSelectedMap){
				var curObj = this.cartMap[this.cartSelectedMap[key].food_id];
				cartListObj.addCart(curObj);
				$(this.cartSelectedMap[key].selector).find('.minus').css('display','inline-block');
			}
			this.cartSum();
		}
	},

	leave:function(){
		this.dom.hide();
		localStorage.removeItem('shopcar_info');
	},

	cartSelectedMap: {
		// 已经选购的单个购物车食物id与食物内容的映射关系表
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
		var me = this;
		$('.cont-right').on('click', '.plus', function(event){
			// console.log('我被点击了')
			var curFoodid = $(this).closest('.food-item').data('foodid');
			var curCartObj = me.cartMap[curFoodid];
			curCartObj.plus();
			if(!me.cartSelectedMap[curFoodid]){
				//如果当前商品没有被选中过，就执行添加到购物车的操作
				cartListObj.addCart(curCartObj)
			}
			me.cartSelectedMap[curFoodid] = curCartObj;//将被选择的单个购物车放到其映射表下
			me.cartSum();
		})
		// 减少商品数量
		$('.cont-right').on('click', '.minus', function(event){
			var curFoodid = $(this).closest('.food-item').data('foodid');
			var curCartObj = me.cartMap[curFoodid];
			curCartObj.minus();
			if(curCartObj.num === 0){
				// 当被选中的商品数量减到0时，删除购物车列表中的该商品
				cartListObj.delete(curCartObj);
			}
			me.cartSum();
		})
		//购物车列表显示与隐藏
		$('.shopcar').on('click',function(){
			// console.log(me.cartSelectedMap)
			if($.isEmptyObject(me.cartSelectedMap)){
				return;
			}
			cartListObj.toggle();
		})
	},

	//购物车总数量
	cartSum: function(){
		var count = 0;
		for(var key in this.cartSelectedMap){
			count += this.cartSelectedMap[key].num;
		}
		if(count === 0){
			$('#cartSum').hide();
			$('.icon-car').removeClass('active-car');
			$('.topay').removeClass('active-pay');
			return;
		}
		console.log(this);
		Store(this.id, this.cartSelectedMap);
		$('#cartSum').show();
		$('.icon-car').addClass('active-car');
		$('.topay').addClass('active-pay');
		$('#cartSum').html(count);
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
				if(res.activities.length == 0){
					description = '';
				}else {
					description = res.activities[0].description;
				}
				str = 
					'<div class="header-main">'+
						'<img src="https://fuss10.elemecdn.com/'+ img_path +'" alt="">'+
						'<div class="shop-info">'+
							'<h1>'+ res.name +'</h1>'+
							'<p>'+ send_method +'<span class="split">/</span>'+ res.order_lead_time +'分钟送达<span class="split">/</span><span class="send-fee">'+ res.piecewise_agent_fee.tips +'</span></p>'+
							'<p>'+ description +'</p>'+
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
			str += '<li><span class="left-text">'+ res[i].name +'</span><span class="left-num"></span></li>'
		}
		$('.leftnav').html(str);
		$('.leftnav').find('li').eq(0).addClass('cont-left-active');
	},

	//渲染右边板块
	renderRightPane: function(res){
		this.cacheData = Store(this.id);
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
		this.showFoodStatus();
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

	cartMap: {
		//单个购物车食物id与食物内容进行映射的关系表
	},

	//渲染单个fooditem里的内容
	renderSingleList: function(list){
		var str = '';
		var cart = null;
		for(var i=0; i<list.length; i++){
			if(this.cacheData){
				//如果缓存数据存在的话, 过去选中购物车列表的数据
				var foodid = list[i].specfoods[0].food_id;
				if(this.cacheData[foodid]) {
					list[i].num = this.cacheData[foodid].num;
				}
			}
			var cart = new singleCart(list[i]);
			this.cartMap[cart.food_id] = cart;//单个购物车食物id与食物内容进行映射
			str += cart.render();
		}
		// console.log(this.cartMap);
		return str;
	}

})