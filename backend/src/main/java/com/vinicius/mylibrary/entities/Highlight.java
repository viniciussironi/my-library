package com.vinicius.mylibrary.entities;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "annotations")
public class Highlight {

    @Id
    private String id;
    private Long userId;
    private Long bookId;
    private String highlight;
    private Integer page;
    private String color;
}
