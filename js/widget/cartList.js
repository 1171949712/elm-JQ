/*

购物车列表模块（组件）

对已经添加到购物车中的商品进行展示以及计算

author：刘政，time：17.1.13

 */

function cartList(){
	var name = '购物车列表模块';
	var $dom = $('.cartList');
	var $layer = $('.layer');
	var $list = $('.cartList-foods');
	var $clear = $('.header-right');
	function init(){
		bindEvent();
	}
	function bindEvent(){
		$layer.click(function(){
			$dom.hide();
		})
		$dom.on('click', '.plus', function(){
			var curFoodid = $(this).closest('.singlefood').data('foodid');
			var curCartObj = detailObj.cartMap[curFoodid];
			// console.log(curCartObj)
			curCartObj.plus();
			detailObj.cartSelectedMap[curFoodid] = curCartObj;//将选择单个购物车放到起映射表下， 并且进行更新
			detailObj.cartSum();
		})
		$dom.on('click', '.minus', function(){
			var curFoodid = $(this).closest('.singlefood').data('foodid');
			var curCartObj = detailObj.cartMap[curFoodid];
			// console.log(curCartObj)
			curCartObj.minus();
			detailObj.cartSum();	
			if(curCartObj.num === 0){
				//执行dom节点删除操作
				deleteCart(curCartObj);
				if($.isEmptyObject(detailObj.cartSelectedMap)){
					$dom.hide();
				}
				return;
			}

			detailObj.cartSelectedMap[curFoodid] = curCartObj;//将选择单个购物车放到起映射表下， 并且进行更新	
				
		})
		$clear.click(function(){
			clear();
		})
	}
	function addCart(obj){
		//添加购物车
		var str = obj.singleRender();
		$list.append(str);
	}
	function clear(){
		// 清空购物车
		for(var key in detailObj.cartSelectedMap){
			var curObj = detailObj.cartSelectedMap[key];
			var curFoodid = curObj.food_id;
			detailObj.cartMap[curFoodid].num = 0;
			$(curObj.selector).find('.num').html('');
			$(curObj.selector).find('.minus').hide();
			deleteCart(detailObj.cartSelectedMap[key]);
		}
		detailObj.cartSum();
		toggle();
	}
	function toggle(){
		$dom.toggle();
	}
	function deleteCart(obj){
		$list.find(obj.selector).remove();
		delete detailObj.cartSelectedMap[obj.food_id];
	}

	return {
		//把写的方法属性暴露出去
		name: name,
		init: bindEvent,
		delete: deleteCart,
		toggle: toggle,
		addCart: addCart
	}
}

var cartListObj = cartList();

