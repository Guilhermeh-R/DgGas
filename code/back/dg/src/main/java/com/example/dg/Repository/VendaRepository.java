package com.example.dg.Repository;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.dg.Modals.Venda;

@Repository
public interface VendaRepository extends JpaRepository<Venda, Integer> {
    List<Venda> findByClienteId(int clienteId);
    List<Venda> findByDataBetween(Date inicio, Date fim);
    List<Venda> findByDataBetween(LocalDate inicio, LocalDate fim);
}
