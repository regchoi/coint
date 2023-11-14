package com.cointcompany.backend.domain.documents.dto;

import com.cointcompany.backend.domain.documents.entity.DocumentUsers;
import com.cointcompany.backend.domain.documents.entity.Documents;
import lombok.*;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString
@Getter
@Setter
public class DocumentsDto {

    @NoArgsConstructor
    @Data
    public static class GetDocuments {
        private Long idNum;

        private String docName;

        private Long filesIdNum;

        private Long directoriesIdNum;

        private String modDate;

        private String modUserid;

        public GetDocuments (Documents documents) {

            this.idNum = documents.getIdNum();
            this.docName = documents.getDocName();
            this.filesIdNum = documents.getFiles().getIdNum();
            this.directoriesIdNum = documents.getDirectories().getIdNum();
//            this.modDate = documents.getModDate().toString().isEmpty()?
//                    String.valueOf(documents.getRegDate()): String.valueOf(documents.getModDate());
//            this.modUserid = documents.getModUserid().toString().isEmpty()?
//                    String.valueOf(documents.getRegUserid()): String.valueOf(documents.getModUserid());
            this.modDate = String.valueOf(documents.getRegDate());
            this.modUserid = String.valueOf(documents.getRegUserid());

        }
    }
    @NoArgsConstructor
    @Data
    public static class PostDocuments {

        private String docName;

        public PostDocuments (Documents documents) {

            this.docName = documents.getDocName();

        }
    }

    @NoArgsConstructor
    @Data
    public static class DocumentUser {
        private Long idNum;
        private int level;
        private boolean star;
        private Long documentsIdNum;

        public DocumentUser(DocumentUsers documentUsers) {
            this.idNum = documentUsers.getIdNum();
            this.level = documentUsers.getLevel();
            this.star = documentUsers.isStar();
            this.documentsIdNum = documentUsers.getDocumentsIdNum();
        }
    }

}

