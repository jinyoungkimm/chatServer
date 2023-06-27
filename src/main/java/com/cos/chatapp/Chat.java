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


    private LocalDateTime createdAt;

}
