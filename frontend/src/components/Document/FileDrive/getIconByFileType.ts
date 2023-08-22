export const getIconByFileType = (fileName: string): { icon: string; color: string } => {
    const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
    switch (fileExtension) {
        case 'pdf':
            return { icon: 'mdi mdi-file-pdf-box', color: 'hsl(0, 80%, 50%)' }; // 빨간색
        case 'jpg':
        case 'jpeg':
        case 'png':
            return { icon: 'mdi mdi-file-image', color: 'hsl(9, 70%, 50%)' }; // 주황색
        case 'txt':
            return { icon: 'mdi mdi-file-document', color: 'hsl(0, 0%, 40%)' }; // 회색
        case 'excel':
        case 'xls':
        case 'xlsx':
            return { icon: 'mdi mdi-microsoft-excel', color: 'hsl(120, 50%, 50%)' }; // 초록색
        case 'doc':
        case 'docx':
            return { icon: 'mdi mdi-microsoft-word', color: 'hsl(240, 40%, 50%)' }; // 파란색
        case 'ppt':
        case 'pptx':
            return { icon: 'mdi mdi-microsoft-powerpoint', color: 'hsl(39, 80%, 50%)' }; // 노란색
        case 'zip':
        case 'rar':
            return { icon: 'mdi mdi-zip-box', color: 'hsl(120, 60%, 50%)' }; // 초록색
        case 'mp3':
        case 'wav':
            return { icon: 'mdi mdi-music', color: 'hsl(0, 0%, 40%)' }; // 회색
        default:
            return { icon: 'mdi mdi-file', color: 'hsl(0, 0%, 40%)' }; // 회색
    }
};
