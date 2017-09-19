/**
* @fileoverview このjsファイルは一番最初に読み込ませてね！
* なんか新しくファイルを作るほどでもない機能を持った関数達とかがある(怠惰)
* @author 鈴木一臣
*/

/**
* 丸（状態）の直径
* @const {number}
*/
const MARU_RAD = 100;
/**
* 丸（状態）の輪郭の太さ。何か計算とかに使うからCSSの方とあわせてね
* @const {number}
*/
const MARU_BORDER_WIDTH = 3;
/**
* 矢印の太さ
* @const {number}
*/
const YAJIRUSI_WIDTH = 10;
/**
* 素の矢印の太さではクリックしづらい為、クリック判定用の太さも用意する。これがでかいほどクリックしやすくなる
* @const {number}
*/
const YAJIRUSI_SHADOW_WIDTH = 100;
/**
* グループから生成する状態のz-indexの初期値
* @const {number}
*/
const INITIAL_Z_INDEX = 100;
/**
* グループにおける「状態」のz-indexの最大値
* @const {number}
*/
const MAX_Z_INDEX = 10000;
/**
* グループにおける「状態」の状態のz-indexの最小値
* @const {number}
*/
const MIN_Z_INDEX = 0;
/**
* 「公開」できるファイル容量の最大値
* @const {number}
*/
const MAX_PUBLISH_FILE_SIZE = 8000000;
/**
* "/preset_img"に入っている画像データ数。この数だけ画像読み込むからファイルに入ってる画像数と合わせてね
* @const {number}
*/
const NUMBER_OF_PRESET_IMGS = 236;
/**
* "/preset_se"に入っている音楽データ数。この数だけ音楽読み込むからファイルに入ってる画像数と合わせてね
* @const {number}
*/
const NUMBER_OF_PRESET_SES = 7;
/**
* 丸（状態）の絵の初期設定
* @const {string}
*/
const INITIAL_IMG_SETTING = 'data:image/png;base64,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';

//言語設定
var lang = location.search.slice(location.search.indexOf("lang=") + 5);
lang = lang.split("&")[0];
lang = lang || "ja";


//window.eventを作り出す。firefoxはこれが無いから
(function(){
	var events = ["mousedown", "mouseover", "mouseout", "mousemove",
		"mousedrag", "click", "dblclick", "wheel"];
	for (var i = 0; i < events.length; i++){
		window.addEventListener(events[i], function(e){window.event = e;}, true);
	}
}());

"use strict";//strict モードの呼び出し

window.addEventListener("load", function(){
	//index.html内にテキストを埋め込む
	(function(){
		Array.prototype.forEach.call(document.querySelectorAll("[data-text_name]"),
			function(e){
				e.insertAdjacentHTML("afterend", IslayPub.language[e.dataset.text_name][lang]);
				e.parentNode.removeChild(e);
			}
		);
	})()

	/*window.addEventListener('touchmove', function(event) {//スクロール無効
	    event.preventDefault();
	});*/

	window.addEventListener("touchmove", function(event) {
    event.preventDefault();
  }, false);

	//ローディング画面とそれに関するイベントを削除
	var a = document.getElementById("now_loading");
	a.parentNode.removeChild(a);
	clearInterval(loading_setInterval_id);
	delete loading_setInterval_id;

	//キャンバスに関する初期設定
	(function(){
		var canvases = document.getElementById("canvases");
		canvases.setAttribute('ontouchstart', 'IslayPub.character.canvas.touch_start(event)');//character_tabu_canvas.js
		/*canvases.addEventListener("touchstart", function(event) {
	    alert("canvases");
	  }, false);*/
		//canvases.setAttribute('ontouchmove', 'IslayPub.character.canvas.touch_move(event)');//character_tabu_canvas.js
    canvases.setAttribute('ontouchmove', 'IslayPub.character.canvas.scroll(event)');//character_tabu_canvas.js
		canvases.setAttribute('ontouchend', 'IslayPub.character.canvas.scroll_end(event)');
		canvases.addEventListener("touchmove", function(event) {
	    event.preventDefault();
	  }, false);
		//canvases.setAttribute('onmousedown', 'IslayPub.character.canvas.mouse_down()');//character_tabu_canvas.js
		//canvases.setAttribute('onwheel', 'event.preventDefault();');
		//canvases.setAttribute('onmousewheel', 'event.preventDefault();');
	})();
	IslayPub.character.tab.create();
	IslayPub.group.tab.create(0, 'main');
	IslayPub.undo_redo.clear_history();

	//"#childwindow"の時はプロダクトページから呼び出された時なのでデータを親ウィンドウから読み込む
	(function(){
		if(location.hash == "#childwindow")
			IslayPub.save_load_dialog.load(JSON.stringify(window.opener.IslayPub.save_load_dialog.make_data()), false);
	})();

	//ページ遷移前に確認ダイアログを
	window.onbeforeunload = function(event){
		return 'ページから移動しますか？';
	};

	window.addEventListener('unload', function(event){//error reportを送信
		if(error_log.length == 1)//エラー履歴が無い時は特に送信しない。
			return;

		xmlHttp = new XMLHttpRequest();

		//第三引数をfalseにする事で同期処理にする。こうしないと通信が完了する前にページが閉じられてしまうから。しかし同期処理にする事でこの問題を回避するのはスマートじゃない・・
		//Navigator.sendBeacon()というのもあるがIE非対応なんだよね
		xmlHttp.open("POST", "/XMLHttpRequest.php", false);

		xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		xmlHttp.send('command=report_error&detail=' + JSON.stringify(error_log));
	});
}, false);

/** javascriptにはhtmlspecialchars()的なものが無いっぽいのでそれを */
String.prototype.htmlEscape = function(){
	var obj = document.createElement('pre');
	obj.textContent = this;
	return obj.innerHTML;
}
/** NodeListはarrayと違うからindexOf使えない。だからそれを実装。 */
NodeList.prototype.search_key_from_value = function(target){
	for(var a = 0; a < this.length; a++){
		if(this[a] === target)
			return a;
	}
	return -1;
}
HTMLCollection.prototype.search_key_from_value = NodeList.prototype.search_key_from_value;

//キーが押されたときの処理。ショートカットキー用
window.onkeydown = function(e){
	//console.log(e.key);
	if(e.key == "Escape"){
		IslayPub.dialog.close();
		return;
	}
	if(document.getElementsByClassName("dialog").length == 0){
		switch(e.key){
			case "z"://undo
				if(e.ctrlKey)IslayPub.undo_redo.undo();
				break;
			case "y"://redo
				if(e.ctrlKey)IslayPub.undo_redo.redo();
				break;
			case "c"://コピー
				if(e.ctrlKey)IslayPub.copy_paste.copy();
				break;
			case "v"://ペースト
				if(e.ctrlKey)IslayPub.copy_paste.paste();
				break;
			case "a"://全選択
				if(e.ctrlKey){
					IslayPub.character.maru.select_all();
				}
				break;
			case "A"://全選択解除
				if(e.ctrlKey){
					IslayPub.character.maru.reset_select();
				}
				break;
		}
	}
}

//alertを改造
window.alert = function(t){
	var e = document.createElement("div")
	var a = function(){
		try{
			e.parentNode.removeChild(e);
		}catch(asd){}
	};

	e.textContent = t;
	e.setAttribute("class", "message");
	e.onclick = a;
	e.addEventListener("animationend", a);

	document.getElementById("message_area").appendChild(e);
}

/**
* エラーの収集。onunload時にサーバに送る。
* @type {Array}
*/
error_log = new Array();
(function(){//ブラウザ情報を突っ込む
	var _navigator = {};
	for (var i in navigator){
		try{
		_navigator[i] = navigator[i];
		}catch(e){}
	}
	error_log.push(_navigator);
})()
window.onerror = function(msg, url, line, col){//起きたエラーを集める
	var e = {"message": msg, "url": url, "line": line, "col": col, "count": 1};
	if(error_log.length == 1){
		error_log.push(e);
	}else{
		if(JSON.stringify(error_log[error_log.length - 1], ["message", "url", "line", "col"]) !== JSON.stringify(e, ["message", "url", "line", "col"]))
			error_log.push(e);
		else
			error_log[error_log.length - 1]["count"]++;
	}
};

/**
* IslayPubを動かすためのDOM操作用メソッドの集まり。
* @namespace
*/
var IslayPub = new function(){
	/**
	* 「公開ボタン」を押したらtrueにして、投稿したらfalseにする。二重投稿を防ぐ為
	* @type {boolean}
	*/
	this.publish_flag = false;

	/**
	* 編集関係のメソッドの集まり
	* @namespace
	*/
	this.character = new function(){
		/** ホイールイベント。ホイールまわすとエディットタイプを変更できる。 */
		this.wheel = function(){//wheel event
			//switch type of edit with wheel spin
			var edit_type = document.querySelector("div#character_edit_type_select input[type=radio]:checked");
			var radios = document.getElementsByName('chara_edit_action');
			var c = -1;
			while(++c < radios.length){
				if(edit_type === radios[c]){
					break;
				}
			}
			var radio_num = document.getElementById("character_edit_type_select").getElementsByTagName("label").length;
			radios[(c + (((event.deltaY||event.wheelDelta*-1)>0)?1:radio_num-1)) % radio_num].checked = true;
			this.change_edit_type();
		}

		/** エディットタイプを変更する時に呼び出す。 */
		this.change_edit_type = function(){
			//矢印の開始情報を取り除く
			var start = document.querySelector("div.maru[yajirusu_start_point='yes']");
			if(start){
				start.removeAttribute('yajirusu_start_point');
			}
		}

		/**
		* 現在のエディットタイプを取得する。
		* @return 現在のエディットタイプ
		*/
		this.get_edit_type = function(){
			var edit_type = document.querySelector("div#character_edit_type_select input[type=radio]:checked").value;
			if(document.getElementById("tab_menu_group").checked)
				edit_type = "add_group";
			return edit_type;
		}
	}

	/** 「ためす」ボタンの機能。エディタで作ったやつを実行する */
	this.play = function(){
		if(IslayPub.group.list[0].length == 0){//もしグループに何も無くて1つ以上丸があれば適当な丸を「メイン」グループに追加する
			var marus = document.querySelectorAll("[name='maru']");
			if(marus.length != 0){
				IslayPub.group.add(0, marus[0].id.substr('maru_'.length));
			}
		}
		var d = IslayPub.dialog.open("").parentNode;
		d.removeAttribute("onclick");
		d.innerHTML = "<object id='player' data='./player.html' width='"+document.getElementById("system_width").value+"' height='"+document.getElementById("system_height").value+"' style='position: absolute;' onload='try{this.contentWindow.focus()}catch(e){}IslayPub.dialog.move_center(this);'></object>";
		alert(IslayPub.language.close_player[lang]);
	}

	/** 公開する */
	this.publishing = function(){
		if((new Blob([JSON.stringify(IslayPub.save_load_dialog.make_data())], {type: "text/plain"})).size > MAX_PUBLISH_FILE_SIZE){//あんまりファイルが大きいときは拒否しとく
			alert(IslayPub.language.large_data[lang]);
			return;
		}

		IslayPub.publish_flag = true;

		// about:blankとしてOpen
		var target = 'ATMARK';
		window.open("", target) ;

		// formを生成
		var form = document.createElement("form");
		form.action = '/login.php';
		form.target = target;
		form.method = 'post';

		// input-hidden生成と設定
		var qs = [{type:'hidden',name:'cmd',value:'upload'}];
		for(var i = 0; i < qs.length; i++) {
			var ol = qs[i];
			var input = document.createElement("input");
			for(var p in ol) {
				input.setAttribute(p, ol[p]);
			}
			form.appendChild(input);
		}

		// formをbodyに追加して、サブミットする。その後、formを削除
		var body = document.getElementsByTagName("body")[0];
		body.appendChild(form);
		form.submit();
		body.removeChild(form);
	}
}
