/**
* @fileoverview 「コピペ」関係の処理の為の関数があるよ
* @author 鈴木一臣
*/

/**
* 編集におけるコピーアンドペースト関係のメソッドの集まり
* @namespace
*/
IslayPub.copy_paste = new function(){
	/** 選択されているものをクリップボードへ */
	this.copy = function(){
		var c = new Array();
		
		Array.prototype.forEach.call(//選択された丸を全て格納
			document.querySelectorAll("[name='maru'][selected='yes']"),
			function(e){c.push(e.cloneNode(true));}
		);
		
		c.forEach(//選択対象外の矢印を取り除く
			function(e){
				Array.prototype.forEach.call(
					e.querySelectorAll("svg"),
					function(a){
						if(!a.getAttribute("selected") || !document.getElementById(a.getAttribute("fromto")).getAttribute("selected"))
							e.removeChild(a);
					}
				)
			}
		);
		
		if(c.length != 0){
			this.clipboard = c;
			alert(IslayPub.language.alert16[lang]);
		}else{
			alert(IslayPub.language.alert18[lang]);
		}
	}
	
	/** クリップボードにあるものをペーストする */
	this.paste = function(){
		if(!this.clipboard){//クリップボードに何も無かったらペーストできないよね
			alert(IslayPub.language.alert19[lang]);
			return;
		}
		
		IslayPub.character.maru.reset_select();
		
		var targets = new Array();
		var canvas = document.getElementById('canvases').lastChild;
		var id_index = new Object();
		
		var nx = null, ny;
		this.clipboard.forEach(//丸のコピーをid振りなおしてappend
			function(e){
				var a = e.cloneNode(true);
				Array.prototype.forEach.call(
					a.querySelectorAll("svg"),
					function(s){
						s.removeAttribute("id");
					}
				)
				var old_id = a.id;
				//最初の要素が画面中央に配置されるようにする。
				if(nx === null){
					nx = document.getElementById('canvases').getBoundingClientRect().width/2 - document.getElementById('canvases').lastChild.getBoundingClientRect().left - MARU_RAD/2 - parseInt(a.style.left);
					ny = document.getElementById('canvases').getBoundingClientRect().height/2 - document.getElementById('canvases').lastChild.getBoundingClientRect().top - MARU_RAD/2 - parseInt(a.style.top);
				}
				a.style.left = parseInt(a.style.left) + nx + "px";
				a.style.top = parseInt(a.style.top) + ny + "px";
				//idを振りなおす
				a.id = "maru_" + IslayPub.character.maru.unique_id();
				id_index[old_id] = a.id;
				//出来たものを追加
				targets.push(a);
				canvas.appendChild(a);
			}
		);
		
		targets.forEach(//矢印のidを振りなおす。また、丸のidの変更にあわせてfromtoを修正
			function(e){
				Array.prototype.forEach.call(
					e.querySelectorAll("svg"),
					function(s){
						s.id = "yajirusi_" + IslayPub.character.yajirusi.unique_id();
						s.setAttribute("fromto", id_index[s.getAttribute("fromto")]);
					}
				)
			}
		);
		
		var t = new Array();
		targets.forEach(function(e){t.push(e.cloneNode(true));});
		IslayPub.undo_redo.add_history(["paste", canvas.id.substr("canvas_".length), t]);
		
		alert(IslayPub.language.alert17[lang]);
	}
}