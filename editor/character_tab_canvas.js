/**
* @fileoverview 「キャラクタタブとキャンバス」関係の処理の為の関数があるよ
* @author 鈴木一臣
*/

/**
* 編集におけるキャラクタタブ関係のメソッドの集まり
* @namespace
*/
IslayPub.character.tab = new function(){
	/**
	* キャラクタタブを生成する
	* @param {number} id これを指定すると、IDをこれで初期化できる
	* @return {element} 生成した状態
	*/
	this.create = function(id){
		//decide id
		var count = 0;
		if(typeof id === "undefined"){
			while(count < 10000){//10000:万一予防な
				if(!document.getElementById('character_tab_'+count))break;
				count++;
			}
		}else{
			count = id;
		}

		//create tab
		var character_tab = document.createElement('label');
		character_tab.setAttribute('id', 'character_tab_'+count);
		character_tab.setAttribute('class', 'character_tab');
		character_tab.setAttribute('style', 'background-color:rgba('+Math.floor(Math.random()*256)+','+Math.floor(Math.random()*256)+','+Math.floor(Math.random()*256)+',0.7)');
		character_tab.setAttribute('name', 'character_tab');
		character_tab.setAttribute('onmousedown', 'window.onmousemove = (function(a){return function(){IslayPub.character.tab.move(a)}})(this)');

		var tab_content = document.createElement('input');
		tab_content.setAttribute('type', 'radio');
		tab_content.setAttribute('name', 'character_tab_radio');
		tab_content.setAttribute('onclick', 'IslayPub.character.tab.select(this);');//これをこっちに入れているのはlabelの方に入れると二回反応してしまうから
		tab_content.setAttribute('onchange', 'try{document.querySelector(".checked_tab").classList.remove("checked_tab");}catch(e){}this.parentNode.classList.add("checked_tab");');
		character_tab.appendChild(tab_content);
		character_tab.innerHTML +=
			"<span name='character_tab_name' title='" + IslayPub.language.character[lang] + (count + 1) + "'>" + IslayPub.language.character[lang] + (count + 1) + '</span>' +
			"<img title='"+IslayPub.language.rename[lang]+"' class='character_tab_rename_button' src='./img/pen.png' onclick='IslayPub.character.tab.rename(this.parentNode.id.substr(\"character_tab_\".length));event.preventDefault();'>" +
			"<img title='"+IslayPub.language.remove_tab[lang]+"' src='img/close_button.png' class='close_button' onclick='IslayPub.character.tab.remove(this.parentNode.id.substr(\"character_tab_\".length));event.preventDefault();'>";

		//create canvas
		var new_canvas = document.createElement('div');
		new_canvas.setAttribute('class', 'canvas');
		new_canvas.setAttribute('id', 'canvas_' + count);

		document.getElementById('character_tabs').insertBefore(character_tab, document.getElementById("add_character_tab_button"));
		document.getElementById('canvases').appendChild(new_canvas);
		character_tab.click();

		IslayPub.undo_redo.add_history(["create_character", count]);

		return character_tab;
	}

	/**
	* キャラクタタブを選択された時、そのキャラクタのキャンバスを手前に持ってくる
	* @param {element} 選択したキャラクタタブ内のlabel要素
	*/
	this.select = function(target){
		IslayPub.character.change_edit_type();
		var id = 'canvas_'+target.parentNode.id.substr('character_tab_'.length);
		document.getElementById('canvases').appendChild(document.getElementById(id));//ノードの一番下に持ってくる事で最前面に

		IslayPub.character.maru.reset_select();
	}

	/**
	* キャラクタタブを移動させる
	* @param {element} 移動するキャラクタタブ
	*/
	this.move = function(tab){
		var rect = document.body.getBoundingClientRect();
		if(event.buttons != 1 || event.clientX < rect.left || rect.right < event.clientX || event.clientY < rect.top || rect.bottom < event.clientY){//ドラッグが終わっていた、もしくはwindowの外にでていた場合
			window.onmousemove = null;
			if(this.old_position !== this.new_position)
				IslayPub.undo_redo.add_history(["move_character", this.old_position, this.new_position]);
			delete this.old_position;
			delete this.new_position;
			return;
		}

		if(typeof this.old_position === "undefined"){
			this.old_position = tab.parentNode.childNodes.search_key_from_value(tab);
			this.new_position = this.old_position;
		}

		var t = document.elementFromPoint(event.clientX, event.clientY);

		//タブの移動
		if(t.getAttribute("name") != "character_tab"){
			t = t.parentNode;
			if(t.getAttribute("name") != "character_tab")
				return;
		}
		if(tab === t)//自分自身をマウスオーバしている時は何もしない
			return;
		var pos = t.nextElementSibling;
		if(pos){
			if(pos == tab){
				tab.parentNode.insertBefore(tab, t);
			}else{
				tab.parentNode.insertBefore(tab, pos);
			}
		}else{
			tab.parentNode.appendChild(tab);
		}
		this.new_position = tab.parentNode.childNodes.search_key_from_value(tab);
	}

	/**
	* キャラクタタブを削除する
	* @param {number} id 削除したいキャラクタタブのID
	*/
	this.remove = function(id){
		if(document.getElementById("character_tabs").querySelectorAll(".character_tab").length == 1){
			alert(IslayPub.language.alert14[lang]);
			return;
		}

		var tab;
		if(typeof id !== "undefined"){
			tab = document.getElementById("character_tab_" + id);
		}else{
			tab = document.querySelector("div#character_tabs input[type=radio]:checked").parentNode;
			var id = tab.id.substr('character_tab_'.length);
		}
		var canvas = document.getElementById('canvas_' + tab.id.substr('character_tab_'.length));

		IslayPub.undo_redo.add_history(["bundle", "start"]);

		//まずキャンパス内の丸を全て削除する。
		var marus = canvas.querySelectorAll("div[name='maru']");
		Array.prototype.forEach.call(marus, function(a){
			IslayPub.character.maru.remove(a);
		});

		IslayPub.undo_redo.add_history(["remove_character", id, this.get_name(id)]);

		//ここからキャンパスとそれに対応するタブを削除する。
		tab.parentNode.removeChild(tab);
		var c = canvas.parentNode;
		c.removeChild(canvas);

		//この時点で一番手前にきたキャンパスに対応するタブを選択する。（そうしないとどのタブも選択されていないという状態になる）
		document.getElementById("character_tab_" + document.getElementById("canvases").lastChild.id.substr('canvas_'.length)).click();

		IslayPub.undo_redo.add_history(["bundle", "end"]);
	}

	/**
	* キャラクタタブをリネームする
	* @param {number} id リネームしたいキャラクタタブのID
	* @param {string} new_name 新しい名前
	*/
	this.rename = function(id, new_name){
		var tab = document.getElementById("character_tab_" + id);
		if(typeof new_name === "undefined"){
			var new_name = prompt(IslayPub.language.prompt1[lang] + ' "' + this.get_name(id) + '"','');
		}
		if(new_name && (new_name = new_name.replace(/(^\s+)|(\s+$)/g, ""))/*前後の空白を取り除く*/){
			IslayPub.undo_redo.add_history(["change_name_character", tab.id.substr('character_tab_'.length), this.get_name(id), new_name]);
			var t = tab.querySelector("[name='character_tab_name']");
			t.textContent = new_name;
			t.title = new_name;
		}
	}

	/**
	* キャラクタタブの名前を取得する
	* @param {number} id 名前を取得したいキャラクタタブのID
	*/
	this.get_name = function(id){
		return document.getElementById("character_tab_" + id).querySelector("[name='character_tab_name']").textContent;
	}
}//end of tab

/**
* キャンバスエリアはタブの生成時にタブとペアで生成される。
* @namespace
*/
IslayPub.character.canvas = new function(){
	var scroll_x = null;
	var scroll_y = null;
  alert("判定"+scroll_x);
	/**
	* キャンバスがクリックされた時の処理
	*/
	/*this.mouse_down = function(){
		event.stopPropagation();
		var edit_type = IslayPub.character.get_edit_type();
		switch (event.button){
			case 0://Left button
				switch (edit_type){
					case 'select': this.area_select(); break;
					case 'move': break;
					case 'create': IslayPub.character.maru.create(); break;
					case 'yajirusi': break;
					case 'delete': break;
				}
				break;
			case 1://Middle button
				document.getElementById('canvases').lastChild.style.top = 0;
				document.getElementById('canvases').lastChild.style.left = 0;
				break;
			case 2://Right button
				window.onmousemove = this.scroll;
				break;
			default:break;
		}
	}*/

	/**
	* キャンバスがタッチされた時の処理
	*/
	this.touch_start = function(event){
		event.stopPropagation();
		var edit_type = IslayPub.character.get_edit_type();
		switch (edit_type){
			case 'select': this.area_select(); break;
			case 'move': break;
			case 'create': IslayPub.character.maru.create(event); break;//character_maru.js
			case 'yajirusi': break;
			case 'delete': break;
      default:break;
		}
				//break;
			/*case 2://Right button
				window.onmousemove = this.scroll;
				break;*/
			//default:break;
  }

	this.touch_move = function(event){
		event.stopPropagation();
		alert("scrollしたい");

	}
	/**
	* 範囲選択をする
	*/
/*
	this.area_select = function(){
		var select_area = document.getElementById("area_select_rect");
		var origin = document.getElementById('canvases').lastChild.getBoundingClientRect();

		if(!select_area){
			window.onmousemove = function(){IslayPub.character.canvas.area_select();};
			window.onmouseup = function(){IslayPub.character.canvas.area_select_end();};

			var a = document.createElement("div");
			a.id = "area_select_rect";
			a.dataset.start_x = event.clientX - origin.left;
			a.dataset.start_y = event.clientY - origin.top;
			document.getElementById('canvases').lastChild.appendChild(a);
			select_area = a;
		}

		//長方形の座標計算
		var w = (event.clientX - origin.left) - select_area.dataset.start_x;
		if(w < 0){
			select_area.style.width = w * -1 + "px";
			select_area.style.left = event.clientX - origin.left + "px";
		}else{
			select_area.style.width = w + "px";
			select_area.style.left = select_area.dataset.start_x + "px";
		}
		var h = (event.clientY - origin.top) - select_area.dataset.start_y;
		if(h < 0){
			select_area.style.height = h * -1 + "px";
			select_area.style.top = event.clientY - origin.top + "px";
		}else{
			select_area.style.height = h + "px";
			select_area.style.top = select_area.dataset.start_y + "px";
		}
	}
*/
	/**
	* 範囲選択をする
	*/
	this.area_select = function(event){
		var select_area = document.getElementById("area_select_rect");
		var origin = document.getElementById('canvases').lastChild.getBoundingClientRect();

		if(!select_area){
			window.ontouchmove = function(event){
				event = event || window.event;
				IslayPub.character.canvas.area_select(event);
			};
			window.ontouchend = function(event){
				event = event || window.event;
				IslayPub.character.canvas.area_select_end(event);
			};
			var a = document.createElement("div");
			a.id = "area_select_rect";
			a.dataset.start_x = event.changedTouches[0].pageX - origin.left;
			a.dataset.start_y = event.changedTouches[0].pageY - origin.top;
			document.getElementById('canvases').lastChild.appendChild(a);
			select_area = a;
		}

		//長方形の座標計算
		var w = (event.changedTouches[0].pageX - origin.left) - select_area.dataset.start_x;
		if(w < 0){
			select_area.style.width = w * -1 + "px";
			select_area.style.left = event.changedTouches[0].pageX - origin.left + "px";
		}else{
			select_area.style.width = w + "px";
			select_area.style.left = select_area.dataset.start_x + "px";
		}
		var h = (event.changedTouches[0].pageY - origin.top) - select_area.dataset.start_y;
		if(h < 0){
			select_area.style.height = h * -1 + "px";
			select_area.style.top = event.changedTouches[0].pageY - origin.top + "px";
		}else{
			select_area.style.height = h + "px";
			select_area.style.top = select_area.dataset.start_y + "px";
		}
	}

	/**
	* 範囲選択終了時処理
	* IslayPub.character.canvas.area_selectから呼び出される。
	*/
/*
	this.area_select_end = function(){
		var select_area = document.getElementById("area_select_rect");

		if(select_area){
			var m = select_area.parentNode.querySelectorAll("[name='maru']");

			var min, max;
			if(parseInt(select_area.dataset.start_x) == parseInt(select_area.style.left)){
				min = parseInt(select_area.dataset.start_x);
				max = min + parseInt(select_area.style.width);
			}else{
				min = parseInt(select_area.style.left);
				max = parseInt(select_area.dataset.start_x);
			}
			m = Array.prototype.filter.call(m, function(e){
				return min < parseInt(e.style.left) && parseInt(e.style.left) + MARU_RAD < max;
			});
			if(parseInt(select_area.dataset.start_y) == parseInt(select_area.style.top)){
				min = parseInt(select_area.dataset.start_y);
				max = min + parseInt(select_area.style.height);
			}else{
				min = parseInt(select_area.style.top);
				max = parseInt(select_area.dataset.start_y);
			}
			m = Array.prototype.filter.call(m, function(e){
				return min < parseInt(e.style.top) && parseInt(e.style.top) + MARU_RAD < max;
			});

			Array.prototype.forEach.call(m, function(e){
				IslayPub.character.maru.change_select(e);
			});

			select_area.parentNode.removeChild(select_area);
		}

		window.onmousemove = null;
		window.onmouseup = null;
	}
*/

	/**
	* 範囲選択終了時処理
	* IslayPub.character.canvas.area_selectから呼び出される。
	*/
	this.area_select_end = function(event){
		var select_area = document.getElementById("area_select_rect");

		if(select_area){
			var m = select_area.parentNode.querySelectorAll("[name='maru']");

			var min, max;
			if(parseInt(select_area.dataset.start_x) == parseInt(select_area.style.left)){
				min = parseInt(select_area.dataset.start_x);
				max = min + parseInt(select_area.style.width);
			}else{
				min = parseInt(select_area.style.left);
				max = parseInt(select_area.dataset.start_x);
			}
			m = Array.prototype.filter.call(m, function(e){
				return min < parseInt(e.style.left) && parseInt(e.style.left) + MARU_RAD < max;
			});
			if(parseInt(select_area.dataset.start_y) == parseInt(select_area.style.top)){
				min = parseInt(select_area.dataset.start_y);
				max = min + parseInt(select_area.style.height);
			}else{
				min = parseInt(select_area.style.top);
				max = parseInt(select_area.dataset.start_y);
			}
			m = Array.prototype.filter.call(m, function(e){
				return min < parseInt(e.style.top) && parseInt(e.style.top) + MARU_RAD < max;
			});

			Array.prototype.forEach.call(m, function(e){
				IslayPub.character.maru.change_select(e);
			});

			select_area.parentNode.removeChild(select_area);
		}

		window.ontouchmove = null;
		window.ontouchend = null;
	}

	this.scroll = function(event){
		var rect = document.getElementById("canvases").getBoundingClientRect();
		if(event.changedTouches[0].pageX < rect.left || rect.right < event.changedTouches[0].pageX || event.changedTouches[0].pageY < rect.top || rect.bottom < event.changedTouches[0].pageY){//ドラッグが終わっていた、もしくはキャンバスの外にでていた場合
			//window.onmousemove = null;
			/*if(!this.scroll_amount || this.scroll_amount < 10){//右クリックされてから大きく動いてなかったらコンテキストメニューを出す
				var a = new Object();//タッチでは,いらなそう
				a[IslayPub.language.contextmenu1[lang] + "(ctr+c)"] = function(){IslayPub.copy_paste.copy()};
				a[IslayPub.language.contextmenu2[lang] + "(ctr+v)"] = function(){IslayPub.copy_paste.paste()};
				a[IslayPub.language.contextmenu3[lang] + "(ctr+a)"] = function(){IslayPub.character.maru.select_all()};
				a[IslayPub.language.contextmenu4[lang] + "(ctr+shit+a)"] = function(){IslayPub.character.maru.reset_select()};
				a[IslayPub.language.contextmenu5[lang] + "(ctr+z)"] = function(){IslayPub.undo_redo.undo()};
				a[IslayPub.language.contextmenu6[lang] + "(ctr+y)"] = function(){IslayPub.undo_redo.redo()};
				IslayPub.contextmenu.open(a);
			}*/
			/*if(this.scroll_x){
				delete this.scroll_x;
				delete this.scroll_y;
				//delete this.scroll_amount;
			}
			return;*/
			if(scroll_x != null){
				scroll_x = null;
				scroll_y = null;
				//delete this.scroll_amount;
			}
		}

		/*if(!this.scroll_x){
			this.scroll_x = event.changedTouches[0].pageX;
			this.scroll_y = event.changedTouches[0].pageY;
			//this.scroll_amount = 0;//移動量を記録しておく。ちょっとマウスが動いちゃったときにもコンテキストメニューを出せるように
		}*/
		if(scroll_x == null){
			scroll_x = event.changedTouches[0].pageX;
			scroll_y = event.changedTouches[0].pageY;
			//this.scroll_amount = 0;//移動量を記録しておく。ちょっとマウスが動いちゃったときにもコンテキストメニューを出せるように
		}

		/*
		//前回のマウス座標との差分だけスクロールさせ、今回のマウス座標を記録
		var target = document.getElementById('canvases').lastChild;
		target.style.left = parseInt(target.style.left || 0) + event.changedTouches[0].pageX - this.scroll_x + "px";
		target.style.top = parseInt(target.style.top || 0) + event.changedTouches[0].pageY - this.scroll_y + "px";
		//this.scroll_amount += Math.abs(event.changedTouches[0].pageX - this.scroll_x) + Math.abs(event.changedTouches[0].pageY - this.scroll_y);
		this.scroll_x = event.changedTouches[0].pageX;
		this.scroll_y = event.changedTouches[0].pageY;
		*/

		//前回のマウス座標との差分だけスクロールさせ、今回のマウス座標を記録
		var target = document.getElementById('canvases').lastChild;
		target.style.left = parseInt(target.style.left || 0) + event.changedTouches[0].pageX -scroll_x + "px";
		target.style.top = parseInt(target.style.top || 0) + event.changedTouches[0].pageY - scroll_y + "px";
		//this.scroll_amount += Math.abs(event.changedTouches[0].pageX - this.scroll_x) + Math.abs(event.changedTouches[0].pageY - this.scroll_y);
		scroll_x = event.changedTouches[0].pageX;
		scroll_y = event.changedTouches[0].pageY;

	}

	this.scroll_end = function(event){
		alert("scroll_x:"+scroll_x);
		if(scroll_x != null){
			scroll_x = null;
			scroll_y = null;
			//delete this.scroll_amount;
		}
	}
	/**
	* キャンバスをスクロールさせる
	*/
/*
	this.scroll = function(){
		alert("scroll");
		var rect = document.getElementById("canvases").getBoundingClientRect();
		if(event.buttons != 2 || event.clientX < rect.left || rect.right < event.clientX || event.clientY < rect.top || rect.bottom < event.clientY){//ドラッグが終わっていた、もしくはキャンバスの外にでていた場合
			window.onmousemove = null;
			if(!this.scroll_amount || this.scroll_amount < 10){//右クリックされてから大きく動いてなかったらコンテキストメニューを出す
				var a = new Object();//タッチでは,いらなそう
				a[IslayPub.language.contextmenu1[lang] + "(ctr+c)"] = function(){IslayPub.copy_paste.copy()};
				a[IslayPub.language.contextmenu2[lang] + "(ctr+v)"] = function(){IslayPub.copy_paste.paste()};
				a[IslayPub.language.contextmenu3[lang] + "(ctr+a)"] = function(){IslayPub.character.maru.select_all()};
				a[IslayPub.language.contextmenu4[lang] + "(ctr+shit+a)"] = function(){IslayPub.character.maru.reset_select()};
				a[IslayPub.language.contextmenu5[lang] + "(ctr+z)"] = function(){IslayPub.undo_redo.undo()};
				a[IslayPub.language.contextmenu6[lang] + "(ctr+y)"] = function(){IslayPub.undo_redo.redo()};
				IslayPub.contextmenu.open(a);
			}
			if(this.scroll_x){
				delete this.scroll_x;
				delete this.scroll_y;
				delete this.scroll_amount;
			}
			return;
		}

		if(!this.scroll_x){
			this.scroll_x = event.clientX;
			this.scroll_y = event.clientY;
			this.scroll_amount = 0;//移動量を記録しておく。ちょっとマウスが動いちゃったときにもコンテキストメニューを出せるように
		}

		//前回のマウス座標との差分だけスクロールさせ、今回のマウス座標を記録
		var target = document.getElementById('canvases').lastChild;
		target.style.left = parseInt(target.style.left || 0) + event.clientX - this.scroll_x + "px";
		target.style.top = parseInt(target.style.top || 0) + event.clientY - this.scroll_y + "px";
		this.scroll_amount += Math.abs(event.clientX - this.scroll_x) + Math.abs(event.clientY - this.scroll_y);
		this.scroll_x = event.clientX;
		this.scroll_y = event.clientY;
	}*/
}
