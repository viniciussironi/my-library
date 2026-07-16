package com.vinicius.mylibrary.DTOs;

import lombok.Data;

@Data
public class AnnotationDTO {
    private Long id;
    private String content;
    private Integer page;
    private Long bookId;
    private Long userId;
}
