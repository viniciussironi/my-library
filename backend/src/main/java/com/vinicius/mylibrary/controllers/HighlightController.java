package com.vinicius.mylibrary.controllers;

import com.vinicius.mylibrary.DTOs.HighlightDTO;
import com.vinicius.mylibrary.entities.Highlight;
import com.vinicius.mylibrary.services.HighlightService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/highlights")
public class HighlightController {

    private final HighlightService highlightService;

    public HighlightController(HighlightService highlightService) {
        this.highlightService = highlightService;
    }

    @GetMapping
    public ResponseEntity<List<HighlightDTO>> findAll() {
        return ResponseEntity.ok(highlightService.findAll());
    }

    @PostMapping
    public ResponseEntity<HighlightDTO> create(@RequestBody Highlight highlight) {
        HighlightDTO dto = highlightService.save(highlight);

        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(dto.getId())
                .toUri();

        return ResponseEntity.created(uri).body(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HighlightDTO> update(@PathVariable String id, @RequestBody Highlight highlight) {
        return ResponseEntity.ok(highlightService.update(id, highlight));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        highlightService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
