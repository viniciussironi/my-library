package com.vinicius.mylibrary.entities;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "highlight")
public class Highlight {

    @Id
    private String id;
    @Indexed
    private Long userId;
    @Indexed
    private Long bookId;
    private String highlight;
    private Integer page;
    private String color;
}
