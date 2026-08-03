package com.vinicius.mylibrary.entities;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "annotations")
public class Annotation {

    @Id
    private String id;
    @Indexed
    private Long userId;
    @Indexed
    private Long bookId;
    private Integer page;
    private String content;
    @CreatedDate
    private LocalDateTime createdAt;
}
