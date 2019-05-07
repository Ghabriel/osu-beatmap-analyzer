
export function useFileUpload(onUpload: (fileContent: string) => void) {
    // function handleFileChange(uploadEvent: ChangeEvent<HTMLInputElement>) {
    function handleFileChange(uploadEvent: Event) {
        const fileReader = new FileReader();

        fileReader.onload = fileEvent => {
            onUpload((fileEvent.target as any).result);
        };

        const fileList = (uploadEvent.target as any).files;
        if (fileList.length > 0) {
            fileReader.readAsText(fileList[0]);
        }
    }

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.addEventListener('change', handleFileChange);

    return () => fileInput.click();

    // TODO: is there a more elegant way (something like the following)?
    // const fileInputRef = useRef<HTMLInputElement>(null);

    // useState(
    //     <input ref={fileInputRef} type="file" onChange={handleFileChange} />
    // );

    // return () => fileInputRef.current!.click();
}
