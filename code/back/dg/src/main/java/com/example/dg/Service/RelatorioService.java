package com.example.dg.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;

import com.example.dg.Modals.Venda;
import com.example.dg.Repository.RelatorioRepository;
import com.example.dg.Repository.VendaRepository;
import com.example.dg.dto.RelatorioDto;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpHeaders;

@Service
public class RelatorioService {
    @Autowired
    private RelatorioRepository relatorioRepository;
    @Autowired
    private VendaRepository vendaRepository;

    public RelatorioService(RelatorioRepository relatorioRepository) {
        this.relatorioRepository = relatorioRepository;
    }
   public byte[] gerarRelatorioMensal(RelatorioDto request) {
    int ano = request.getAno();
    int mes = request.getMes();

    LocalDate inicio = LocalDate.of(ano, mes, 1);
    LocalDate fim = inicio.withDayOfMonth(inicio.lengthOfMonth());

    ByteArrayOutputStream baos = new ByteArrayOutputStream();

    try (PdfWriter writer = new PdfWriter(baos);
         PdfDocument pdfDoc = new PdfDocument(writer);
         Document document = new Document(pdfDoc)) {

        document.add(new Paragraph("Relatório Mensal de Vendas"));
        document.add(new Paragraph("Mês: " + mes + "/" + ano).setBold());
        System.out.println("Consultando: " + inicio + " até " + fim);


        // Percorre cada dia do mês
        for (LocalDate dia = inicio; !dia.isAfter(fim); dia = dia.plusDays(1)) {
            double totalDia = calcularTotalDoDia(dia);

            // Só mostra o dia se houver vendas
            if (totalDia > 0) {
                // Buscar quantidade de vendas do dia
                Date inicioDia = Date.from(dia.atStartOfDay(ZoneId.systemDefault()).toInstant());
                Date fimDia = Date.from(dia.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant());
                int quantidadeVendas = vendaRepository.findByDataBetween(inicioDia, fimDia).size();

                document.add(new Paragraph("Dia " + dia + ": " + quantidadeVendas + " vendas - Faturamento: R$ " +
                        String.format("%.2f", totalDia)));

                        System.out.println("Dia " + dia + " => total: " + totalDia);

            }
        }

        // Total do mês
        double totalMes = calcularTotalDoMes(ano, mes);
        document.add(new Paragraph("\nFaturamento total do mês: R$ " + String.format("%.2f", totalMes)).setBold());

    } catch (Exception e) {
        e.printStackTrace();
    }

    return baos.toByteArray();
}

    public double calcularTotalDoDia(LocalDate dia) {
        // Converter LocalDate para Date
        Date consultaDia = Date.from(dia.atStartOfDay(ZoneId.systemDefault()).toInstant());


        List<Venda> vendasDoDia = vendaRepository.findByDataBetween(consultaDia, consultaDia);

        return vendasDoDia.stream()
                .mapToDouble(v -> v.getValor()) 
                .sum();
    }
    public double calcularTotalDoMes(int ano, int mes) {
    // Converter LocalDate para Date
        LocalDate inicioLocalDate = LocalDate.of(ano, mes, 1);
        LocalDate fimLocalDate = inicioLocalDate.withDayOfMonth(inicioLocalDate.lengthOfMonth());

        Date inicio = Date.from(inicioLocalDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date fim = Date.from(fimLocalDate.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant());

        List<Venda> vendasDoMes = vendaRepository.findByDataBetween(inicio, fim);

        return vendasDoMes.stream()
                .mapToDouble(Venda::getValor) // ajuste se o nome do método for diferente
                .sum();
    }


 
        
}
