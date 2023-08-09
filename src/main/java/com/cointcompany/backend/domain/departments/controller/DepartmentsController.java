package com.cointcompany.backend.domain.departments.controller;

import com.cointcompany.backend.domain.departments.dto.DepartmentsDto;
import com.cointcompany.backend.domain.departments.entity.Departments;
import com.cointcompany.backend.domain.departments.service.DepartmentsService;
import com.cointcompany.backend.domain.users.entity.Users;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user/department")
@CrossOrigin
public class DepartmentsController {

    private final DepartmentsService departmentsService;

    @GetMapping
    public ResponseEntity<List<DepartmentsDto.GetDepartmentsRes>> getDepartments () {

        List<DepartmentsDto.GetDepartmentsRes> departmentsList = departmentsService.findAllDepartmentsToGetDepartmentsRes();

        return new ResponseEntity<>(departmentsList, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<String> postDepartments (@RequestBody List<Departments> departmentsList) {

        for (Departments departments : departmentsList) {
            departmentsService.saveDepartments(departments);
        }

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }

    @PutMapping
    public ResponseEntity<String> putUsers (@RequestBody List<Departments> departmentsList) {

        for (Departments departments : departmentsList) {
            departmentsService.modifyDepartments(departments);
        }

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }
    @PostMapping("/delete")
    public ResponseEntity<String> deleteUsers (@RequestBody List<Long> departmentIdList) {

        for (Long departmentId : departmentIdList) {
            departmentsService.removeDepartments(departmentId);
        }

        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }
}