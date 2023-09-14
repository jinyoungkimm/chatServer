
//채팅방 기능
let _sender = document.getElementById("sender").value;
let _receiver =  document.getElementById("receiver").value;
let _roomNum =  document.getElementById("roomNum").value;

document.querySelector("#username").innerHTML=username;

const eventSource = new EventSource(`http://localhost:8081/chat/roomNum/${_roomNum}`); // SSE 연결하기!

eventSource.onmessage = (event) => {// SSE Protocol에 의해서, 만약 본인과 상대방이 해당 채팅방(roomNum)에 메시지를 보내서, DB에 INSERT될 때마다 [자동]으로, 
                                    // 이 이벤트가 실행이 되면서, 채팅 웹 페이지가 db의 채팅방(roomNum)에 저장돼 있는 메시지(본인과 상대방의 메시지)
                                    // 가 [자동]으로 흘러 들어 오면서, initMyMessage(data)에 의해서 새롭게 갱신이 된다. 

const data = JSON.parse(event.data); // data: {~~} 형식으로 반환되는 JSON Object을 각 key, value로 파싱한 것!

console.log(data.username);

console.log(username);

if(data.sender == _sender) // 본인의 id
{
  //채팅창의 오른쪽, 즉 파란색 쪽에 message가 출력되어야 한다.(본인이 보낸 메세지는 항상 파란색 쪽에 출력이 되었다.)

  initMyMessage(data); 
  

}
else{

  //채팅창의 왼쪽쪽, 즉 회색 쪽에 message가 출력되어야 한다.(상대방 보낸 메세지는 항상 회색 쪽에 출력이 되었다.)
  initYourMessage(data);
  
}

}

//채팅창의 오른쪽, 즉 파란색 부분의 message를 출력하는 html을 동적으로 생성(본인의 메시지를 html로 출력) 
function getSendMsgBox(data){

  let md = data.createdAt.substring(5,10);
  let tm = data.createdAt.substring(11,16);
  convertTime = tm + "|" + md;
 
  return `<div class="sent_msg"> 
  
  <p>${data.msg}</p>
  
  <span class="time_date">${convertTime} /<b>${data.sender}</b></span>
  
  </div>`;
  
  }
//채팅창의 왼쪽, 즉 회색 부분의 message를 출력하는 html을 동적으로 생성.(상대방이 보낸 메시지를 html로 출력)
  function getReceiveMsgBox(data){

    let md = data.createdAt.substring(5,10);
    let tm = data.createdAt.substring(11,16);
    convertTime = tm + "|" + md;

    return `<div class="received_withd_msg"> 
    
    <p>${data.msg}</p>
    
    <span class="time_date">${convertTime} /<b>${data.sender}</b></span>
    
    </div>`;
    
    }


function initMyMessage(data){ // 기존 본인의 메시지를 들고 온다. 

  let chatBox = document.querySelector("#chat-box");
  //let msgInput = document.querySelector("#chat-outgoing-msg");
  
  
  let sendBox = document.createElement("div");

  sendBox.className="outgoing_msg";


  sendBox.innerHTML = getSendMsgBox(data);

  chatBox.append(sendBox); 

  document.documentElement.scrollTop= document.body.scrollHeight;


}

function initYourMessage(data){ // 기존 상대방의 메시지를 들고 온다. 

  let chatBox = document.querySelector("#chat-box");
  //let msgInput = document.querySelector("#chat-outgoing-msg");
  
  let receivedBox = document.createElement("div");

  receivedBox.className="received_msg";

  receivedBox.innerHTML = getReceiveMsgBox(data);

  chatBox.append(receivedBox); 

  document.documentElement.scrollTop= document.body.scrollHeight;

}


document.querySelector("#chat-outgoing-button").addEventListener("click",()=>{

  addMessage();
  
  });
  
  document.querySelector("#chat-outgoing-msg").addEventListener("keydown",(e)=>{
  
     
      if(e.keyCode == 13){ // 엔터키의 keyCode == 13이다. 
          
      
          addMessage();
  
      }
      });

//AJAX 채팅 메시지 전송!
async function addMessage(){ 

    let msgInput = document.querySelector("#chat-outgoing-msg");


    let chat = { // (JavaScript)Object 데이터 타입

      sender: _sender,

      receiver: _receiver,

      roomNum: _roomNum,

      msg: msgInput.value

    };
     
    // 내가 실시간으로 적은 메세지를, JS를 통해서 저장시키는 코드!
      fetch("http://localhost:8081/chat",{

      method: "post",                                                                                          
                                                        
      body: JSON.stringify(chat), // JavaScript Object -> JSON 변환

      headers:{

        "Content-Type":"application/json; charset=utf-8"

      }
    });

    msgInput.value="";

}


// 귓속말 기능!(본인이 입력하는 메시지만 db에 저장되는 [단방향] 채팅 기능임.아직 이 단계는 제대로된 채팅 기능이 아님)

/*
// DB에 저장돼 있는, 
const eventSource = new EventSource("http://localhost:8080/sender/{ssar}/receiver/{cos}"); // SSE 연결하기!

eventSource.onmessage = (event) => { // SSE Protocol에 의해서, 만약 본인이 메시지를 보내서, DB에 INSERT될 때마다 [자동]으로, 
                                     // 이 이벤트가 실행이 되면서, 채팅 웹 페이지가 initMessage(data)에 의해서 새롭게 갱신이 된다. 

console.log(1,event); // new EventSource(http://localhost:8080/sender/{ssar}/receiver/{cos}) 요청 시 반환 받는, 1개 이상의 메세지들!

const data = JSON.parse(event.data); // data: {~~} 형식으로 반환되는 JSON Object을 각 key, value로 파싱한 것!

console.log(2,data); // <key,value>로 파싱됨

initMessage(data); // sender: ssar, receiver : cos에 해당하는 메세지를 db로부터 모두 가져와서, 출력을 시켜준다. 
                   // 즉, [기존]의 메세지 내용을 출력하는 함수.
}

  <!-- 보낸메시지 시작 -->
            <div class="outgoing_msg">
              <div class="sent_msg">
                <p>Lorem Ipsum refers to text that the DTP (Desktop Publishing) industry use as replacement text when
                  the real text is not </p>
                <span class="time_date"> 11:18 | Today</span>
              </div>
            </div>
            <!-- 보낸메시지 끝 -->
 
 
// 위 html 코드를 동적으로 생성하는 기능을 구현한다고 보면 된다. 

function getSendMsgBox(msg,time){

  return `<div class="sent_msg"> 
  
  <p>${msg}</p>
  
  <span class="time_date">${time}</span>
  
  </div>`;
  
  }


function initMessage(data){ // [기존]의 메세지 내용을 출력!

    let chatBox = document.querySelector("#chat-box"); 
    
    let chatOutgoingBox = document.createElement("div");

    chatOutgoingBox.className="outgoing_msg";

    let md = data.createdAt.substring(5,10);
    let tm = data.createdAt.substring(11,16);
    convertTime = tm + "|" + md;

    chatOutgoingBox.innerHTML = getSendMsgBox(data.msg,convertTime);

    chatBox.append(chatOutgoingBox); 

}


document.querySelector("#chat-outgoing-button").addEventListener("click",()=>{

  addMessage();
  
  });
  
  document.querySelector("#chat-outgoing-msg").addEventListener("keydown",(e)=>{
  
     
      if(e.keyCode == 13){ // 엔터키의 keyCode == 13이다. 
          
          addMessage();
  
      }
      });

async function addMessage(){ // async(비동기)로 해야 하는 이유는 밑에서 설명!!!

    let chatBox = document.querySelector("#chat-box");
    let msgInput = document.querySelector("#chat-outgoing-msg");
    
    // chatOutGoingBox 변수에 새로 생성될 html 코드를 만드는 과정이다. 
    let chatOutgoingBox = document.createElement("div");
    chatOutgoingBox.className="outgoing_msg";

    let date = new Date();
    let now = date.getHours() + ":" + date.getMinutes() + "|" + (date.getMonth() +1) + "/" + date.getDate();


    let chat = { // (JavaScript)Object 데이터 타입

      sender: "ssar",
      receiver: "cos",
      msg: msgInput.value

    };
     
    // 내가 실시간으로 적은 메세지를, JS를 통해서 저장시키는 코드!
    let response = await fetch("http://localhost:8080/chat",{ // fetch()작업은 실행 시간이 많이 들기 때문에 반환값(response)를 받으려면 시간이 오래 걸린다. 
      method: "post",                                   // JS는 시간이 오래 걸리게 되면 결과적으로, response에 null을 반환한다. 
                                                        // 이러한 상황을 막기 위하여 await,즉 addMessage()를 fetch() 시점에 blocking을 시켜, fetch() 실행이 종료가 될 때까지
                                                        // addMessage() 함수를 더이상 실행시키지 않고, addMessage() 함수 이외의 남은 코드들을 실행시킨다(티스토리 게시물 487 참조)
      body: JSON.stringify(chat), // JavaScript Object -> JSON 변환
      headers:{
        "Content-Type":"application/json; charset=utf-8"
      }
    });

    console.log(response);

    let parseResponse =  await response.json();

    console.log(parseResponse);

    chatOutgoingBox.innerHTML = getSendMsgBox(msgInput.value,now);
    chatBox.append(chatOutgoingBox); // append는 덮어쓰기가 아니라 기존의 html에 이어 붙이는 것이다. 
    msgInput.value="";

}*/

