//O método save mistura regras de negócio e persistência.
package com.example.dg.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.dg.Modals.Cliente;
import com.example.dg.Repository.ClienteRepository;

@Service
public class ClienteService {
    @Autowired
    private ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }


    public Cliente cadastrarCliente(Cliente cliente) {
        if (cliente.getNome() == null || cliente.getNome().isEmpty()) {
            throw new IllegalArgumentException("Nome do cliente não pode ser vazio");
        }
        if (cliente.getTelefone() == null || !cliente.validarNumero(cliente.getTelefone())) {
            throw new IllegalArgumentException("Número de telefone inválido");
        }
        if (cliente.getEndereco() == null || !cliente.validarEndereco(cliente.getEndereco())) {
            throw new IllegalArgumentException("Endereço inválido");
        }
        List<Cliente> clientesExistentes = clienteRepository.findAll();
        for (Cliente c : clientesExistentes) {
            if (c.getEndereco().equals(cliente.getEndereco())) {
                throw new IllegalArgumentException("Endereço já cadastrado");
            }
        }
        return clienteRepository.save(cliente);
    }
    public Cliente atualizarCliente(Cliente cliente) {
        if (clienteRepository.existsById(cliente.getId())) {
            return clienteRepository.save(cliente);
        } else {
            throw new RuntimeException("Cliente não encontrado");
        }
    }
    public Cliente buscarClientePorId(int id) {
        return clienteRepository.findById(id).orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
    }
    public List<Cliente> buscarTodosClientes() {
        List<Cliente> clientes = clienteRepository.findAll();

        Collections.reverse(clientes);
        return clientes;
    }
    public void deletarCliente(int id) {
        if (clienteRepository.existsById(id)) {
            clienteRepository.deleteById(id);
        } else {
            throw new RuntimeException("Cliente não encontrado");
        }
    }
    public List<Cliente> previsaoTerminoGasHoje() {
        List<Cliente> clientes = clienteRepository.findAll();
        List<Cliente> clientesComPrevisao = new ArrayList<>();

        for (Cliente cliente : clientes) {
            Date data = cliente.getPrevisaoTerminoGas();

            if (data != null) {
                LocalDate previsao = ((java.sql.Date) data).toLocalDate();
                if (previsao.isEqual(LocalDate.now())) {
                    clientesComPrevisao.add(cliente);
                }
            }
        }

        return clientesComPrevisao;
    }


}
