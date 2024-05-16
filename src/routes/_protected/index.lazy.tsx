/* eslint-disable @typescript-eslint/no-explicit-any */
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_protected/')({
  component: HomeScreen
  // component: Index
})


import { useAddProjectMutation, useGetProjectsQuery, useGetTemplatesQuery } from "@/services/project/projectApiSlice";
import {
  Dialog,
  DialogContent,
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
import { Button } from '@/components/ui/button';
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card"
import { EyeIcon, TrashIcon } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Layout from '@/components/Layout';
import { useEffect } from 'react';


const projectCreationSchema = z.object({
  name: z.string().min(1, { message: 'name is required' }),
  template: z.string().min(1, { message: 'type is required' }),
})

function AddProject() {
  const navigate = useNavigate();
  const { data } = useGetTemplatesQuery({});
  const templates = data?.project_templates || [];
  const [addProjectApi, { isLoading }] = useAddProjectMutation();
  const form = useForm<z.infer<typeof projectCreationSchema>>({
    resolver: zodResolver(projectCreationSchema),
    defaultValues: {
      name: '',
    },
  })

  useEffect(() => {
    console.log('data', data);
  }, [data])

  async function onSubmit(data: z.infer<typeof projectCreationSchema>) {
    const { name, template } = data;
    console.log('data', data);
    try {
      const res = await addProjectApi({
        name,
        template: Number(template),
      }).unwrap();
      console.log('add project', res);
      toast.success('Project created successfully!');
      navigate({ to: '/$projectId', params: { projectId: res.project.id } });
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
        <Button className='mt-2'>Add new project</Button>
      </DialogTrigger>
      <DialogContent>
        <CardHeader>
          <CardTitle>Create Project</CardTitle>
        </CardHeader>
        <CardContent>
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
              <FormField
                control={form.control}
                name="template"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Project Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        {
                          templates.map((template: any) => (
                            <FormItem key={template.id} className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value={template.id.toString()} />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {template.name}
                              </FormLabel>
                            </FormItem>
                          ))
                        }
                        {/* <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="crack-detection" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Crack Detection
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="moss-detection" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Bird poo/Moss Detection
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="before-after" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Before and after survey
                          </FormLabel>
                        </FormItem> */}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                disabled={isLoading}
                className="w-full"
              >
                Create new project
              </Button>
            </form>
          </Form>
        </CardContent>
      </DialogContent>
    </Dialog>
  )

}

export default function HomeScreen() {
  return (
    <Layout>
      <div>
        <h1 className="text-lg font-semibold md:text-2xl">
          Home
        </h1>
        <p className="text-muted-foreground">
          To get started, start a new project or edit an already created project.
        </p>
      </div >
      <div
        className="flex items-center justify-center rounded-lg border border-dashed shadow-sm py-8"
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h3 className="text-2xl font-bold tracking-tight">Create new project</h3>
          <p className="text-sm text-muted-foreground">Start a new building inspection project.</p>
          <AddProject />
        </div>
      </div>
      <RecentProjects />
    </Layout>
  )
}

function RecentProjects() {
  const navigate = useNavigate();
  const { data, isLoading } = useGetProjectsQuery({});
  const projects = data?.projects || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Projects</CardTitle>
      </CardHeader>
      <CardContent>
        {
          isLoading ? (
            <div className='grid place-items-center'>
              <div>Loading...</div>
            </div>
          )
            :
            projects.length === 0 ?
              <div className='grid place-items-center'>
                <p>No projects found!</p>
              </div>
              : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>View</TableHead>
                      <TableHead>Delete</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.map((project: any) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">{project.name}</TableCell>
                        <TableCell>{project.template.name}</TableCell>
                        <TableCell>
                          <Button
                            variant='link'
                            className='px-0'
                            onClick={() => navigate({ to: '/$projectId', params: { projectId: project.id } })}
                          >
                            <EyeIcon className="h-5 w-5" />
                            <span className="sr-only">View</span>
                          </Button>
                        </TableCell>
                        <TableCell>
                          <TrashIcon className="h-5 w-5 text-red-500" />
                          <span className="sr-only">Delete</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>

                </Table>
              )
        }
      </CardContent>
    </Card >
  )
}
