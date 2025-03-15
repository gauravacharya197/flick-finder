'use client'
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, SubmitHandler } from 'react-hook-form';
import VideoService, { Video } from "../../../services/VideoService";
import Modal from "@/components/ui/Modal";
import { Input } from "@/components/ui/primitives/input";
import { FaPencil } from "react-icons/fa6";
import { FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/primitives/table";

import { Button } from "@/components/ui/primitives/button";
import { IoAlertCircleOutline } from "react-icons/io5";
import toast from "react-hot-toast";
export const Videos = ()=> {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);

  const { data: videos, isLoading, error } = useQuery<Video[]>({
    queryKey: ["videos", searchQuery],
    queryFn: () => VideoService.getVideos(searchQuery),
  });

  const addVideoMutation = useMutation({
    mutationFn: VideoService.addVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      setIsModalOpen(false);
    },
    onError: (error) => {
        console.log(error.message || "An error occurred");
    }
  });

  const editVideoMutation = useMutation({
    mutationFn: VideoService.updateVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      setIsEditModalOpen(false);
    },
    onError: () => {
      toast.error("Failed to update video", { position: "bottom-center" });
    },
  });

  const deleteVideoMutation = useMutation({
    mutationFn: VideoService.deleteVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
    onError: () => {
      toast.error("Failed to delete video", { position: "bottom-center" });

    },
  });

  const handleDelete = (id: number) => {
    deleteVideoMutation.mutate(id);
  };

  const handleEdit = (video: Video) => {
    setEditingVideo(video);
    setIsEditModalOpen(true);
  };



 

  return (<div>
    <div>
      <div className="">
        <h1 className="text-3xl font-bold text-white mb-4 dark:text-gray-100">
         Videos
        </h1>
        
        <div className="relative mb-3 max-w-md">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            className="pl-10 h-12  rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            type="text"
            placeholder="Search movies by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
           
        </div>
        <Button className="mb-3" onClick={() => setIsModalOpen(true)}> <FaPlus/> Add Video</Button>
          
        
        </div>
      </div>
      
      {isLoading && (
        
          
          <p className="mt-4">Loading videos...</p>
        
      )}
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400">
          <div className="flex items-center gap-3">
            <IoAlertCircleOutline className="h-5 w-5" />
            <p>Error fetching videos. Please try again later.</p>
          </div>
        </div>
      )}
      
      {!isLoading && !error && (
        <div className=" overflow-hidden">
          <div className="overflow-x-auto">
          <Table>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[80px]">ID</TableHead>
      <TableHead className="w-[250px]">Title</TableHead>
      <TableHead className="w-[120px]">TMDB</TableHead>
      <TableHead className="w-[120px]">IMDB</TableHead>
      <TableHead className="min-w-[200px] max-w-[300px]">Source</TableHead>
      <TableHead className="w-[120px]">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {videos?.length === 0 ? (
      <TableRow>
        <TableCell colSpan={6} className="h-32 text-center text-gray-500 dark:text-gray-400">
          <div className="flex flex-col items-center justify-center space-y-2">
            <p>No videos found</p>
            <Button 
              variant="link" 
              onClick={() => setIsModalOpen(true)}
              className="text-blue-500 hover:text-blue-600"
            >
              Add your first video
            </Button>
          </div>
        </TableCell>
      </TableRow>
    ) : (
      videos?.map((video) => (
        <TableRow 
          key={video.id}
          className="transition-colors duration-150"
        >
          <TableCell>{video.id}</TableCell>
          <TableCell>{video.title}</TableCell>
          <TableCell>{video.tmdbId || '—'}</TableCell>
          <TableCell>{video.imdbId || '—'}</TableCell>
          <TableCell className="max-w-[300px]">
            <div className="truncate" title={video.videoSource}>
              {video.videoSource}
            </div>
          </TableCell>
          <TableCell>
            <div className="flex justify-center space-x-3">
              <Button
                onClick={() => handleEdit(video)}
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full"
              >
                <FaPencil className="h-4 w-4 text-blue-600" />
              </Button>
              <Button
                onClick={() => handleDelete(video.id)}
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
              >
                <FaTrash className="h-4 w-4 text-red-600" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      ))
    )}
  </TableBody>
</Table>
          </div>
        </div>
      )}
  
      {/* Add Video Modal */}
      <Modal 
        open={isModalOpen} 
        onCancel={() => setIsModalOpen(false)} 
         title=' Add Video'
        
        className="rounded-lg overflow-hidden p-4"
      >
        <AddEditVideoForm
          onSubmit={addVideoMutation.mutate}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
  
      {/* Edit Video Modal */}
      <Modal 
        open={isEditModalOpen} 
        onCancel={() => setIsEditModalOpen(false)} 
        title=' Edit Video'
         
        
        className="rounded-lg overflow-hidden p-4"
      >
        <AddEditVideoForm
          onSubmit={editVideoMutation.mutate}
          onCancel={() => setIsEditModalOpen(false)}
          initialData={editingVideo}
        />
      </Modal>
    </div>
  
  )
}

interface AddEditVideoFormProps {
  onSubmit: (values: Video) => void;
  onCancel: () => void;
  initialData?: Video | null;
}

const AddEditVideoForm: React.FC<AddEditVideoFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<Video>({
    defaultValues: initialData || { tmdbId: '', imdbId: '', videoSource: '' }
  });

  useEffect(() => {
    if (initialData) {
      setValue('tmdbId', initialData.tmdbId);
      setValue('imdbId', initialData.imdbId);
      setValue('title', initialData.title);
      setValue('videoSource', initialData.videoSource);
    }
  }, [initialData, setValue]);

  const onFormSubmit: SubmitHandler<Video> = (data) => {
    onSubmit(data);
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold mb-2">Title</label>
        <Input
          className="w-full"
          type="text"
          {...register("title", { required: "TMDB ID is required" })}
        />
        {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
      </div>
      <div>
        <label className="block text-sm font-semibold mb-2">TMDB ID</label>
        <Input
          className="w-full"
          type="text"
          {...register("tmdbId", { required: "TMDB ID is required" })}
        />
        {errors.tmdbId && <span className="text-red-500 text-sm">{errors.tmdbId.message}</span>}
      </div>
      

      <div>
        <label className="block text-sm font-semibold mb-2">IMDB ID</label>
        <Input
          className="w-full"
          type="text"
          {...register("imdbId", { required: "IMDB ID is required" })}
        />
        {errors.imdbId && <span className="text-red-500 text-sm">{errors.imdbId.message}</span>}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Video Source</label>
        <Input
          className="w-full"
          type="text"
          {...register("videoSource", { required: "Video Source is required" })}
        />
        {errors.videoSource && <span className="text-red-500 text-sm">{errors.videoSource.message}</span>}
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Submit
        </button>
      </div>
    </form>
  );
};
