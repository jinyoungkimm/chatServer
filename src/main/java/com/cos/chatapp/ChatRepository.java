package com.cos.chatapp;


import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.data.mongodb.repository.Tailable;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;


public interface ChatRepository extends ReactiveMongoRepository<Chat,String> {

    // 여기서 부터는 이제 메시지 송신자와 수신자 간에 다이렉트로 하는 귓속말 기능이 아니라, 송신자와 수신자가 [채팅방]을 통해서 채팅하는 기능을 구현을 할 것이다.
    @Tailable // 커서를 안 닫고 계속 유지하게 한다.(티스토리 참조)
    @Query("{sender:?0, receiver:?1}") // db.chat.find({sender:'cos',receiver:'ssar'})와 같은 형태의 MongoDB의 SELECT 기능이다.
    /**
     * sender == cos, receiver == ssar인 JSON Object를 chat 컬렉션에서 조회하는 기능능     * [
     *   {
     *     _id: ObjectId("6498a0d6e264048efbafafc3"),
     *     sender: 'cos',
     *     receiver: 'ssar',
     *     msg: '응 반가워'
     *   }
     * ]
     */
     Flux<Chat> mFindBySender(String sender,String receiver); // Flux(흐름) : 연결을 유지하면서 데이터를 계속 흘려 보낼 수가 있다.*/


    // 더이상 귓속말 기능이 아니라, [채팅방]을 매개체로 송/수신자가 대화를 할 것이며, 채팅방 번호에 해당하는 채팅 내용(Chat Collection)을 MongoDB에서 가져 올 것이다.
    @Tailable
    @Query("{roomNum:?0}")
    Flux<Chat> mFindByRoomNum(Integer roomNum);


}
