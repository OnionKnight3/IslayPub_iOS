/**
* @fileoverview 「矢印」関係の処理の為の関数があるよ
* @author 鈴木一臣
*/

/**
* 編集における矢印関係のメソッドの集まり
* @namespace
*/
IslayPub.character.yajirusi = new function(){
	/**
	* 開始点が選ばれていなかった場合は第一引数の丸を開始点に設定するだけ。開始点が選ばれていたら矢印を生成する。
	* @param {element} maru 終点となる「状態」
	* @param {Array}　init init[2]は指定した場合、svgのdを指定できる(1は矢印の棒の、2は鏃の部分)。
	* @return {element} 矢印を生成した場合はその矢印要素を返す
	*/
	this.create = function(maru,init){
		var start = document.querySelector("div.maru[yajirusu_start_point='yes']");
		if(start){
			start.removeAttribute('yajirusu_start_point');
			var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			svg.setAttribute('name', 'yajirusi');
			svg.id = 'yajirusi_' + this.unique_id();
			//svg.setAttribute('onmousedown', 'IslayPub.character.yajirusi.mouse_down(this)');
      svg.setAttribute('ontouchstart', 'IslayPub.character.yajirusi.touch_start(this,event)');
			//svg.addEventListener('touchstart',IslayPub.character.yajirusi.touch_start(this,event) , true);

			alert(svg);
			/*svg.ontouchstart = function(event){
				alert("target:"+event.target);
				IslayPub.character.yajirusi.touch_start(this);
			};*/
			svg.setAttribute('fromto', maru.id);
			svg.setAttribute('transition_condition', "none");
			var path = document.createElementNS("http://www.w3.org/2000/svg", "path");//矢印の線の部分
			//M 開始点 Q 制御点 終点
			path.setAttribute('d','');
			path.setAttribute('name','path');
			path.setAttribute('fill', 'none');
			path.setAttribute('stroke', 'black');
			path.setAttribute('stroke-width', YAJIRUSI_WIDTH);
			path.id = svg.id + "_path";

			var path_shadow = document.createElementNS("http://www.w3.org/2000/svg", "path");//素の矢印の太さではクリックしづらい為、クリック判定用の線。
			path_shadow.setAttribute('d','');
			path_shadow.setAttribute('name','path_shadow');
			path_shadow.setAttribute('fill', 'none');
			path_shadow.setAttribute('stroke-width', YAJIRUSI_SHADOW_WIDTH);
			path_shadow.id = svg.id + "_path_shadow";

			var tri = document.createElementNS("http://www.w3.org/2000/svg", "path");//矢印の鏃の部分
			tri.setAttribute('d',"");
			tri.setAttribute('name',"tri");
			tri.setAttribute('fill', 'black');
			tri.setAttribute('stroke', 'black');
			tri.setAttribute('stroke-width', YAJIRUSI_WIDTH);

			svg.appendChild(path);
			svg.appendChild(path_shadow);
			svg.appendChild(tri);

			var tp = document.createElementNS("http://www.w3.org/2000/svg", "textPath");
			tp.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#" + path.id);
			tp.setAttribute("class", "ysjirusi_textPath_tooltip");
			var te = document.createElementNS("http://www.w3.org/2000/svg", "text");
			te.setAttribute("class", "ysjirusi_text_tooltip");
			te.setAttribute("fill", "purple");
			te.setAttribute("font-family", "sans-serif");
			te.setAttribute("font-size", "15");
			te.setAttribute("dy", "-10");
			te.setAttribute("text-anchor", "middle");
			te.appendChild(tp);
			svg.appendChild(te);
			var tp = document.createElementNS("http://www.w3.org/2000/svg", "textPath");
			tp.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#" + path.id);
			tp.textContent = start.getElementsByTagName("svg").length + 1;
			tp.setAttribute("class", "ysjirusi_textPath_priority");
			var te = document.createElementNS("http://www.w3.org/2000/svg", "text");
			te.setAttribute("class", "ysjirusi_text_priority");
			te.setAttribute("fill", "purple");
			te.setAttribute("font-family", "sans-serif");
			te.setAttribute("font-size", "15");
			te.setAttribute("dy", "20");
			te.setAttribute("text-anchor", "middle");
			te.appendChild(tp);
			svg.appendChild(te);

			start.appendChild(svg);
			IslayPub.character.yajirusi.tooltip(svg);
			IslayPub.character.yajirusi.move(svg, "init", init);

			IslayPub.undo_redo.add_history(["create_yajirusi", start.id.substr("maru_".length), maru.id.substr("maru_".length)]);

			return svg;
		}else{
			maru.setAttribute('yajirusu_start_point', 'yes');
		}
	}

	/**
	* 矢印のユニークなIDを生成する
	* @return {number} ユニークな矢印のID
	*/
	this.unique_id = function(){
		var count = 0;
		while(count < 10000){//10000:万一予防な
			if(!document.getElementById('yajirusi_'+count))break;
			count++;
		}
		return count;
	}

	/**
	* 指定した矢印に遷移条件の文字列を表示させる
	* @param {element} svg 対象となるSVG要素
	*/
	this.tooltip = function(svg){
		var t = "";
		var c = svg.getAttribute("transition_condition").split(":");
		switch(c[0]){
			case "none":
				t = IslayPub.language.condition_none[lang];
				break;
			case "loop":
				t = IslayPub.language.condition_loop[lang] + ":" + c[1] + IslayPub.language.times[lang];
				break;
			case "clicked":
				t =
					IslayPub.language.condition_clicked[lang] + ":" +
					(c[1] == "1"? IslayPub.language.left_click[lang]:"") +
					(c[2] == "1"? IslayPub.language.middle_click[lang]:"") +
					(c[3] == "1"? IslayPub.language.right_click[lang]:"");
				break;
			case "bump":
				t =
					IslayPub.language.condition_bump[lang] + ":" +
					(c[1] == "1"? IslayPub.language.top[lang]:"") +
					(c[2] == "1"? IslayPub.language.bottom[lang]:"") +
					(c[3] == "1"? IslayPub.language.left_edge[lang]:"") +
					(c[4] == "1"? IslayPub.language.right_edge[lang]:"") +
					(c[5] == "1"? (c[6] == "something"?IslayPub.language.something[lang]:document.querySelector("#character_tab_"+c[6]+" [name='character_tab_name']").textContent):"");
				break;
			case "random":
				t = IslayPub.language.condition_random[lang] + ":" + c[1] + "%";
				break;
			case "keydown":
				var a = String.fromCharCode(c[1]);
				switch(c[1]){
					case "38": a = "↑"; break;
					case "40": a = "↓"; break;
					case "37": a = "←"; break;
					case "39": a = "→"; break;
					case "13": a = IslayPub.language.enter_key[lang]; break;
					case "32": a = IslayPub.language.space_key[lang]; break;
				}
				t = IslayPub.language.condition_keydown[lang] + ':"' + a + '"';
				break;
			case "alone":
				t += IslayPub.language.condition_alone[lang];
				break;
			case "notice":
				t += IslayPub.language.condition_notice[lang] + ":" + c[1];
				break;
		}
		svg.querySelector(".ysjirusi_textPath_tooltip").textContent = t;
	}

	this.mouse_down = function(yajirusi){
		alert("mouse_down");
		event.stopPropagation();
		var edit_type = IslayPub.character.get_edit_type();
		switch(event.button){
			case 0://Left button
				switch (edit_type){
					case 'select':this.change_select(yajirusi);break;
					case 'move':
					case 'create':
					case 'yajirusi':window.onmousemove=function(){IslayPub.character.yajirusi.move(yajirusi,'yajirusi');};break;
					case 'delete':this.remove(yajirusi);break;
					case 'add_group': break;
				}
				break;
			case 1://Middle button
				break;
			case 2://Right button
				IslayPub.yajirusi_dialog.open(yajirusi);
				break;
			default:break;
		}
	}

	/**
	* 矢印がタッチされた時の処理
	* @param {element} yajirusi 対象となるSVG要素
	*/
	this.touch_start = function(yajirusi,event){
		alert("yazirusi touch start"+event.target);
		event.stopPropagation();
		var edit_type = IslayPub.character.get_edit_type();
		switch (edit_type){
			case 'select':this.change_select(yajirusi);break;
			case 'move':
			case 'create':
			case 'yajirusi':window.onmousemove=function(){IslayPub.character.yajirusi.move(yajirusi,'yajirusi');};break;
			case 'delete':this.remove(yajirusi);break;
			case 'add_group': break;
		}
		//IslayPub.yajirusi_dialog.open(yajirusi);
	}

	/** 指定された矢印の「せんたく」状態のオンオフをスイッチする */
	this.change_select = function(yajirusi){
		if(yajirusi.getAttribute("selected"))
			this.unselect(yajirusi);
		else
			this.select(yajirusi);
	}

	/** 指定された矢印を選択された状態にする */
	this.select = function(yajirusi){
		yajirusi.setAttribute("selected", "yes");
	}

	/** 指定された矢印の選択状態を解除する */
	this.unselect = function(yajirusi){
		yajirusi.removeAttribute("selected");
	}

	/** 全ての矢印の選択状態を解除する */
	this.reset_select = function(){
		Array.prototype.forEach.call(
			document.querySelectorAll("[name='yajirusi'][selected='yes']"),
			function(e){
				this.unselect(e);
			},
			this
		);
	}

	/** 指定した矢印の優先度を取得する */
	this.get_priority = function(yajirusi){//最優先度は0
		return yajirusi.parentNode.getElementsByTagName("svg").search_key_from_value(yajirusi);
	}

	/** 指定された「状態」から伸びる矢印の優先度を示すテキストをアップデートする */
	this.update = function(maru){
		var y = maru.getElementsByTagName("svg");
		var s = 0;
		while(y[s]){
			y[s].querySelector(".ysjirusi_textPath_priority").textContent = ++s;
		}
	}

	/**
	* 指定した矢印を削除する。
	* @param {element} yajirusi 削除したい矢印
	* @param {boolean} recursive この関数を使うときにこれを指定しないこと
	*/
	this.remove = function(yajirusi, recursive){
		if(recursive !== true && yajirusi.getAttribute("selected")){//対象が選択されている状態ならば
			IslayPub.undo_redo.add_history(["bundle", "start"]);
			Array.prototype.forEach.call(//選択された矢印を全て削除する
				document.querySelectorAll("[name='yajirusi'][selected='yes']"),
				function(e){
					this.remove(e, true);
				},
				this
			);
			IslayPub.undo_redo.add_history(["bundle", "end"]);
			return true;
		}

		var maru = yajirusi.parentNode;
		IslayPub.undo_redo.add_history(["remove_yajirusi", maru.id.substr("maru_".length), IslayPub.character.yajirusi.get_priority(yajirusi), yajirusi]);
		maru.removeChild(yajirusi);

		this.update(maru);
	}

	/**
	* 指定した矢印を動かす
	* @param {element} yajirusi　動かしたい矢印
	* @param {string} type 次のものを指定してください。矢印を動かす時'string:yajirusi'、丸が動かされた時'string:maru'、矢印を生成した時'string:init'
	* @param {Array} point 矢印を生成した時にpoint[2]を指定した場合、avgのdを指定できる(1は矢印の棒の、2は鏃の部分)
	*/
	this.move = function(yajirusi, type, point){
		var path = yajirusi.querySelector("[name='path']");
		var path_shadow = yajirusi.querySelector("[name='path_shadow']");
		var tri = yajirusi.querySelector("[name='tri']");
		var path_d;

		var rect = document.getElementById("canvases").getBoundingClientRect();
		if(type == "yajirusi" && (event.buttons != 1 || event.clientX < rect.left || rect.right < event.clientX || event.clientY < rect.top || rect.bottom < event.clientY)){//ドラッグが終わっていた、もしくはキャンバスの外にでていた場合
			window.onmousemove = null;
			IslayPub.undo_redo.add_history(["yajirusi_move", yajirusi.parentNode.id.substr("maru_".length), IslayPub.character.yajirusi.get_priority(yajirusi), this.start_d, this.last_d]);
			delete this.start_d;
			delete this.last_d;
			return;
		}

		if(type == "yajirusi" && typeof this.start_d === "undefined"){
			this.start_d = [path.getAttribute("d"), tri.getAttribute("d")];
		}

		if(typeof point !== "undefined"){
			path.setAttribute("d",point[0]);
			path_shadow.setAttribute("d",point[0]);
			tri.setAttribute("d",point[1]);
			//tooltip
			var texts = yajirusi.querySelector(".ysjirusi_text_tooltip");
			texts.setAttribute("dx", path.getTotalLength()/2);
			texts = yajirusi.querySelector(".ysjirusi_text_priority");
			texts.setAttribute("dx", path.getTotalLength()/2);
			return;
		}

		rect = yajirusi.parentNode.parentNode.getBoundingClientRect();
		var x = event.clientX-rect.left;
		var y = event.clientY-rect.top;

		var end_maru_center = document.getElementById(yajirusi.getAttribute('fromto')).style;//指されている丸の中心座標
		end_maru_center = {x:parseInt(end_maru_center.left) - parseInt(yajirusi.parentNode.style.left) + MARU_RAD / 2, y:parseInt(end_maru_center.top) - parseInt(yajirusi.parentNode.style.top) + MARU_RAD / 2};

		//矢印の線の部分の計算
		if(yajirusi.getAttribute('fromto') == yajirusi.parentNode.id){//自身参照矢印の場合
			if(type == 'maru')//丸を動かすときは矢印は変化しない
				return;

			var m = {x:event.clientX - yajirusi.parentNode.getBoundingClientRect().left-MARU_RAD/2, y:event.clientY - yajirusi.parentNode.getBoundingClientRect().top-MARU_RAD/2};
			var rad = Math.atan2(m.y, m.x);//矢印の向き(ラジアン)
			var deg = rad * 180 / Math.PI;//度
			var d = 0.5;//矢印の開始点と終了点の距離(ラジアン)
			var r = MARU_RAD/2;//半径
			var cc = {x:Math.cos(rad)*MARU_RAD+MARU_RAD/3, y:Math.sin(rad)*MARU_RAD+MARU_RAD/3};//円の中心
			var start = {x:Math.cos(rad - d)*MARU_RAD/2+MARU_RAD/2-MARU_BORDER_WIDTH, y:Math.sin(rad - d)*MARU_RAD/2+MARU_RAD/2-MARU_BORDER_WIDTH};//開始点
			var end = {x:Math.cos(rad + d)*MARU_RAD/2+MARU_RAD/2-MARU_BORDER_WIDTH, y:Math.sin(rad + d)*MARU_RAD/2+MARU_RAD/2-MARU_BORDER_WIDTH};//終了点
			var start_deg = Math.atan2(cc.y - start.y, cc.x - start.x) * 180 / Math.PI;
			path_d = "M "+start.x+","+start.y+" a "+r+","+r+" "+start_deg+" 1 1 "+(end.x-start.x)+","+(end.y-start.y);

			var tri_rad = rad + d;
		}else{//他の丸を指している矢印の場合
			var p = path.getAttribute('d').split(' ');

			var center;
			if(type == 'yajirusi'){//矢印自体を動かす時
				center = {x:event.clientX - yajirusi.parentNode.getBoundingClientRect().left, y:event.clientY - yajirusi.parentNode.getBoundingClientRect().top} ;
			}else if(type == "init"){//初期化時
				center = {x:(MARU_RAD/2 + end_maru_center.x)/2 - MARU_BORDER_WIDTH*2, y:(MARU_RAD/2 + end_maru_center.y)/2 - MARU_BORDER_WIDTH*2}
			}else{//丸を動かす時
				center = {x:parseFloat(p[4]), y:parseFloat(p[5])};
			}

			var start_rad = Math.atan2(center.y - MARU_RAD/2, center.x - MARU_RAD/2);
			var start = {x:Math.cos(start_rad)*MARU_RAD/2+MARU_RAD/2-MARU_BORDER_WIDTH, y:Math.sin(start_rad)*MARU_RAD/2+MARU_RAD/2-MARU_BORDER_WIDTH};//開始点
			var end_rad = Math.atan2(center.y - end_maru_center.y, center.x - end_maru_center.x);
			var end = {x:Math.cos(end_rad)*MARU_RAD/2+end_maru_center.x-MARU_BORDER_WIDTH, y:Math.sin(end_rad)*MARU_RAD/2+end_maru_center.y-MARU_BORDER_WIDTH};//終了点

			var s = {x:(start.x + end.x)/2, y:(start.y + end.y)/2};
			var cp;//control point
			if(type == "maru"){
				start = {x:parseFloat(p[1]), y:parseFloat(p[2])};
				cp = {x:parseFloat(p[4]), y:parseFloat(p[5])};
			}else{
				cp = {x:s.x + (center.x - s.x)*2, y:s.y + (center.y - s.y)*2};
			}
			path_d = "M "+start.x+" "+start.y+" Q "+cp.x+" "+cp.y+" "+end.x+" "+end.y;

			var tri_rad = Math.atan2(cp.y - end_maru_center.y, cp.x - end_maru_center.x);
		}
		//矢印の鏃の部分の計算
		var tri_size = 6;
		var a = {x:Math.cos(tri_rad)*tri_size*1.7 + end.x, y:Math.sin(tri_rad)*tri_size*1.7 + end.y};
		var tp1 = {x:a.x + Math.cos(tri_rad-1.5708)*tri_size, y:a.y + Math.sin(tri_rad-1.5708)*tri_size};
		var tp2 = {x:a.x + Math.cos(tri_rad+1.5708)*tri_size, y:a.y + Math.sin(tri_rad+1.5708)*tri_size};

		//計算結果を適用
		tri.setAttribute('d','M '+end.x+" "+end.y+" L "+tp1.x+" "+tp1.y+" L "+tp2.x+" "+tp2.y+" z");
		path.setAttribute("d", path_d);
		path_shadow.setAttribute("d", path_d);

		//tooltip
		var texts = yajirusi.querySelector(".ysjirusi_text_tooltip");
		texts.setAttribute("dx", path.getTotalLength()/2);
		texts = yajirusi.querySelector(".ysjirusi_text_priority");
		texts.setAttribute("dx", path.getTotalLength()/2);

		this.last_d = [path.getAttribute("d"), tri.getAttribute("d")];
	}
}//end of yajirusi
