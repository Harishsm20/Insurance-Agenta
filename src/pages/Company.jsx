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
  Select,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Title } = Typography;

const Company = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get("https://insurance-agenta-server.onrender.com/api/companies");
        setRecords(response.data.data);
      } catch (err) {
        console.error("Error fetching records:", err);
        message.error("Failed to fetch records.");
      }
    };

    fetchRecords();
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get("https://insurance-agenta-server.onrender.com/api/companies");
      const companiesWithKeys = response.data.data.map((company, index) => ({
        ...company,
        key: company._id,
        cno: `CMP${(index + 1).toString().padStart(3, "0")}`,
      }));
      setData(companiesWithKeys);
      setFilteredData(companiesWithKeys);
      setLoading(false);
    } catch (error) {
      console.error("Fetch error:", error);
      message.error("Failed to fetch companies");
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
      title: "Agent Name",
      dataIndex: "agentName",
      key: "agentName",
      render: (text) => <span>{text || "-"}</span>,
    },
    {
      title: "Licence",
      dataIndex: "licence",
      key: "licence",
      render: (text) => <span>{text || "-"}</span>,
    },
    // {
    //   title: "Records",
    //   dataIndex: "records",
    //   key: "records",
    //   render: (records, record) => (
    //     <Tag color="blue" onClick={() => handleView(record)}>
    //       {records?.length || 0} records
    //     </Tag>
    //   ),
    // },
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
        item.agentName?.toLowerCase().includes(value) ||
        item.licence?.toLowerCase().includes(value)
    );
    setFilteredData(filteredResults);
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setIsEditModalOpen(true);
    form.setFieldsValue({
      name: record.name,
      agentName: record.agentName,
      licence: record.licence,
      records: record.records.map((rec) => rec._id),
    });
  };

  const handleSaveEdit = async (values) => {
    try {
      await axios.put(
        `https://insurance-agenta-server.onrender.com/api/companies/${selectedRecord._id}`,
        {
          name: values.name,
          agentName: values.agentName,
          licence: values.licence,
          records: values.records,
        }
      );
      setIsEditModalOpen(false);
      fetchCompanies();
      message.success("Company updated successfully");
    } catch (error) {
      console.error("Edit error:", error);
      message.error("Failed to update company");
    }
  };

  const handleDelete = (record) => {
    setSelectedRecord(record);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRecord || !selectedRecord._id) {
      message.error("Company not found");
      return;
    }

    try {
      await axios.delete(`https://insurance-agenta-server.onrender.com/api/companies/${selectedRecord._id}`);
      await fetchCompanies();
      setIsDeleteModalOpen(false);
      message.success("Company deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      message.error("Failed to delete company");
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
      >
        <Title align="start" level={3} style={{ margin: 0 }}>
          Companies
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/addcompany")}
        >
          Add Company
        </Button>
      </Space>

      <Input
        placeholder="Search companies..."
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

      {/* View Company Modal */}
      <Modal
        title={`Company: ${selectedRecord?.name}`}
        visible={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={[<Button key="close" onClick={() => setIsViewModalOpen(false)}>Close</Button>]}
        width={800}
      >
        <div>
          <h4>Agent Name:</h4>
          <p>{selectedRecord?.agentName || "No agent name available"}</p>
          <h4>Licence:</h4>
          <p>{selectedRecord?.licence || "No licence available"}</p>
          <h4>Records:</h4>
          <Row gutter={16}>
            {selectedRecord?.records?.map((record) => (
              <Col span={8} key={record._id}>
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
                  <span>{record.name}</span>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </Modal>

      {/* Edit Company Modal */}
      <Modal
        title="Edit Company"
        visible={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsEditModalOpen(false)}>
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={() => form.submit()}>
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
            agentName: selectedRecord?.agentName,
            licence: selectedRecord?.licence,
          }}
        >
          <Form.Item
            label="Company Name"
            name="name"
            rules={[{ required: true, message: "Please input the company name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Agent Name"
            name="agentName"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Licence"
            name="licence"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Records"
            name="records"
          >
            <Select
              mode="multiple"
              allowClear
              placeholder="Select records"
              options={records.map((record) => ({
                value: record._id,
                label: record.name,
              }))}
              defaultValue={selectedRecord?.records.map((record) => record._id)}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Company Modal */}
      <Modal
        title="Are you sure you want to delete this company?"
        visible={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onOk={handleDeleteConfirm}
        okText="Delete"
        cancelText="Cancel"
        centered
      >
        <p>Deleting this company will remove it permanently. Are you sure?</p>
      </Modal>
    </div>
  );
};

export default Company;
