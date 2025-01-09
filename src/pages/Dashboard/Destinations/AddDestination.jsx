import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Checkbox,
  Upload,
  Row,
  Col,
  message,
  Select,
} from "antd";
import { useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";

const { TextArea } = Input;

const AddDestination = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [galleryImages, setGalleryImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileList, setFileList] = useState([]);

  const [categories, setCategories] = useState([]); // State for categories
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await axios.get("http://localhost:5001/api/category/");
        setCategories(
          Array.isArray(response.data.data) ? response.data.data : []
        );
      } catch (error) {
        console.error("Error fetching categories:", error);
        message.error("Failed to load categories.");
        setCategories([]); // Ensure categories remains an array
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();

      // Append form fields to FormData
      formData.append("name", values.destinationId);
      formData.append("title", values.title);
      formData.append("subTitle", values.subTitle || "");
      formData.append("about", values.about);
      formData.append("stays", JSON.stringify(values.stays || []));
      formData.append("spots", JSON.stringify(values.spots || []));
      formData.append("categoryId", values.categoryId);

      // Append cover image if selected
      if (fileList.length > 0) {
        formData.append("image", fileList[0].originFileObj); // Match the field name here
      }

      // Append all gallery images under the same field name
      galleryImages.forEach((file) => {
        formData.append("gallery", file.originFileObj); // Match the field name here (no index)
      });

      setIsSubmitting(true);

      // Make API request with FormData
      const response = await axios.post(
        "http://localhost:5001/api/destinationPage/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Correct header for file uploads
          },
        }
      );

      message.success("Destination created successfully!");
      navigate("/dashboard/destinations");
    } catch (error) {
      console.error("Error creating destination:", error);
      message.error("Failed to create destination. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = ({ fileList }) => {
    const latestFileList = fileList.slice(-1);
    setFileList(latestFileList);
  };

  const handleGalleryChange = ({ fileList }) => {
    setGalleryImages(fileList);
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
          <h1 className="font-bold text-2xl text-gray-800">Add Destination</h1>
          <p className="font-medium text-gray-500">
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
                <Col span={8}>
                  <Form.Item
                    label="Destination ID"
                    name="destinationId"
                    rules={[
                      {
                        required: true,
                        message: "Please input the unique id!",
                      },
                    ]}
                  >
                    <Input className="font-normal" placeholder="D001" />
                  </Form.Item>
                </Col>
                <Col span={16}>
                  <Form.Item
                    label="Title"
                    name="title"
                    rules={[
                      { required: true, message: "Please input the title!" },
                    ]}
                  >
                    <Input
                      className="font-normal"
                      placeholder="Destination Title"
                    />
                  </Form.Item>
                </Col>
                <Col span={16}>
                  <Form.Item label="Subtitle" name="subTitle">
                    <Input
                      className="font-normal"
                      placeholder="Destination Sub-Title"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Category"
                    name="categoryId"
                    rules={[
                      { required: true, message: "Please select a category!" },
                    ]}
                  >
                    <Select
                      placeholder="Select a category"
                      loading={loadingCategories}
                      allowClear
                    >
                      {Array.isArray(categories) &&
                        categories.map((category) => (
                          <Select.Option
                            key={category._id}
                            value={category._id}
                          >
                            {category.name}
                          </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="About"
                    name="about"
                    rules={[
                      {
                        required: true,
                        message: "Please enter the description!",
                      },
                    ]}
                  >
                    <TextArea
                      className="font-normal"
                      placeholder="About the Destination"
                      rows={8}
                    />
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
                label="Cover Picture"
                name="coverPicture"
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

              <Form.Item label="Gallery Images" name="gallery">
                <Upload
                  listType="picture-card"
                  multiple
                  beforeUpload={() => false}
                  fileList={galleryImages}
                  onChange={handleGalleryChange}
                >
                  <button
                    style={{ border: 0, background: "none" }}
                    type="button"
                  >
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </button>
                </Upload>
              </Form.Item>
            </div>
          </Col>
        </Row>

        <div
          style={{
            backgroundColor: "#fff",
            padding: "16px",
            marginTop: "20px",
            borderRadius: "8px",
          }}
        >
          <Form.Item label="Stays">
            <Form.List name="stays">
              {(fields, { add, remove }) => (
                <>
                  <Row gutter={[16, 16]}>
                    {fields.map(({ key, name, fieldKey, ...restField }) => (
                      <Col key={key} xs={24} sm={12} md={8}>
                        <div
                          style={{
                            padding: "16px",
                            border: "1px solid #d9d9d9",
                            borderRadius: "4px",
                          }}
                        >
                          <Form.Item
                            {...restField}
                            name={[name, "name"]}
                            label="Stay Name"
                            rules={[
                              {
                                required: true,
                                message: "Please input stay name!",
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>

                          <Form.Item
                            {...restField}
                            name={[name, "price"]}
                            label="Price"
                          >
                            <Input />
                          </Form.Item>

                          <Row gutter={8}>
                            <Col span={12}>
                              <Form.Item
                                {...restField}
                                name={[name, "beds"]}
                                label="Beds"
                              >
                                <InputNumber style={{ width: "100%" }} />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item
                                {...restField}
                                name={[name, "baths"]}
                                label="Baths"
                              >
                                <InputNumber style={{ width: "100%" }} />
                              </Form.Item>
                            </Col>
                          </Row>

                          <div className="flex flex-row justify-between">
                            <Form.Item
                              {...restField}
                              name={[name, "wifi"]}
                              valuePropName="checked"
                            >
                              <Checkbox>WiFi</Checkbox>
                            </Form.Item>
                            <Button
                              onClick={() => remove(name)}
                              type="dashed"
                              danger
                            >
                              Remove Stay
                            </Button>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    style={{ width: "100%", marginTop: "10px" }}
                  >
                    Add Stay
                  </Button>
                </>
              )}
            </Form.List>
          </Form.Item>
        </div>

        <div
          style={{
            backgroundColor: "#fff",
            padding: "16px",
            marginTop: "20px",
            borderRadius: "8px",
          }}
        >
          <Form.Item label="Spots">
            <Form.List name="spots">
              {(fields, { add, remove }) => (
                <>
                  <Row gutter={[16, 16]}>
                    {fields.map(({ key, name, fieldKey, ...restField }) => (
                      <Col key={key} xs={24} sm={12} md={8}>
                        <div
                          style={{
                            padding: "8px",
                            border: "1px solid #d9d9d9",
                            borderRadius: "4px",
                          }}
                        >
                          <Form.Item
                            {...restField}
                            name={[name, "title"]}
                            label="Spot Title"
                            rules={[
                              {
                                required: true,
                                message: "Please input spot title!",
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, "imgSrc"]}
                            label="Image URL"
                          >
                            <Input />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, "location"]}
                            label="Location"
                          >
                            <Input />
                          </Form.Item>
                          <Button
                            onClick={() => remove(name)}
                            type="dashed"
                            danger
                          >
                            Remove Spot
                          </Button>
                        </div>
                      </Col>
                    ))}
                  </Row>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    style={{ width: "100%", marginTop: "10px" }}
                  >
                    Add Spot
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

export default AddDestination;
