package com.vinicius.mylibrary.services;

import com.vinicius.mylibrary.DTOs.AnnotationDTO;
import com.vinicius.mylibrary.DTOs.HighlightDTO;
import com.vinicius.mylibrary.entities.Annotation;
import com.vinicius.mylibrary.entities.Highlight;
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
    private final AuthService authService;

    public AnnotationService(AnnotationRepository annotationRepository, AuthService authService) {
        this.annotationRepository = annotationRepository;
        this.authService = authService;
    }

    public List<AnnotationDTO> findAllAnnotations() {
        return annotationRepository.findByUserId(authService.authenticated().getId()).stream().map(AnnotationDTO::new).toList();
    }

    public List<AnnotationDTO> findAnnotationsByBook(Long bookId) {
        return annotationRepository.findByBookId(bookId).stream().map(AnnotationDTO::new).toList();
    }

    public AnnotationDTO save(AnnotationDTO annotation) {
        Annotation entity = new Annotation();
        entity.setUserId(authService.authenticated().getId());
        dtoToEntity(annotation, entity);

        return new AnnotationDTO(entity);
    }

    public AnnotationDTO update(String id, AnnotationDTO updated) {
        Annotation entity = annotationRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException(id));
        entity.setUserId(authService.authenticated().getId());
        dtoToEntity(updated, entity);

        return new AnnotationDTO(annotationRepository.save(entity));
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

    private void dtoToEntity(AnnotationDTO dto, Annotation entity) {
        entity.setContent(dto.getContent());
        entity.setPage(dto.getPage());
        entity.setCreatedAt(LocalDateTime.now());
        entity.setBookId(dto.getBookId());
    }
}