/**
* @fileoverview 「player」に関する関数群
* @author 鈴木一臣
*/

/**
* アニメーションの更新速度(ms)の最大値
* @const {number}
*/
const MAX_SPEED = 1000;
/**
* アニメーションの更新速度(ms)の最小値
* @const {number}
*/
const MIN_SPEED = 16;
/**
* アニメーション中に表示できる要素の最大数
* @const {number}
*/
const MAX_OBJECTS = 10000;
/**
* z-indexの基本値。z-indexが指定されなかった時はこの値にする
* @const {number}
*/
const INITIAL_Z_INDEX = 100;

//各種設定
if(window.opener){
	console.log("player: window mode");
	data = window.opener.IslayPub.save_load_dialog.make_data();
	window.onresize = function(){//windowの大きさ
		window.resizeBy(Number(data["system"]["width"]) - window.innerWidth, Number(data["system"]["height"]) - window.innerHeight);
	}
	var event = document.createEvent("HTMLEvents");
	event.initEvent("resize", false, true);
	window.dispatchEvent(event);//windowの大きさを設定する為にresizeイベントを発火させる

	//window.onblur = function(){window.close();};//ウィンドウのフォーカスが外れたら閉じる。
}else{
	data = window.parent.IslayPub.save_load_dialog.make_data();
}

var key_flag = new Array();//押されたキーはここに記録し、離されたら消す
document.onkeydown = function(e){
	if(e.keyCode == 27){//esc
		try{window.parent.IslayPub.dialog.close();}catch(e){};
	}
	key_flag[e.keyCode] = true;
}
document.onkeyup = function(e){
	key_flag[e.keyCode] = false;
}

var notice_list = new Array();//お知らせはここに詰め込まれていく。
//各種設定ここまで

if(data){
	document.body.style.backgroundColor = data["system"]["background_color"];//背景色
	spawn_group(0);//mainグループを生成
	var now_speed = Number(data["system"]["speed"]);
	if(now_speed < MIN_SPEED || MAX_SPEED < now_speed){//アニメーション速度が不正な値だった場合
		alert("error:at setting speed");
		window.close();
	}
	var timer = setInterval(update, now_speed);
}

/** 1フレームにおける処理。これを一回実行すると1フレーム分進む */
function update(){
	action_phase();
	transition_phase();
	end_phase();
}

/** 全ての要素のアクションを処理する */
function action_phase(){
	var states = document.getElementsByTagName("img");
	var delete_list = Array();//「きえる」のアクションを行った状態をここに入れていく。そして、全ての要素のアクションを終えてから消す。
	for(var s = 0; s < states.length; s++){
		var id = states[s].getAttribute("maru_id");
		states[s].setAttribute("loop_count", Number(states[s].getAttribute("loop_count")) + 1);
		
		//アクション1を行う
		var action1 = data["states"][id]["action1"].split(':');
		switch(action1[0]){
			case "none":break;
			case "move":
				states[s].style.left = (parseInt(states[s].style.left) + Number(action1[1])) + "px";
				states[s].style.top = (parseInt(states[s].style.top) + Number(action1[2])) + "px";
				break;
			case "hurahuramove":
				var rx = Math.floor(Math.random()*20-10);
				var ry = Math.floor(Math.random()*20-10);
				states[s].style.left = (parseInt(states[s].style.left) + Number(action1[1])) + rx + "px";
				states[s].style.top = (parseInt(states[s].style.top) + Number(action1[2])) + ry + "px";
				break;
			case "jump":
				states[s].style.left = Number(action1[1]) + "px";
				states[s].style.top = Number(action1[2]) + "px";
				break;
			case "randomjump":
				var min_y = (action1[1]==0)? parseInt(states[s].style.top): 0;
				var max_y = (action1[2]==0)? parseInt(states[s].style.top): data["system"]["height"] - states[s].clientHeight;
				var min_x = (action1[3]==0)? parseInt(states[s].style.left): 0;
				var max_x = (action1[4]==0)? parseInt(states[s].style.left): data["system"]["width"] - states[s].clientWidth;
				states[s].style.left = Math.floor((Math.random() * ((max_x + 1) - min_x)) + min_x) + "px";
				states[s].style.top = Math.floor((Math.random() * ((max_y + 1) - min_y)) + min_y) + "px";
				break;
			case "follow":
				if(action1[1] == "parent"){//ついていく対象が親の場合
					var p = states[s].getAttribute("parent_id");
					if(p != "none" && p != "dead"){//親が存在していれば
						p = document.getElementById(p);
					}else{
						p = null;
					}
				}else{//ついていく対象が特定のキャラクタの場合
					var p = data["character_tabs"][action1[1]]["states"];
					for(var q = 0; ; q++){
						if(q == states.length){
							p = null;
							break;
						}
						if(p.indexOf(states[q].getAttribute("id").substr('maru_'.length))){
							p = states[q];
							break;
						}
					}
				}
				if(p != null){
					var mx = (p.clientWidth/2 + parseInt(p.style.left)) - (states[s].clientWidth/2 + parseInt(states[s].style.left));
					var my = (p.clientHeight/2 + parseInt(p.style.top)) - (states[s].clientHeight/2 + parseInt(states[s].style.top));
					mx *= 0.1;
					my *= 0.1;
					var alice = p.getBoundingClientRect();
					var bob = states[s].getBoundingClientRect();
					if(	alice.left > bob.right + mx ||
						alice.right < bob.left + mx ||
						alice.top > bob.bottom + my ||
						alice.bottom < bob.top + my ){//ぶつからないなら近づく
						states[s].style.left = parseInt(states[s].style.left) + mx + "px";
						states[s].style.top = parseInt(states[s].style.top) + my + "px";
					}
				}
				break;
		}
		
		//アクション2を行う
		var action2 = data["states"][id]["action2"].split(':');
		switch(action2[0]){
			case "none":break;
			case "makecharacter":
				spawn_state(action2[2], states[s]);
				break;
			case "makegroup":
				spawn_group(action2[1], states[s]);
				break;
			case "notice":
				notice_list.push(action2[1]);
				break;
			case "message":
				if(window.opener){
					document.title = action2[1];
				}else{
					window.parent.alert(action2[1]);
				}
				break;
			case "changespeed":
				switch(action2[1]){
					case "up":now_speed -= Number(action2[2]);break;
					case "down":now_speed += Number(action2[2]);break;
					case "abs":now_speed = Number(action2[2]);break;
				}
				now_speed = now_speed > MAX_SPEED? MAX_SPEED: now_speed;
				now_speed = now_speed < MIN_SPEED? MIN_SPEED: now_speed;
				clearInterval(timer);
				timer = setInterval(update, now_speed);
				break;
			case "change":
				state_transition(states[s], action2[2]);
				break;
			case "deleted":
				delete_list.push(states[s]);
				break;
			case "exit":window.close();window.parent.IslayPub.dialog.close();break;
		}
		
		//アクション2で消されてなければ音楽の処理を行う
		if(action2[0] != "deleted")
			se_manager.start(states[s], data["states"][id]["se"]);
	}
	
	//アクション2で「消える」が選ばれていた要素を削除
	for(var dels = 0; dels < delete_list.length; dels++){
		//子供に親が死んだ事を伝える
		var childlen = document.querySelectorAll("img[parent_id='" + delete_list[dels].id + "']");
		for(var c = 0; c < childlen.length; c++){
			childlen[c].setAttribute("parent_id", "dead");
		}
		
		if(delete_list[dels].dataset.se_charcter_loop)
			se_manager.end(delete_list[dels].dataset.se_charcter_loop);
		delete_list[dels].parentNode.removeChild(delete_list[dels]);
	}
}

/** 全ての要素の遷移条件を判定して適宜遷移させる。 */
function transition_phase(){
	var states = document.getElementsByTagName("img");
	for(var s = 0; s < states.length; s++){
		var arrows = data["states"][states[s].getAttribute("maru_id")]["arrows"];
		var flag = false;
		for(var t = 0; t < Object.keys(arrows).length; t++){
			var condition = arrows[t]["condition"].split(":");
			switch(condition[0]){
				case "none": flag = arrows[t]["fromto"]; break;
				case "loop":
					if(Number(condition[1]) < states[s].getAttribute("loop_count"))
						flag = true;
					break;
				case "clicked":
					if(	(condition[1] == "1" && states[s].getAttribute("click_flag").indexOf("0") != -1) ||
						(condition[2] == "1" && states[s].getAttribute("click_flag").indexOf("1") != -1) ||
						(condition[3] == "1" && states[s].getAttribute("click_flag").indexOf("2") != -1) ){
						flag = true;
					}
					break;
				case "bump":
					var c = collision(states[s]);
					if(	(condition[1] == "1" && c[0]) ||//壁にぶつかった時
						(condition[2] == "1" && c[1]) ||
						(condition[3] == "1" && c[2]) ||
						(condition[4] == "1" && c[3]) ){
							flag = true;
					}else if(condition[5] == "1"){//キャラクタにぶつかった時
						if(condition[6] == "something"){//なにか
							for(var e = 0; e < states.length; e++){
								if(s != e && collision(states[s], states[e])){
									flag = true;
									break;
								}
							}
						}else{//特定のキャラクタ
							for(var ch = 0; ch < Object.keys(data["character_tabs"]).length; ch++){
								if(data["character_tabs"][ch]["id"] === condition[6]){
									k = ch;
									break;
								}
							}
							for(var ch = 0; ch < Object.keys(data["character_tabs"][k]["states"]).length; ch++){
								var candidates = document.querySelectorAll("img[maru_id='" + data['character_tabs'][k]['states'][ch] + "']");
								for(var c = 0; c < candidates.length; c++){
									if(states[s] != candidates[c] && collision(states[s], candidates[c])){
										flag = true;
										break;
									}
								}
								if(flag)break;
							}
						}
					}
					break;
				case "random":
					if(Math.floor(Math.random() * 100) < Number(condition[1]))
						flag = true;
					break;
				case "keydown":
					if(key_flag[condition[1]])
						flag = true;
					break;
				case "alone":
					if(states[s].getAttribute("parent_id") == "dead")
						flag = true;
					break;
				case "notice":
					if(notice_list.indexOf(condition[1]) != -1)
						flag = true;
					break;
			}
			if(flag === true){
				flag = arrows[t]["fromto"];
				break;
			}
		}
		if(flag !== false){
			state_transition(states[s], flag);
		}
		states[s].setAttribute("click_flag", "");//クリックフラグを消す。
	}
	
}

/** ターン終了時処理。壁からはみ出てる要素を内側に戻すとか */
function end_phase(){
	var states = document.getElementsByTagName("img");
	for(var s = 0; s < states.length; s++){//壁の通り抜けが禁止ならば、全てのオブジェクトを壁の内側に直す。
		if(!data["system"]["wall"]){
			var c = collision(states[s]);
			if(c[0]) states[s].style.top = "0px";
			if(c[1]){
				var d = data["system"]["height"] - states[s].clientHeight;
				states[s].style.top = (d < 0? 0: d) + "px";
			}
			if(c[2]) states[s].style.left = "0px";
			if(c[3]){
				var d = data["system"]["width"] - states[s].clientWidth;
				states[s].style.left = (d < 0? 0: d) + "px";
			}
		}
	}
	notice_list = new Array();//お知らせリストを消去
}

/**
* グループを生成
* @param {number} group_id 生成したいグループのID
* @param {element} parent_element 「親」がいる場合、その親要素を
*/
function spawn_group(group_id, parent_element){
	for(var s = 0; s < Object.keys(data["group_tabs"][group_id]["states"]).length; s++){
		spawn_state(data["group_tabs"][group_id]["states"][s][0], parent_element, data["group_tabs"][group_id]["states"][s][1]);
	}
}

/**
* 状態を生成
* @param {number} id 生成したい状態のID
* @param {element} parent_element 「親」がいる場合、その親要素を
* @param {number} z_index 生成する状態z-indexを指定できる
*/
function spawn_state(id, parent_element, z_index){//状態を生成
	if(document.getElementsByTagName("img").length > MAX_OBJECTS){
		alert("too many objects");
		spawn_state = function(){};
		return;
	}
	var count = 0;
	while(count < 10000){//10000:万一予防な
		if(!document.getElementById(count))break;
		count++;
	}
	var state = data["states"][id];
	var e = document.createElement("img");
	e.setAttribute("src", data["imgs"][state["img"]]);
	e.setAttribute("maru_id", id);//このオブジェクトがどの状態stateのものかを示す。
	e.setAttribute("id", count);//このオブジェクトを一意に識別するためのid
	e.setAttribute("style", "left:0px;top:0px;z-index:"+(z_index || INITIAL_Z_INDEX));//初期位置は左上
	e.setAttribute("click_flag", "");//左中央右クリックされたらそれぞれ0,1,2の文字が追加される。
	e.setAttribute("onmousedown", "this.setAttribute('click_flag', this.getAttribute('click_flag') + event.button);");
	e.setAttribute("loop_count", 0);//「同じ状態を繰り返した」用カウンタ
	e.setAttribute("draggable", false);
	e.setAttribute("ondragstart", 'return false;');
	if(typeof parent_element === "undefined"){
		e.setAttribute("parent_id", "none");//これは親のidかnoneかdeadのいずれか
	}else{
		e.style.left = parent_element.style.left;
		e.style.top = parent_element.style.top;
		e.setAttribute("parent_id", parent_element.id);
	}
	document.body.appendChild(e);
}

/**
* 状態を次へと遷移させる。
* @param {element} e 遷移元
* @param {number} id 遷移先のstateのid
*/
function state_transition(e, id){
	e.setAttribute("src", data["imgs"][data["states"][id]["img"]]);
	e.setAttribute("maru_id", id);
	e.setAttribute("click_flag", "");
	e.setAttribute("loop_count", 0);
	delete e.dataset.se_once;
	if(e.dataset.se_state_loop){
		se_manager.end(e.dataset.se_state_loop);
		delete e.dataset.se_state_loop;
	}
}

/**
* 当たり判定。
* 第一引数と第二引数に指定された要素がぶつかっているかどうかを判定する。第二引数が省略された時は第一引数に指定された要素と壁との衝突を判定する
* @param {element} alice 当たり判定を調べたい要素
* @param {element} bob 当たり判定を調べたい要素。省略可能。省略時には第一引数と壁の当たり判定になる。
* @return {boolean | Array.<boolean>} 第一引数と第二引数に指定された要素がぶつかっていればtrue。壁との当たり判定時は、大きさ4の配列として返され上下左右の壁に当たっていた場合それぞれ配列の0,1,2,3にtrueが入っている。当たっていなかったらfalseが入る
*/
function collision(alice, bob){
	if(typeof bob === "undefined"){//壁との当たり判定
		var c = Array();
		c[0] = (parseInt(alice.style.top) < 0);
		c[1] = (parseInt(alice.style.top) + alice.clientHeight > data["system"]["height"]);
		c[2] = (parseInt(alice.style.left) < 0);
		c[3] = (parseInt(alice.style.left) + alice.clientWidth > data["system"]["width"]);
		return c;
	}else{//引数２つの当たり判定
		alice = alice.getBoundingClientRect();
		bob = bob.getBoundingClientRect();
		return !(	alice.left > bob.right ||
					alice.right < bob.left ||
					alice.top > bob.bottom ||
					alice.bottom < bob.top);
	}
}

/** 音楽に関する関数群 */
var se_manager = new function(){
	/**
	* 現在流れている音楽が入っている。
	* @private {Array}
	*/
	this.se_list = Array();
	
	/**
	* 指定された要素に関して、音楽を流すかどうかの処理をする
	* @param {element} target 音楽を流す張本人
	* @param {string} se 音楽の流し方のタイプ
	*/
	this.start = function(target, se){
		se = se.split(':');
		if(se[0] == "none")return;
		
		switch(se[1]){
			case "once":
				if(!target.dataset.se_once){
					target.dataset.se_once = this.play(se[0], se[3], "once");
				}
				break;
			case "state_loop":
				if(!target.dataset.se_state_loop){
					target.dataset.se_state_loop = this.play(se[0], se[3], "loop");
				}
				break;
			case "charcter_loop":
				if(!target.dataset.se_charcter_loop){
					target.dataset.se_charcter_loop = this.play(se[0], se[3], "loop");
				}
				break;
		}
	}
	
	/**
	* 音楽を再生する
	* @param {number} se_id 再生したい音楽のID
	* @param {number} volume 音量
	* @param {string} time 何回再生するか。今現在は"once"か"loop"の二択しかないからどっちかを選んで
	* @return {number} 再生ID。音楽をとめるときに使う
	*/
	this.play = function(se_id, volume, time){
		var a = document.createElement("audio");
		a.src = data["se_list"][se_id];
		a.volume = volume;
		var play_id = this.se_list.push(a) - 1;
		if(time == "once"){
			a.onended = function(){se_manager.end(play_id);};
		}else if(time == "loop"){
			a.loop = true;
		}
		a.play();
		return play_id;
	}
	
	/**
	* 音楽を止める
	* @param {number} 止めたい音楽の再生ID
	*/
	this.end = function(play_id){
		this.se_list[play_id].pause();
		this.se_list[play_id] = null;
	}
}
