package com.example.dg.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.dg.Modals.Relatorio;

@Repository
public interface RelatorioRepository extends JpaRepository<Relatorio, Integer> {
    // Aqui você pode adicionar métodos específicos para Relatório, se necessário
    
}
