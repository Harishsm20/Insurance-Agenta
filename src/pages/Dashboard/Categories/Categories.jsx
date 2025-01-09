import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Space,
  Table,
  Typography,
  Modal,
  Tag,
  message,
  Form,
  Image,
  Select,
  Row,
  Col,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Title } = Typography;

const Categories = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [destinations, setDestinations] = useState([]);
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/destinationPage/");
        setDestinations(response.data.data);
      } catch (err) {
        console.error("Error fetching destinations:", err);
        message.error("Failed to fetch destinations.");
      }
    };

    fetchDestinations();
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/category/");
      const categoriesWithKeys = response.data.data.map((cat, index) => ({
        ...cat,
        key: cat._id,
        cno: `C${(index + 1).toString().padStart(3, "0")}`,
      }));
      setData(categoriesWithKeys);
      setFilteredData(categoriesWithKeys);
      setLoading(false);
    } catch (error) {
      console.error("Fetch error:", error);
      message.error("Failed to fetch categories");
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "C.No",
      dataIndex: "cno",
      key: "cno",
      width: 100,
      sorter: (a, b) => a.cno.localeCompare(b.cno),
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => <span>{text || "-"}</span>,
    },
    {
      title: "Destinations",
      dataIndex: "destinations",
      key: "destinations",
      render: (destinations, record) => (
        <Tag color="blue" onClick={() => handleView(record)}>
          {destinations?.length || 0} destinations
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
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

  const handleView = (record) => {
    setSelectedRecord(record);
    setIsViewModalOpen(true);
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    const filteredResults = data.filter(
      (item) =>
        item.cno.toLowerCase().includes(value) ||
        item.name?.toLowerCase().includes(value) ||
        item.description?.toLowerCase().includes(value)
    );
    setFilteredData(filteredResults);
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setIsEditModalOpen(true);
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      destinations: record.destinations.map((dest) => dest._id),
    });
  };

  const handleSaveEdit = async (values) => {
    try {
      await axios.put(`http://localhost:5001/api/category/${selectedRecord._id}`, {
        name: values.name,
        description: values.description,
        destinations: values.destinations,
      });
      setIsEditModalOpen(false);
      fetchCategories();
      message.success("Category updated successfully");
    } catch (error) {
      console.error("Edit error:", error);
      message.error("Failed to update category");
    }
  };

  // Step 1: Set selectedRecord before opening delete modal
  const handleDelete = (record) => {
    setSelectedRecord(record);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRecord || !selectedRecord._id) {
        message.error("Category not found");
      return;
    }

    // Perform the delete operation using the correct _id
    try{
      await axios.delete(`http://localhost:5001/api/category/${selectedRecord._id}`);
      await fetchCategories();
  
      // Close the modal and show success message
      setIsDeleteModalOpen(false);
      message.success("Category deleted successfully");
    
  } catch (error) {
    console.error("Delete error:", error);
    message.error("Failed to delete category");
  }

  // Close the modal after deletion
  setIsDeleteModalOpen(false);
};


  return (
    <div style={{ background: "#fff", padding: 24, borderRadius: 8 }}>
      <Space
        style={{
          marginBottom: 16,
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <Title align="start" level={3} style={{ margin: 0 }}>
          Categories
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/dashboard/addcategory")}
        >
          Add Category
        </Button>
      </Space>

      <Input
        placeholder="Search categories..."
        prefix={<SearchOutlined />}
        onChange={handleSearch}
        style={{ marginBottom: 16, maxWidth: 400 }}
      />

      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{
          pageSize,
          onChange: (_, size) => setPageSize(size),
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20"],
        }}
        loading={loading}
        scroll={{ x: "max-content" }}
        responsive={{ xs: 1, sm: 2, md: 3, lg: 4 }}
      />

      {/* View Category Modal */}
      <Modal
        title={`Category: ${selectedRecord?.name}`}
        visible={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewModalOpen(false)}>
            Close
          </Button>,
        ]}
        width={800}
      >
        <div>
          <h4>Description:</h4>
          <p>{selectedRecord?.description || "No description available"}</p>
          <h4>Destinations:</h4>
          <Row gutter={16}>
            {selectedRecord?.destinations?.map((destination) => (
              <Col span={8} key={destination._id}>
                <div
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    borderRadius: "4px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Image
                    src={destination.imgSrc}
                    alt={destination.name}
                    width={100}
                    height={100}
                    style={{ objectFit: "cover", borderRadius: "4px" }}
                  />
                  <span>{destination.name}</span>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        title="Edit Category"
        visible={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsEditModalOpen(false)}>
            Cancel
          </Button>,
          <Button
            key="save"
            type="primary"
            onClick={() => form.submit()}
          >
            Save
          </Button>,
        ]}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveEdit}
          initialValues={{
            name: selectedRecord?.name,
            description: selectedRecord?.description,
          }}
        >
          <Form.Item
            label="Category Name"
            name="name"
            rules={[{ required: true, message: "Please input the category name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            label="Destinations"
            name="destinations"
            rules={[{ required: true, message: "Please select destinations!" }]}
          >
            <Select
              mode="multiple"
              allowClear
              placeholder="Select destinations"
              options={destinations.map((destination) => ({
                value: destination._id,
                label: destination.name,
              }))}
              defaultValue={selectedRecord?.destinations.map(
                (destination) => destination._id
              )}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Category Modal */}
      <Modal
        title="Are you sure you want to delete this category?"
        visible={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onOk={handleDeleteConfirm}
        okText="Delete"
        cancelText="Cancel"
        centered
      >
        <p>Deleting this category will remove it permanently. Are you sure?</p>
      </Modal>
    </div>
  );

}


export default Categories;
