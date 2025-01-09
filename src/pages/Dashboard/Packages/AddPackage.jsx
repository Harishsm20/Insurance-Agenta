import React, { useState } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Row,
  Col,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";

const { TextArea } = Input;
const { Option } = Select;

const AddPackage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileList, setFileList] = useState([]);

  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();

      formData.append("packageId", values.id);
      formData.append("name", values.name);
      formData.append("location", JSON.stringify(values.location));
      formData.append("nights", values.nights);
      formData.append("days", values.days);
      formData.append("tourType", values.tourType);
      formData.append("groupSize", values.groupSize);
      formData.append("languages", JSON.stringify(values.languages));
      formData.append("description", values.description);
      formData.append("price", values.price);

      if (values.agenda && values.agenda.length > 0) {
        values.agenda.forEach((item, index) => {
          formData.append(`agenda[${index}][title]`, item.title);
          formData.append(`agenda[${index}][description]`, item.description);
        });
      }

      if (fileList.length > 0) {
        formData.append("image", fileList[0].originFileObj);
      }

      console.log(formData);
      const response = await axios.post(
        "http://localhost:5001/api/package/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      message.success("Package created successfully!");
      navigate("/dashboard/packages");
    } catch (error) {
      console.error("Error creating package:", error.response?.data || error);
      message.error("Failed to create package. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = ({ fileList }) => {
    const latestFileList = fileList.slice(-1);
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
        <div className=" flex flex-col px-2">
          <h1 className="font-bold text-2xl text-gray-800">Add Package</h1>
          <p className=" font-medium text-gray-500">
            Add exciting new places to explore.
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
        {/* Top Section */}
        <Row gutter={[16, 16]}>
          {/* Left Box */}
          <Col xs={24} md={14}>
            <div
              style={{
                backgroundColor: "#fff",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Package ID"
                    name="id"
                    rules={[
                      { required: true, message: "Please input the name!" },
                    ]}
                  >
                    <Input className="font-normal" placeholder="OTPXXX" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Tour Type"
                    name="tourType"
                    rules={[
                      { required: true, message: "Please select a tour type!" },
                    ]}
                  >
                    <Select placeholder="Tour Type">
                      <Option value="Family Tour">Family Tour</Option>
                      <Option value="Friends Tour">Friends Tour</Option>
                      <Option value="Devotional Tour">Devotional Tour</Option>
                      <Option value="Adventure Tour">Adventure Tour</Option>
                      <Option value="Historical Tour">Historical Tour</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                label="Package Name"
                name="name"
                rules={[{ required: true, message: "Please input the name!" }]}
              >
                <Input className="font-normal" placeholder="Package Name" />
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Location"
                    name="location"
                    rules={[
                      {
                        required: true,
                        message: "Please input the location(s)!",
                      },
                    ]}
                  >
                    <Select
                      mode="tags"
                      placeholder="Enter one or more locations"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Languages"
                    name="languages"
                    rules={[
                      {
                        required: true,
                        message: "Please input the languages!",
                      },
                    ]}
                  >
                    <Select
                      mode="tags"
                      placeholder="Languages spoken during the tour"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                label="Description"
                name="description"
                rules={[
                  { required: true, message: "Please input the description!" },
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="Describe the package in detail"
                />
              </Form.Item>
            </div>
          </Col>

          {/* Right Box */}
          <Col xs={24} md={10}>
            <div
              style={{
                backgroundColor: "#fff",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Form.Item
                label="Image"
                name="images"
                valuePropName="fileList"
                getValueFromEvent={(e) => e.fileList}
                rules={[{ required: true, message: "Please upload an image!" }]}
              >
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onChange={handleFileChange}
                  beforeUpload={() => false}
                  maxCount={1}
                >
                  {fileList.length === 0 && (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Days"
                    name="days"
                    rules={[
                      {
                        required: true,
                        message: "Please input the number of days!",
                      },
                    ]}
                  >
                    <InputNumber
                      className="font-normal"
                      min={1}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Nights"
                    name="nights"
                    rules={[
                      {
                        required: true,
                        message: "Please input the number of nights!",
                      },
                    ]}
                  >
                    <InputNumber
                      className="font-normal"
                      min={1}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Group Size"
                    name="groupSize"
                    rules={[
                      {
                        required: true,
                        message: "Please input the group size!",
                      },
                    ]}
                  >
                    <Input
                      className="font-normal"
                      placeholder="E.g., Small, Medium, Large"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Price"
                    name="price"
                    rules={[
                      { required: true, message: "Please input the price!" },
                    ]}
                  >
                    <InputNumber
                      className="font-normal"
                      style={{ width: "100%" }}
                      min={1}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        {/* Agenda Section */}
        <div
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            marginTop: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Form.Item
            label={
              <span style={{ fontSize: "18px", fontWeight: 600 }}>Agenda</span>
            }
          >
            <Form.List name="agenda">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div
                      key={key}
                      style={{
                        marginBottom: "15px",
                        padding: "20px",
                        border: "1px solid #d9d9d9",
                        borderRadius: "8px",
                        backgroundColor: "#fff",
                        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <Row gutter={16}>
                        <Col span={24}>
                          <Form.Item
                            {...restField}
                            name={[name, "title"]}
                            label="Title"
                            rules={[
                              {
                                required: true,
                                message: "Please input the agenda title!",
                              },
                            ]}
                          >
                            <Input
                              className="font-normal"
                              placeholder="Agenda Title"
                            />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, "description"]}
                            label="Description"
                            rules={[
                              {
                                required: true,
                                message: "Please input the agenda description!",
                              },
                            ]}
                          >
                            <TextArea
                              className="font-normal"
                              placeholder="Agenda Description"
                              rows={3}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Button
                        danger
                        onClick={() => remove(name)}
                        style={{ marginTop: "10px" }}
                      >
                        Remove Agenda
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    style={{ width: "100%" }}
                  >
                    Add Agenda Item
                  </Button>
                </>
              )}
            </Form.List>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default AddPackage;
