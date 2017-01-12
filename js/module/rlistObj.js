var rlistObj = Object.create(searchObj);
rlistObj = $.extend(rlistObj,{
	name: '餐厅列表页',
	dom: $('#rlist'),
	offset: 0,

	init: function(){
	},

	enter: function(){
		this.dom.show();
		this.bindEvent();
	},

	leave: function(){
		this.dom.hide();
		window.removeEventListener('scroll', this.scroll);
	},

	scroll: function(event){
		// console.log(me.dom.height())
		// console.log('滚动了'); 
		var me = rlistObj;
		if(window.scrollY + window.innerHeight === me.dom.height()){
			console.log('该加载数据了') 
			me.offset += 20;
			me.loadInfo(null,true);
		}
	},

	bindEvent: function(){
		window.addEventListener('scroll', this.scroll);//监听滚动条
		//轮播图
		var bullets = $('#position li');
		Swipe(document.getElementById('mySwipe'), {
		    auto: 0,
		    continuous: true,
		    disableScroll:false,
		    callback: function(pos) {
		      console.log('滑动结束之后所执行回调函数');
		        var i = bullets.length;
		        while (i--) {
		            bullets[i].className = ' ';
		        }
		        bullets[pos].className = 'cur';
		    }
		});

		//跳转到餐厅详情页
		$('.shoplist').on('click', '.item-list', function(event){
			var id = this.dataset.id;
			var lat = this.dataset.lat;
			var lng = this.dataset.lng;
			// console.log(id)
			location.href = '#detail-' + id + '-' + lat + '-' + lng;
		})
	},

	loadInfo: function(locObj, flag){
		//加载餐厅列表数据
		var me = this;
		locObj = locObj || Store('ele');
		$('.detail-addr').html(locObj.addr);//获取地址
		if(!!flag === false){
			$('.shoplist').html('');
		}
		$.ajax({
			url: '/shopping/restaurants',
			data: {
				latitude:locObj.lat,
				longitude:locObj.lng,
				offset:this.offset,
				limit:20,
				extras:['activities']
			},
			success: function(res){
				// console.log(res)
				var str = '';
				if(res.length === 0 || res.length <= 4){
					$('.shoplist').addClass('overlist');
				}else{
					$('.shoplist').removeClass('overlist');
				}
				for(var i=0; i<res.length; i++){
					var img_path = res[i].image_path;
					var a = img_path.slice(0,1);
					var b = img_path.slice(1,3);
					var c = img_path.slice(3,32);
					var d = img_path.slice(32);
					img_path = a + '/' + b + '/' + c + d + '.' + d;
					// console.log(img_path)
					str += 
					'<div  data-lng="'+ res[i].longitude +'" data-lat="'+ res[i].latitude +'" data-id="'+ res[i].id +'" class="item-list">' +
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
			error: function(){
				console.log('后台出错了');
			}
		})
	},

	loadReslist: function(hash){
		var me = this;
		var locInfo = Store('ele');
		if(!locInfo){
			$.ajax({
				url: 'v1/pois/' + hash.split('-')[1],
				type: 'get',
				success: function(res){
					$('.detail-addr').html(res.address);//获取地址
					var obj = {
						lat: res.latitude,
						lng: res.longitude,
						addr: res.address
					};
					Store('ele',obj);
					me.loadInfo(obj);
				}
			})
			return;
		}
		this.loadInfo(locInfo);
	},
})