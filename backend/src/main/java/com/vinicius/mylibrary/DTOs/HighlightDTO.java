package com.vinicius.mylibrary.DTOs;

import com.vinicius.mylibrary.entities.Highlight;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class HighlightDTO {

    private String id;
    private String highlight;
    private Integer page;
    private String color;
    private Long bookId;

    public HighlightDTO(Highlight highlight) {
        this.id = highlight.getId();
        this.highlight = highlight.getHighlight();
        this.page = highlight.getPage();
        this.color = highlight.getColor();
        this.bookId = highlight.getBookId();
    }
}
