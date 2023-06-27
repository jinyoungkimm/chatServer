package com.cos.chatapp;


import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "chat") // 채팅이 오고 갈때마다, 이 [컬렉션]에 데이터들을 밀어 넣을 거다.
public class Chat {

    @Id
    private String id;
    private String msg;
    private String sender; // 송신자

    private String receiver; // 수신자

    private Integer roomNun; // 채팅방 번호 : 채팅방이 있으면 수신자는 필요가 없고 [송신자(sender)]만 있으면 된다.
    // -> 채팅방이 소위 메세지가 전달되어야 할 목적지(=송신자)역할을 하기 때문이다.
    // 그럼 수신자 정보가 필요할 때 언제인가 : 송신자와 수신자 사이에 채팅방을 통하지 않고 귓속말 같은 것으로 direct하게 메시지를 송/수신 할 때 필요!!!

    private LocalDateTime createdAt;

}
