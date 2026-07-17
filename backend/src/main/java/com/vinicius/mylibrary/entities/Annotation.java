package com.vinicius.mylibrary.entities;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "annotations")
public class Annotation {

    @Id
    private String id;
    private Long userId;
    private Long bookId;
    private Integer page;
    private String content;
    private LocalDateTime createdAt;
}
