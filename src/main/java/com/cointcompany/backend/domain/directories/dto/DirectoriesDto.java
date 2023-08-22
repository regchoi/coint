package com.cointcompany.backend.domain.directories.dto;

import com.cointcompany.backend.domain.directories.entity.Directories;
import com.cointcompany.backend.domain.directories.entity.DirectoryUsers;
import com.cointcompany.backend.domain.users.entity.Users;
import lombok.*;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString
@Getter
@Setter
public class DirectoriesDto {
    @NoArgsConstructor
    @Data
    public static class GetDirectories {
        private Long idNum;

        private String dirName;

        private Long parentDirectoriesIdNum;

        public GetDirectories (Directories directories) {

            this.idNum = directories.getIdNum();
            this.dirName = directories.getDirName();
            this.parentDirectoriesIdNum = directories.getParentDirectories().getIdNum();

        }
    }
    @NoArgsConstructor
    @Data
    public static class PostDirectories {

        private String dirName;

        public PostDirectories (String dirName) {

            this.dirName = dirName;

        }
    }
    @NoArgsConstructor
    @Data
    public static class GetDirectoryUsers {

        private Long directoriesIdNum;

        private Long usersIdNum;

        public GetDirectoryUsers (DirectoryUsers directoryUsers) {

            this.directoriesIdNum = directoryUsers.getDirectories().getIdNum();
            this.usersIdNum = directoryUsers.getUsers().getIdNum();

        }
    }

    @NoArgsConstructor
    @Data
    public static class GetParentDirectories {
        private Long idNum;

        private String dirName;

        private Long parentDirectoriesIdNum;

        private Long regUserId;

        public GetParentDirectories (Directories directories) {

            this.idNum = directories.getIdNum();
            this.dirName = directories.getDirName();
            this.parentDirectoriesIdNum = directories.getParentDirectories().getIdNum();
            this.regUserId = directories.getRegUserid();

        }
    }
}
