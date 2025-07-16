package com.example.dg.Modals;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Entity
@Table(name = "cliente")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String nome;
    private String telefone;
    private String endereco;

    @Temporal(TemporalType.DATE)
    private Date dataUltimaCompra;

    @Temporal(TemporalType.DATE)
    private Date previsaoTerminoGas;
}
