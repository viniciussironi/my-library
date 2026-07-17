package com.vinicius.mylibrary.DTOs;

import com.vinicius.mylibrary.entities.Highlight;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class HighlightDTO {

    private String id;
    private Long userId;
    private Long bookId;
    private String highlight;
    private Integer page;
    private String color;

    public HighlightDTO(Highlight highlight) {
        this.id = highlight.getId();
        this.userId = highlight.getUserId();
        this.bookId = highlight.getBookId();
        this.highlight = highlight.getHighlight();
        this.page = highlight.getPage();
        this.color = highlight.getColor();
    }
}
