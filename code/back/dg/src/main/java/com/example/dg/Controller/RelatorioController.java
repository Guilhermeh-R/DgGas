//O retorno do relatório está fortemente acoplado às entidades do banco.

package com.example.dg.Controller;

import org.springframework.http.HttpHeaders;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.dg.Modals.Venda;
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
    @PostMapping("/clientes")
    public ResponseEntity<byte[]> getClientes(@RequestBody int mes) {
        byte[] relatorio = relatorioService.gerarRelatorioClientes(mes);


        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=relatorio_clientes.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(relatorio);
    }
    @GetMapping("/totalHoje")
    public ResponseEntity<List<Venda>> getTotalHoje() {
        List<Venda> vendasHoje = relatorioService.calcularQtdDoHoje();
        return ResponseEntity.ok(vendasHoje);
    }
    @GetMapping("/totalMes")
    public ResponseEntity<List<Venda>> getTotalMes() {
        int ano = LocalDate.now().getYear();
        int mes = LocalDate.now().getMonthValue();
        List<Venda> vendasMes = relatorioService.calcularTotalDoMes(ano, mes);
        return ResponseEntity.ok(vendasMes);
    }
}
