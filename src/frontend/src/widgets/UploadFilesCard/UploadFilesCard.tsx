import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from '@/shared/ui';
import { CloudUpload, Paperclip } from 'lucide-react';
import { FC, useState } from 'react'
import { DropzoneOptions } from 'react-dropzone';

interface UploadFilesCardProps { }

const FileSvgDraw = () => {
    return (
        <>
            <CloudUpload className='w-8 h-8' />
            <p className="mb-1 text-sm text-foreground text-center">
                <span className="font-semibold">Нажмите, чтобы загрузить</span>
                &nbsp; или перетащите и отпустите
            </p>
            <p className="text-xs text-foreground ">
                WAV
            </p>
        </>
    );
};

export const UploadFilesCard: FC<UploadFilesCardProps> = () => {
    const [files, setFiles] = useState<File[] | null>(null);

    const dropZoneConfig: DropzoneOptions = {
        maxFiles: 5,
        maxSize: 1024 * 1024 * 500,
        multiple: true,
        accept: {
            // 'wav': ['.wav'],
        }
    };

    return (
        <FileUploader
            value={files}
            onValueChange={setFiles}
            dropzoneOptions={dropZoneConfig}
            className="relative bg-background rounded-md p-1"
        >
            <FileInput className="outline-dashed rounded-md outline-2 outline-border">
                <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full ">
                    <FileSvgDraw />
                </div>
            </FileInput>
            <FileUploaderContent>
                {files &&
                    files.length > 0 &&
                    files.map((file, i) => (
                        <FileUploaderItem key={i} index={i}>
                            <Paperclip className="h-4 w-4 stroke-current" />
                            <span>{file.name}</span>
                        </FileUploaderItem>
                    ))}
            </FileUploaderContent>
        </FileUploader>
    );
}
