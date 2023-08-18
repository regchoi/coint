package com.cointcompany.backend.domain.directories.dto;

import com.cointcompany.backend.domain.departments.dto.DepartmentsDto;
import com.cointcompany.backend.domain.directories.entity.Directories;
import com.cointcompany.backend.domain.usergroups.dto.UserGroupsDto;
import com.cointcompany.backend.domain.users.entity.Users;
import lombok.*;

import java.util.List;

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
}
