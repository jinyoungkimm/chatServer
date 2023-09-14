package com.cos.chatapp;


import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.repository.query.Param;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Scheduler;
import reactor.core.scheduler.Schedulers;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@Slf4j
@RequiredArgsConstructor // JSON [객체]로 반환하기 때문!
public class CharController {

    private final ChatRepository chatRepository;

    private static HashSet<String> rommNumber = new HashSet<>();



    @CrossOrigin
    @GetMapping(value="/chat/roomNum/{sender}/{receiver}/{roomNum}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    @ResponseBody
    public Flux<Chat> findByRoomNum2(@PathVariable("sender") String sender,
                                     @PathVariable("receiver") String receiver,
                                     @PathVariable("roomNum") String roomNum){



        if(!rommNumber.contains(roomNum)) // 한 번도 채팅방이 만들어 진 적이 없는 경우!
        {
            Chat chat = new Chat();
            String _sender = sender;
            String _receiver = receiver;
            //String room = sender + receiver;
            chat.setSender(_sender);
            chat.setReceiver(_receiver);
            chat.setRoomNum(roomNum);

            rommNumber.add(roomNum);


            chatRepository.save(chat);



        }


        return chatRepository.mFindByRoomNum(roomNum);

    }


    @CrossOrigin
    @PostMapping("/chat") // 웹에서 보낸 메시지를 db에 저장한다.(저장만 하고, FLUX 되지는 X)
    @ResponseBody
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
