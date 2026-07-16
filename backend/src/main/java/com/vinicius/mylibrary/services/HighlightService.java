package com.vinicius.mylibrary.services;

import com.vinicius.mylibrary.entities.Highlight;
import com.vinicius.mylibrary.repositories.HighlightRepository;
import org.springframework.stereotype.Service;

@Service
public class HighlightService {
    private final HighlightRepository highlightRepository;

    public HighlightService(HighlightRepository highlightRepository) {
        this.highlightRepository = highlightRepository;
    }
}