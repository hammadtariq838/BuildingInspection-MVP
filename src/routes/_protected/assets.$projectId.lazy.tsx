import Navbar from '@/components/Navbar';
import { useGetAssetsByProjectQuery } from '@/services/asset/assetApiSlice';
import { createLazyFileRoute } from '@tanstack/react-router';
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { useEffect } from 'react';

export const Route = createLazyFileRoute('/_protected/assets/$projectId')({
  component: Index
})

function Index() {
  const { projectId } = Route.useParams();
  const { data = [], isLoading } = useGetAssetsByProjectQuery({ projectId });

  useEffect(() => {
    console.log('data', data);
  }
    , [data]);


  return (
    <main className="flex flex-col min-h-screen w-full">
      <Navbar />
      <div className='flex grow'>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <section className='grid place-self-start gap-4 my-8 w-full px-32'>
            <div className='flex justify-between px-6 h-max'>
              <h1 className='text-3xl font-bold'>Results</h1>
            </div>
            <div className='grid gap-6 grid-cols-3'>
              {
                data.map((asset) => (
                  <Card className='w-max' key={asset.id}>
                    <a href={asset.asset_image} target='_blank' key={asset.id}>
                      <CardContent className='pb-2 w-[380px] h-[380px]'>
                        <img src={asset.asset_image} alt={asset.project} className='w-full h-full' />
                      </CardContent>
                    </a>
                    <CardFooter className='grid gap-2 place-items-center'>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="w-full text-center">View Results</Button>
                        </DialogTrigger>
                        <DialogContent className='h-[450px] py-4 px-8'>
                          <Carousel className="w-full">
                            <CarouselContent className='ml-0 max-w-md' >
                              {
                                asset.results.map((result, index) => (
                                  <CarouselItem key={result.id} className='pl-0'>
                                    <h2 className='text-center text-lg font-bold'>{result.model_name}</h2>
                                    <a href={result.result_image} target='_blank'>
                                      <img src={result.result_image} alt={result.asset} className='w-[380px] h-[380px] mx-auto' />
                                    </a>
                                    <p className='text-center text-sm'>
                                      {index + 1} of {asset.results.length}
                                    </p>
                                  </CarouselItem>
                                ))
                              }
                            </CarouselContent>
                            <CarouselPrevious
                              className='-left-8'
                            />
                            <CarouselNext
                              className='-right-8'
                            />
                          </Carousel>
                        </DialogContent>
                      </Dialog>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
