package com.cointcompany.backend.domain.departments.service;

import com.cointcompany.backend.domain.departments.dto.DepartmentsDto;
import com.cointcompany.backend.domain.departments.entity.Departments;
import com.cointcompany.backend.domain.departments.repository.DepartmentsRepository;
import com.cointcompany.backend.domain.usergroups.dto.UserGroupsDto;
import com.cointcompany.backend.domain.usergroups.entity.Usergroups;
import com.cointcompany.backend.domain.users.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class DepartmentsService {

    private final DepartmentsRepository departmentsRepository;
    private final UsersRepository usersRepository;
    private final ModelMapper mapper;

    @Transactional
    public String saveDepartments(Departments departments) {
        departmentsRepository.save(departments);
        return "SUCCESS";
    }
    @Transactional(readOnly = true)
    public List<DepartmentsDto.GetDepartmentsRes> findAllDepartmentsToGetDepartmentsRes() {

        List<Departments> departmentsList = departmentsRepository.findAll();
        List<DepartmentsDto.GetDepartmentsRes> getDepartmentsResList = new ArrayList<>();

        for (Departments departments : departmentsList) {
            DepartmentsDto.GetDepartmentsRes getDepartmentsRes = new DepartmentsDto.GetDepartmentsRes(departments);

            if (departments.getModUserid() != null) {
                getDepartmentsRes.setModUserid(usersRepository.findById(departments.getModUserid()).orElseThrow().getName());
            }
            if (departments.getRegUserid() != null) {
                getDepartmentsRes.setRegUserid(usersRepository.findById(departments.getRegUserid()).orElseThrow().getName());
            }
            getDepartmentsResList.add(getDepartmentsRes);
        }

        return getDepartmentsResList;

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
