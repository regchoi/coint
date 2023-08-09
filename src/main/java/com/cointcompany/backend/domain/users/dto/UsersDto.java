//package com.cointcompany.backend.domain.users.dto;
//
//import com.fasterxml.jackson.annotation.JsonIgnore;
//import lombok.*;
//
//import java.time.LocalDateTime;
//
//@NoArgsConstructor(access = AccessLevel.PROTECTED)
//@ToString
//@Getter
//@Setter
//public class UsersDto {
//
//    @NoArgsConstructor
//    @Data
//    public static class GetUsersRes {
//        private Long idNum;
//
//        private String state;
//
//        private Long seq;
//
//        private String id;
//
//        private String userName;
//
//        private String userPosition;
//
//        private String userDepartment;
//
//        private Boolean isAdmin;
//
//        private String email;
//
//        private String phone;
//
//        private String regDate;
//
//        private LocalDateTime lastLoginDate;
//
//        public GetUsersRes (
//                Long idNum, String state, Long seq, String id, String userName,
//                String userPosition, String userDepartment, Boolean isAdmin,
//                String email, String phone, LocalDateTime regDate, LocalDateTime lastLoginDate
//                ) {
//            this.id_num = id_num;
//            this.state = state;
//            this.seq = seq;
//            this.id = id;
//            this.userName = userName;
//            this.userPosition = userPosition;
//            this.userDepartment = userDepartment;
//            this.isAdmin = isAdmin;
//            this.email = email;
//            this.phone = phone;
//            this.regDate = regDate;
//            this.lastLoginDate = lastLoginDate;
//        }
//    }
//
//    @Data
//    public static class ModifyUserReq extends Users {
////        @JsonIgnore
////        private Long id_num;
//    }
//    @Data
//    @NoArgsConstructor
//    public static class SaveUserReq extends Users {
//        @JsonIgnore
//        private Long id_num;
//    }
//
//}
