package com.cointcompany.backend.domain.directories.controller;

import com.cointcompany.backend.domain.directories.dto.DirectoriesDto;
import com.cointcompany.backend.domain.directories.service.DirectoriesService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "디렉토리", description = "디렉토리 API 명세서")
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/directory")
@CrossOrigin
public class DirectoriesController {

    private final DirectoriesService directoriesService;

    @Operation(summary = "디렉토리 전체 조회")
    @ApiResponse(responseCode = "200", description = "조회 성공")
    @GetMapping
    public ResponseEntity<List<DirectoriesDto.GetDirectories>> getDirectories () {

        List<DirectoriesDto.GetDirectories> directoriesList = directoriesService.findAllDirectories();

        return new ResponseEntity<>(directoriesList, HttpStatus.OK);
    }

    @Operation(summary = "디렉토리 신규 등록")
    @ApiResponse(responseCode = "200", description = "등록 성공")
    @PostMapping("/{parentId}")
    public ResponseEntity<String> saveDirectories(
            @PathVariable Long parentId, @RequestBody DirectoriesDto.PostDirectories postDirectories
    ) {

        directoriesService.saveDirectories(postDirectories, parentId);

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }

    @Operation(summary = "디렉토리 수정")
    @ApiResponse(responseCode = "200", description = "수정 성공")
    @PutMapping("/{directoryId}")
    public ResponseEntity<String> modifyDirectories(
            @PathVariable Long directoryId, @RequestBody DirectoriesDto.PostDirectories postDirectories
    ) {

        directoriesService.modifyDirectories(postDirectories, directoryId);

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }

    @Operation(summary = "디렉토리 삭제")
    @ApiResponse(responseCode = "200", description = "삭제 성공")
    @DeleteMapping("/{directoryId}")
    public ResponseEntity<String> removeDirectories(
            @PathVariable Long directoryId
    ) {

        directoriesService.removeDirectories(directoryId);

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }

}