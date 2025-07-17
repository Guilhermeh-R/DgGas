package com.example.dg.Modals;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Entity
@Table(name = "cliente")
@Getter
@Setter
@NoArgsConstructor
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

    public Cliente(String nome, String telefone, String endereco, Date dataUltimaCompra, Date previsaoTerminoGas) {
        setTelefone(telefone);
        this.nome = nome;
        setEndereco(endereco);
        this.dataUltimaCompra = dataUltimaCompra;
        this.previsaoTerminoGas = previsaoTerminoGas;
    }

    public void setTelefone(String telefone) {
        if (!validarNumero(telefone)) {
            throw new IllegalArgumentException("Número de telefone inválido");
        }
        this.telefone = telefone;
    }

    public Boolean validarNumero(String telefone) {
        return telefone != null && telefone.matches("\\d{11}");
    }
    public void setEndereco(String endereco) {
        if (!validarEndereco(endereco)) {
            throw new IllegalArgumentException("Endereço inválido");
        }
        this.endereco = endereco;
    }

    public Boolean validarEndereco(String endereco) {
        if (endereco == null || endereco.trim().isEmpty()) {
            return false;
        }

        if (!endereco.contains(",")) {
            return false;
        }

        if (endereco.length() < 5) {
            return false;
        }

        String[] partes = endereco.split(",");
        if (partes.length < 2 || partes[0].trim().isEmpty() || partes[1].trim().isEmpty()) {
            return false;
        }

        return true;
    }

}
