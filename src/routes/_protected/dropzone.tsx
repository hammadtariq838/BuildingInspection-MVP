import { createFileRoute } from '@tanstack/react-router'
import { UploadIcon } from 'lucide-react';

export const Route = createFileRoute('/_protected/dropzone')({
  component: Dropzone
})

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

function Dropzone() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState<number[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles([...files, ...acceptedFiles]);
  }, [files]);

  const uploadFiles = async () => {
    setUploading(files.map((_, index) => index));
    // Simulate upload progress
    setTimeout(() => setUploading([]), 2000);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="container mx-auto p-4">
      <div {...getRootProps()} className="border-dashed border-2 border-gray-300 p-6 rounded-md text-center cursor-pointer">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-gray-600">Drop the files here...</p>
        ) : (
          <p className="text-gray-600">
            <UploadIcon size={48} className="mx-auto mb-4" />
            Drag and drop your images here or click to select files.
          </p>
        )}
      </div>
      <div className="mt-4">
        {files.map((file, index) => (
          <div key={index} className="flex items-center justify-between p-2 border rounded mb-2">
            <div className="flex items-center">
              <img src={URL.createObjectURL(file)} alt={file.name} className="w-12 h-12 object-cover mr-4" />
              <span>{file.name}</span>
            </div>
            <button onClick={() => removeFile(index)} className="text-red-600">Remove</button>
          </div>
        ))}
      </div>
      <button onClick={uploadFiles} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Upload Images</button>
      {uploading.length > 0 && (
        <div className="mt-4">
          <p>Uploading {uploading.length} images...</p>
          <div className="w-full bg-gray-200 rounded-full">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(uploading.length / files.length) * 100}%` }}></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dropzone;
