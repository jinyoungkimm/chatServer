package com.cos.chatapp;


import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.data.mongodb.repository.Tailable;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;


public interface ChatRepository extends ReactiveMongoRepository<Chat,String> {


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
    Flux<Chat> mFindBySender(String sender,String receiver); // Flux(흐름) : 연결을 유지하면서 데이터를 계속 흘려 보낼 수가 있다.



    @Tailable
    @Query("{roomNum:?0}")
    Flux<Chat> mFindByRoomNum(Integer roomNum);


}
