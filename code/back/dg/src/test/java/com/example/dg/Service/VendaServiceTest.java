package com.example.dg.Service;

import com.example.dg.Modals.Cliente;
import com.example.dg.Modals.Venda;
import com.example.dg.Repository.ClienteRepository;
import com.example.dg.Repository.VendaRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class VendaServiceTest {

    @Mock
    private VendaRepository vendaRepository;

    @Mock
    private ClienteRepository clienteRepository;

    @InjectMocks
    private VendaService vendaService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void deveCadastrarVendaQuandoDadosValidos() {
        // Arrange
        Cliente cliente = new Cliente();
        cliente.setId(1);

        Venda venda = new Venda();
        venda.setValor(100.0);
        venda.setCliente(cliente);

        // Venda antiga com data para evitar NullPointerException
        Venda vendaAntiga = new Venda();
        vendaAntiga.setData(new Date(System.currentTimeMillis() - 86400000)); // 1 dia atrás

        // Simula encontrar cliente
        when(clienteRepository.findById(1)).thenReturn(Optional.of(cliente));

        // Lista mutável e com data válida
        ArrayList<Venda> vendasAntigas = new ArrayList<>();
        vendasAntigas.add(vendaAntiga);

        when(vendaRepository.findByClienteId(1)).thenReturn(vendasAntigas);

        // Simula salvar cliente e venda
        when(clienteRepository.save(any(Cliente.class))).thenReturn(cliente);
        when(vendaRepository.save(any(Venda.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        Venda resultado = vendaService.cadastrarVenda(venda);

        // Assert
        assertNotNull(resultado.getData(), "A data da venda deve ser preenchida");
        assertEquals(cliente, resultado.getCliente(), "O cliente retornado deve ser o mesmo do mock");
        verify(vendaRepository, times(1)).save(venda);
        verify(clienteRepository, atLeastOnce()).save(cliente);
    }

    @Test
    void deveLancarExcecaoQuandoValorMenorOuIgualZero() {
        // Arrange
        Venda venda = new Venda();
        venda.setValor(0.0);
        venda.setCliente(new Cliente());

        // Act & Assert
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            vendaService.cadastrarVenda(venda);
        });

        assertEquals("O valor da venda deve ser maior que zero.", ex.getMessage());
        verifyNoInteractions(clienteRepository, vendaRepository);
    }

    @Test
    void deveLancarExcecaoQuandoClienteNaoEncontrado() {
        // Arrange
        Cliente cliente = new Cliente();
        cliente.setId(99);

        Venda venda = new Venda();
        venda.setValor(150.0);
        venda.setCliente(cliente);

        when(clienteRepository.findById(99)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException ex = assertThrows(RuntimeException.class, () -> {
            vendaService.cadastrarVenda(venda);
        });

        assertEquals("Cliente não encontrado", ex.getMessage());
        verify(clienteRepository, times(1)).findById(99);
        verifyNoMoreInteractions(clienteRepository);
        verifyNoInteractions(vendaRepository);
    }
}
