package com.cos.chatapp;


import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Scheduler;
import reactor.core.scheduler.Schedulers;

import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor // JSON [객체]로 반환하기 때문!
public class CharController {

    private final ChatRepository chatRepository;

    // 귓속말 할 때 사용!
   /* @CrossOrigin
    // MediaType.TEXT_EVENT_STREAM_VALUE : SSE Protocl기능! ( 요청이 와서 응답을 보내도, 응답 channel은 끊지 않고 계속해서 응답 channel로 데이터를 보낼 수 있게 해줌)
    @GetMapping(value = "/sender/{sender}/receiver/{receiver}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<Chat> getMessage(@PathVariable String sender,@PathVariable String receiver){
        //반환형이 Flux이기에 [여러 개]의 데이터를 한 번에 보낼 수가 있다.
    return chatRepository.mFindBySender(sender,receiver)
            .subscribeOn(Schedulers.boundedElastic());

    }*/


    // 귓속말이 아니라, [채팅팅방] 능을 구현하겠다.
    @CrossOrigin
    @GetMapping(value="/chat/roomNum/{roomNum}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<Chat> findByRoomNum(@PathVariable Integer roomNum){

        return chatRepository.mFindByRoomNum(roomNum);

    }


    @PostMapping("/chat")
    public Mono<Chat> setMsg(@RequestBody Chat chat) {

        chat.setCreatedAt(LocalDateTime.now());
        return chatRepository.save(chat); // Spring Data가 자동으로 SAVE()를 이미 구현해 놓았다.

    }


   /* @CrossOrigin
    @PostMapping("/chat")
    public void setMsg(@RequestBody Chat chat) {

        chat.setCreatedAt(LocalDateTime.now());
        chatRepository.save(chat); // Spring Data가 자동으로 SAVE()를 이미 구현해 놓았다.

    }*/




}
