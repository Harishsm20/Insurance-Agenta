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
  Row,
  Col,
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

const Packages = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/package");
      const packagesWithKeys = response.data.map((pkg, index) => ({
        ...pkg,
        key: pkg._id,
      }));
      setData(response.data);
      setFilteredData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Fetch error:", error);
      message.error("Failed to fetch packages");
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "PKG ID",
      dataIndex: "packageId",
      key: "packageId",
      width: 100,
      sorter: (a, b) => a.pno.localeCompare(b.pno),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
    },
    {
      title: "Tour Type",
      dataIndex: "tourType",
      key: "tourType",
      render: (tourType) => <Tag color="gold">{tourType}</Tag>,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `₹${price}`,
    },
    {
      title: "Languages",
      dataIndex: "languages",
      key: "languages",
      render: (languages) => (
        <div>
          {languages.map((lang, index) => (
            <Tag color="blue" key={index}>
              {lang}
            </Tag>
          ))}
        </div>
      ),
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
        item.pno.toLowerCase().includes(value) ||
        item.name?.toLowerCase().includes(value) ||
        item.tourType?.toLowerCase().includes(value)
    );
    setFilteredData(filteredResults);
  };

  const handleView = (record) => {
    setSelectedRecord(record);
    setIsViewModalOpen(true);
  };

  const handleEdit = (record) => {
    navigate(`/dashboard/edit-package/${record._id}`);
  };

  const handleDelete = (record) => {
    setSelectedRecord(record);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5001/api/package/${selectedRecord._id}`
      );
      await fetchPackages();
      setIsDeleteModalOpen(false);
      message.success("Package deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      message.error("Failed to delete package");
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
          Packages
        </Title>
        <Button
          align="start"
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/dashboard/addPackage")}
        >
          Add Package
        </Button>
      </Space>

      <Input
        placeholder="Search packages..."
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
        responsive
      />

      <Modal
        title="Package Details"
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
                  <strong>P.No:</strong> {selectedRecord.pno}
                </p>
                <p>
                  <strong>Name:</strong> {selectedRecord.name}
                </p>
                <p>
                  <strong>Tour Type:</strong> {selectedRecord.tourType}
                </p>
                <p>
                  <strong>Price:</strong> ₹{selectedRecord.price}
                </p>
              </div>
              <div>
                <Image
                  src={selectedRecord.image || ""}
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
              <h3 style={{ fontWeight: "bold" }}>Description</h3>
              <p>{selectedRecord.description}</p>
            </div>

            <div>
              <h3 style={{ fontWeight: "bold" }}>Agenda</h3>
              {selectedRecord.agenda?.map((day, index) => (
                <div key={index} style={{ marginBottom: "16px" }}>
                  <strong>{day.title}</strong>
                  <ul>
                    <li>{day.description}</li>
                  </ul>
                </div>
              ))}
            </div>
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
        <p>Are you sure you want to delete this package?</p>
      </Modal>
    </div>
  );
};

export default Packages;
