package com.vinicius.mylibrary.controllers;

import com.vinicius.mylibrary.DTOs.AnnotationDTO;
import com.vinicius.mylibrary.entities.Annotation;
import com.vinicius.mylibrary.services.AnnotationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/annotations")
public class AnnotationController {

    private final AnnotationService annotationService;

    public AnnotationController(AnnotationService annotationService) {
        this.annotationService = annotationService;
    }

    @GetMapping
    public ResponseEntity<List<AnnotationDTO>> AllAnnotations() {
        return ResponseEntity.ok(annotationService.findAllAnnotations());
    }

    @PostMapping
    public ResponseEntity<AnnotationDTO> create(@RequestBody AnnotationDTO annotation) {
        AnnotationDTO dto = annotationService.save(annotation);

        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(dto.getId())
                .toUri();

        return ResponseEntity.created(uri).body(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AnnotationDTO> update(@PathVariable String id, @RequestBody AnnotationDTO annotation) {
        return ResponseEntity.ok(annotationService.update(id, annotation));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        annotationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
