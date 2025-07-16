package com.example.dg.Modals;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Entity
@Table(name = "relatorio")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Relatorio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Temporal(TemporalType.DATE)
    private Date dataGeracao;

    private String tipo;

    @Column(columnDefinition = "TEXT")
    private String conteudo;
}