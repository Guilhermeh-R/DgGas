package com.example.dg.Service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.example.dg.Modals.Cliente;
import com.example.dg.Repository.ClienteRepository;

public class ClienteServiceTest {
    @Mock
    private ClienteRepository clienteRepository;

    @InjectMocks
    private ClienteService clienteService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void deveCadastrarClienteQuandoDadosValidos(){
        Cliente cliente = new Cliente();
        cliente.setNome("Cliente Teste");
        cliente.setEndereco("Rua Teste, 123");
        cliente.setTelefone("12345678912");

        when(clienteRepository.save(cliente)).thenReturn(cliente);
        Cliente resultado = clienteService.cadastrarCliente(cliente);
        assertEquals(cliente, resultado);
    }
}

