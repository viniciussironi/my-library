package com.vinicius.mylibrary.repositories;

import com.vinicius.mylibrary.entities.Annotation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface AnnotationRepository extends MongoRepository<Annotation, String> {

    List<Annotation> findByBookId(Long bookId);
    List<Annotation> findByUserId(Long userId);
}
