package com.vinicius.mylibrary.services;

import com.vinicius.mylibrary.DTOs.HighlightDTO;
import com.vinicius.mylibrary.entities.Highlight;
import com.vinicius.mylibrary.repositories.HighlightRepository;
import com.vinicius.mylibrary.services.exceptions.DatabaseException;
import com.vinicius.mylibrary.services.exceptions.ResourceNotFoundException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HighlightService {
    private final HighlightRepository highlightRepository;

    public HighlightService(HighlightRepository highlightRepository) {
        this.highlightRepository = highlightRepository;
    }

    public List<HighlightDTO> findAll() {
        return highlightRepository.findAll().stream().map(HighlightDTO::new).toList();
    }

    public HighlightDTO save(Highlight highlight) {
        Highlight highlightSaved = highlightRepository.save(highlight);
        return new HighlightDTO(highlightSaved);
    }

    public HighlightDTO update(String id, Highlight updated) {
        Highlight existing = highlightRepository.findById(id).orElseThrow();
        existing.setHighlight(updated.getHighlight());
        existing.setPage(updated.getPage());
        existing.setColor(updated.getColor());
        return new HighlightDTO(highlightRepository.save(existing));
    }

    public void delete(String id) {
        if(!highlightRepository.existsById(id)) {
            throw new ResourceNotFoundException("Marcação não encontrada");
        }
        try {
            highlightRepository.deleteById(id);
        }
        catch (DataIntegrityViolationException e) {
            throw new DatabaseException("Falha de integridade");
        }
    }
}