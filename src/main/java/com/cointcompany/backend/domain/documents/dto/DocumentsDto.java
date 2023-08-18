package com.cointcompany.backend.domain.documents.dto;

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

        public GetDocuments (Documents documents, Long filesIdNum, Long directoriesIdNum) {

            this.idNum = documents.getIdNum();
            this.docName = documents.getDocName();
            this.filesIdNum = filesIdNum;
            this.directoriesIdNum = directoriesIdNum;
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

        private Long filesIdNum;

        private Long directoriesIdNum;

        public PostDocuments (Documents documents, Long filesIdNum, Long directoriesIdNum) {

            this.docName = documents.getDocName();
            this.filesIdNum = filesIdNum;
            this.directoriesIdNum = directoriesIdNum;

        }
    }


}
