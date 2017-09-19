/**
* @fileoverview 「矢印」のダイアログに関する関数達
* @author 鈴木一臣
*/

/**
* 矢印のダイアログに関するメソッドの集まり
* @namespace
*/
IslayPub.yajirusi_dialog = new function(){
	/**
	* 矢印の遷移条件を編集するダイアログを開く
	* @param {element} 遷移条件を編集したい矢印
	*/
	this.open=function(target){
		IslayPub.dialog.open(
			"<div id='dialog_transition_condition'>◇"+IslayPub.language.transition_condition[lang]+"◇<br>"+
				"<select onchange='IslayPub.yajirusi_dialog.action_change([])'>"+
					"<option value='transition_condition_none'>"+IslayPub.language.condition_none[lang]+"</option>"+
					"<option value='transition_condition_loop'>"+IslayPub.language.condition_loop[lang]+"</option>"+
					"<option value='transition_condition_clicked'>"+IslayPub.language.condition_clicked[lang]+"</option>"+
					"<option value='transition_condition_bump'>"+IslayPub.language.condition_bump[lang]+"</option>"+
					"<option value='transition_condition_random'>"+IslayPub.language.condition_random[lang]+"</option>"+
					"<option value='transition_condition_keydown'>"+IslayPub.language.condition_keydown[lang]+"</option>"+
					"<option value='transition_condition_alone'>"+IslayPub.language.condition_alone[lang]+"</option>"+
					"<option value='transition_condition_notice'>"+IslayPub.language.condition_notice[lang]+"</option>"+
				"</select>"+
				"<div id='dialog_transition_detail'></div>"+
			"</div>"+
			"<div id='dialog_buttons'>"+
				"<input type='button' value='"+IslayPub.language.ok[lang]+"' onclick='if(IslayPub.yajirusi_dialog.apply(\"" + target.id + "\")){IslayPub.dialog.close();}'>"+
				"<input type='button' value='"+IslayPub.language.cancel[lang]+"' onclick='IslayPub.dialog.close()'>"+
				"<input type='button' value='"+IslayPub.language.apply[lang]+"' onclick='IslayPub.yajirusi_dialog.apply(\"" + target.id + "\")'>"+
			"</div>"
		);
		
		var a = target.getAttribute('transition_condition');
		if(a){
			a = a.split(':');
			document.querySelector('option[value=transition_condition_' + a[0] + ']').selected = true;
			IslayPub.yajirusi_dialog.action_change(a);
		}
	}
	
	/**
	* 矢印ダイアログが開かれた時に内容を初期化する関数
	* @param {array} 初期化するやつ
	*/
	this.action_change=function(init){
		var target = document.getElementById('dialog_transition_detail');
		
		switch(document.querySelector('#dialog_transition_condition>select').options[document.querySelector('#dialog_transition_condition>select').selectedIndex].value){
			case 'transition_condition_none': target.innerHTML = ''; break;
			case 'transition_condition_loop':
				target.innerHTML="<input id='transition_condition_loop' type='number' min=1 value=" + Number((typeof init[1] === "undefined")?1:init[1]) + ">"+IslayPub.language.times[lang];
				break;
			case 'transition_condition_clicked':
				target.innerHTML=
				"<label style='margin-left:10px;'><input type='checkbox' id='transition_condition_leftclick' name='condition_clicked_type' value='left' " + ((typeof init[1] !== "undefined" && init[1]==='1')?"checked='checked'":'') + ">"+IslayPub.language.left_click[lang]+"</label>"+
				"<label style='margin-left:10px;'><input type='checkbox' id='transition_condition_centerclick' name='condition_clicked_type' value='center' " + ((typeof init[2] !== "undefined" && init[2]==='1')?"checked='checked'":'') + ">"+IslayPub.language.middle_click[lang]+"</label>"+
				"<label style='margin-left:10px;'><input type='checkbox' id='transition_condition_rightclick' name='condition_clicked_type' value='right' " + ((typeof init[3] !== "undefined" && init[3]==='1')?"checked='checked'":'') + ">"+IslayPub.language.right_click[lang]+"</label>";
				break;
			case 'transition_condition_bump':
				var tabs = document.getElementsByName('character_tab');
				var a = "<select id='transition_condition_bump_select'><option value='something'>"+IslayPub.language.something[lang]+"</option>";
				for(var s = 0; s < tabs.length; s++){
					a += "<option value='" + tabs[s].id.substr('character_tab_'.length) + "' " + ((typeof init[6] !== "undefined" && init[6] === tabs[s].id.substr('character_tab_'.length))?'selected=true':'') + ">" + tabs[s].querySelector("[name='character_tab_name']").textContent + "</option>";
				}
				a += "<\select>";
				target.innerHTML=
				"<label style='margin-left:10px;'><input type='checkbox' id='transition_condition_bumpleft' name='condition_bump_type' value='left' " + ((typeof init[3] !== "undefined" && init[3]==='1')?"checked='checked'":'') + ">"+IslayPub.language.left_edge[lang]+"</label>"+
				"<label style='margin-left:10px;'><input type='checkbox' id='transition_condition_bumpright' name='condition_bump_type' value='center' " + ((typeof init[4] !== "undefined" && init[4]==='1')?"checked='checked'":'') + ">"+IslayPub.language.right_edge[lang]+"</label><br>"+
				"<label style='margin-left:10px;'><input type='checkbox' id='transition_condition_bumptop' name='condition_bump_type' value='center' " + ((typeof init[1] !== "undefined" && init[1]==='1')?"checked='checked'":'') + ">"+IslayPub.language.top[lang]+"</label>"+
				"<label style='margin-left:10px;'><input type='checkbox' id='transition_condition_bumpbottom' name='condition_bump_type' value='center' " + ((typeof init[2] !== "undefined" && init[2]==='1')?"checked='checked'":'') + ">"+IslayPub.language.bottom[lang]+"</label><br>"+
				"<label style='margin-left:10px;'><input type='checkbox' id='transition_condition_bumpcharacter' name='condition_bump_type' value='right' " + ((typeof init[5] !== "undefined" && init[5]==='1')?"checked='checked'":'') + ">"+IslayPub.language.character[lang]+"</label>"+
				a;
				break;
			case 'transition_condition_random':
				target.innerHTML = "<input id='transition_condition_random' type='number' min=1 max=99 value=" + Number((typeof init[1] === "undefined")?50:init[1]) + ">" + "%";
				break;
			case 'transition_condition_keydown':
				var s = "<select id='transition_condition_keydown_select'>" +
				"<option value='38'>↑</option>" +
				"<option value='40'>↓</option>" +
				"<option value='37'>←</option>" +
				"<option value='39'>→</option>";
				s += "<option value='32'>"+IslayPub.language.space_key[lang]+"</option><option value='13'>"+IslayPub.language.enter_key[lang]+"</option>"
				for(var q = 0; q <= 9; q++){
					s += "<option value='" + (""+q).charCodeAt() + "'>" + q + "</option>";
				}
				var a = "A".charCodeAt() - 1;
				for(var q = 0; q < 26; q++){
					a++;
					s += "<option value='" + a + "'>" + String.fromCharCode(a) + "</option>";
				}
				s += "</select>";
				target.innerHTML = s;
				if(typeof init[1] !== "undefined"){
					document.querySelector("#transition_condition_keydown_select>option[value=\"" + init[1] + "\"]").selected = true;
				}
				break;
			case 'transition_condition_alone': target.innerHTML = ''; break;
			case 'transition_condition_notice':
				target.innerHTML = "<input type='text' id='transition_condition_notice' maxlength=20 value='" + ((typeof init[1] === "undefined")?'':init[1]) + "'><br>";
				break;
		}
	}
	
	/**
	* 矢印ダイアログでの変更内容を適用する
	* @param {string} 変更対象の矢印
	* @param {boolean} 再起処理の時に使う。普通に呼び出す時は使わないで
	*/
	this.apply = function(target, recursive){
		target = document.getElementById(target);
		
		if(recursive !== true && target.getAttribute("selected")){
			IslayPub.undo_redo.add_history(["bundle", "start"]);
			Array.prototype.forEach.call(document.querySelectorAll("[name='yajirusi'][selected='yes']"),
				function(e){
					this.apply(e.id, true);
			}, this);
			IslayPub.undo_redo.add_history(["bundle", "end"]);
			return true;
		}
		
		var new_condition = null;
		var old_condition = target.getAttribute('transition_condition');
		switch(document.querySelector('#dialog_transition_condition>select').options[document.querySelector('#dialog_transition_condition>select').selectedIndex].value){
			case 'transition_condition_none':
				new_condition = 'none';
				break;
			case 'transition_condition_loop':
				var c = parseInt(document.getElementById('transition_condition_loop').value, 10);
				if(c < 1){alert(IslayPub.language.alert4[lang]);return false;}
				new_condition = 'loop:' + c;
				break;
			case 'transition_condition_clicked':
				new_condition = 'clicked:' +
				((document.getElementById('transition_condition_leftclick').checked)?'1':'0') + ':' + 
				((document.getElementById('transition_condition_centerclick').checked)?'1':'0') + ':' + 
				((document.getElementById('transition_condition_rightclick').checked)?'1':'0');
				break;
			case 'transition_condition_bump':
				new_condition = 'bump:' +
				((document.getElementById('transition_condition_bumptop').checked)?'1':'0') + ':' + 
				((document.getElementById('transition_condition_bumpbottom').checked)?'1':'0') + ':' + 
				((document.getElementById('transition_condition_bumpleft').checked)?'1':'0') + ':' + 
				((document.getElementById('transition_condition_bumpright').checked)?'1':'0') + ':' + 
				((document.getElementById('transition_condition_bumpcharacter').checked)?'1':'0') + ':' + 
				document.getElementById('transition_condition_bump_select').options[document.getElementById('transition_condition_bump_select').selectedIndex].value;
				break;
			case 'transition_condition_random':
				var c = parseInt(document.getElementById('transition_condition_random').value, 10);
				if(c < 1 || 99 < c){alert(IslayPub.language.alert4[lang]);return false;}
				new_condition = 'random:' + c;
				break;
			case 'transition_condition_keydown':
				new_condition = 'keydown:' +
				document.getElementById('transition_condition_keydown_select').options[document.getElementById('transition_condition_keydown_select').selectedIndex].value;
				break;
			case 'transition_condition_alone':
				new_condition = 'alone';
				break;
			case 'transition_condition_notice':
				if(document.getElementById('transition_condition_notice').value.length == 0){alert(IslayPub.language.alert2[lang]);return false;}
				new_condition = 'notice:' +
				document.getElementById('transition_condition_notice').value;
				break;
		}
		
		if(old_condition !== new_condition){
			target.setAttribute('transition_condition', new_condition);
			IslayPub.character.yajirusi.tooltip(target);
			IslayPub.undo_redo.add_history(["change_condition", target.parentNode.id.substr("maru_".length), IslayPub.character.yajirusi.get_priority(target), {before:old_condition, after:new_condition}]);
		}
		return true;
	}
}
