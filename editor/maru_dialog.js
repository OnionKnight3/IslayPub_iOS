/**
* @fileoverview 「状態」のダイアログに関する関数達
* @author 鈴木一臣
*/

/**
* 丸のダイアログに関するメソッドの集まり
* @namespace
*/
IslayPub.maru_dialog = new function(){
	/**
	*	ターゲットのデータを変更する。その為のダイアログを開く。
	*	@param {elemen} target ターゲットとなる「状態」
	*/
	this.open = function(target){
		IslayPub.dialog.open(
			(target.getAttribute("selected")? IslayPub.language.maru_dialog1[lang]: "") +
			"<div id='dialog_name'>◇"+IslayPub.language.name[lang]+"◇<br>"+
				"<input type='text' id='text_box' maxlength=20>"+
			"</div>"+
			"<div id='dialog_image'>◇"+IslayPub.language.img[lang]+"◇<br>"+
				"<img id='image_box' onclick='IslayPub.maru_dialog.img_change(this.src);' draggable=false>"+
			"</div>"+
			"<div id='dialog_action1'>◇"+IslayPub.language.action1[lang]+"◇<br>"+
				"<select onchange='IslayPub.maru_dialog.action_change(1,[])'>"+
					"<option value='action1_none'>" + IslayPub.language.action1_none[lang] + "</option>"+
					"<option value='action1_move'>" + IslayPub.language.action1_move[lang] + "</option>"+
					"<option value='action1_hurahuramove'>" + IslayPub.language.action1_hurahuramove[lang] + "</option>"+
					"<option value='action1_jump'>" + IslayPub.language.action1_jump[lang] + "</option>"+
					"<option value='action1_randomjump'>" + IslayPub.language.action1_randomjump[lang] + "</option>"+
					"<option value='action1_follow'>" + IslayPub.language.action1_follow[lang] + "</option>"+
				"</select>"+
				"<div id='dialog_action1_detail'></div>"+
			"</div>"+
			"<div id='dialog_action2'>◇"+IslayPub.language.action2[lang]+"◇<br>"+
				"<select onchange='IslayPub.maru_dialog.action_change(2,[])'>"+
					"<option value='action2_none'>" + IslayPub.language.action2_none[lang] + "</option>"+
					"<option value='action2_makecharacter'>" + IslayPub.language.action2_makecharacter[lang] + "</option>"+
					"<option value='action2_makegroup'>" + IslayPub.language.action2_makegroup[lang] + "</option>"+
					"<option value='action2_notice'>" + IslayPub.language.action2_notice[lang] + "</option>"+
					"<option value='action2_message'>" + IslayPub.language.action2_message[lang] + "</option>"+
					"<option value='action2_changespeed'>" + IslayPub.language.action2_changespeed[lang] + "</option>"+
					"<option value='action2_change'>" + IslayPub.language.action2_change[lang] + "</option>"+
					"<option value='action2_deleted'>" + IslayPub.language.action2_deleted[lang] + "</option>"+
					"<option value='action2_exit'>" + IslayPub.language.action2_exit[lang] + "</option>"+
				"</select>"+
				"<div id='dialog_action2_detail'></div>"+
			"</div>"+
			"<div id='dialog_se' style='display:block;'>◇"+IslayPub.language.se[lang]+"◇<br>"+
				"<div id='dialog_se_input_title' onclick='IslayPub.maru_dialog.open_se_dialog();'></div>"+
				"<select id='dialog_se_select' onchange='IslayPub.maru_dialog.change_dialog_se_select();'>"+
					"<option value='none'>"+IslayPub.language.se_none[lang]+"</option>"+
					"<option value='once'>"+IslayPub.language.se_once[lang]+"</option>"+
					"<option value='state_loop'>"+IslayPub.language.se_state_loop[lang]+"</option>"+
					"<option value='charcter_loop'>"+IslayPub.language.se_charcter_loop[lang]+"</option>"+
				"</select>"+
				"<audio id='dialog_se_audio' src='' title='' type='audio/mp3'></audio>"+
				"<div id='dialog_se_controls' style='display:none;'><button onclick='document.getElementById(\"dialog_se_audio\").play()'>"+IslayPub.language.se_play[lang]+"</button>"+
				IslayPub.language.volume[lang]+"<input type='range' id='dialog_se_volume' min=0 max=1 step=0.01 oninput='document.getElementById(\"dialog_se_audio\").volume=this.value;'></div>"+
			"</div>"+
			"<div id='dialog_buttons'>"+
				"<input type='button' value='"+IslayPub.language.ok[lang]+"' onclick='if(IslayPub.maru_dialog.apply(\"" + target.id + "\")){IslayPub.dialog.close();}'>"+
				"<input type='button' value='"+IslayPub.language.cancel[lang]+"' onclick='IslayPub.dialog.close()'>"+
				"<input type='button' value='"+IslayPub.language.apply[lang]+"' onclick='IslayPub.maru_dialog.apply(\"" + target.id + "\")'>"+
			"</div>"
		);
		
		//初期化
		if(target.getAttribute("selected")){//対象が「選択」されていた場合
			document.getElementById('image_box').src = INITIAL_IMG_SETTING;
			document.getElementById("dialog_name").style.display = "none";
			document.getElementById("dialog_image").classList.add("line_through");
			document.getElementById("dialog_image").onclick = function(){this.classList.remove("line_through");};
			document.getElementById("dialog_action1").classList.add("line_through");
			document.getElementById("dialog_action1").onclick = function(){this.classList.remove("line_through");};
			document.getElementById("dialog_action2").classList.add("line_through");
			document.getElementById("dialog_action2").onclick = function(){this.classList.remove("line_through");};
			document.getElementById("dialog_se").classList.add("line_through");
			document.getElementById("dialog_se").onclick = function(){this.classList.remove("line_through");};
		}else{
			document.getElementById('text_box').value = target.getElementsByTagName('span')[0].textContent//name
			document.getElementById('image_box').src = target.getElementsByTagName('img')[0].src;//image
			if(target.dataset.se != "none"){//se
				document.getElementById("dialog_se_audio").src = this.se_list[target.dataset.se.split(":")[0]];
				document.querySelector('#dialog_se_select > option[value=' + target.dataset.se.split(":")[1] + ']').selected = true;
				document.getElementById("dialog_se_input_title").textContent = target.dataset.se.split(":")[2];
				document.getElementById("dialog_se_audio").title = target.dataset.se.split(":")[2];
				document.getElementById("dialog_se_audio").volume = target.dataset.se.split(":")[3];
				document.getElementById("dialog_se_volume").value = target.dataset.se.split(":")[3];
				document.getElementById("dialog_se_controls").style.display = "";
				document.getElementById("dialog_se_select").disabled = false;
			}
			for(var c = 1; c <=2; c++){//actions. c=# of action#
				var a = target.getAttribute('action' + c);
				if(a){
					a = a.split(':');
					document.querySelector('option[value=action' + c + '_' + a[0] + ']').selected = true;
					IslayPub.maru_dialog.action_change(c, a);
				}
			}
		}
	}
	
	/**
	* 「音楽」の選択肢で「なし」以外の動作が選ばれ、かつ何の音楽ファイルも設定されていなかった時に音楽設定ダイアログを開く。
	*/
	this.change_dialog_se_select = function(){
		if(document.getElementById("dialog_se_select").value != "none"){
			if(document.getElementById("dialog_se_audio").title == ""){
				IslayPub.maru_dialog.open_se_dialog();
			}
		}else{
			this.reset_se("");
		}
	}
	
	/**
	* 音楽設定ダイアログを開く。
	*/
	this.open_se_dialog = function(){
		var a = function(n){//選ばれたプリセット音楽が選択された時
			var audio_ele = document.getElementById("dialog_se_audio");
			document.getElementById("dialog_se_input_title").textContent = "sample"+n;
			document.getElementById("dialog_se_controls").style.display = "";
			audio_ele.title = "sample"+n;
			audio_ele.volume = 0.5;
			document.getElementById("dialog_se_volume").value = 0.5;
			audio_ele.oncanplaythrough = null;
			audio_ele.onerror = null;
			audio_ele.src = event.target.nextSibling.src;
			audio_ele.play();
			IslayPub.dialog.close();
		}
		var e = "<div>◇" + IslayPub.language.select_se[lang] + "◇</div>";
		for(var s = 0; s < NUMBER_OF_PRESET_SES; s++){
			e += "<div><button onclick='("+a+")("+s+")'>"+IslayPub.language.use_this_se[lang]+"</button><audio id='preset_se_"+s+"' controls></audio></div>";
		}
		e +="<input type='file' id='dialog_se_input' onchange='IslayPub.maru_dialog.select_se()'><br>"+
			"<input type='button' value='"+IslayPub.language.cancel[lang]+"' onclick='IslayPub.dialog.close()'>"+
			"<button hidden name='onclosedialog' onclick='("+IslayPub.maru_dialog.cancel_se+")();'></button>";
			
		IslayPub.dialog.open(e);
				
		//音楽のロード
		for(var s = 0; s < NUMBER_OF_PRESET_SES; s++){
			(function(s){
				var xhr = new XMLHttpRequest();
				xhr.open("GET" , "./preset_se/"+s+".mp3");
				xhr.responseType = "blob";
				xhr.onload = function(e){
					var a = new FileReader();
					a.onloadend = function(){
						document.getElementById("preset_se_"+s).src = a.result;
						document.getElementById("preset_se_"+s).volume = 0.5;
					}
					a.readAsDataURL(xhr.response);
				}
				xhr.send();
			})(s);
		}
	}
	
	/**
	* 音楽設定ダイアログの音楽ファイルがinputタグにて選ばれた場合起動する。
	* 読み込みに成功したらそのファイルを使い、それ以外の何かの時は適当に失敗させる。
	*/
	this.select_se = function(){
		var a = document.getElementById("dialog_se_audio");
		var reader = new FileReader();
		reader.addEventListener('load', function(e){
			var fname = document.getElementById("dialog_se_input").files[0].name;
			if(fname.split(".")[fname.split(".").length-1] !== "mp3"){//選んだファイルがmp3じゃ無い時
				IslayPub.maru_dialog.cancel_se();
				alert(IslayPub.language.only_mp3[lang]);
			}else{
				a.oncanplaythrough = function(){//読み込みに成功した時
					document.getElementById("dialog_se_input_title").textContent = fname;
					document.getElementById("dialog_se_controls").style.display = "";
					a.title = fname;
					a.volume = 0.5;
					document.getElementById("dialog_se_volume").value = 0.5;
					a.oncanplaythrough = null;
					a.onerror = null;
					a.play();
				};
				a.onerror = function(){//読み込みに失敗した時
					IslayPub.maru_dialog.reset_se();
					alert(IslayPub.language.fail_load_file[lang]);
				};
				document.getElementById("dialog_se_input_title").innerHTML = IslayPub.language.now_loading[lang];
				a.src = e.target.result;
			}
			IslayPub.dialog.close();
		});
		if(document.getElementById("dialog_se_input").files[0]){
			reader.readAsDataURL(document.getElementById("dialog_se_input").files[0]);
		}else{
			IslayPub.maru_dialog.cancel_se();
			alert(IslayPub.language.no_file[lang]);
		}
	}
	
	/**
	* 音楽関係をリセットする。
	*/
	this.reset_se = function(){
		var a = document.getElementById("dialog_se_audio");
		a.src = "";
		a.title = "";
		a.oncanplaythrough = null;
		a.onerror = null;
		document.getElementById("dialog_se_controls").style.display = "none";
		document.getElementById("dialog_se_select").value = "none";
		document.getElementById("dialog_se_input_title").innerHTML = "";
	}
	
	/**
	* 音楽ファイルが設定されていなかったら、音楽関係をリセットする。
	*/
	this.cancel_se = function(){
		if(document.getElementById("dialog_se_input_title").innerHTML == ""){
			IslayPub.maru_dialog.reset_se();
		}
	}
	
	/**
	* 「絵」の設定をするダイアログを開く。
	* @param {string} img_src 「現在の絵」に設定するbase64形式の画像データを渡してください。
	*/
	this.img_change = function(img_src){
		var a = function(e){
			document.getElementById("changing_image_box").src = e.childNodes[0].src;
		}
		
		var e =
		"<div>◇"+IslayPub.language.current_img[lang]+"◇</div>"+
		"<img id='changing_image_box' src=" + img_src + " draggable=false>"+
		"<form id='frm' name='frm' onsubmit='return false;' style='line-height:2em;'>"+
			"<label for='thumbnail' style='display:block;'>◇"+IslayPub.language.select_file[lang]+"◇</label>"+
			"<input type='file' id = 'thumbnail' name = 'thumbnail' onchange='IslayPub.maru_dialog.choice_gazou()' required>"+
		"</form>"+
		"<div style='overflow:auto;height:200px;' class='preset_imgs_box'>";
		for(var s = 0; s < NUMBER_OF_PRESET_IMGS; s++){
			e += "<span style='height:32px;width:32px;display:inline-block;' onclick='("+a+")(this)'><img id='preset_img_"+s+"' src='' style='max-height:32px;max-width:32px;'></span>";
		}
		e +=
			"</div>"+
			"<button type='submit' onClick='document.getElementById(\"image_box\").src=document.getElementById(\"changing_image_box\").src; IslayPub.dialog.close();' style='width: 100px;'>"+IslayPub.language.ok[lang]+"</button>"+
			"<button type='submit' onClick='IslayPub.dialog.close();' style='width: 100px;'>"+IslayPub.language.cancel[lang]+"</button><br>"+
		"";
		
		IslayPub.dialog.open(e);
		
		//画像のロード
		for(var s = 0; s < NUMBER_OF_PRESET_IMGS; s++){
			(function(s){
				var xhr = new XMLHttpRequest();
				xhr.open("GET" , "./preset_img/"+s+".png");
				xhr.responseType = "blob";
				xhr.onload = function(e){
					var a = new FileReader();
					a.onloadend = function(){
						document.getElementById("preset_img_"+s).src = a.result;
					}
					a.readAsDataURL(xhr.response);
				}
				xhr.send();
			})(s);
		}
	}
	
	/**
	* 「絵」の設定をするダイアログをするダイアログのinputタグでファイルを読み込んだ時の処理。
	* 読み込みに成功したら、「現在の絵」に反映させる。
	*/
	this.choice_gazou = function(){
		var ex = document.getElementById("thumbnail").value.split(".");
		if(!(ex.length === 0) && (ex[ex.length-1] === "png" || ex[ex.length-1] === "jpg" || ex[ex.length-1] === "gif")){
			var reader = new FileReader();
			reader.addEventListener('load', function(e){
				document.getElementById("changing_image_box").src = e.target.result;
			});
			reader.readAsDataURL(document.getElementById("thumbnail").files[0]);
		}else{
			alert(IslayPub.language.alert3[lang]);
		}
	}
	
	/**
	*	選ばれたものによってdetailエリアの内容を変える。
	*	@param {number} アクション１かアクション2か
	*	@param {array} init 初期化用の値
	*/
	this.action_change = function(type, init){
		init[0] = document.querySelector('#dialog_action'+type+'>select').options[document.querySelector('#dialog_action'+type+'>select').selectedIndex].value;
		var target = document.getElementById('dialog_action' + type + '_detail');
		
		switch(type){
			case 1://アクション1
				switch(init[0]){
					case 'action1_none':
						target.innerHTML='';break;
					case 'action1_move':
					case 'action1_hurahuramove':
						var x = Number((typeof init[1] === "undefined")?0:init[1]);
						var y = Number((typeof init[2] === "undefined")?0:init[2]);
						target.innerHTML=
						"<input id='action1_move_x_direction' type='button' value=" + (x<0?IslayPub.language.left[lang]:IslayPub.language.right[lang]) + " onclick=\"this.value=(this.value==IslayPub.language.right[window.lang])?IslayPub.language.left[window.lang]:IslayPub.language.right[window.lang];\">"+
						"<input id='action1_move_x' type='number' min=0 value=" + Math.abs(x) + ">"+
						"<input id='action1_move_y_direction' type='button' value=" + (y<0?IslayPub.language.up[lang]:IslayPub.language.down[lang]) + " onclick=\"this.value=(this.value==IslayPub.language.down[window.lang])?IslayPub.language.up[window.lang]:IslayPub.language.down[window.lang];\">"+
						"<input id='action1_move_y' type='number' min=0 value=" + Math.abs(y) + ">";
						break;
					case 'action1_jump':
						target.innerHTML=
						IslayPub.language.from_left[lang] + "：" + IslayPub.language.from_top[lang] + "<br>"+
						"<input type='number' id='action1_jump_x' value=" + Number((typeof init[1] === "undefined")?0:init[1]) + ">" +
						"<input type='number' id='action1_jump_y' value=" + Number((typeof init[2] === "undefined")?0:init[2]) + ">";
						break;
					case 'action1_randomjump':
						target.innerHTML=
						"<label style='margin-right:10px;margin-left:10px;'><input type='checkbox' id='action1_randomjump_up' name='randomjump_type' value='up' " + ((typeof init[1] !== "undefined" && init[1]==='1')?"checked='checked'":'') + ">"+IslayPub.language.up[lang]+"</label>"+
						"<label style='margin-right:20px;margin-left:10px;'><input type='checkbox' id='action1_randomjump_down' name='randomjump_type' value='down' " + ((typeof init[2] !== "undefined" && init[2]==='1')?"checked='checked'":'') + ">"+IslayPub.language.down[lang]+"</label>"+
						"<label style='margin-right:20px;margin-left:10px;'><input type='checkbox' id='action1_randomjump_left' name='randomjump_type' value='left' " + ((typeof init[3] !== "undefined" && init[3]==='1')?"checked='checked'":'') + ">"+IslayPub.language.left[lang]+"</label>"+
						"<label style='margin-right:20px;margin-left:10px;'><input type='checkbox' id='action1_randomjump_right' name='randomjump_type' value='right' " + ((typeof init[4] !== "undefined" && init[4]==='1')?"checked='checked'":'') + ">"+IslayPub.language.right[lang]+"</label>";
						break;
					case 'action1_follow':
						var tabs = document.getElementsByName('character_tab');
						var a = "<select><option value='parent'>"+IslayPub.language.parent[lang]+"</option>";
						for(var s = 0; s < tabs.length; s++){
							a += "<option value='" + tabs[s].id.substr('character_tab_'.length) + "' " + ((typeof init[1] !== "undefined" && init[1] === tabs[s].id.substr('character_tab_'.length))?'selected=true':'') + ">" + tabs[s].querySelector("[name='character_tab_name']").textContent + "</option>";
						}
						a += "<\select>";
						target.innerHTML = a;
						break;
				}break;
			case 2://アクション2
				switch(init[0]){
					case 'action2_none':
						target.innerHTML='';
						break;
					case 'action2_makecharacter':
						var character = document.getElementsByName('character_tab');
						var a = "<select id='action2_makecharacter_character' onchange='IslayPub.group.selecter_updata(this,document.getElementById(\"action2_makecharacter_state\"));'>";
						for(var s = 0; s < character.length; s++){
							a += "<option value='" + character[s].id.substr('character_tab_'.length) + "'>" + character[s].querySelector("[name='character_tab_name']").textContent + "</option>";
						}
						target.innerHTML = a + "</select><select id='action2_makecharacter_state'></select>";
						IslayPub.group.selecter_updata(document.getElementById('action2_makecharacter_character'),document.getElementById('action2_makecharacter_state'));
						if(typeof init[1] !== "undefined"){
							document.getElementById("action2_makecharacter_character").querySelector("[value='" + init[1] + "']").selected = "selected";
							document.getElementById("action2_makecharacter_character").onchange();
							document.getElementById("action2_makecharacter_state").querySelector("[value='" + init[2] + "']").selected = "selected";
						}
						break;
					case 'action2_makegroup':
						var groups = document.getElementsByName('group_tab');
						var a = "<select id='action2_makegroup_selecter'>";
						for(var s = 0; s < groups.length; s++){
							a += "<option value='" + groups[s].id.substr('group_tab_'.length) + "'>" + groups[s].querySelector("[name='group_tab_name']").textContent + "</option>";
						}
						target.innerHTML = a + "</select>";
						if(typeof init[1] !== "undefined"){
							target.querySelector("[value='" + init[1] + "']").selected = "selected";
						}
						break;
					case 'action2_notice':
						target.innerHTML = "<input type='text' id='action2_notice_text' maxlength=20 value='" + ((typeof init[1] === "undefined")?'':init[1]) + "'>";
						break;
					case 'action2_message':
						target.innerHTML = "<input type='text' id='action2_message_text' maxlength=20 value='" + ((typeof init[1] === "undefined")?'':init[1]) + "'>";
						break;
					case 'action2_changespeed':
						target.innerHTML = "<select id='action2_changespeed_type'><option value='up'>"+IslayPub.language.speed_up[lang]+"</option><option value='down'>"+IslayPub.language.speed_down[lang]+"</option><option value='abs'>"+IslayPub.language.speed_abs[lang]+"</option></select><input type='number' id='action2_changespeed_speed' step=1 min=16 max=1000 value=50>";
						if(typeof init[1] !== "undefined"){
							target.querySelector("[value='" + init[1] + "']").selected = "selected";
							document.getElementById('action2_changespeed_speed').value = Number(init[2]);
						}
						break;
					case 'action2_change':
						var character = document.getElementsByName('character_tab');
						var a = "<select id='action2_change_character' onchange='IslayPub.group.selecter_updata(this,document.getElementById(\"action2_change_state\"));'>";
						for(var s = 0; s < character.length; s++){
							a += "<option value='" + character[s].id.substr('character_tab_'.length) + "'>" + character[s].querySelector("[name='character_tab_name']").textContent + "</option>";
						}
						target.innerHTML = a + "</select><select id='action2_change_state'></select>";
						IslayPub.group.selecter_updata(document.getElementById('action2_change_character'),document.getElementById('action2_change_state'));
						if(typeof init[1] !== "undefined"){
							document.getElementById("action2_change_character").querySelector("[value='" + init[1] + "']").selected = "selected";
							document.getElementById("action2_change_state").querySelector("[value='" + init[2] + "']").selected = "selected";
						}
						break;
					case 'action2_deleted':
						target.innerHTML='';
						break;
					case 'action2_exit':
						target.innerHTML='';
						break;
					
				}break;
		}
	}
	
	this.se_list = new Array();
	/**
	* 既に登録されている音楽だった場合そのidを返し、そうでない場合は新しく登録しそのidを返す。
	* @param {string} se base64型の音楽データ
	* @return {number} 引数として渡された音楽のid
	*/
	this.get_se_id = function(se){
		var a = 0;
		while(true){
			if(a == this.se_list.length){
				this.se_list.push(se);
				break;
			}else if(this.se_list[a] === se){
				break;
			}
			a++;
		}
		return a;
	}
	
	/**
	* 変更内容を反映する。ダイアログは閉じない。
	* @param {string} target 変更する｢状態」のid。
	* @param {boolean} recursive この関数を呼び出す時はこの引数を指定しないで。これはこの関数自身が再起呼び出しする時に使う引数
	*/
	this.apply = function(target, recursive){
		var a = document.querySelector(".tooltip");
			if(a)
				a.parentNode.removeChild(a);
		
		target = document.getElementById(target);
		
		if(recursive !== true && target.getAttribute("selected")){
			IslayPub.undo_redo.add_history(["bundle", "start"]);
			Array.prototype.forEach.call(document.querySelectorAll("[name='maru'][selected='yes']"),
				function(e){
					this.apply(e.id, true);
				}, this);
			IslayPub.undo_redo.add_history(["bundle", "end"]);
			return true;
		}
		
		var changed = new Object();
		//キャラクタ名
		if(document.getElementById('text_box').value.replace(/(^\s+)|(\s+$)/g, "") != 0 && target.querySelector("[name='maru_name']").textContent !== document.getElementById('text_box').value){
			changed["name"] = {before: target.getElementsByTagName('span')[0].textContent, after: document.getElementById('text_box').value};
			target.querySelector("[name='maru_name']").textContent = document.getElementById('text_box').value;
		}
		//画像
		if(target.getElementsByTagName('img')[0].src !== document.getElementById('image_box').src && !document.getElementById("dialog_image").classList.contains("line_through")){
			changed["img"] = {before: target.getElementsByTagName('img')[0].src, after: document.getElementById('image_box').src};
			target.getElementsByTagName('img')[0].src = document.getElementById('image_box').src;
		}
		//音
		var new_se;
		if(document.getElementById("dialog_se_audio").title == ""){
			new_se = "none";
		}else{
			new_se =
				this.get_se_id(document.getElementById("dialog_se_audio").src) + ":" +
				document.getElementById("dialog_se_select")[document.getElementById("dialog_se_select").selectedIndex].value + ":" + 
				document.getElementById("dialog_se_audio").title + ":" +
				document.getElementById("dialog_se_audio").volume;
		}
		if(target.dataset.se != new_se){
			changed["se"] = {before: target.dataset.se, after: new_se};
			target.dataset.se = new_se;
		}
		
		var new_action = null;
		switch(document.querySelector('#dialog_action1>select').options[document.querySelector('#dialog_action1>select').selectedIndex].value){//action1
			case 'action1_none':
				new_action = 'none';
				break;
			case 'action1_move':
				new_action = 'move:' +
				Number(document.getElementById('action1_move_x').value) * (document.getElementById('action1_move_x_direction').value==IslayPub.language.right[lang]?1:-1) + ':' + 
				Number(document.getElementById('action1_move_y').value) * (document.getElementById('action1_move_y_direction').value==IslayPub.language.down[lang]?1:-1);
				break;
			case 'action1_hurahuramove':
				new_action = 'hurahuramove:' +
				Number(document.getElementById('action1_move_x').value) * (document.getElementById('action1_move_x_direction').value==IslayPub.language.right[lang]?1:-1) + ':' + 
				Number(document.getElementById('action1_move_y').value) * (document.getElementById('action1_move_y_direction').value==IslayPub.language.down[lang]?1:-1);
				break;
			case 'action1_jump':
				new_action = 'jump:' +
				Number(document.getElementById('action1_jump_x').value) + ':' + 
				Number(document.getElementById('action1_jump_y').value);
				break;
			case 'action1_randomjump':
				new_action = 'randomjump:' +
				((document.getElementById('action1_randomjump_up').checked)?'1':'0') + ':' + 
				((document.getElementById('action1_randomjump_down').checked)?'1':'0') + ':' + 
				((document.getElementById('action1_randomjump_left').checked)?'1':'0') + ':' + 
				((document.getElementById('action1_randomjump_right').checked)?'1':'0');
				break;
			case 'action1_follow':
				new_action = 'follow:' +
				document.querySelector('#dialog_action1_detail>select').options[document.querySelector('#dialog_action1_detail>select').selectedIndex].value;
				break;
		}
		if(new_action !== null && target.getAttribute('action1') !== new_action && !document.getElementById("dialog_action1").classList.contains("line_through")){
			changed["action1"] = {before: target.getAttribute('action1'), after: new_action};
			target.setAttribute('action1', new_action);
		}
		
		new_action = null;
		switch(document.querySelector('#dialog_action2>select').options[document.querySelector('#dialog_action2>select').selectedIndex].value){//action2
			case 'action2_none':
				new_action = 'none';
				break;
			case 'action2_makecharacter':
				if(document.getElementById('action2_makecharacter_state').options[document.getElementById('action2_makecharacter_state').selectedIndex].value === 'none'){
					alert(IslayPub.language.alert1[lang]);
					break;
				}
				new_action = 'makecharacter:' +
				document.getElementById('action2_makecharacter_character').options[document.getElementById('action2_makecharacter_character').selectedIndex].value + ":" +
				document.getElementById('action2_makecharacter_state').options[document.getElementById('action2_makecharacter_state').selectedIndex].value;
				break;
			case 'action2_makegroup':
				new_action = 'makegroup:' +
				document.getElementById('action2_makegroup_selecter').options[document.getElementById('action2_makegroup_selecter').selectedIndex].value;
				break;
			case 'action2_notice':
				if(document.getElementById('action2_notice_text').value.length == 0){
					alert(IslayPub.language.alert2[lang]);
					break;
				}
				new_action = 'notice:' + document.getElementById('action2_notice_text').value;
				break;
			case 'action2_message':
				new_action ='message:' + document.getElementById('action2_message_text').value;
				break;
			case 'action2_changespeed':
				new_action = 'changespeed:' +
				document.getElementById('action2_changespeed_type').options[document.getElementById('action2_changespeed_type').selectedIndex].value + ":" +
				document.getElementById('action2_changespeed_speed').value;
				break;
			case 'action2_change':
				if(document.getElementById('action2_change_state').options[document.getElementById('action2_change_state').selectedIndex].value === 'none'){
					alert(IslayPub.language.alert1[lang]);
					break;
				}
				new_action = 'change:' +
				document.getElementById('action2_change_character').options[document.getElementById('action2_change_character').selectedIndex].value + ":" +
				document.getElementById('action2_change_state').options[document.getElementById('action2_change_state').selectedIndex].value;
				break;
			case 'action2_deleted':
				new_action = 'deleted';
				break;
			case 'action2_exit':
				new_action = 'exit';
				break;
				
		}
		if(new_action !== null && target.getAttribute('action2') !== new_action && !document.getElementById("dialog_action2").classList.contains("line_through")){
			changed["action2"] = {before: target.getAttribute('action2'), after: new_action};
			target.setAttribute('action2', new_action);
		}
		
		if(Object.keys(changed).length !== 0){//変更があったら
			IslayPub.undo_redo.add_history(["change_action", target.id.substr('maru_'.length), changed]);
		}
		return true;
	}
}
