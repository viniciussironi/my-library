package com.vinicius.mylibrary.DTOs;

import com.vinicius.mylibrary.entities.Annotation;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class AnnotationDTO {
    private String id;
    private Long bookId;
    private Integer page;
    private String content;
    private LocalDateTime createdAt;

    public AnnotationDTO(Annotation annotation) {
        this.id = annotation.getId();
        this.bookId = annotation.getBookId();
        this.page = annotation.getPage();
        this.content = annotation.getContent();
        this.createdAt = annotation.getCreatedAt();
    }
}
