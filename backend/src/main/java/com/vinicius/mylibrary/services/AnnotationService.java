package com.vinicius.mylibrary.services;

import com.vinicius.mylibrary.entities.Annotation;
import com.vinicius.mylibrary.repositories.AnnotationRepository;
import org.springframework.stereotype.Service;

@Service
public class AnnotationService {
    private final AnnotationRepository annotationRepository;

    public AnnotationService(AnnotationRepository annotationRepository) {
        this.annotationRepository = annotationRepository;
    }

    public Annotation save(Annotation annotation) {
        return annotationRepository.save(annotation);
    }
}