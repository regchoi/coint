package com.cointcompany.backend.domain.departments.dto;

import com.cointcompany.backend.domain.departments.entity.Departments;
import lombok.*;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString
@Getter
@Setter
public class DepartmentsDto {

    @NoArgsConstructor
    @Data
    public static class GetDepartmentsRes {
        private Long idNum;

        private String departmentName;

        private String description;

        private String regDate;

        private String regUserid;

        private String modDate;

        private String modUserid;

        public GetDepartmentsRes (Departments departments) {

            this.idNum = departments.getIdNum();
            this.departmentName = departments.getDepartmentName();
            this.description = departments.getDescription();
            this.regDate = String.valueOf(departments.getRegDate());
            this.regUserid = String.valueOf(departments.getRegUserid());
            this.modDate = String.valueOf(departments.getModDate());
            this.modUserid = String.valueOf(departments.getModUserid());

        }
    }

    @NoArgsConstructor
    @Data
    public static class GetUserDepartmentRes {
        private Long userDepartmentIdNum;

        private Long departmentIdNum;

        private String departmentName;

        public GetUserDepartmentRes(Long userDepartmentIdNum, Departments departments) {
            this.userDepartmentIdNum = userDepartmentIdNum;
            this.departmentIdNum = departments.getIdNum();
            this.departmentName = departments.getDepartmentName();
        }
    }


}
