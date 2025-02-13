'use client'
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, SubmitHandler } from 'react-hook-form';
import VideoService, { Video } from "../../../services/VideoService";
import AdminLayout from "../layout";
import Modal from "@/components/ui/Modal";
import { Input } from "@/components/ui/input";
import { FaPencil } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";

export default function Videos() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);

  const { data: videos, isLoading, error } = useQuery<Video[]>({
    queryKey: ["videos"],
    queryFn: VideoService.getVideos,
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
      alert("Failed to update video.");
    },
  });

  const deleteVideoMutation = useMutation({
    mutationFn: VideoService.deleteVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
    onError: () => {
      alert("Failed to delete video.");
    },
  });

  const handleDelete = (id: number) => {
    deleteVideoMutation.mutate(id);
  };

  const handleEdit = (video: Video) => {
    setEditingVideo(video);
    setIsEditModalOpen(true);
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 80, align: "center" },
    { title: "TMDB ID", dataIndex: "tmdbId", key: "tmdbId", width: 150, align: "center" },
    { title: "IMDB ID", dataIndex: "imdbId", key: "imdbId", width: 150, align: "center" },
    { title: "Source", dataIndex: "videoSource", key: "videoSource", align: "left" },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      align: "center",
      render: (_: any, record: Video) => (
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => handleEdit(record)}
            className="text-blue-600 hover:text-blue-800"
          >
            <FaPencil className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleDelete(record.id)}
            className="text-red-600 hover:text-red-800"
          >
            <FaTrash className="h-5 w-5" />
          </button>
        </div>
      ),
    },
  ];

  if (isLoading) return <p>Loading videos...</p>;
  if (error) return <p>Error fetching videos.</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Videos</h1>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded-md mb-4"
        onClick={() => setIsModalOpen(true)}
      >
        Add Video
      </button>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full">
        <thead>
  <tr className="bg-gray-100">
    {columns.map((column) => (
      <th
        key={column.key}
        className={`py-2 px-4 text-sm font-semibold text-gray-600 ${column.align === 'center' ? 'text-center' : 'text-left'}`}
      >
        {column.title}
      </th>
    ))}
  </tr>
</thead>

<tbody>
  {videos?.map((video) => (
    <tr key={video.id}>
      <td className="py-2 px-4 text-center">{video.id}</td>
      <td className="py-2 px-4 text-center">{video.tmdbId}</td>
      <td className="py-2 px-4 text-center">{video.imdbId}</td>
      <td className="py-2 px-4">{video.videoSource}</td>
      <td className="py-2 px-4 text-center">
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => handleEdit(video)}
            className="text-blue-600 hover:text-blue-800"
          >
            <FaPencil className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleDelete(video.id)}
            className="text-red-600 hover:text-red-800"
          >
            <FaTrash className="h-5 w-5" />
          </button>
        </div>
      </td>
    </tr>
  ))}
</tbody>
        </table>
      </div>

      {/* Add Video Modal */}
      <Modal className=" px-4 py-4" open={isModalOpen} onCancel={() => setIsModalOpen(false)} title="Add Video">
        <AddEditVideoForm
          onSubmit={addVideoMutation.mutate}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* Edit Video Modal */}
      <Modal className=" px-4 py-4" open={isEditModalOpen} onCancel={() => setIsEditModalOpen(false)} title="Edit Video">
        <AddEditVideoForm
          onSubmit={editVideoMutation.mutate}
          onCancel={() => setIsEditModalOpen(false)}
          initialData={editingVideo}
        />
      </Modal>
    </div>
  );
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
