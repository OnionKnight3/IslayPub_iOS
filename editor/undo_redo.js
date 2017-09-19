/**
* @fileoverview redoとundoに関する関数群<br>
* historyに次の「操作内容」を入れていく。<br>
* 状態の生成			["create_state", id, tab_id, x, y]<br>
* 状態の削除			["remove_state", tab_id, dom]<br>
* 状態の移動			["state_move", id, 元のX座標, 元のY座標, 移動後のX座標, 移動後のY座標]<br>
* 状態の変更			["change_action", id, {name:*, img:*, action1:*, action2:*}]*={before:"string",after:"string"}(変更無しの場合、プロパティ無し)<br>
* 矢印の生成			["create_yajirusi", from(id), to(id)]<br>
* 矢印の削除			["remove_yajirusi", from(id), *priority, dom]*priority=優先度。つまりその矢印は上から何番目のものだったか(0から始まる)。<br>
* 矢印の移動			["yajirusi_move", from(id), priority, start_d[2], last_d[2]]<br>
* 矢印の条件の変更		["change_condition", from(id), priority, {before:*, after:*}]<br>
* キャラクタの生成		["create_character", id]<br>
* キャラクタの削除		["remove_character", id, name]<br>
* キャラクタの移動		["move_character", old_position, new_position]<br>
* キャラクタの名前の変更	["change_name_character", id, old_name, new_name]<br>
* グループの生成			["create_group", id]<br>
* グループの削除			["remove_group", id, name, position]<br>
* グループの移動			["group_move", old_position, new_position]<br>
* グループの名前の変更		["group_rename", id, old_name, new_name]<br>
* グループメンバの追加		["add_group_member", group_id, maru_id]<br>
* グループメンバの削除		["remove_group_member", group_id, group_member([id, z_index]), position]<br>
* グループメンバの移動		["move_group_member", group_id, old_position, new_position]<br>
* グループメンバのz_index変更["change_group_member_z_index", group_id, position, old_z_index, new_z_index]<br>
* ペースト				["paste", tab_id, targets]targets=丸がarrayに入ってる<br>
* システムの変更			["change_system", {speed: *, width: *, height: *, background_color: *, wall: *}]*={before:"string",after:"string"}(変更無しの場合、プロパティ無し)<br>
* 範囲選択で複数同時変更があった場合等時開始と終了点に["bundle", "start"or"end"]<br>
* @author 鈴木一臣
*/

/**
* undoとredo関係のメソッドの集まり
* @namespace
*/
IslayPub.undo_redo = new function(){
	/** @private {array.<array>} 操作履歴が入っていく */
	this.history = new Array();
	/** @private {number} 今historyの何処にいるかを示す */
	this.now = 0;
	/** @private {number} historyの末尾を示す */
	this.max = 0;
	/**
	* trueならundo,redoする時historyに追加するのを阻止な。undo,redo時の操作まで履歴に突っ込まないようにする為の
	* @type {boolean}
	*/
	this.flag = true;
	
	/**
	* 操作履歴に操作内容を追加する。
	* @param {操作内容} 操作内容
	*/
	this.add_history = function(action){
		if(this.flag){//console.log("add", this.now, action);
			document.getElementById("character_undo_button").classList.remove("disabled_button");
			document.getElementById("character_redo_button").classList.add("disabled_button");
			
			this.history[this.now++] = action;
			this.max = this.now;
		}
	}
	
	/** 操作履歴をリセットする */
	this.clear_history = function(){
		this.history = new Array();
		this.now = 0;
		this.max = 0;
		
		document.getElementById("character_undo_button").classList.add("disabled_button");
		document.getElementById("character_redo_button").classList.add("disabled_button");
	}
	
	/** undoする */
	this.undo = function(){
		IslayPub.character.maru.reset_select();
		IslayPub.character.yajirusi.reset_select();
		if(this.now != 0){//console.log("undo", this.now-1, this.history[this.now-1]);
			this.flag = false;
			this.now--;
			switch(this.history[this.now][0]){
				case "create_state":
					var maru = document.getElementById("maru_" + this.history[this.now][1]);
					IslayPub.character.maru.unselect(maru);
					IslayPub.character.maru.remove(maru);
					break;
				case "remove_state":
					document.getElementById("canvas_" + this.history[this.now][1]).appendChild(this.history[this.now][2].cloneNode(true));
					break;
				case "state_move":
					IslayPub.character.maru.move(document.getElementById("maru_" + this.history[this.now][1]), {x:this.history[this.now][2], y:this.history[this.now][3]});
					break;
				case "change_action":
					var target = document.getElementById("maru_" + this.history[this.now][1]);
					if(this.history[this.now][2]["name"])
						target.querySelector("[name='maru_name']").textContent = this.history[this.now][2]["name"]["before"];
					if(this.history[this.now][2]["img"])
						target.getElementsByTagName('img')[0].src = this.history[this.now][2]["img"]["before"];
					if(this.history[this.now][2]["se"])
						target.dataset.se = this.history[this.now][2]["se"]["before"];
					if(this.history[this.now][2]["action1"])
						target.setAttribute('action1', this.history[this.now][2]["action1"]["before"]);
					if(this.history[this.now][2]["action2"])
						target.setAttribute('action2', this.history[this.now][2]["action2"]["before"]);
					break;
				case "create_yajirusi":
					var target = document.getElementById("maru_" + this.history[this.now][1]).getElementsByTagName('svg');
					target = target[target.length - 1];
					IslayPub.character.yajirusi.remove(target);
					break;
				case "remove_yajirusi":
					var p = document.getElementById("maru_" + this.history[this.now][1]);
					p.insertBefore(this.history[this.now][3].cloneNode(true), p.getElementsByTagName("svg")[this.history[this.now][2]]);
					IslayPub.character.yajirusi.update(p);
					break;
				case "yajirusi_move":
					var target = document.getElementById("maru_" + this.history[this.now][1]).getElementsByTagName("svg")[this.history[this.now][2]];
					target.querySelector("[name='path']").setAttribute("d", this.history[this.now][3][0]);
					target.querySelector("[name='tri']").setAttribute("d", this.history[this.now][3][1]);
					IslayPub.character.yajirusi.move(target, "maru");
					break;
				case "change_condition":
					var target = document.getElementById("maru_" + this.history[this.now][1]).getElementsByTagName("svg")[this.history[this.now][2]];
					target.setAttribute('transition_condition', this.history[this.now][3]["before"]);
					IslayPub.character.yajirusi.tooltip(target);
					break;
				case "create_character":
					IslayPub.character.tab.remove(this.history[this.now][1]);
					break;
				case "remove_character":
					var created = IslayPub.character.tab.create(this.history[this.now][1]);
					IslayPub.character.tab.rename(created.id.substr("character_tab_".length), this.history[this.now][2]);
					break;
				case "move_character":
					var p = document.getElementById("character_tabs");
					if(p.childNodes.length == this.history[this.now][1]+1)
						p.appendChild(p.childNodes[this.history[this.now][2]]);
					else{
						var t = p.childNodes[this.history[this.now][2]];
						p.removeChild(p.childNodes[this.history[this.now][2]]);
						p.insertBefore(t, p.childNodes[this.history[this.now][1]]);
					}
					break;
				case "change_name_character":
					IslayPub.character.tab.rename(this.history[this.now][1], this.history[this.now][2]);
					break;
				case "create_group":
					document.getElementById("group_tab_" + this.history[this.now][1]).click();
					IslayPub.group.tab.remove(document.getElementsByName("group_tab").length - 1);
					break;
				case "remove_group":
					var created = IslayPub.group.tab.create(this.history[this.now][1], this.history[this.now][2]);
					var group_tabs = document.getElementById("group_tabs");
					var p = group_tabs.childNodes[this.history[this.now][3]];
					if(created !== p)
						group_tabs.insertBefore(created, p);
					break;
				case "group_move":
					var p = document.getElementById("group_tabs");
					if(p.childNodes.length == this.history[this.now][1]+1)
						p.appendChild(p.childNodes[this.history[this.now][2]]);
					else{
						var t = p.childNodes[this.history[this.now][2]];
						p.removeChild(p.childNodes[this.history[this.now][2]]);
						p.insertBefore(t, p.childNodes[this.history[this.now][1]]);
					}
					break;
				case "group_rename":
					IslayPub.group.tab.rename(this.history[this.now][1], this.history[this.now][2]);
					break;
				case "add_group_member":
					IslayPub.group.remove(this.history[this.now][1], IslayPub.group.list[this.history[this.now][1]].length-1);
					break;
				case "remove_group_member":
					IslayPub.group.add(this.history[this.now][1], this.history[this.now][2][0], this.history[this.now][2][1], this.history[this.now][3]);
					break;
				case "move_group_member":
					IslayPub.group.move_to(this.history[this.now][1], this.history[this.now][3], this.history[this.now][2]);
					break;
				case "change_group_member_z_index":
					IslayPub.group.list[this.history[this.now][1]][this.history[this.now][2]][1] = this.history[this.now][3];
					break;
				case "paste":
					var c = document.getElementById("canvas_" + this.history[this.now][1]);
					this.history[this.now][2].forEach(function(e){c.removeChild(document.getElementById(e.id));});
					break;
				case "change_system":
					if(this.history[this.now][1]["speed"])
						document.getElementById("system_speed_input").value = this.history[this.now][1]["speed"]["before"];
					if(this.history[this.now][1]["width"])
						document.getElementById("system_width").value = this.history[this.now][1]["width"]["before"];
					if(this.history[this.now][1]["height"])
						document.getElementById("system_height").value = this.history[this.now][1]["height"]["before"];
					if(this.history[this.now][1]["background_color"])
						document.getElementById("system_background_color").value = this.history[this.now][1]["background_color"]["before"];
					if(this.history[this.now][1]["wall"])
						document.getElementById("system_wall").checked = this.history[this.now][1]["wall"]["before"];
					break;
			}
			this.flag = true;
			document.getElementById("character_redo_button").classList.remove("disabled_button");
		}
		if(this.now == 0){
			document.getElementById("character_undo_button").classList.add("disabled_button");
			return;
		}
		if(this.history[this.now][0] == "bundle" && this.history[this.now][1] == "end")
			this.bundle("undo");
	}//end of "undo"
	
	/** redoする */
	this.redo = function(){
		IslayPub.character.maru.reset_select();
		IslayPub.character.yajirusi.reset_select();
		if(this.now != this.max){//console.log("redo", this.now, this.history[this.now]);
			this.flag = false;
			switch(this.history[this.now][0]){
				case "create_state":
					document.getElementById("character_tab_" + this.history[this.now][2]).click();
					var created = IslayPub.character.maru.create();
					created.id = "maru_" + this.history[this.now][1];
					created.setAttribute('style', 'top:' + this.history[this.now][4] + 'px;left:' + this.history[this.now][3] + 'px;');
					break;
				case "remove_state":
					IslayPub.character.maru.remove(document.getElementById(this.history[this.now][2].id));
					break;
				case "state_move":
					IslayPub.character.maru.move(document.getElementById("maru_" + this.history[this.now][1]), {x:this.history[this.now][4], y:this.history[this.now][5]});
					break;
				case "change_action":
					var target = document.getElementById("maru_" + this.history[this.now][1]);
					if(this.history[this.now][2]["name"])
						target.querySelector("[name='maru_name']").textContent = this.history[this.now][2]["name"]["after"];
					if(this.history[this.now][2]["img"])
						target.getElementsByTagName('img')[0].src = this.history[this.now][2]["img"]["after"];
					if(this.history[this.now][2]["se"])
						target.dataset.se = this.history[this.now][2]["se"]["after"];
					if(this.history[this.now][2]["action1"])
						target.setAttribute('action1', this.history[this.now][2]["action1"]["after"]);
					if(this.history[this.now][2]["action2"])
						target.setAttribute('action2', this.history[this.now][2]["action2"]["after"]);
					break;
				case "create_yajirusi":
					IslayPub.character.yajirusi.create(document.getElementById("maru_" + this.history[this.now][1]));
					IslayPub.character.yajirusi.create(document.getElementById("maru_" + this.history[this.now][2]));
					break;
				case "remove_yajirusi":
					IslayPub.character.yajirusi.remove(document.getElementById("maru_" + this.history[this.now][1]).getElementsByTagName("svg")[this.history[this.now][2]]);
					break;
				case "yajirusi_move":
					var target = document.getElementById("maru_" + this.history[this.now][1]).getElementsByTagName("svg")[this.history[this.now][2]];
					target.querySelector("[name='path']").setAttribute("d", this.history[this.now][4][0]);
					target.querySelector("[name='tri']").setAttribute("d", this.history[this.now][4][1]);
					IslayPub.character.yajirusi.move(target, "maru");
					break;
				case "change_condition":
					var target = document.getElementById("maru_" + this.history[this.now][1]).getElementsByTagName("svg")[this.history[this.now][2]];
					target.setAttribute('transition_condition', this.history[this.now][3]["after"]);
					IslayPub.character.yajirusi.tooltip(target);
					break;
				case "create_character":
					IslayPub.character.tab.create(this.history[this.now][1]);
					break;
				case "remove_character":
					IslayPub.character.tab.remove(this.history[this.now][1]);
					break;
				case "move_character":
					var p = document.getElementById("character_tabs");
					if(p.childNodes.length == this.history[this.now][2]+1)
						p.appendChild(p.childNodes[this.history[this.now][1]]);
					else{
						var t = p.childNodes[this.history[this.now][1]];
						p.removeChild(p.childNodes[this.history[this.now][1]]);
						p.insertBefore(t, p.childNodes[this.history[this.now][2]]);
					}
					break;
				case "change_name_character":
					IslayPub.character.tab.rename(this.history[this.now][1], this.history[this.now][3]);
					break;
				case "create_group":
					IslayPub.group.tab.create(this.history[this.now][1]);
					break;
				case "remove_group":
					IslayPub.group.tab.remove(this.history[this.now][1]);
					break;
				case "group_move":
					var p = document.getElementById("group_tabs");
					if(p.childNodes.length == this.history[this.now][2]+1)
						p.appendChild(p.childNodes[this.history[this.now][1]]);
					else{
						var t = p.childNodes[this.history[this.now][1]];
						p.removeChild(p.childNodes[this.history[this.now][1]]);
						p.insertBefore(t, p.childNodes[this.history[this.now][2]]);
					}
					break;
				case "group_rename":
					IslayPub.group.tab.rename(this.history[this.now][1], this.history[this.now][3]);
					break;
				case "add_group_member":
					IslayPub.group.add(this.history[this.now][1], this.history[this.now][2]);
					break;
				case "remove_group_member":
					IslayPub.group.remove(this.history[this.now][1], this.history[this.now][3]);
					break;
				case "move_group_member":
					IslayPub.group.move_to(this.history[this.now][1], this.history[this.now][2], this.history[this.now][3]);
					break;
				case "change_group_member_z_index":
					IslayPub.group.list[this.history[this.now][1]][this.history[this.now][2]][1] = this.history[this.now][4];
					break;
				case "paste":
					var c = document.getElementById("canvas_" + this.history[this.now][1]);
					this.history[this.now][2].forEach(function(e){c.appendChild(e.cloneNode(true));});
					break;
				case "change_system":
					if(this.history[this.now][1]["speed"])
						document.getElementById("system_speed_input").value = this.history[this.now][1]["speed"]["after"];
					if(this.history[this.now][1]["width"])
						document.getElementById("system_width").value = this.history[this.now][1]["width"]["after"];
					if(this.history[this.now][1]["height"])
						document.getElementById("system_height").value = this.history[this.now][1]["height"]["after"];
					if(this.history[this.now][1]["background_color"])
						document.getElementById("system_background_color").value = this.history[this.now][1]["background_color"]["after"];
					if(this.history[this.now][1]["wall"])
						document.getElementById("system_wall").checked = this.history[this.now][1]["wall"]["after"];
					break;
			}
			this.now++;
			this.flag = true;
			document.getElementById("character_undo_button").classList.remove("disabled_button");
		}
		if(this.now == this.max){
			document.getElementById("character_redo_button").classList.add("disabled_button");
			return;
		}
		
		if(this.history[this.now - 1][0] == "bundle" && this.history[this.now - 1][1] == "start")
			this.bundle("redo");
	}//end of "redo"
	
	/**
	* 範囲選択で複数同時変更があった場合等にこれを使えば、複数の操作のundo,redoをまとめてできる
	* @param {string} "redo"か"undo"
	*/
	this.bundle = function(mode){
		while(true){
			//bundleがもう一度あったら終わり
			if(mode == "undo" && this.history[this.now - 1][0] == "bundle" && this.history[this.now - 1][1] == "start"){
				this.undo();
				return;
			}else if(mode == "redo" && this.history[this.now][0] == "bundle" && this.history[this.now][1] == "end"){
				this.redo();
				return;
			}
			
			if(mode == "undo"){
				this.undo();
			}else{
				this.redo();
			}
		}
	}
}
