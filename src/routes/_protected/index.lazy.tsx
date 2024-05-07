import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_protected/')({
  component: Index
})


import { useAddProjectMutation, useGetProjectsQuery } from "@/services/project/projectApiSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { useNavigate } from '@tanstack/react-router';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDistance } from 'date-fns'
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';


const projectCreationSchema = z.object({
  name: z.string().min(1, { message: 'name is required' }),
})

function AddProject() {
  const navigate = useNavigate();
  const [addProjectApi, { isLoading }] = useAddProjectMutation();
  const form = useForm<z.infer<typeof projectCreationSchema>>({
    resolver: zodResolver(projectCreationSchema),
    defaultValues: {
      name: '',
    },
  })

  async function onSubmit(data: z.infer<typeof projectCreationSchema>) {
    const { name } = data;
    try {
      const res = await addProjectApi({ project_name: name }).unwrap();
      console.log('add project', res);
      toast.success('Project created successfully!');
      navigate({ to: '/$projectId', params: { projectId: res.id } });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(
        error?.data?.message || error?.data?.detail || error.error || 'Error: Something went wrong!'
      );
      console.log(error);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className='flex justify-between'>
          <h1 className='text-2xl font-bold'>Projects</h1>
          <Button>Add Project</Button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Project</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-8'>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className='grid gap-2'>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input type='text' required {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isLoading}
              className="w-full"
            >
              Add Project
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )

}

function Index() {
  const navigate = useNavigate();
  const { data: projects = [], isLoading } = useGetProjectsQuery();

  return (
    <main className="flex flex-col min-h-screen w-full">
      <Navbar />
      {isLoading ? (
        <section className="grid place-items-center grow">
          <div>Loading...</div>
        </section>
      ) : (
        <section className='flex flex-col grow my-8 gap-8 mx-32'>
          <AddProject />
          <Table className='border'>
            <TableHeader>
              <TableRow className='divide-x'>
                <TableHead className="">Project Name</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>View</TableHead>
                <TableHead>Delete</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow className='divide-x' key={project.id}>
                  <TableCell className="font-medium">{project.project_name}</TableCell>
                  <TableCell>{
                    formatDistance(new Date(project.created_at), new Date(), {
                      addSuffix: true
                    })
                  }</TableCell>
                  <TableCell>
                    <Button
                      variant='link'
                      className='px-0'
                      onClick={() => navigate({ to: '/$projectId', params: { projectId: project.id } })}
                    >
                      View
                    </Button>
                  </TableCell>
                  <TableCell>Delete</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      )}
    </main >
  )
}
