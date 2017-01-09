var citylistObj = Object.create(searchObj);
citylistObj = $.extend(citylistObj,{
	name:'城市列表页',
	dom:$('#citylist'),
	init: function(){
		this.bindEvent();
		this.loadBaiduCity();
	},

	//加载百度城市
	loadBaiduCity: function(){
		var me = this;
		$.ajax({
			url: '/waimai',
			data: {
				qt:'getcitylist',
				format:1,
				t:1483695950039
			},
			dataType:'json',
			type:'get',
			success: function(res){
				// console.log(res);
				var str = '';
				var t = [];
				var map = res.result.city_list;
				// console.log(map)
				for(var key in map){
					// console.log(key)
					t = t.concat(map[key]);
				}
				// console.log(t)
				 
				var baiduCityMap = {};
				for(var i=0; i<t.length; i++){
					baiduCityMap[t[i].name] = t[i].code;
				}
				// console.log(baiduCityMap);
				me.baiduCityMap = baiduCityMap;
				me.loadHotCity();
				me.loadGroupCity();

			},
			error: function(){
				console.log('后端出错了');
			}
		})
	},

	//加载热门城市
	loadHotCity: function(){
		var me = this;
		$.ajax({
			url: '/v1/cities?type=hot',
			type: 'get',
			success: function(res){
				// console.log(res);
				var str = '';
				for(var i=0; i<res.length; i++){
					var city = encodeURI(res[i].name);
					var bcID = me.baiduCityMap[res[i].name];
					str += '<li><a href="#address-'+ city +'-'+ res[i].id +'-'+ bcID +'">'+ res[i].name +'</a></li>';
				}
				$('.hot-list ul').html(str);
			},
			error: function(){
				console.log('后端出错了');
			}
		})
	},

	//加载索引
	loadAList: function(arr){
		var str = '';
		for(var i=0; i<arr.length; i++){
			str += '<li>'+ arr[i] +'</li>'
		}
		$('.suoyin ul').html('<h2>字母索引</h2>' + str);
	},

	//点击索引跳转
	bindEvent: function(){
		$('.suoyin ul').on('click', 'li', function(){
			var selector = '[data-city = '+ this.innerHTML +']';
			// console.log(selector);
			var offsetTop = $(selector).offset().top;
			// console.log(offsetTop);
			window.scrollTo(0,offsetTop);
		})
	},

	//加载单个分组城市
	loadSingleList: function(list){
		var me = this;
		var str = '';
		for(var i=0; i<list.length; i++){
			var city = encodeURI(list[i].name);
			var bcID = me.baiduCityMap[list[i].name];
			str += '<li><a href="#address-'+ city +'-'+ list[i].id +'-'+ bcID +'">'+ list[i].name +'</a></li>';
		}
		return str;
	},

	//加载分组城市
	loadGroupCity: function(){
		var that = this;
		$.ajax({
			url: '/v1/cities?type=group',
			type: 'get',
			success: function(res){
				// console.log(res);
				var arr = [];
				for(var key in res){
					// console.log(res[i]);
					arr.push(key);
				}
				arr.sort();
				that.loadAList(arr);
				var str = '';
				for(var i=0; i<arr.length; i++){
					str += 
					'<div class="item">' +
						'<h2 data-city='+  arr[i] +'>'+ arr[i] +'</h2>' +
						'<ul>' +
							that.loadSingleList(res[arr[i]]) +
						'</ul>' +
					'</div>'
				}
				$('.group').html(str);
				$('.group h2').eq(0).html('A&nbsp<span>(按字母排序)</span>');
				
			},
			error: function(){
				console.log('后端出错了');
			}
		})	
	}
		
})

