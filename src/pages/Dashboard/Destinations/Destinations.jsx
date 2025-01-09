import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Space,
  Table,
  Typography,
  Modal,
  Image,
  Tag,
  message,
} from "antd";
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Title } = Typography;

const Destinations = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5001/api/destinationPage/"
      );
      // Add serial number to each destination
      const destinationsWithKeys = response.data.data.map((dest, index) => ({
        ...dest,
        key: dest._id,
        dno: `D${(index + 1).toString().padStart(3, "0")}`, // Creates D001, D002, etc.
      }));
      setData(destinationsWithKeys);
      setFilteredData(destinationsWithKeys);
      setLoading(false);
    } catch (error) {
      console.error("Fetch error:", error);
      message.error("Failed to fetch destinations");
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "D.No",
      dataIndex: "dno",
      key: "dno",
      width: 100,
      sorter: (a, b) => a.dno.localeCompare(b.dno),
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => (a.title || "").localeCompare(b.title || ""),
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <Image
          src={image}
          alt="destination"
          width={50}
          height={50}
          style={{ objectFit: "cover", borderRadius: "4px" }}
        />
      ),
    },
    {
      title: "Stays",
      dataIndex: "stays",
      key: "stays",
      render: (stays) => <Tag color="blue">{stays?.length || 0} stays</Tag>,
    },
    {
      title: "Spots",
      dataIndex: "spots",
      key: "spots",
      render: (spots) => <Tag color="green">{spots?.length || 0} spots</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
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
    const filteredResults = data.filter(
      (item) =>
        item.dno.toLowerCase().includes(value) ||
        item.name?.toLowerCase().includes(value) ||
        item.title?.toLowerCase().includes(value)
    );
    setFilteredData(filteredResults);
  };

  const handleView = (record) => {
    setSelectedRecord(record);
    setIsViewModalOpen(true);
  };

  const handleEdit = (record) => {
    // navigate(`/dashboard/edit-destination/${record._id}`);
  };

  const handleDelete = (record) => {
    setSelectedRecord(record);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5001/api/destinationPage/${selectedRecord.name}`
      );
      await fetchDestinations();
      setIsDeleteModalOpen(false);
      message.success("Destination deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      message.error("Failed to delete destination");
    }
  };

  return (
    <div style={{ background: "#fff", padding: 24, borderRadius: 8 }}>
      <Space
        style={{
          marginBottom: 16,
          width: "100%",
          justifyContent: "space-between",
        }}
        className=" flex flex-col items-start sm:flex-row"
      >
        <Title align="start" level={3} style={{ margin: 0 }}>
          Destinations
        </Title>
        <Button
          align="start"
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/dashboard/addDestination")}
        >
          Add Destination
        </Button>
      </Space>

      <Input
        placeholder="Search destinations..."
        prefix={<SearchOutlined />}
        onChange={handleSearch}
        style={{ marginBottom: 16, maxWidth: 400 }}
      />

      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{
          pageSize: pageSize,
          onChange: (_, size) => setPageSize(size),
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20"],
        }}
        loading={loading}
        scroll={{ x: "max-content" }}
        responsive={{ xs: 1, sm: 2, md: 3, lg: 4 }}
      />

      <Modal
        title="Destination Details"
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewModalOpen(false)}>
            Close
          </Button>,
        ]}
        width={800}
      >
        {selectedRecord && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <div>
                <h3 style={{ fontWeight: "bold" }}>Basic Information</h3>
                <p>
                  <strong>D.No:</strong> {selectedRecord.dno}
                </p>
                <p>
                  <strong>Name:</strong> {selectedRecord.name}
                </p>
                <p>
                  <strong>Title:</strong> {selectedRecord.title}
                </p>
                <p>
                  <strong>Subtitle:</strong> {selectedRecord.subTitle}
                </p>
              </div>
              <div>
                <Image
                  src={selectedRecord.image}
                  alt={selectedRecord.name}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              </div>
            </div>

            <div>
              <h3 style={{ fontWeight: "bold" }}>About</h3>
              <p>{selectedRecord.about}</p>
            </div>

            {selectedRecord.stays?.length > 0 && (
              <div>
                <h3 style={{ fontWeight: "bold" }}>
                  Stays ({selectedRecord.stays.length})
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "8px",
                  }}
                >
                  {selectedRecord.stays.map((stay, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "8px",
                        border: "1px solid #f0f0f0",
                        borderRadius: "4px",
                      }}
                    >
                      <p style={{ fontWeight: "500" }}>{stay.name}</p>
                      <p>Price: {stay.price}</p>
                      <p>Capacity: {stay.capacity} guests</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedRecord.spots?.length > 0 && (
              <div>
                <h3 style={{ fontWeight: "bold" }}>
                  Spots ({selectedRecord.spots.length})
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "8px",
                  }}
                >
                  {selectedRecord.spots.map((spot, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "8px",
                        border: "1px solid #f0f0f0",
                        borderRadius: "4px",
                      }}
                    >
                      <p style={{ fontWeight: "500" }}>{spot.title}</p>
                      <p>{spot.location}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal
        title="Confirm Deletion"
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onOk={confirmDelete}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete this destination?</p>
      </Modal>
    </div>
  );
};

export default Destinations;
