var detailObj = Object.create(searchObj);
detailObj = $.extend(detailObj,{
	name:'餐厅详情页',
	dom:$('#detail'),
	init:function(){

	},

	bindEvent: function(){

	},

	loadResdetail: function(hash){
		this.id = hash.split('-')[1];
		this.lat = hash.split('-')[2];
		this.lng = hash.split('-')[3];
		this.loadHeader();
		this.loadContent();

		/*var myScroll = new Iscroll($('.cont-right'),{

		})*/
		window.leftScroll = new IScroll('.cont-left', {
			scrollbars: false, //不显示滚动条
			preventDefault: false, //不阻止点击事件
			bounce: false //不让其弹动
		});
		window.rightScroll = new IScroll('.cont-right', {
			scrollbars: false,
			preventDefault: false, //不阻止点击事件
			bounce: true
		})
	},

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
				str = 
					'<div class="header-main">'+
						'<div class="img-wrap"><img src="https://fuss10.elemecdn.com/'+ img_path +'?imageMogr/quality/80/format/webp/" alt=""></div>'+
						'<div class="shop-info">'+
							'<h1>'+ res.name +'</h1>'+
							'<p>商家配送<span class="split">/</span>'+ res.order_lead_time +'分钟送达<span class="split">/</span>'+ res.piecewise_agent_fee.tips +'</p>'+
							'<p><i>减</i>满60减15，满100减40(不与美食活动同享)（限在线支付）</p>'+
						'</div>'+
					'</div>'+
					'<div class="header-tip">'+
						'<span class="tolded">公告</span><p>'+ res.promotion_info +'</p>'+
						'<span class="icon-right">></span>'+
					'</div>'
				$('.shop-header').html(str);
			},
			error: function(){
				console.log('failed');
			}
		})
	},

	loadContent: function(){
		var me = this;
		$.ajax({
			url: '/shopping/v2/menu?restaurant_id=' + this.id,
			type: 'get',
			success: function(res){
				console.log(res);
				me.renderLeftPane(res);
				me.renderRightPane(res);
			},
			error: function(){
				console.log('failed');
			}
		})
	},

	renderLeftPane: function(res){
		var str = '';
		for(var i=0; i<res.length; i++){
			str += '<li>'+ res[i].name +'</li>'
		}
		$('.leftnav').html(str);
	},

	renderRightPane: function(res){
		var str = '';
		for(var i=0; i<res.length; i++){
			str += 
				'<div class="singleItem">'+
					'<h2>'+ res[i].name +'</h2>'+
						this.renderSingleList(res[i].foods) +
				'</div>'
		}
		$('.cont-right').html(str);
	},

	renderSingleList: function(list){
		var str = '';
		for(var i=0; i<list.length; i++){
			var img_path = list[i].image_path;
			var a = img_path.slice(0,1);
			var b = img_path.slice(1,3);
			var c = img_path.slice(3,32);
			var d = img_path.slice(32);
			img_path = a + '/' + b + '/' + c + d + '.' + d;
			console.log(img_path);
			str += 
				'<div class="food-item">'+
					'<div class="food-img">'+
						'<img src="//fuss10.elemecdn.com/'+ img_path +'?imageMogr/thumbnail/140x140/format/webp/quality/85" alt="">'+
					'</div>'+
					'<div class="food-info">'+
						'<h2>'+ list[i].name +'</h2>'+
						'<p class="incloud">'+ list[i].tips +'</p>'+
						'<div class="price">'+
							'<i>¥</i><i class="pri">'+ list[i].specfoods[0].price +'</i>'+
							'<div class="count">'+
								'<span class="minus">-</span>'+
								'<em class="num">1</em>'+
								'<span class="plus">+</span>'+
							'</div>'+
						'</div>'+
					'</div>'+
				'</div>'
		}
		return str;
	}

})