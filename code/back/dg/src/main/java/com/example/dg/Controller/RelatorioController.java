package com.example.dg.Controller;

import org.springframework.http.HttpHeaders;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.dg.Service.RelatorioService;
import com.example.dg.dto.RelatorioDto;
import org.springframework.http.MediaType;

@RestController
@RequestMapping("/relatorio")
public class RelatorioController {
    @Autowired
    private RelatorioService relatorioService;

    public RelatorioController(RelatorioService relatorioService) {
        this.relatorioService = relatorioService;
    }
    @PostMapping("/gerarRelatorioMensal")
    public ResponseEntity<byte[]> gerarRelatorioMensal(@RequestBody RelatorioDto request) {
        byte[] relatorio = relatorioService.gerarRelatorioMensal(request);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=relatorio_mensal.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(relatorio);
    }
}