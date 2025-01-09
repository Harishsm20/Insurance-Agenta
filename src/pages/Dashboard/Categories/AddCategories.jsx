import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, Input, Select, message, Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [destinations, setDestinations] = useState([]); // All available destinations
  const [selectedDestinations, setSelectedDestinations] = useState([]); // Selected destination IDs
  const [error, setError] = useState(""); // Error state

  // Fetch available destinations for selection
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/destinationPage/");
        console.log(response)
        setDestinations(response.data.data); // assuming the response contains an array of destinations
      } catch (err) {
        console.error("Error fetching destinations:", err);
        message.error("Failed to fetch destinations.");
      }
    };

    fetchDestinations();
  }, []);

  const handleSubmit = async (values) => {
    if (selectedDestinations.length === 0) {
      setError("Please select at least one destination.");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        name: values.name,
        description: values.description,
        destinations: selectedDestinations, // Include selected destination IDs
      };

      // Send the request to create a new category
      const response = await axios.post("http://localhost:5001/api/category/create", payload);
      message.success("Category created successfully!");
      navigate("/dashboard/category");
    } catch (error) {
      console.error("Error creating category:", error);
      message.error("Failed to create category. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDestinationChange = (selectedValues) => {
    setSelectedDestinations(selectedValues);
  };

  // Remove a selected destination from the selectedDestinations state
  const handleRemoveDestination = (destinationId) => {
    setSelectedDestinations(selectedDestinations.filter(id => id !== destinationId));
  };

  return (
    <div style={{ padding: "0px" }}>
      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between" }}>
        <div>
          <h1 className="font-bold text-2xl text-gray-800">Add Category</h1>
          <p className="font-medium text-gray-500">Add a new category to organize your destinations.</p>
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
        <Form.Item
          label="Category Name"
          name="name"
          rules={[{ required: true, message: "Please input the category name!" }]}
        >
          <Input placeholder="Category Name" />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea placeholder="Category Description" rows={4} />
        </Form.Item>

        {/* Destinations Dropdown */}
        <Form.Item label="Select Destinations">
          <Select
            mode="multiple"
            allowClear
            placeholder="Select Destinations"
            value={selectedDestinations}
            onChange={handleDestinationChange}
            style={{ width: "100%" }}
          >
            {destinations.map((destination) => (
              <Select.Option key={destination._id} value={destination._id}>
                <Row>
                  <Col span={12}>
                    <img
                      src={destination.imgSrc}
                      alt={destination.name}
                      style={{ width: "50px", height: "50px", objectFit: "cover" }}
                    />
                    {destination.name}
                  </Col>
                </Row>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <div>
          <h4>Selected Destinations</h4>
          <Row gutter={8}>
            {selectedDestinations.map((destinationId) => {
              const destination = destinations.find((dest) => dest._id === destinationId);
              return destination ? (
                <Col key={destinationId} span={8}>
                  <div
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      margin: "4px",
                      borderRadius: "4px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img
                        src={destination.imgSrc}
                        alt={destination.name}
                        style={{ width: "30px", height: "30px", objectFit: "cover", marginRight: "8px" }}
                      />
                      <span>{destination.name}</span>
                    </div>
                    <Button
                      type="link"
                      onClick={() => handleRemoveDestination(destinationId)}
                      style={{ color: "red", fontSize: "18px", padding: 0 }}
                    >
                      X
                    </Button>
                  </div>
                </Col>
              ) : null;
            })}
          </Row>
        </div>

        {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}

        <Button type="primary" htmlType="submit" loading={isSubmitting}>
          Create Category
        </Button>
      </Form>
    </div>
  );
};

export default AddCategory;
