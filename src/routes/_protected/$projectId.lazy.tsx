import { useGetAssetsByProjectQuery, useProcessAssetsMutation } from '@/services/asset/assetApiSlice';
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Navbar from '@/components/Navbar';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useBulkUploadAssetsMutation } from '@/services/asset/assetApiSlice';
import { Link } from '@tanstack/react-router';


export const Route = createLazyFileRoute('/_protected/$projectId')({
  component: Screen
});

function ProcessAssets() {
  const navigate = useNavigate();
  const [processAssetsApi, { isLoading }] = useProcessAssetsMutation();
  const { projectId } = Route.useParams();

  async function onClick() {
    try {
      const res = await processAssetsApi({ projectId }).unwrap();
      console.log('process assets', res);
      toast.success('Assets processed successfully!');
      navigate({ to: '/assets/$projectId', params: { projectId } });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(
        error?.data?.message || error?.data?.detail || error.error || 'Error: Something went wrong!'
      );
      console.log(error);
    }
  }

  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
    >Process Assets</Button>
  )
}

const FormSchema = z.object({
  asset_images: z.instanceof(FileList),
})

function Screen() {
  const { projectId } = Route.useParams();
  const { data = [], isLoading, refetch } = useGetAssetsByProjectQuery({ projectId });

  const [bulkUploadApi, { isLoading: isUploading }] = useBulkUploadAssetsMutation();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log('data', data)
    // send these files over to the server
    const formData = new FormData()
    for (let i = 0; i < data.asset_images.length; i++) {
      formData.append('asset_images', data.asset_images[i])
    }

    try {
      const res = await bulkUploadApi({
        projectId: projectId,
        asset_images: formData,
      }).unwrap();
      console.log('bulk upload', res);
      toast.success('Images uploaded successfully!');
      refetch();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(
        error?.data?.message || error?.data?.detail || error.error || 'Error: Something went wrong!'
      );
      console.log(error);
    }
  }


  return (
    <main className="flex flex-col min-h-screen w-full">
      <Navbar />
      <div className='flex grow'>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          data.length !== 0 ? (
            <section className='grid gap-4 my-8 w-full px-32'>
              <div className='flex justify-between px-6'>
                <h1 className='text-3xl font-bold'>Assets</h1>
                <ProcessAssets />
              </div>
              <div className='grid gap-6 place-items-center grid-cols-3'>
                {
                  data.map((asset) => (
                    <Link to='/assets/$projectId' params={{ projectId }} key={asset.id}>
                      <Card className='w-max'>
                        <CardContent className='w-[380px] h-[380px]'>
                          <img src={asset.asset_image} alt={asset.project} className='w-full h-full' />
                        </CardContent>
                        <CardFooter className='grid gap-2 place-items-center'>
                          <div>Updated at: {new Date(asset.updated_at).toDateString()}</div>
                          <div>Created at: {new Date(asset.created_at).toDateString()}</div>
                        </CardFooter>
                      </Card>
                    </Link>
                  ))}
              </div>
            </section>
          ) : (
            <section className="grid place-items-center grow">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 p-8 w-max border rounded-md">
                  <FormField
                    control={form.control}
                    name="asset_images"
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel>Images</FormLabel>
                        <FormControl>
                          <Input
                            {...fieldProps}
                            type='file'
                            accept='image/*'
                            multiple
                            placeholder="Bulk upload images ..."
                            onChange={(e) => {
                              onChange(e.target.files)
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Bulk upload the images.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={isUploading}
                  >Submit</Button>
                </form>
              </Form>
            </section>
          )
        )}
      </div>
    </main>
  );
}





// function InputForm() {
//   const [bulkUploadApi, { isLoading }] = useBulkUploadAssetsMutation();
//   const form = useForm<z.infer<typeof FormSchema>>({
//     resolver: zodResolver(FormSchema),
//     defaultValues: {},
//   })

//   async function onSubmit(data: z.infer<typeof FormSchema>) {
//     console.log('data', data)
//     // send these files over to the server
//     const formData = new FormData()
//     for (let i = 0; i < data.asset_images.length; i++) {
//       formData.append('asset_images', data.asset_images[i])
//     }

//     try {
//       const res = await bulkUploadApi({
//         projectId: '1',
//         asset_images: formData,
//       }).unwrap();
//       console.log('bulk upload', res);
//       toast.success('Images uploaded successfully!');
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } catch (error: any) {
//       toast.error(
//         error?.data?.message || error?.data?.detail || error.error || 'Error: Something went wrong!'
//       );
//       console.log(error);
//     }
//   }

//   return (
//     <section className="grid place-items-center grow">
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 p-8 w-max border rounded-md">
//           <FormField
//             control={form.control}
//             name="asset_images"
//             // eslint-disable-next-line @typescript-eslint/no-unused-vars
//             render={({ field: { value, onChange, ...fieldProps } }) => (
//               <FormItem>
//                 <FormLabel>Images</FormLabel>
//                 <FormControl>
//                   <Input
//                     {...fieldProps}
//                     type='file'
//                     accept='image/*'
//                     multiple
//                     placeholder="Bulk upload images ..."
//                     onChange={(e) => {
//                       onChange(e.target.files)
//                     }}
//                   />
//                 </FormControl>
//                 <FormDescription>
//                   Buk upload the images.
//                 </FormDescription>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <Button
//             type="submit"
//             disabled={isLoading}
//           >Submit</Button>
//         </form>
//       </Form>
//     </section>
//   )
// }

