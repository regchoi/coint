package com.cointcompany.backend.domain.documents.service;

import com.cointcompany.backend.domain.directories.dto.DirectoriesDto;
import com.cointcompany.backend.domain.directories.entity.Directories;
import com.cointcompany.backend.domain.directories.repository.DirectoriesRepository;
import com.cointcompany.backend.domain.documents.dto.DocumentsDto;
import com.cointcompany.backend.domain.documents.entity.Documents;
import com.cointcompany.backend.domain.documents.repository.DocumentsRepository;
import com.cointcompany.backend.domain.file.entity.Files;
import com.cointcompany.backend.domain.file.repository.FilesRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Service
public class DocumentsService {

    private final DirectoriesRepository directoriesRepository;
    private final DocumentsRepository documentsRepository;
    private final FilesRepository filesRepository;

    @Transactional(readOnly = true)
    public List<DocumentsDto.GetDocuments> findAllDocuments() {

        List<DocumentsDto.GetDocuments> getDocumentsList = new ArrayList<>();
        List<Documents> documentsList = documentsRepository.findAll();

        for (Documents documents : documentsList) {
            DocumentsDto.GetDocuments getDocuments = new DocumentsDto.GetDocuments(
                            documents,
                            documents.getFiles().getIdNum(),
                            documents.getDirectories().getIdNum());
            getDocumentsList.add(getDocuments);
        }

        return getDocumentsList;
    }

    @Transactional
    public ResponseEntity<String> uploadDocuments(MultipartFile file, Long directoryId) {

        try {

            Files files = Files.of(
                    URLEncoder.encode(file.getOriginalFilename(), StandardCharsets.UTF_8),
                    file.getBytes());

            filesRepository.save(files);

            Directories directories = directoriesRepository.findById(directoryId).orElseThrow();

            Documents documents = Documents.of(file.getOriginalFilename(), directories, files);

            documentsRepository.save(documents);

            return ResponseEntity.ok("File uploaded and saved to DB successfully!");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("File upload failed.");
        }
    }

    @Transactional
    public ResponseEntity<byte[]> downloadDocuments(Long documentId) {
        Optional<Files> files = filesRepository.findById(
                documentsRepository.findById(documentId).orElseThrow().getFiles().getIdNum()
        );

        if (files.isPresent()) {
            Files downloadFile = files.get();
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + downloadFile.getFileName() + "\"")
                    .body(downloadFile.getFileData());
        } else {
            return ResponseEntity.notFound().build();
        }

    }
    @Transactional
    public String modifyDirectories(DirectoriesDto.PostDirectories postDirectories, Long directoriesIdNum) {

        Directories directories = directoriesRepository.findById(directoriesIdNum).orElseThrow();
        directories.setDirName(postDirectories.getDirName());

        return "SUCCESS";

    }

    @Transactional
    public String removeDirectories(Long directoriesIdNum) {

        //삭제하기 전 연결 된 Document 먼저 삭제

        directoriesRepository.deleteById(directoriesIdNum);

        return "SUCCESS";
    }

}
