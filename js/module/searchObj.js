var searchObj = {
	name:'地址搜索页',
	dom:$('#address'),
	init:function(){
		this.bindEvent();
	},

	changeCity: function(hash){
		// console.log(hash);
		var cityname = hash.split('-')[1] || '上海';
		cityname = decodeURI(cityname);
		$('#cname').html(cityname);
		this.cityID = hash.split('-')[2];
		this.bcID = hash.split('-')[3];
	},

	bindEvent:function(){
		// console.log('绑定事件');
		var me = this;
		var elm = $('#elm');
		var baidu = $('#baidu');
		$("#keyword").on('input', function(event){
			// console.log('我进行了改变'); 	
		})

		//饿了么搜索
		elm.click(function(event){
			var word = $('#keyword').val();
			$.ajax({
				url: '/v1/pois',
				data:{
					city_id: me.cityID || 1,
					keyword: word,
					type: 'search'
				},
				type: 'get',
				success: function(res){
					// console.log('我请求成功了');
					console.log(res)
					var str = '';
					for(var i=0; i<res.length; i++){
						var address = encodeURI(res[i].address);
						str += '<li><a href="#rlist-'+ res[i].latitude +'-'+ res[i].longitude +'-'+ address +'">'+ res[i].name +'</a></li>';
					}
					$('#list').html(str);
				},
				error: function(){
					console.log('我请求失败了');
				}
			});
		})


		//百度外卖的搜索
		baidu.click(function(event){
			// console.log('百度外卖搜索');
			var word = $("#keyword").val();
			$.ajax({
				url: '/waimai',
				dataType: 'json',
				data: {
					qt:'poisug',
					wd: word,
					cb:'suggestion_1483600579740',
					cid:me.bcID || 289,
					b:'',
					type:0,
					newmap:1,
					ie:'utf-8'
				},
				success: function(res){
					// console.log(res);
					// console.log('我请求成功了');
					var str = "";
					for(var i =0; i < res.s.length; i++) {
						str += '<li>'+ res.s[i] +'</li>'
					}	
					$("#list").html(str);	 	
				},
				error: function(res){
					console.log('我请求失败了');	 	
				}
			})	 	
		});
	},
	
	enter:function(){
		this.dom.show();
	},
	leave:function(){
		this.dom.hide();
	}

}