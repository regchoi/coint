import React, { useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import { useDropzone, DropzoneOptions } from 'react-dropzone';
import 'react-quill/dist/quill.snow.css'; // Quill 스타일

const DocumentEditor: React.FC = () => {
    const [editorHtml, setEditorHtml] = useState<string>('');

    const onEditorChange = (content: string) => {
        setEditorHtml(content);
    };

    const dropzoneOptions: DropzoneOptions = {
        accept: {
            'image': ['image/*'],
            'pdf': ['application/pdf']
        },
        onDrop: (acceptedFiles) => {
            // 파일 처리 로직
            console.log('Accepted files:', acceptedFiles);
        },
    };

    const { getRootProps, getInputProps } = useDropzone(dropzoneOptions);

    return (
        <div>
            <ReactQuill
                value={editorHtml}
                onChange={onEditorChange}
                style={{ height: '400px' }}
            />
            <p>Drag And Drop</p>
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                <p>여기에 파일을 드래그 앤 드롭하거나 클릭하여 파일을 선택하세요.</p>
            </div>
        </div>
    );
};

export default DocumentEditor;
