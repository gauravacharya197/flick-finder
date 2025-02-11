'use client'
import { useState } from "react";
import { Table, Button, Form, Input, Modal, message } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import VideoService, { Video } from "../../../services/VideoService";
import AdminLayout from "../layout";

export default function Videos() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [form] = Form.useForm();

  const { data: videos, isLoading, error } = useQuery<Video[]>({
    queryKey: ["videos"],
    queryFn: VideoService.getVideos,
  });

  const addVideoMutation = useMutation({
    mutationFn: VideoService.addVideo,
    onSuccess: () => {
      message.success("Video added successfully!");
      queryClient.invalidateQueries({queryKey: ['videos']});
      setIsModalOpen(false);
    },
    onError: () => {
      message.error("Failed to add video.");
    },
  });

  const editVideoMutation = useMutation({
    mutationFn: VideoService.updateVideo,
    onSuccess: () => {
      message.success("Video updated successfully!");
      queryClient.invalidateQueries({queryKey: ['videos']});
      setIsEditModalOpen(false);
    },
    onError: () => {
      message.error("Failed to update video.");
    },
  });

  const deleteVideoMutation = useMutation({
    mutationFn: VideoService.deleteVideo,
    onSuccess: () => {
      message.success("Video deleted successfully!");
      queryClient.invalidateQueries({queryKey: ['videos']});
    },
    onError: () => {
      message.error("Failed to delete video.");
    },
  });

  const handleDelete = (id: number) => {
    deleteVideoMutation.mutate(id);
  };

  const handleEdit = (video: Video) => {
    setEditingVideo(video);
    form.setFieldsValue(video);
    setIsEditModalOpen(true);
  };

  const onEditFinish = (values: Video) => {
    if (editingVideo) {
      editVideoMutation.mutate({ ...editingVideo, ...values });
    }
  };

  const onAddFinish = (values: Partial<Video>) => {
    addVideoMutation.mutate(values);
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
        <>
          <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>Delete</Button>
        </>
      ),
    },
  ];

  if (isLoading) return <p>Loading videos...</p>;
  if (error) return <p>Error fetching videos.</p>;

  return (
    
      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-4">Videos</h1>
        <Button type="primary" className="mb-4" onClick={() => setIsModalOpen(true)}>
          Add Video
        </Button>
        <Table
          columns={columns as any}
          dataSource={videos}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          bordered
        />

        {/* Add Video Modal */}
        <Modal title="Add Video" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
          <Form layout="vertical" onFinish={onAddFinish}>
            <Form.Item label="TMDB ID" name="tmdbId">
              <Input />
            </Form.Item>
            <Form.Item label="IMDB ID" name="imdbId">
              <Input />
            </Form.Item>
            <Form.Item label="Video Source" name="videoSource" rules={[{ required: true, message: "Video source is required!" }]}>
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={addVideoMutation.isPending}>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Edit Video Modal */}
        <Modal title="Edit Video" open={isEditModalOpen} onCancel={() => setIsEditModalOpen(false)} footer={null}>
          <Form layout="vertical" form={form} onFinish={onEditFinish}>
            <Form.Item label="TMDB ID" name="tmdbId">
              <Input />
            </Form.Item>
            <Form.Item label="IMDB ID" name="imdbId">
              <Input />
            </Form.Item>
            <Form.Item label="Video Source" name="videoSource" rules={[{ required: true, message: "Video source is required!" }]}>
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={editVideoMutation.isPending}>
                Save Changes
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    
  );
}
