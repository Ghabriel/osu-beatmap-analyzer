import React, { ChangeEvent, useRef } from 'react';
import Button, { ButtonProps } from 'react-bootstrap/Button';

export type UploadButtonProps = {
    onUpload: (fileContent: string) => void;
} & ButtonProps;

const styles = {
    fileInput: {
        display: 'none'
    }
};

export const UploadButton: React.FunctionComponent<UploadButtonProps> = props => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    function handleFileChange(uploadEvent: ChangeEvent<HTMLInputElement>) {
        const fileReader = new FileReader();

        fileReader.onload = fileEvent => {
            console.log((fileEvent.target as any).result);
        };

        const file = (uploadEvent.target as any).files[0];
        fileReader.readAsText(file);
    }

    function handleClick() {
        fileInputRef.current!.click();
    }

    return (
        <div>
            <input ref={fileInputRef} style={styles.fileInput} type="file" onChange={handleFileChange} />
            <Button {...props} onClick={handleClick}>Import Beatmap</Button>
        </div>
    );
};
