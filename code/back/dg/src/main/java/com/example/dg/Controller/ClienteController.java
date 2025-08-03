package com.example.dg.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.dg.Modals.Cliente;
import com.example.dg.Service.ClienteService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;


@RestController
@RequestMapping("/clientes")
public class ClienteController {
    @Autowired
    private ClienteService clienteService;


    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }
    @PostMapping("/cadastrar")
    public Cliente cadastrarCliente(@RequestBody Cliente cliente) {
        return clienteService.cadastrarCliente(cliente);
    }
    @PostMapping("/atualizar")
    public Cliente atualizarCliente(@RequestBody Cliente cliente) {
        return clienteService.atualizarCliente(cliente);
    }
    @PostMapping("/buscarPorId")
    public Cliente buscarClientePorId(@RequestBody int id) {
        return clienteService.buscarClientePorId(id);
    }
    @GetMapping("/ListarTodos")
    public List<Cliente> buscarTodosClientes() {
        return clienteService.buscarTodosClientes();
    }
    @DeleteMapping("/deletar/{id}")
    public void deletarCliente(@PathVariable int id) {
        clienteService.deletarCliente(id);
    }
}
