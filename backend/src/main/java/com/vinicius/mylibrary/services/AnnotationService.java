package com.vinicius.mylibrary.services;

import com.vinicius.mylibrary.DTOs.AnnotationDTO;
import com.vinicius.mylibrary.entities.Annotation;
import com.vinicius.mylibrary.repositories.AnnotationRepository;
import com.vinicius.mylibrary.services.exceptions.DatabaseException;
import com.vinicius.mylibrary.services.exceptions.ResourceNotFoundException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AnnotationService {
    private final AnnotationRepository annotationRepository;

    public AnnotationService(AnnotationRepository annotationRepository) {
        this.annotationRepository = annotationRepository;
    }

    public List<AnnotationDTO> findAll() {
        return annotationRepository.findAll().stream().map(AnnotationDTO::new).toList();
    }

    public AnnotationDTO save(Annotation annotation) {
        annotation.setCreatedAt(LocalDateTime.now());
        Annotation annotationSaved = annotationRepository.save(annotation);
        return new AnnotationDTO(annotationSaved);
    }

    public AnnotationDTO update(String id, Annotation updated) {
        Annotation existing = annotationRepository.findById(id).orElseThrow();
        existing.setContent(updated.getContent());
        existing.setPage(updated.getPage());

        return new AnnotationDTO(annotationRepository.save(existing));
    }

    public void delete(String id) {
        if(!annotationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Anotação não encontrada");
        }
        try {
            annotationRepository.deleteById(id);
        }
        catch (DataIntegrityViolationException e) {
            throw new DatabaseException("Falha de integridade");
        }
    }
}