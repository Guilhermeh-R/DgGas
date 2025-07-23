package com.example.dg.Repository;

import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.example.dg.Modals.Cliente;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Integer> {
    @Query("SELECT c FROM Cliente c JOIN FETCH c.dataUltimaCompra d WHERE d IS NOT NULL")
    List<Cliente> findAllClientesWithVendas();

}
