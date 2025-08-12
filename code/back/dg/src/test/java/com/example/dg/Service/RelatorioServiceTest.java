package com.example.dg.Service;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Date;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

import org.aspectj.lang.annotation.Before;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.Spy;

import com.example.dg.Modals.Cliente;
import com.example.dg.Modals.Venda;
import com.example.dg.Repository.ClienteRepository;
import com.example.dg.Repository.RelatorioRepository;
import com.example.dg.Repository.VendaRepository;
import com.example.dg.dto.RelatorioDto;

public class RelatorioServiceTest {
    @Mock
    RelatorioRepository relatorioRepository;
    @Mock
    VendaRepository vendaRepository;
    @Mock
    ClienteRepository clienteRepository;
    @Spy
    @InjectMocks
    RelatorioService relatorioService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void deveGerarRelatorioComDadosValidos() {
        // Arrange: criar vendas simuladas
        List<Venda> vendas = new ArrayList<>();
        Cliente cliente = new Cliente();
        cliente.setId(1);
        cliente.setNome("Cliente Teste");
        cliente.setEndereco("Rua Teste, 123");
        cliente.setTelefone("12345678912");

        Venda venda = new Venda();
        venda.setId(1);
        venda.setCliente(cliente);
        venda.setValor(100.0);
        LocalDate localDate = LocalDate.of(2025, 8, 12);
        Date data = Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
        venda.setData(data);
        vendas.add(venda);

        // Configura mocks
        when(vendaRepository.findByDataBetween(any(Date.class), any(Date.class))).thenReturn(vendas);
        when(relatorioRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        byte[] relatorio = relatorioService.gerarRelatorioMensal(new RelatorioDto(2025, 8));

        // Assert
        assertNotNull(relatorio);
        assertTrue(relatorio.length > 0);

        verify(relatorioService, atLeastOnce()).calcularTotalDoDia(any(LocalDate.class));
        verify(relatorioRepository, times(1)).save(any());
    }
    
}

