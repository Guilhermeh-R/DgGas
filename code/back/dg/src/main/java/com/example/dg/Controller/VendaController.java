package com.example.dg.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

import com.example.dg.Service.VendaService;

import com.example.dg.Modals.Venda;

@RestController
@RequestMapping("/vendas")
public class VendaController {
    @Autowired
    private VendaService vendaService;

    public VendaController(VendaService vendaService) {
        this.vendaService = vendaService;
    }
    @PostMapping("/cadastrar")
    public Venda cadastrarVenda(@RequestBody Venda venda) {
        return vendaService.cadastrarVenda(venda);
    }
    @PostMapping("/atualizar")
    public Venda atualizarVenda(@RequestBody Venda venda) {
        return vendaService.atualizarVenda(venda);
    }
    @PostMapping("/buscarPorId")
    public Venda buscarVendaPorId(@RequestBody int id) {
        return vendaService.buscarVendaPorId(id);
    }
    @GetMapping("/ListarTodos")
    public List<Venda> buscarTodasVendas() {
        return vendaService.buscarTodasVendas();
    }
    @PostMapping("/deletar")
    public void deletarVenda(@RequestBody int id) {
        vendaService.deletarVenda(id);
    }
}
