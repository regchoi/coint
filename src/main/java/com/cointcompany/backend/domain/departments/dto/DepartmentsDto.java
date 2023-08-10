package com.cointcompany.backend.domain.departments.dto;

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

        private String regUserId;

        private String modDate;

        private String modUserId;

        public GetDepartmentsRes (
                Long idNum, String departmentName, String description,
                String regDate, String regUserId, String modDate, String modUserId
                ) {

            this.idNum = idNum;
            this.departmentName = departmentName;
            this.description = description;
            this.regDate = regDate;
            this.regUserId = regUserId;
            this.modDate = modDate;
            this.modUserId = modUserId;

        }
    }

    @NoArgsConstructor
    @Data
    public static class GetUserDepartmentRes {
        private Long idNum;

        private String departmentName;

        public GetUserDepartmentRes(Long idNum, String departmentName) {
            this.idNum = idNum;
            this.departmentName = departmentName;
        }
    }


}
