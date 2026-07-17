package com.vinicius.mylibrary.repositories;

import com.vinicius.mylibrary.entities.Highlight;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface HighlightRepository extends MongoRepository<Highlight, String> {

    List<Highlight> findByBookId(Long bookId);
    List<Highlight> findByUserId(Long userId);
}
