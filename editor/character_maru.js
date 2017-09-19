/**
* @fileoverview 「状態」関係の処理の為の関数があるよ
* @author 鈴木一臣
*/

/**
* 編集における丸関係のメソッドの集まり
* @namespace
*/
IslayPub.character.maru = new function(){
	/**
	* 「状態」を生成する
	* 「状態」の位置はcanvasの左上からの相対座標
	*/
	/*
	this.create = function(){
		//decide id
		var count = this.unique_id();

		//create element
		var maru = document.createElement('div');
		maru.setAttribute('class', 'maru');
		maru.setAttribute('name', 'maru');
		maru.setAttribute('id', 'maru_' + count);
		maru.setAttribute('onmousedown', 'IslayPub.character.maru.mouse_down(this)');
		maru.setAttribute('action1', 'none');
		maru.setAttribute('action2', 'none');
		maru.dataset.se = 'none';//("音楽のid:play type(once, state_loop, charcter_loopのいずれか):title:volume") or ("none")
		maru.innerHTML =
			"<img src='" + INITIAL_IMG_SETTING + "' width=55 height=55 alt='' class='maru_img' draggable=false ondragstart='return false;'>" +
			"<span class='maru_name' name='maru_name'>" + IslayPub.language.state[lang] + count + "</span>";
		maru.addEventListener("mouseover", this.pop_tooltip);

		//set possition
		try{
			var rect = document.getElementById('canvases').lastChild.getBoundingClientRect();
			var x = event.clientX - rect.left - MARU_RAD/2;
			var y = event.clientY - rect.top - MARU_RAD/2;
			maru.setAttribute('style', 'top:' + y + 'px;left:' + x + 'px;');
		}catch(e){}

		document.getElementById('canvases').lastChild.appendChild(maru);

		IslayPub.undo_redo.add_history(["create_state", count, document.getElementById('canvases').lastChild.id.substr('canvas_'.length), x ,y]);

		return maru;
	}*/

	this.create = function(event){
		//decide id
		var count = this.unique_id();

		//create element
		var maru = document.createElement('div');
		maru.setAttribute('class', 'maru');
		maru.setAttribute('name', 'maru');
		maru.setAttribute('id', 'maru_' + count);
		//maru.setAttribute('onmousedown', 'IslayPub.character.maru.mouse_down(this)');
		maru.setAttribute('ontouchstart', 'IslayPub.character.maru.touch_start(this,event)');

		/*maru.ontouchstart = function(event){
			IslayPub.character.maru.touch_start(this,event);
		};*/
		maru.setAttribute('action1', 'none');
		maru.setAttribute('action2', 'none');
		maru.dataset.se = 'none';//("音楽のid:play type(once, state_loop, charcter_loopのいずれか):title:volume") or ("none")
		maru.innerHTML =
			"<img src='" + INITIAL_IMG_SETTING + "' width=55 height=55 alt='' class='maru_img' draggable=false ondragstart='return false;'>" +
			"<span class='maru_name' name='maru_name'>" + IslayPub.language.state[lang] + count + "</span>";
		//maru.addEventListener("mouseover", this.pop_tooltip);

		//set possition
		try{
			var rect = document.getElementById('canvases').lastChild.getBoundingClientRect();
			var x = event.changedTouches[0].pageX - rect.left - MARU_RAD/2;
			var y = event.changedTouches[0].pageY - rect.top - MARU_RAD/2;
			maru.setAttribute('style', 'top:' + y + 'px;left:' + x + 'px;');
		}catch(e){alert(e);}

		document.getElementById('canvases').lastChild.appendChild(maru);

		IslayPub.undo_redo.add_history(["create_state", count, document.getElementById('canvases').lastChild.id.substr('canvas_'.length), x ,y]);

		return maru;
	}


	/** マウスが丸の中に入ったらツールチップを出し、前回の分を消す */
	this.pop_tooltip = function(){
		if(!event.currentTarget.querySelector(".tooltip")){
			var a = document.querySelector(".tooltip");
			if(a)
				a.parentNode.removeChild(a);

			event.currentTarget.innerHTML += "<div class='tooltip'>"+IslayPub.character.maru.tooltip(event.currentTarget)+"</div>";
		}
	}

	/** 「状態」のユニークなIDを生成する */
	this.unique_id = function(){
		var count = 0;
		while(count < 10000){//10000:万一予防な
			if(!document.getElementById('maru_'+count))break;
			count++;
		}
		return count;
	}

	/**
	* tooltipの中身を返す
	* @param {element} maru ツールチップを生成したい「状態」の要素
	* @return {string} ツールチップの中身となるHTML文
	*/
	this.tooltip = function(maru){
		var a = maru.getAttribute('action1').split(':');
		var t = "<span>" + IslayPub.language["action1"][lang] + "<br>" + IslayPub.language["action1_" + a[0]][lang] + "</span>";
		switch(a[0]){
			case 'none':break;
			case 'move':
			case 'hurahuramove':
				if(Number(a[1]) < 0)
					t += IslayPub.language["left"][lang] + " : " + (Number(a[1]) * -1);
				else
					t += IslayPub.language["right"][lang] + " : " + a[1];
				t += "  ";
				if(Number(a[2]) < 0)
					t += IslayPub.language["up"][lang] + " : " + (Number(a[2]) * -1);
				else
					t += IslayPub.language["down"][lang] + " : " + a[2];
				break;
			case 'jump':
				t += a[1] + " : " + a[2];
				break;
			case 'randomjump':
				t += IslayPub.language["up"][lang] + ((a[1] == 1)?"○":"×") + " " +
				IslayPub.language["down"][lang] + ((a[2] == 1)?"○":"×") + " " +
				IslayPub.language["left"][lang] + ((a[3] == 1)?"○":"×") + " " +
				IslayPub.language["right"][lang] + ((a[4] == 1)?"○":"×");
				break;
			case 'follow':
				if(a[1] == "parent")
					t += IslayPub.language["parent"][lang];
				else
					t += document.getElementById("character_tab_" + a[1]).querySelector("[name='character_tab_name']").textContent;
				break;
		}

		a = maru.getAttribute('action2').split(':');
		t += "<hr><span>" + IslayPub.language["action2"][lang] + "<br>" + IslayPub.language["action2_" + a[0]][lang] + "</span>";
		switch(a[0]){
			case "none":break;
			case "change":break;
			case "makecharacter":
				t += document.getElementById("character_tab_" + a[1]).querySelector("[name='character_tab_name']").textContent +
				" : " + document.getElementById("maru_" + a[2]).querySelector("[name='maru_name']").textContent;
				break;
			case "makegroup":
				t += document.getElementById("group_tab_" + a[1]).querySelector("[name='group_tab_name']").textContent;
				break;
			case "notice":
			case "message":
				t += a[1].htmlEscape();
				break;
			case "changespeed":
				t += IslayPub.language["speed_" + a[1]][lang] + " : " + a[2];
				break;
			case "deleted":break;
			case "exit":break;
		}

		return t;
	}

	/**
	* 「状態」画クリックされた時の処理
	* @param {element} maru クリックされた「状態」の要素
	*/
	/*this.mouse_down = function(maru){
		event.stopPropagation();
		var edit_type = IslayPub.character.get_edit_type();
		switch (event.button){
			case 0://Left button
				switch (edit_type){
					case 'select':this.change_select(maru);break;
					case 'move':
					case 'create':window.onmousemove = function(){IslayPub.character.maru.move(maru);}; break;
					case 'yajirusi':IslayPub.character.yajirusi.create(maru); break;
					case 'delete':this.remove(maru); break;
					case 'add_group':
						var clone = maru.cloneNode(true);
						clone.setAttribute("onmousedown", "event.stopPropagation();");
						while(clone.querySelector("svg")){
							clone.querySelector("svg").parentNode.removeChild(clone.querySelector("svg"));
						}
						clone.classList.add("adding_group");
						maru.parentNode.appendChild(clone);
						var s = function(){
							var rect = maru.parentNode.getBoundingClientRect();
							var x = event.clientX-rect.left-MARU_RAD/2;
							var y = event.clientY-rect.top-MARU_RAD/2;
							clone.setAttribute('style', 'top:'+y+'px;left:'+x+'px;');

							//グループタブにマウスが乗ったらタブを動かして、そのタブが選ばれている事を視覚的に示す。
							var a = document.elementFromPoint(event.clientX, event.clientY);
							if(a.parentNode.getAttribute("name") == "group_tab"){
								a = a.parentNode;
							}
							if(document.querySelector(".hovered_group_tab"))
								document.querySelector(".hovered_group_tab").classList.remove("hovered_group_tab");
							if(a.getAttribute("name") == "group_tab" && event.buttons == 1){
								a.classList.add("hovered_group_tab");
							}

							if(event.buttons != 1){
								var id = clone.id;
								clone.parentNode.removeChild(clone);
								window.onmousemove = event.stopPropagation();
								var g = document.elementFromPoint(event.clientX, event.clientY);
								if(g.parentNode.getAttribute("name") == "group_tab"){
									g = g.parentNode;
								}else if(g.getAttribute("name") != "group_tab"){
									return;
								}
								IslayPub.group.add(g.id.substr('group_tab_'.length), id.substr('maru_'.length));
								alert(IslayPub.language.alert15[lang](clone.querySelector("[name='maru_name']").textContent, g.querySelector("[name='group_tab_name']").textContent));
							}
						};
						s();
						window.onmousemove = s;

						break;
				}
				break;
			case 1://Middle button
				break;
			case 2://Right button
				IslayPub.maru_dialog.open(maru);
				break;
			default:break;
		}
	}*/
	/**
	* 「状態」画タッチされた時の処理
	* @param {element} maru クリックされた「状態」の要素
	*/
	this.touch_start = function(maru,event){
		event.stopPropagation();
		var edit_type = IslayPub.character.get_edit_type();
		switch (edit_type){
			case 'select':this.change_select(maru);break;
			case 'move':
			case 'create':
										maru.ontouchmove = function(event){
											event = event || window.event;
										  event.stopPropagation();
											IslayPub.character.maru.move(maru,event);
									  };
										maru.ontouchend = function(){//ドラッグが終わったら
											maru.ontouchmove = null;
										};
										//maru.setAttribute('ontouchmove', 'IslayPub.character.maru.move(this,event)');
										break;
			case 'yajirusi':IslayPub.character.yajirusi.create(maru); break;
			case 'delete':this.remove(maru); break;
			case 'add_group':
				var clone = maru.cloneNode(true);
				clone.setAttribute("onmousedown", "event.stopPropagation();");
				while(clone.querySelector("svg")){
					clone.querySelector("svg").parentNode.removeChild(clone.querySelector("svg"));
				}
				clone.classList.add("adding_group");
				maru.parentNode.appendChild(clone);
				var s = function(){
					var rect = maru.parentNode.getBoundingClientRect();
					var x = event.clientX-rect.left-MARU_RAD/2;
					var y = event.clientY-rect.top-MARU_RAD/2;
					clone.setAttribute('style', 'top:'+y+'px;left:'+x+'px;');

					//グループタブにマウスが乗ったらタブを動かして、そのタブが選ばれている事を視覚的に示す。
					var a = document.elementFromPoint(event.clientX, event.clientY);
					if(a.parentNode.getAttribute("name") == "group_tab"){
						a = a.parentNode;
					}
					if(document.querySelector(".hovered_group_tab"))
						document.querySelector(".hovered_group_tab").classList.remove("hovered_group_tab");
					if(a.getAttribute("name") == "group_tab" && event.buttons == 1){
						a.classList.add("hovered_group_tab");
					}

					if(event.buttons != 1){
						var id = clone.id;
						clone.parentNode.removeChild(clone);
						window.onmousemove = event.stopPropagation();
						var g = document.elementFromPoint(event.clientX, event.clientY);
						if(g.parentNode.getAttribute("name") == "group_tab"){
							g = g.parentNode;
						}else if(g.getAttribute("name") != "group_tab"){
							return;
						}
						IslayPub.group.add(g.id.substr('group_tab_'.length), id.substr('maru_'.length));
						alert(IslayPub.language.alert15[lang](clone.querySelector("[name='maru_name']").textContent, g.querySelector("[name='group_tab_name']").textContent));
					}
				};
				s();
				window.onmousemove = s;

				break;
		}//end of switch (edit_type)
		//IslayPub.maru_dialog.open(maru);
	}//end of this.touch_start

	/**
	* 対象が選択中かどうかの状態を反転させる
	* @param {element} target 選択状態を反転させたい「状態」の要素
	*/
	this.change_select = function(target){
		if(target.getAttribute("selected"))
			this.unselect(target);
		else
			this.select(target);
	}

	/**
	* 対象を選択
	* @param {element} target 選択したい「状態」
	*/
	this.select = function(target){
		target.setAttribute("selected", "yes");
		Array.prototype.forEach.call(target.querySelectorAll("svg"),
			function(e){
				IslayPub.character.yajirusi.select(e);
		});
		Array.prototype.forEach.call(document.querySelectorAll("[fromto="+target.id+"]"),
			function(e){
				IslayPub.character.yajirusi.select(e);
		});
	}


	/**
	* 対象の選択を解除
	* @param {element} target 選択を解除したい「状態」
	*/
	this.unselect = function(target){
		target.removeAttribute("selected");
		Array.prototype.forEach.call(target.querySelectorAll("svg"),
			function(e){
				if(!document.getElementById(e.getAttribute("fromto")).getAttribute("selected"))
					IslayPub.character.yajirusi.unselect(e);
		});
		Array.prototype.forEach.call(document.querySelectorAll("[fromto="+target.id+"]"),
			function(e){
				if(!e.parentNode.getAttribute("selected"))
					IslayPub.character.yajirusi.unselect(e);
		});
	}

	/** 全ての選択状態を解除 */
	this.reset_select = function(){
		Array.prototype.forEach.call(
			document.querySelectorAll("[selected='yes']"),
			function(e){
				this.unselect(e);
			},
			this
		);
	}

	/** 全ての「状態」を選択 */
	this.select_all = function(){
		Array.prototype.forEach.call(
			document.querySelectorAll(".canvas:last-child > [name='maru']"),
			function(a){IslayPub.character.maru.select(a);}
		);
	}

	/**
	* 指定された「状態」を関連付けられいるものも含めて削除する
	* @param {element} maru 削除したい「状態」の要素
	* @param {boolean} recursive 再起の時だけ使うやつだから、指定しないで
	*/
	this.remove = function(maru, recursive){
		if(recursive !== true && maru.getAttribute("selected")){//対象が選択されている状態ならば
			IslayPub.undo_redo.add_history(["bundle", "start"]);
			Array.prototype.forEach.call(//選択された丸を全て削除する
				document.querySelectorAll("[name='maru'][selected='yes']"),
				function(e){
					this.remove(e, true);
				},
				this
			);
			IslayPub.undo_redo.add_history(["bundle", "end"]);
			return true;
		}

		IslayPub.undo_redo.add_history(["bundle", "start"]);

		//関連物を列挙
		var yajirusi = document.querySelectorAll("svg[fromto='"+maru.id+"']");
		var group = document.querySelectorAll("div[group_maru_id='"+maru.id.substr('maru_'.length)+"']:not(.deleting)");
		var action2_change = document.querySelectorAll("div[action2='change:" + maru.parentNode.id.substr('canvas_'.length) + ":" + maru.id.substr('maru_'.length) + "']");
		var action2_makecharacter = document.querySelectorAll("div[action2='makecharacter:" + maru.parentNode.id.substr('canvas_'.length) + ":" + maru.id.substr('maru_'.length) + "']");

		if(yajirusi.length > 0 || group.length > 0 || action2_change.length > 0 || action2_makecharacter.length > 0){
			Array.prototype.forEach.call(yajirusi, function(a){
				IslayPub.character.yajirusi.remove(a);
			});
			Array.prototype.forEach.call(group, function(a){
				IslayPub.group.remove(a);
			});
			Array.prototype.forEach.call(action2_change, function(a){
				IslayPub.undo_redo.add_history(["change_action", a.id.substr('maru_'.length), {"action2":{"before":a.getAttribute("action2"), "after":"none"}}]);
				a.setAttribute("action2","none");
				IslayPub.character.maru.tooltip(a);
			});
			Array.prototype.forEach.call(action2_makecharacter, function(a){
				IslayPub.undo_redo.add_history(["change_action", a.id.substr('maru_'.length), {"action2":{"before":a.getAttribute("action2"), "after":"none"}}]);
				a.setAttribute("action2","none");
				IslayPub.character.maru.tooltip(a);
			});
		}
		IslayPub.undo_redo.add_history(["remove_state", maru.parentNode.id.substr('canvas_'.length), maru]);
		IslayPub.undo_redo.add_history(["bundle", "end"]);

		maru.parentNode.removeChild(maru);
	}

	/**
	* 「状態」を移動させる
	* @param {element} maru 動かしたい「状態」
	* @param {Object} point point{x,y}を指定すれば、その位置に移動させることが出来る
	*/
	this.move = function(maru,event,point){
		event.preventDefault();
		if(typeof point === "undefined"){//タッチかマウスで動かしてる時
			var rect = document.getElementById("canvases").getBoundingClientRect();
			//alert(rect.left + ":" + rect.right + ":" + rect.top + ":" + rect.bottom);
			if(event.changedTouches[0].pageX < rect.left || rect.right < event.changedTouches[0].pageX || event.changedTouches[0].pageY < rect.top || rect.bottom < event.changedTouches[0].pageY){//キャンバスの外にでていた場合
				window.ontouchmove = null;
				//maru.setAttribute('ontouchmove', '');
				//window.removeEventListener("touchmove",IslayPub.character.maru.move(maru,event),false);
				if(this.move_start_x){
					if(maru.getAttribute("selected")){
						IslayPub.undo_redo.add_history(["bundle", "start"]);

						var difference_x = parseInt(maru.style.left) - this.move_start_x;
						var difference_y = parseInt(maru.style.top) - this.move_start_y;
						Array.prototype.forEach.call(
							document.querySelectorAll("[name='maru'][selected='yes']"),
							function(e){
								IslayPub.undo_redo.add_history(["state_move", e.id.substr('maru_'.length), parseInt(e.style.left) - difference_x, parseInt(e.style.top) - difference_y, parseInt(e.style.left), parseInt(e.style.top)]);
							}
						);

						IslayPub.undo_redo.add_history(["bundle", "end"]);
					}else{
						IslayPub.undo_redo.add_history(["state_move", maru.id.substr('maru_'.length), this.move_start_x, this.move_start_y, parseInt(maru.style.left), parseInt(maru.style.top)]);
					}
				}
				delete this.move_start_x;
				delete this.move_start_y;
				return;
			}

			if(typeof this.move_start_x === "undefined"){
				this.move_start_x = parseInt(maru.style.left);
				this.move_start_y = parseInt(maru.style.top);
				return;
			}
			rect = maru.parentNode.getBoundingClientRect();
			//移動量の計算
			var x = event.changedTouches[0].pageX - rect.left-MARU_RAD/2;
			var difference_x = x - parseInt(maru.style.left);
			var y = event.changedTouches[0].pageY - rect.top-MARU_RAD/2;
			var difference_y = y - parseInt(maru.style.top);
			event = null;//?

			if(maru.getAttribute("selected")){//移動している丸が選択されている状態ならば
				Array.prototype.forEach.call(//選択された丸を全て移動させる
					document.querySelectorAll("[name='maru'][selected='yes']"),
					function(e){
						if(e !== maru)
							this.move(e, {x: parseInt(e.style.left) + difference_x, y: parseInt(e.style.top) + difference_y});
					},
					this
				);
			}

			maru.setAttribute('style', 'top:'+y+'px;left:'+x+'px;');
		}else{//座標を指定されて動く時
			maru.setAttribute('style', 'top:'+point.y+'px;left:'+point.x+'px;');
		}

		//動かしている丸を指している矢印の処理
		var yajirusis = document.querySelectorAll("svg[fromto='"+maru.id+"']");
		Array.prototype.forEach.call(yajirusis, function(ya){
			IslayPub.character.yajirusi.move(ya,"maru");
		});
		//動かしている丸の矢印の処理
		yajirusis = maru.querySelectorAll("svg");
		Array.prototype.forEach.call(yajirusis, function(ya){
			IslayPub.character.yajirusi.move(ya,"maru");
		});
	}
}//end of maru
