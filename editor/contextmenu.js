/**
* @fileoverview  「右クリックメニュー」関係の処理の為の関数があるよ
* @author 鈴木一臣
*/

/**
* 右クリック時に出てくるメニュー関係のメソッドの集まり
* @namespace
*/
IslayPub.contextmenu = new function(){
	/**
	* コンテキストメニューを表示
	* @param {Object} menu 表示したいテキストとそれが選ばれたときの処理をペアにした連想配列
	*/
	this.open = function(menu){
		var background = document.createElement('div');
		background.id = "contextmenu_background";
		background.onmousedown = this.close;
		background.onclick = this.close;
		
		var items = document.createElement('div');
		items.style.top = event.clientY + "px";
		items.style.left = event.clientX + "px";
		items.classList.add("contextmenu_items");
		
		for(e in menu){
			var item = document.createElement('div');
			item.classList.add("contextmenu_item");
			item.onmousedown = function(){event.stopPropagation();};
			item.onclick = menu[e];
			item.textContent = e;
			items.appendChild(item);
		}
		
		background.appendChild(items);
		document.getElementsByTagName('body')[0].appendChild(background);
	}
	
	/** 右クリックメニューを閉じる */
	this.close = function(){
		document.body.removeChild(document.getElementById("contextmenu_background"));
	}
}
