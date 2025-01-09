import React, { useState } from "react";
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Input, Space, Table, Typography, Modal } from "antd";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const initialData = Array.from({ length: 10 }).map((_, i) => ({
  key: i,
  id: `DEST${i + 1}`,
  name: `Destination Name ${i + 1}`,
  photo:
    "https://assets.editorial.aetnd.com/uploads/2011/06/taj-mahal-gettyimages-463924915.jpg",
}));

const RequestList = () => {
  const [data, setData] = useState(initialData);
  const [filteredData, setFilteredData] = useState(initialData);
  const [pageSize, setPageSize] = useState(5);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const navigate = useNavigate();

  const columns = [
    {
      title: "Destination ID",
      dataIndex: "id",
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Photo",
      dataIndex: "photo",
      render: (photo) => (
        <img src={photo} alt="destination" style={{ width: 50, height: 50 }} />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button icon={<EyeOutlined />} onClick={() => handleView(record)} />
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record)}
          />
        </Space>
      ),
    },
  ];

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    const filteredResults = data.filter((item) =>
      item.name.toLowerCase().includes(value)
    );
    setFilteredData(filteredResults);
  };

  const handleView = (record) => {
    setSelectedRecord(record);
    setIsViewModalOpen(true);
  };

  const handleEdit = (record) => {
    navigate(`/edit-destination/${record.id}`);
  };

  const handleDelete = (record) => {
    setSelectedRecord(record);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    setData(data.filter((item) => item.id !== selectedRecord.id));
    setFilteredData(
      filteredData.filter((item) => item.id !== selectedRecord.id)
    );
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          Request Destinations
        </Title>
      </div>
      <div
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <Input
          placeholder="Search destinations"
          prefix={<SearchOutlined />}
          onChange={handleSearch}
          style={{ marginBottom: 16, maxWidth: 400, padding: 10 }}
        />
        <Table
          columns={columns}
          dataSource={filteredData}
          scroll={{
            x: "max-content",
          }}
          pagination={{
            pageSize: pageSize,
            onChange: (page, size) => setPageSize(size),
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20"],
          }}
          rowSelection={{ type: "checkbox" }}
          loading={false}
        />

        {/* View Modal */}
        <Modal
          title="Destination Details"
          open={isViewModalOpen}
          onCancel={() => setIsViewModalOpen(false)}
          footer={[
            <Button key="close" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>,
          ]}
        >
          {selectedRecord && (
            <>
              <p>
                <strong>ID:</strong> {selectedRecord.id}
              </p>
              <p>
                <strong>Name:</strong> {selectedRecord.name}
              </p>
              <img
                src={selectedRecord.photo}
                alt="destination"
                style={{ width: 100, height: 100 }}
              />
            </>
          )}
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          title="Confirm Deletion"
          open={isDeleteModalOpen}
          onOk={confirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
          okText="Delete"
          okType="danger"
        >
          <p>Are you sure you want to delete this destination?</p>
        </Modal>
      </div>
    </>
  );
};

export default RequestList;
