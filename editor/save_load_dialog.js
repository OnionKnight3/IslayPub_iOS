/**
* @fileoverview 「セーブ及びロード」に関する関数群
* @author 鈴木一臣
*/

/**
* セーブ・ロード関係のメソッドの集まり
* @namespace
*/
IslayPub.save_load_dialog = new function(){
	/**
	* セーブ&ロードダイアログを開く
	*/
	this.open = function(){//localStorage.clear();//全データ削除
		var d = IslayPub.dialog.open(this.init());
		var asd = function(){
			event.preventDefault();
			var reader = new FileReader();
			reader.readAsText(event.dataTransfer.files[0]);
			reader.onload = function(){
				IslayPub.save_load_dialog.load(reader.result);
			}
		}
		d.setAttribute("ondragover", "event.preventDefault();");
		d.setAttribute("ondragenter", "event.preventDefault();");
		d.setAttribute("ondrop", "("+asd+")()");
	}
	
	/** セーブ&ロードダイアログの中身を初期化。ローカルストレージに入っている保存データをダイアログ内に羅列するとか */
	this.init = function(){
		var ini = "";
		for(var i = 0; i < localStorage.length; i++){
			ini += "<div><span title='" + (new Blob([localStorage[localStorage.key(i)]], {type: "text/plain"})).size + "byte'>" + localStorage.key(i).htmlEscape() + "</span>" +
			"<button onclick='IslayPub.save_load_dialog.load(localStorage[this.parentNode.firstChild.textContent], true);'>"+IslayPub.language.save_dialog1[lang]+"</button>" +
			"<button onclick='IslayPub.save_load_dialog.save(this.parentNode.firstChild.textContent);'>"+IslayPub.language.save_dialog2[lang]+"</button>" +
			"<button onclick='IslayPub.save_load_dialog.remove(this.parentNode.firstChild.textContent);this.parentNode.parentNode.removeChild(this.parentNode);'>"+IslayPub.language.save_dialog3[lang]+"</button></div>";
		}
		ini += "<input type='text' id='save_file_name' placeholder='"+IslayPub.language.alert5[lang]+"'>"+
		"<button onclick='IslayPub.save_load_dialog.save(document.getElementById(\"save_file_name\").value);IslayPub.dialog.close();'>"+IslayPub.language.save_dialog4[lang]+"</button><br>"+
		"<a id='download' href='#' download='Islay.txt' onclick='IslayPub.save_load_dialog.download();'>"+IslayPub.language.save_dialog6[lang]+"</a><br>"+
		"<label><a>"+IslayPub.language.save_dialog7[lang]+"</a><input style='display:none;' type='file' id='load_from_localFile' onchange='IslayPub.save_load_dialog.load_from_localFile();'></label><br>"+
		"<button onclick='IslayPub.dialog.close()'>"+IslayPub.language.save_dialog5[lang]+"</button>";
		return ini;
	}
	
	/**
	* localStorageから保存データを読み込む
	* @param json_data {string} 保存データ(Jons形式)
	* @param cnfrm {boolean} trueなら、ロードする時に「今の編集状況消えちゃうよ？」って確認ダイアログを出す
	*/
	this.load = function(json_data, cnfrm){
		if(cnfrm && !confirm(IslayPub.language.alert6[lang])){
			return;
		}
		
		/*try*/{
			var data = JSON.parse(json_data);
			//console.log(data);
			//初期化
			document.getElementById('group_tabs').innerHTML = '<div id="add_group_tab_button" onclick="IslayPub.group.tab.create();">'+IslayPub.language.creat_group_tab[lang]+'</div>';
			IslayPub.group.list = new Array();
			document.getElementById('character_tabs').innerHTML = '<div id="add_character_tab_button" onclick="IslayPub.character.tab.create();">'+IslayPub.language.creat_character_tab[lang]+'</div>';
			document.getElementById('canvases').innerHTML = "";
			document.getElementById('tab_menu1').click();
			
			for(var ct = 0; ct < Object.keys(data["character_tabs"]).length; ct++){
				var created = IslayPub.character.tab.create();//キャラクタタブを生成
				document.getElementById("canvas_" + created.id.substr('character_tab_'.length)).setAttribute("id", "canvas_" + data["character_tabs"][ct]["id"].htmlEscape());
				created.setAttribute("id", "character_tab_" + data["character_tabs"][ct]["id"].htmlEscape());
				created.querySelector("[name = 'character_tab_name']").textContent = data["character_tabs"][ct]["name"].htmlEscape();
				
				for(var states = 0; states < Object.keys(data["character_tabs"][ct]["states"]).length; states++){//状態を生成し、属性を付与していく
					var state = data["states"][data["character_tabs"][ct]["states"][states]];
					var created = IslayPub.character.maru.create();
					created.setAttribute("id", "maru_" + data["character_tabs"][ct]["states"][states].htmlEscape());
					created.getElementsByTagName('span')[0].textContent = state["name"].htmlEscape();
					created.setAttribute("action1", state["action1"].htmlEscape());
					created.setAttribute("action2", state["action2"].htmlEscape());
					created.dataset.se = state["se"].htmlEscape() || "none";
					created.setAttribute("style", 'top:'+Number(state["top"])+'px;left:'+Number(state["left"])+'px;');
					created.getElementsByTagName('img')[0].setAttribute("src", data["imgs"][state["img"]].htmlEscape());
				}
				for(var states = 0; states < Object.keys(data["character_tabs"][ct]["states"]).length; states++){//状態が作られたので、今度はそれぞれの状態から伸びる矢印を生成していく
					for(var yajirusis = 0; yajirusis < Object.keys(data["states"][data["character_tabs"][ct]["states"][states]]["arrows"]).length; yajirusis++){
						var arrow = data["states"][data["character_tabs"][ct]["states"][states]]["arrows"][yajirusis];
						document.getElementById("maru_" + data["character_tabs"][ct]["states"][states]).setAttribute('yajirusu_start_point', 'yes');
						var created = IslayPub.character.yajirusi.create(document.getElementById("maru_" + arrow["fromto"].htmlEscape()) , [arrow["path1"].htmlEscape(),arrow["path2"].htmlEscape()]);
						created.setAttribute('transition_condition', arrow["condition"].htmlEscape());
					}
				}
			}//キャラクタタブと状態が全て完成
			
			for(var gt = 0; gt < Object.keys(data["group_tabs"]).length; gt++){
				IslayPub.group.tab.create(data["group_tabs"][gt]["id"], data["group_tabs"][gt]["name"]);//グループタブを生成
				
				for(var states = 0; states < Object.keys(data["group_tabs"][gt]["states"]).length; states++){//グループに属する状態を追加してゆく
					IslayPub.group.add(data["group_tabs"][gt]["id"], data["group_tabs"][gt]["states"][states][0], data["group_tabs"][gt]["states"][states][1]);
				}
			}//グループタブ全て完成
			
			//tooltipをアップデート
			var states = document.querySelectorAll("[name='yajirusi']");
			for(var s = 0; s < states.length; s++){
				IslayPub.character.yajirusi.tooltip(states[s]);
			}
			
			//システム関係
			document.getElementById("system_speed_input").value = Number(data["system"]["speed"]);
			document.getElementById("system_width").setAttribute("value", Number(data["system"]["width"]));
			document.getElementById("system_height").setAttribute("value", Number(data["system"]["height"]));
			document.getElementById("system_background_color").value = data["system"]["background_color"];
			document.getElementById("system_wall").checked = data["system"]["wall"];
			
			//se
			IslayPub.maru_dialog.se_list = data["se_list"] || new Array();
		}
		// catch(e){
			// alert("ロードに失敗しました。\n" + e);
			// console.log(data);
			// console.log(e);
			// return;
		// }
		
		try{
			IslayPub.dialog.close();//ダイアログを閉じる
			IslayPub.undo_redo.clear_history();
			document.getElementById("character_tabs").firstChild.click();
		}catch(e){}
	}
	
	/**
	* localStorageにデータを保存する
	* @param file_name {string} 保存するデータの名前を決めよう
	*/
	this.save = function(file_name){
		if(!(file_name.length > 0)){
			alert(IslayPub.language.alert5[lang]);return;
		}
		if(typeof localStorage[file_name] !== "undefined" && !confirm(IslayPub.language.alert7[lang])){
			return;
		}
		try{
			localStorage[file_name] = JSON.stringify(this.make_data());
		}catch(e){
			alert(IslayPub.language.alert8[lang]);
			console.log(e);
			return;
		}
		this.init();
		alert(IslayPub.language.alert9[lang]);
	}
	
	/**
	* localStorageにある保存データを削除する
	* @param file_name {string} 削除したいデータの名前
	*/
	this.remove = function(file_name){
		if(!confirm(IslayPub.language.alert10[lang]))return;
		localStorage.removeItem(file_name);
		this.init();
	}
	
	/**
	* 保存用のデータを作る。形式を以下に示す。<br>
	* data（全てObject型）
	* <ul>
	* 	<li>imgs（画像データ。IDが添え字となる）</li>
	* 	<li>states（「状態」達。IDが添え字となる。maru_*の*の部分）
	* 		<ul>
	* 			<li>name（状態の名前）</li>
	* 			<li>action1</li>
	* 			<li>action2</li>
	* 			<li>top（状態の座標）</li>
	* 			<li>left（状態の座標）</li>ｈｔ
	* 			<li>img（状態に使用されている画像のID）</li>
	* 			<li>se</li>
	* 			<li>arraows
	* 				<ul>
	* 					<li>path1(矢印の線の部分のsvgのd)</li>
	* 					<li>path2(矢印の鏃の部分のsvgのd)</li>
	* 					<li>condition（遷移条件）</li>
	* 					<li>fromto(遷移先。「状態」のID。)</li>
	* 				</ul>
	* 			</li>
	* 		</ul>
	* 	</li>
	* 	<li>character_tabs
	* 		<ul>
	* 			<li>name（キャラクタタブの名前）</li>
	* 			<li>id（キャラクタタブのID。"character_tab_*" の*の部分）</li>
	* 			<li>states（添え字は適当。一応HTML的に上にある順になってる）
	* 				<ul>
	* 					<li>id（「状態」のID）</li>
	* 				</ul>
	* 			</li>
	* 		</ul>
	* 	</li>
	* 	<li>group_tabs
	* 		<ul>
	* 			<li>name（グループタブの名前）</li>
	* 			<li>id（グループタブのID。"group_tab_*" の*の部分）</li>
	* 			<li>states（上から順に）
	* 				<ul>
	* 					<li>id（「状態」のID）</li>
	* 					<li>z-index（プレイヤでこの「状態」が生成された時のz-index）</li>
	* 				</ul>
	* 			</li>
	* 		</ul>
	* 	</li>
	* 	<li>se_list（音楽データ。IDが添え字となる）</li>
	* 	<li>system
	* 		<ul>
	* 			<li>speed（アニメーションの速度。ms）</li>
	* 			<li>width（実行ウィンドウの幅）</li>
	* 			<li>height（実行ウィンドウの高さ）</li>
	* 			<li>background_color（実行ウィンドウの背景色）</li>
	* 			<li>wall(通り抜けるならtrue、でなければfalse)</li>
	* 		</ul>
	* 	</li>
	* </ul>
	* @return {object} 保存データ
	*/
	this.make_data = function(){
		var data = new Object();
		
		data["imgs"] = new Object();
		data["states"] = new Object();
		
		var se_index = new Array();
		data["character_tabs"] = new Object();
		var char_tabs = document.getElementsByName('character_tab');
		for(var t = 0; t < char_tabs.length; t++){
			var char_tab = data["character_tabs"][t] = new Object();
			char_tab["name"] = IslayPub.character.tab.get_name(char_tabs[t].id.substr('character_tab_'.length));
			char_tab["id"] = char_tabs[t].id.substr('character_tab_'.length);
			
			char_tab["states"] = new Object();
			var states = document.getElementById('canvas_'+char_tabs[t].id.substr('character_tab_'.length)).querySelectorAll("[name='maru']");
			for(var s = 0; s < states.length; s++){
				char_tab["states"][s] = states[s].id.substr('maru_'.length);
				var c = data["states"][states[s].id.substr('maru_'.length)] = new Object();
				c["name"] = states[s].querySelector("[name='maru_name']").textContent;
				c["action1"] = states[s].getAttribute('action1');
				c["action2"] = states[s].getAttribute('action2');
				c["top"] = parseInt(states[s].style.top);
				c["left"] = parseInt(states[s].style.left);
				c["se"] = states[s].dataset.se;
				if(states[s].dataset.se != "none"){
					se_index.push(parseInt(states[s].dataset.se));
				}
				//「じょうたい」の｢絵」がdata["imgs"]に無い新しいものだったら登録して、既にあるものだったらそれを使う。
				var src = states[s].getElementsByTagName('img')[0].src;
				var i = 0;
				while(true){
					if(Object.keys(data["imgs"]).length == i){
						data["imgs"][i] = src;
						break;
					}else if(data["imgs"][i] == src){
						break;
					}else{
						i++;
					}
				}
				c["img"] = i;
				
				c["arrows"] = new Object();
				var arrows = states[s].getElementsByTagName('svg');
				for(var a = 0; a < arrows.length; a++){
					var arrow = c["arrows"][a] = new Object();
					arrow["path1"] = arrows[a].querySelector("[name='path']").getAttribute("d");
					arrow["path2"] = arrows[a].querySelector("[name='tri']").getAttribute("d");
					arrow["condition"] = arrows[a].getAttribute("transition_condition");
					arrow["fromto"] = arrows[a].getAttribute("fromto").substr('maru_'.length);
				}
			}
		}
		
		data["group_tabs"] = new Object();
		var group_tabs = document.getElementsByName('group_tab');
		for(var t = 0; t < group_tabs.length; t++){
			var group_tab = data["group_tabs"][t] = new Object();
			group_tab["name"] = group_tabs[t].querySelector("[name='group_tab_name']").textContent;
			group_tab["id"] = group_tabs[t].id.substr('group_tab_'.length);
			
			group_tab["states"] = IslayPub.group.list[group_tab["id"]];
		}
		
		data["se_list"] = new Array();
		se_index.forEach(function(e){
			data["se_list"][e] = IslayPub.maru_dialog.se_list[e];
		});
		
		data["system"] = new Object();
		data["system"]["speed"] = document.getElementById("system_speed_input").value;
		data["system"]["width"] = document.getElementById("system_width").value;
		data["system"]["height"] = document.getElementById("system_height").value;
		data["system"]["background_color"] = document.getElementById("system_background_color").value;
		data["system"]["wall"] = document.getElementById("system_wall").checked;
		
		//console.log(data);
		return data;
	}
	
	/** 保存データのテキストファイルをダウンロードできる */
	this.download = function(){
		var blob = new Blob([ JSON.stringify(this.make_data()) ], { "type" : "text/plain" });

		if (window.navigator.msSaveBlob) { 
			window.navigator.msSaveBlob(blob, "Islay.txt"); 
		} else {
			document.getElementById("download").href = window.URL.createObjectURL(blob);
		}
	}
	
	/** inputタグで読み込んだファイルからデータをロードする */
	this.load_from_localFile = function(){
		var reader = new FileReader();
		reader.readAsText(event.target.files[0]);
		reader.onload = function(){
			IslayPub.save_load_dialog.load(reader.result);
		}
	}
}
