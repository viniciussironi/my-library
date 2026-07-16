package com.vinicius.mylibrary.repositories;

import com.vinicius.mylibrary.entities.Annotation;
import org.springframework.data.repository.CrudRepository;

public interface HighlightRepository extends CrudRepository<Annotation, Long> {
}
