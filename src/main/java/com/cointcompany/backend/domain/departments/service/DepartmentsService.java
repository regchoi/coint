package com.cointcompany.backend.domain.departments.service;

import com.cointcompany.backend.common.config.security.jwt.security.UserDetailsImpl;
import com.cointcompany.backend.domain.departments.dto.DepartmentsDto;
import com.cointcompany.backend.domain.departments.repository.DepartmentsRepository;
import com.cointcompany.backend.domain.departments.entity.Departments;
import com.cointcompany.backend.domain.usergroups.dto.UserGroupsDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class DepartmentsService {

    private final DepartmentsRepository departmentsRepository;
    private final ModelMapper mapper;

    @Transactional
    public String saveDepartments(Departments departments) {
        departmentsRepository.save(departments);
        return "SUCCESS";
    }

    @Transactional(readOnly = true)
    public List<DepartmentsDto.GetDepartmentsRes> findAllDepartmentsToGetDepartmentsRes() {

        List<Departments> departmentsList = departmentsRepository.findAll();
        List<DepartmentsDto.GetDepartmentsRes> departmentsResListResList = departmentsList.stream()
                .map(departments -> mapper.map(departments, DepartmentsDto.GetDepartmentsRes.class))
                .collect(Collectors.toList());

        return departmentsResListResList;

    }

    @Transactional
    public void removeDepartments(Long departmentId) {
        Departments department = departmentsRepository.findById(departmentId).orElseThrow();
        department.setDel(Boolean.TRUE);
    }

    @Transactional
    public void modifyDepartments(Departments departments) {
        Departments department = departmentsRepository.getReferenceById(departments.getIdNum());

        department.setDepartmentName(departments.getDepartmentName());
        department.setDescription(departments.getDescription());

    }
}
