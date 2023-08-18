package com.cointcompany.backend.domain.file.controller;

import com.cointcompany.backend.domain.file.entity.FileUploads;
import com.cointcompany.backend.domain.file.repository.FileUploadRepository;
import com.cointcompany.backend.domain.projects.repository.ProjectsRepository;
import com.cointcompany.backend.domain.tasks.entity.Tasks;
import com.cointcompany.backend.domain.tasks.repository.TasksRepository;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@Slf4j
public class FileUploadController {

    private final FileUploadRepository fileUploadRepository;
    private final ProjectsRepository projectsRepository;
    private final TasksRepository tasksRepository;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            FileUploads fileUploads = FileUploads.of(
                    URLEncoder.encode(file.getOriginalFilename(), StandardCharsets.UTF_8),
                    file.getBytes());

            fileUploadRepository.save(fileUploads);

            return ResponseEntity.ok("File uploaded and saved to DB successfully!");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("File upload failed.");
        }
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadFile(@PathVariable Long id) {
        Optional<FileUploads> fileUploads = fileUploadRepository.findById(id);

        if (fileUploads.isPresent()) {
            FileUploads uploadedFile = fileUploads.get();
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + uploadedFile.getFileName() + "\"")
                    .body(uploadedFile.getFileData());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/download/list")
    public FileUploads getFileData() {
        List<FileUploads> fileUploadsList = fileUploadRepository.findAll();
        FileUploads uploads = fileUploadsList.get(3);
        uploads.setFileName(
                URLDecoder.decode(uploads.getFileName(), StandardCharsets.UTF_8)
        );
        return uploads;
    }

    @PostMapping("/upload/excel")
    public String uploadExcel(@RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            return "File is empty.";
        }

//        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
//            Sheet sheet = workbook.getSheetAt(0);
//            Iterator<Row> rowIterator = sheet.iterator();
//
//            // 첫 번째 행은 헤더이므로 건너뛰고 데이터를 읽습니다.
//            if (rowIterator.hasNext()) {
//                rowIterator.next(); // 첫 번째 행(헤더)을 건너뜁니다.
//            }
//
//            while (rowIterator.hasNext()) {
//                Row row = rowIterator.next();
//                int start = row.getCell(2).getLocalDateTimeCellValue().toLocalDate().getYear()*10000
//                        + row.getCell(2).getLocalDateTimeCellValue().toLocalDate().getMonthValue()*100
//                        + row.getCell(2).getLocalDateTimeCellValue().toLocalDate().getDayOfMonth();
//
//                int end = row.getCell(3).getLocalDateTimeCellValue().toLocalDate().getYear()*10000
//                        + row.getCell(3).getLocalDateTimeCellValue().toLocalDate().getMonthValue()*100
//                        + row.getCell(3).getLocalDateTimeCellValue().toLocalDate().getDayOfMonth();
//
//                if (start - end > 0) {
//                    return "시작날짜와 종료날짜가 올바르지 않습니다.";
//                }
//            }
//        }

        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rowIterator = sheet.iterator();
            // 첫 번째 행은 헤더이므로 건너뛰고 데이터를 읽습니다.
            if (rowIterator.hasNext()) {
                rowIterator.next(); // 첫 번째 행(헤더)을 건너뜁니다.
            }
            while (rowIterator.hasNext()) {
                Row row = rowIterator.next();
                Tasks tasks = Tasks.of(
                        row.getCell(0).getStringCellValue(),
                        row.getCell(1).getStringCellValue(),
                        row.getCell(2).getLocalDateTimeCellValue().toLocalDate(),
                        row.getCell(3).getLocalDateTimeCellValue().toLocalDate(),
                        row.getCell(4).getStringCellValue(),
                        projectsRepository.findById((long) row.getCell(5).getNumericCellValue()).orElseThrow()

                );
                tasksRepository.save(tasks);
            }

            return "File uploaded successfully.";
        }
    }

    @GetMapping("/download/excel/{projectId}")
    public void downloadExcel(HttpServletResponse response, @PathVariable Long projectId) throws IOException {
        List<Tasks> tasksList = tasksRepository.findByProjectsIdNum(projectId);

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Sheet1");

        CellStyle dateCellStyle = workbook.createCellStyle();
        short dateFormat = workbook.createDataFormat().getFormat("yyyy-MM-dd");
        dateCellStyle.setDataFormat(dateFormat);

//        CellStyle hiddenCellStyle = workbook.createCellStyle();
//        hiddenCellStyle.setHidden(true);


        int rowNum = 0;
        Row headerRow = sheet.createRow(rowNum++);
        headerRow.createCell(0).setCellValue("taskName");
        headerRow.createCell(1).setCellValue("description");
        headerRow.createCell(2).setCellValue("startDate");
        headerRow.createCell(3).setCellValue("endDate");
        headerRow.createCell(4).setCellValue("status");
        headerRow.createCell(5).setCellValue("taskId");
        // ... 다른 헤더 셀들 생성

        sheet.setColumnWidth(5,0);
//        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");


        for (Tasks tasks : tasksList) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(tasks.getTaskName());
            row.createCell(1).setCellValue(tasks.getDescription());
            row.createCell(4).setCellValue(tasks.getStatus());
            // ... 다른 필드에 따라 셀들 생성

            // 날짜 데이터 포맷팅 및 셀 생성
            Cell dateCell = row.createCell(2);
            LocalDate localDate = tasks.getStartDate();
            dateCell.setCellValue(java.sql.Date.valueOf(localDate));
            dateCell.setCellStyle(dateCellStyle);
            dateCell = row.createCell(3);
            localDate = tasks.getEndDate();
            dateCell.setCellValue(java.sql.Date.valueOf(localDate));
            dateCell.setCellStyle(dateCellStyle);

            Cell cell = row.createCell(5);
            cell.setCellValue(tasks.getIdNum());
//            cell.setCellStyle(hiddenCellStyle);
        }

        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=data.xlsx");

        workbook.write(response.getOutputStream());
        workbook.close();
    }
}