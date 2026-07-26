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
    private final AuthService authService;

    public HighlightService(HighlightRepository highlightRepository, AuthService authService) {
        this.highlightRepository = highlightRepository;
        this.authService = authService;
    }

    public List<HighlightDTO> findAllHighlights() throws ResourceNotFoundException {
        return highlightRepository.findByUserId(authService.authenticated().getId()).stream().map(HighlightDTO::new).toList();
    }

    public List<HighlightDTO> findHighlightsByBook(Long bookId) throws ResourceNotFoundException {
        return highlightRepository.findByBookId(bookId).stream().map(HighlightDTO::new).toList();
    }

    public HighlightDTO save(HighlightDTO highlight) throws ResourceNotFoundException, DatabaseException {
        Highlight entity = new Highlight();
        entity.setUserId(authService.authenticated().getId());
        dtoToEntity(highlight, entity);

        entity = highlightRepository.save(entity);

        return new HighlightDTO(entity);
    }

    public HighlightDTO update(String id, HighlightDTO updated) {
        Highlight entity = highlightRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException(id));
        entity.setUserId(authService.authenticated().getId());
        dtoToEntity(updated, entity);

        entity = highlightRepository.save(entity);

        return new HighlightDTO(entity);
    }

    public void delete(String id) {
        authService.authenticated();
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

    private void dtoToEntity(HighlightDTO dto, Highlight entity) {
        entity.setHighlight(dto.getHighlight());
        entity.setPage(dto.getPage());
        entity.setColor(dto.getColor());
        entity.setBookId(dto.getBookId());
    }
}