import { Button } from "@/components/ui/button";
import { Link, useNavigate } from '@tanstack/react-router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ArrowLeftSquareIcon } from "lucide-react";
import { useAddProjectMutation, useGetProjectsQuery } from "@/services/project/projectApiSlice";
import {
  NavigationMenu,
  NavigationMenuContent, NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
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
import { Input } from "./ui/input";
import { Fragment } from "react";

const projectCreationSchema = z.object({
  name: z.string().min(1, { message: 'name is required' }),
})


const Navbar = () => {
  const navigate = useNavigate();
  const { data = [] } = useGetProjectsQuery();
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
    <header className="flex flex-col gap-4 h-20 bg-[#023047] px-32 pt-5">
      <div className="flex items-center justify-between">
        <div className="flex gap-12">
          <Link to='/'>
            <h1 className="text-2xl font-bold text-white">Building Inspection</h1>
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Projects</NavigationMenuTrigger>
                <NavigationMenuContent className="w-80 py-2 px-4 flex flex-col gap-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full text-center">Create New Project</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(onSubmit)}
                            className="grid gap-8"
                          >
                            <DialogTitle>Create new Project</DialogTitle>
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
                              Create
                            </Button>

                          </form>
                        </Form>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>

                  {/* <div className="border rounded">
                    <Separator /> */}
                  <div className="flex flex-col justify-center my-2 gap-2 border rounded pb-2">
                    {
                      data.map((project) => (
                        <Fragment key={project.id}>
                          <Separator />
                          <Link to={`/$projectId`} params={{ projectId: project.id }} className="whitespace-nowrap">
                            <NavigationMenuLink className="px-4">
                              {project.project_name}
                            </NavigationMenuLink>
                          </Link>
                        </Fragment>
                      ))
                    }
                    {/* </div> */}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white cursor-pointer">
                {
                  "Muhammad Hammad".split(' ').map((name) => name[0]).join('')
                }
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-20" align='end'>
              <DropdownMenuItem className="flex items-center gap-2">
                <ArrowLeftSquareIcon className="h-5 w-5" />
                <Button
                  variant="link"
                  className='hover:no-underline p-0 h-auto'
                  onClick={() => navigate({ to: '/logout' })}
                >
                  Logout
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header >
  )
}

export default Navbar