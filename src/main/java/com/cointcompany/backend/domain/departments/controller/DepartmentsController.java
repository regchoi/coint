package com.cointcompany.backend.domain.departments.controller;

import com.cointcompany.backend.domain.departments.dto.DepartmentsDto;
import com.cointcompany.backend.domain.departments.entity.Departments;
import com.cointcompany.backend.domain.departments.service.DepartmentsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "부서", description = "부서 API 명세서")
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user/department")
@CrossOrigin
public class DepartmentsController {

    private final DepartmentsService departmentsService;

    @Operation(summary = "부서 전체 조회")
    @ApiResponse(responseCode = "200", description = "조회 성공")
    @GetMapping
    public ResponseEntity<List<DepartmentsDto.GetDepartmentsRes>> getDepartments () {

        List<DepartmentsDto.GetDepartmentsRes> departmentsList = departmentsService.findAllDepartmentsToGetDepartmentsRes();

        return new ResponseEntity<>(departmentsList, HttpStatus.OK);
    }

    @Operation(summary = "부서 신규 등록")
    @ApiResponse(responseCode = "200", description = "등록 성공")
    @PostMapping
    public ResponseEntity<String> postDepartments (@RequestBody List<Departments> departmentsList) {

        for (Departments departments : departmentsList) {
            departmentsService.saveDepartments(departments);
        }

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }

    @Operation(summary = "부서 수정")
    @ApiResponse(responseCode = "200", description = "수정 성공")
    @PutMapping
    public ResponseEntity<String> putDepartment (@RequestBody List<Departments> departmentsList) {

        for (Departments departments : departmentsList) {
            departmentsService.modifyDepartments(departments);
        }

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }

    /**
     * 일괄 삭제를 사용하기 위하여 DeleteMapping 대신 PostMapping 사용
     */
    @Operation(summary = "부서 삭제")
    @ApiResponse(responseCode = "200", description = "삭제 성공")
    @PostMapping("/delete")
    public ResponseEntity<String> deleteDepartment (@RequestBody List<Long> departmentIdList) {

        for (Long departmentId : departmentIdList) {
            departmentsService.removeDepartments(departmentId);
        }

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }
}