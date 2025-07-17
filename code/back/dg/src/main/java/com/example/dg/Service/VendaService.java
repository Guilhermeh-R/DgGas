package com.example.dg.Service;

import java.util.Comparator;
import java.util.List;

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

            long somaIntervalos = 0;
            for (int i = 1; i < vendas.size(); i++) {
                long intervalo = vendas.get(i).getData().getTime() - vendas.get(i - 1).getData().getTime();
                somaIntervalos += intervalo;
            }

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
        return vendaRepository.findAll();
    }

    public void deletarVenda(int id) {
        vendaRepository.deleteById(id);
    }
}