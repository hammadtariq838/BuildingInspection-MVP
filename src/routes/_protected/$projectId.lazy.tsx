/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAddAssetMutation, useGetAssetsQuery } from '@/services/asset/assetApiSlice';
import { createLazyFileRoute } from '@tanstack/react-router';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BASE_URL } from '@/constants';
import Layout from '@/components/Layout';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { TrashIcon, UploadIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useGetProjectByIdQuery } from '@/services/project/projectApiSlice';

export const Route = createLazyFileRoute('/_protected/$projectId')({
  component: Screen
});

function Screen() {
  const { projectId } = Route.useParams();
  const { data, isLoading, refetch } = useGetAssetsQuery({ projectId });
  const { data: projectData } = useGetProjectByIdQuery(projectId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const assets = data?.assets || [];


  useEffect(() => {
    // while each of the asset's results status is not 'completed', refetch the assets every 5 seconds
    const interval = setInterval(() => {
      refetch();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const allCompleted = assets.every(asset =>
        asset.results.every((result: any) => result.status === 'completed')
      );

      if (allCompleted) {
        clearInterval(interval);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [assets, refetch]);

  const template_name = projectData?.project?.template?.name || '';

  const [dialogOpen, setDialogOpen] = useState(false);


  const getProgress = () => {
    const completed = assets.reduce((acc, asset) => acc + asset.results.filter((result: any) => result.status === 'completed').length, 0);
    const total = assets.reduce((acc, asset) => acc + asset.results.length, 0);
    return total > 0 ? ((completed / total) * 100).toFixed(2) : 0;
  };

  const getStatusCount = (status: string) => {
    return assets.reduce((acc, asset) => acc + asset.results.filter((result: any) => result.status === status).length, 0);
  };


  return (
    <Layout>
      <div className='flex grow'>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          assets.length !== 0 ? (
            <section className='grid gap-4 w-full'>
              <div className='flex justify-between px-6'>
                <h1 className='text-3xl font-bold'>Results</h1>
                <p className='text-gray-500'>{assets.length} assets uploaded</p>
                <p className='text-gray-500'>Progress: {getProgress()}%</p>
                <div className='flex gap-4'>
                  <p className='text-gray-500'>Completed: {getStatusCount('completed')}</p>
                  <p className='text-gray-500'>Pending: {getStatusCount('pending')}</p>
                  <p className='text-gray-500'>Failed: {getStatusCount('failed')}</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>Upload More</Button>
                  </DialogTrigger>
                  <DialogContent className='max-w-max'>
                    {
                      template_name === 'Before After' ?
                        <BeforeAfter /> :
                        <BulkUpload setDialogOpen={setDialogOpen} />
                    }
                  </DialogContent>
                </Dialog>
              </div>
              <div className='grid gap-6 place-items-center grid-cols-3'>
                {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  assets.map((asset: any, index: number) => {
                    return (
                      <Card className='w-max' key={index}>
                        <CardContent className='w-[380px] h-[380px] p-0'>
                          {/* {`${BASE_URL}${asset.file}`} */}
                          <img
                            src={`${BASE_URL}${asset.file}`}
                            alt={asset.name} className='w-full h-full rounded-t-lg' />
                        </CardContent>
                        <CardFooter className='p-0'>
                          <div className='w-full'>
                            <p className='text-center line-clamp-1 font-bold'>{asset.name}</p>
                            <ul className='ml-6'>
                              {asset.results.map((result: any, idx: number) => (
                                <li key={idx} className='list-decimal'>
                                  {result.action.name}: {result.status}
                                </li>
                              ))}
                            </ul>
                            <ViewResults asset={asset} />
                          </div>
                        </CardFooter>
                      </Card>
                    )
                  })}
              </div>
            </section>
          ) :
            template_name === 'Before After' ?
              <BeforeAfter /> :
              <BulkUpload />
        )}
      </div>
    </Layout>
  );
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ViewResults({ asset }: { asset: any }) {
  console.log('asset', asset)
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='w-full'
          disabled={asset.results.every((result: any) => result.status !== 'completed')}
        >View Results</Button>
      </DialogTrigger>
      <DialogContent className='w-max max-w-max'>
        {/* a div with four images one original and three results */}
        <div className='grid grid-cols-2 gap-4 m-4'>
          <a href={`${BASE_URL}${asset.file}`} target='_blank' rel='noreferrer'>
            <img src={`${BASE_URL}${asset.file}`} alt={asset.name} className='w-60 h-60' />
          </a>
          {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            asset.results.map((result: any, index: number) => {
              // console.log('result', result)
              return (
                <div key={index}>
                  {result.status === 'completed' ?
                    <a href={`${BASE_URL}${result.result}`} target='_blank' rel='noreferrer'>
                      <HoverCard>
                        <HoverCardTrigger asChild>

                          <img
                            key={index}
                            src={`${BASE_URL}${result.result}`}
                            alt={result.name}
                            className='w-60 h-60'
                          />
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          {/* json metadata */}
                          <h3 className='text-lg font-bold'>Metadata</h3>
                          <pre>
                            <code>
                              {JSON.stringify(result.metadata, null, 2)}
                            </code>
                          </pre>
                        </HoverCardContent>
                      </HoverCard>
                    </a>
                    :
                    <div key={index} className='w-60 h-60 bg-gray-200 flex items-center justify-center'>
                      <p>{result.status}</p>
                    </div>
                  }
                </div>
              )
            })

          }
        </div>
        {/* each result have metadata: display it in comprehensively */}
        {/* <ul className='ml-6'>
          {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            asset.results.map((result: any, idx: number) => (
              <li key={idx} className='list-decimal'>
                {result.action.name}: {result.status}
              </li>
            ))
          }
        </ul> */}
      </DialogContent>
    </Dialog>
  )
}


function BulkUpload({ setDialogOpen }: { setDialogOpen?: (open: boolean) => void }) {
  const { projectId } = Route.useParams();
  const [bulkUploadApi, { isLoading: isUploading }] = useAddAssetMutation();
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState<number[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles([...files, ...acceptedFiles]);
  }, [files]);

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i])
    }

    try {
      setUploading(files.map((_, index) => index));
      const res = await bulkUploadApi({
        projectId: projectId,
        asset_images: formData,
      }).unwrap();
      setUploading([]);
      console.log('assets upload', res);
      toast.success('Images uploaded successfully!');
      setFiles([]);
      if (setDialogOpen) {
        setDialogOpen(false);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(
        error?.data?.message || error?.data?.detail || error.error || 'Error: Something went wrong!'
      );
      console.log(error);
    }
  }
  return (
    <section className='grid w-full'>
      <form className="container mx-auto p-4" onSubmit={onSubmit}>
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
        <div className="mt-4 max-h-80 overflow-y-auto">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 border rounded mb-2">
              <div className="flex items-center">
                <img src={URL.createObjectURL(file)} alt={file.name} className="w-12 h-12 object-cover mr-4" />
                <span>{file.name}</span>
              </div>
              <Button type='button' variant='link' onClick={() => removeFile(index)} className="text-red-600"><TrashIcon /></Button>
            </div>
          ))}
        </div>
        <Button disabled={isUploading}
          type='submit'
          className="mt-4 w-full"
        >Upload Assets</Button>
        {uploading.length > 0 && (
          <div className="mt-4">
            <p>Uploading {uploading.length} images...</p>
            <div className="w-full bg-gray-200 rounded-full">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(uploading.length / files.length) * 100}%` }}></div>
            </div>
          </div>
        )}
      </form>
    </section>
  );
}



function BeforeAfter() {
  const { projectId } = Route.useParams();
  const [bulkUploadApi, { isLoading: isUploading }] = useAddAssetMutation();
  const [beforeImage, setBeforeImage] = useState<File | undefined>(undefined);
  const [afterImage, setAfterImage] = useState<File | undefined>(undefined);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData()
    if (beforeImage) {
      formData.append('before', beforeImage)
    }
    if (afterImage) {
      formData.append('after', afterImage)
    }

    try {
      const res = await bulkUploadApi({
        projectId: projectId,
        asset_images: formData,
      }).unwrap();
      console.log('assets upload', res);
      toast.success('Images uploaded successfully!');
      setBeforeImage(undefined);
      setAfterImage(undefined);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(
        error?.data?.message || error?.data?.detail || error.error || 'Error: Something went wrong!'
      );
      console.log(error);
    }
  }


  return (
    <section className='grid w-full'>
      <form className="container mx-auto p-4" onSubmit={onSubmit}>
        <div className="flex gap-8">
          <div className="border-dashed border-2 border-gray-300 p-6 rounded-md text-center cursor-pointer w-full h-40">
            <h3 className="font-bold text-lg">
              Before
            </h3>
            <input type="file" onChange={(e) => setBeforeImage(e.target.files?.[0])} />
          </div>
          <div className="border-dashed border-2 border-gray-300 p-6 rounded-md text-center cursor-pointer w-full h-40">
            <h3 className="font-bold text-lg">
              After
            </h3>
            <input type="file" onChange={(e) => setAfterImage(e.target.files?.[0])} />
          </div>
        </div>
        <Button disabled={isUploading}
          type='submit'
          className="mt-4 w-full"
        >
          Upload Assets
        </Button>
      </form>
    </section>
  );
}

