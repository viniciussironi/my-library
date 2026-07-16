package com.vinicius.mylibrary.repositories;

import com.vinicius.mylibrary.entities.Annotation;
import org.springframework.data.repository.CrudRepository;

public interface AnnotationRepository extends CrudRepository<Annotation, Long> {
}
