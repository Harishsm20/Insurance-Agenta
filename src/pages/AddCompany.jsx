import React, { useState } from "react";
import {
  Button,
  Form,
  Input,
  Upload,
  Row,
  Col,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";

const AddCompany = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileList, setFileList] = useState([]);

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();

      // Append form fields to FormData
      formData.append("name", values.name);
      formData.append("agentName", values.agentName || "");
      formData.append("licence", values.licence || "");

      // Append file if selected
      if (fileList.length > 0) {
        formData.append("licenceFile", fileList[0].originFileObj);
      }

      setIsSubmitting(true);

      // Make API request with FormData
      const response = await axios.post(
        "http://localhost:5001/api/company/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      message.success("Company created successfully!");
      navigate("/dashboard/companies");
    } catch (error) {
      console.error("Error creating company:", error);
      message.error("Failed to create company. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = ({ fileList }) => {
    const latestFileList = fileList.slice(-1); // Only keep the latest file
    setFileList(latestFileList);
  };

  return (
    <div style={{ padding: "0px" }} className="text-slate-900 font-medium">
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div className="flex flex-col px-2">
          <h1 className="font-bold text-2xl text-gray-800">Add Company</h1>
          <p className="font-medium text-gray-500">
            Add a new company to the system.
          </p>
        </div>
        <div className="flex gap-3">
          <Button size="medium" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button
            type="primary"
            size="medium"
            icon={<PlusOutlined />}
            onClick={() => form.submit()}
            loading={isSubmitting}
          >
            Add
          </Button>
        </div>
      </div>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={15}>
            <div
              style={{
                backgroundColor: "#fff",
                padding: "16px",
                borderRadius: "8px",
              }}
            >
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    label="Company Name"
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: "Please input the company name!",
                      },
                    ]}
                  >
                    <Input className="font-normal" placeholder="Company Name" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Agent Name" name="agentName">
                    <Input className="font-normal" placeholder="Agent Name" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Licence" name="licence">
                    <Input className="font-normal" placeholder="Licence Number" />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Col>

          <Col xs={24} sm={9}>
            <div
              style={{
                backgroundColor: "#fff",
                padding: "16px",
                borderRadius: "8px",
              }}
            >
              <Form.Item
                label="Licence File"
                name="licenceFile"
                valuePropName="fileList"
                getValueFromEvent={(e) => e.fileList}
              >
                <Upload
                  listType="picture-card"
                  maxCount={1}
                  beforeUpload={() => false}
                  fileList={fileList}
                  onChange={handleFileChange}
                >
                  {fileList.length === 0 && (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default AddCompany;