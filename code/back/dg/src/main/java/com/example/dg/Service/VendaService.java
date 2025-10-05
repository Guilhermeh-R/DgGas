//Não há tratamento de exceções específicas.

package com.example.dg.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.time.ZoneId;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.dg.Modals.Cliente;
import com.example.dg.Modals.Venda;
import com.example.dg.Repository.ClienteRepository;
import com.example.dg.Repository.VendaRepository;

@Service
public class VendaService {
    @Autowired
    private VendaRepository vendaRepository;
    @Autowired
    private ClienteRepository clienteRepository;

    public Venda cadastrarVenda(Venda venda) {
        if (venda.getValor() <= 0.0) {
            throw new IllegalArgumentException("O valor da venda deve ser maior que zero.");
        }
        venda.setData(new java.util.Date());
        Cliente cliente = clienteRepository.findById(venda.getCliente().getId()).orElse(null);
        if (cliente == null) {
            throw new RuntimeException("Cliente não encontrado");
        }
        cliente = atualizarClientePrevisao(cliente, venda);
        

        venda.setCliente(cliente);


        return vendaRepository.save(venda);
    }
    private Cliente atualizarClientePrevisao(Cliente cliente, Venda novaVenda) {
        cliente.setDataUltimaCompra(novaVenda.getData());

        List<Venda> vendas = vendaRepository.findByClienteId(cliente.getId());

        if (vendas == null) {
            return clienteRepository.save(cliente);
        }

        // Adiciona a nova venda para o cálculo da média (ainda não persistida)
        vendas.add(novaVenda);

        if (vendas.size() >= 2) {
            // Ordena por data crescente
            vendas.sort(Comparator.comparing(Venda::getData));
            //soma os intervalos entre as vendas para calcular a média
            long somaIntervalos = 0;
            for (int i = 1; i < vendas.size(); i++) {
                long intervalo = vendas.get(i).getData().getTime() - vendas.get(i - 1).getData().getTime();
                somaIntervalos += intervalo;
            }
            // A quantidade de intervalos e 1 a menos que o numero de vendas
            long mediaIntervalos = somaIntervalos / (vendas.size() - 1);

            long proximaPrevisao = novaVenda.getData().getTime() + mediaIntervalos;
            cliente.setPrevisaoTerminoGas(new java.util.Date(proximaPrevisao));
        }

        return clienteRepository.save(cliente);
    }
    public Venda atualizarVenda(Venda venda) {
        return vendaRepository.save(venda);
    }

    public Venda buscarVendaPorId(int id) {
        return vendaRepository.findById(id).orElse(null);
    }

    public List<Venda> buscarTodasVendas() {
        List<Venda> vendas = vendaRepository.findAll();

        Collections.reverse(vendas);
        return vendas;
    }

    public void deletarVenda(int id) {
        vendaRepository.deleteById(id);
    }
    public List<Cliente> clientesPosVenda() {
        LocalDate ontem = LocalDate.now().minusDays(1);
        List<Venda> vendas = vendaRepository.findAll();

        Set<Cliente> clientesPosVenda = new HashSet<>();

        for (Venda venda : vendas) {
            Date vendaData = venda.getData();
            if (vendaData != null) {
                LocalDate dataVenda = ((java.sql.Date) vendaData).toLocalDate();

                if (dataVenda.equals(ontem)) {
                    clientesPosVenda.add(venda.getCliente());
                }
            }
        }

        return new ArrayList<>(clientesPosVenda);
    }

}
