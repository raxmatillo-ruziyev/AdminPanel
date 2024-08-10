import { Button, Table, Modal, Form, Input, Select, message, Popconfirm } from 'antd';
import React, { useEffect, useState } from 'react';

function Model() {
  const [model, setModel] = useState([]);
  const [brand, setBrand] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);

  const Url = 'https://autoapi.dezinfeksiyatashkent.uz/api/models';
  const BrandUrl = 'https://autoapi.dezinfeksiyatashkent.uz/api/brands';
  const access_token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNTczNzkzNTUtZDNjYi00NzY1LTgwMGEtNDZhOTU1NWJiOWQyIiwidG9rZW5fdHlwZSI6ImFjY2VzcyIsImlhdCI6MTcyMDA5NDM4MywiZXhwIjoxNzUxNjMwMzgzfQ.TCJEizDzsDtjme-0kbVRRGn_mrSa2aFLIpaCeTX1h00';

  // Fetch models
  const getModels = () => {
    fetch(Url)
      .then((response) => response.json())
      .then((res) => {
        const transformedData = res.data.map((entry, index) => ({
          ...entry,
          index: index + 1,
        }));
        setModel(transformedData);
      })
      .catch((error) => console.error('Error fetching models:', error));
  };

  // Modal
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedModel(null);
  };

  // Fetch brands
  const getBrands = () => {
    fetch(BrandUrl)
      .then((res) => res.json())
      .then((item) => {
        const transformedData = item.data.map((entry) => ({
          value: entry.id,
          label: entry.title,
        }));
        setBrand(transformedData);
      })
      .catch((error) => console.error('Error fetching brands:', error));
  };

  useEffect(() => {
    getModels();
    getBrands();
  }, []);

  const columns = [
    {
      title: 'Index',
      dataIndex: 'index',
      key: 'index',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Brand',
      dataIndex: 'brand_title',
      key: 'brand_title',
    },
    {
      title: 'Action',
      key: 'action',
      render: (record) => (
        <div>
          <Button type="primary" onClick={() => handleEdit(record)}>Edit</Button>
          <Popconfirm
            title="Are you sure to delete this model?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger style={{ marginLeft: '20px' }}>Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
    {
      title: <Button style={{ marginLeft: '35px' }} type='primary' onClick={showModal}>Add Model</Button>
    },
  ];

  // Form
  const onFinish = (values) => {
    if (selectedModel) {
      // Update existing model
      updateModel(values);
    } else {
      // Add new model
      addModel(values);
    }
  };

  const addModel = (values) => {
    fetch(Url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({
        name: values.name,
        brand_id: values.brand,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          message.success('Model added successfully');
          setIsModalOpen(false);
          getModels(); // Refresh the data
        } else {
          message.error('Failed to add model');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        message.error('Failed to add model');
      });
  };

  const updateModel = (values) => {
    fetch(`${Url}/${selectedModel}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({
        name: values.name,
        brand_id: values.brand,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          message.success('Model updated successfully');
          setIsModalOpen(false);
          getModels(); // Refresh the data
        } else {
          message.error('Failed to update model');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        message.error('Failed to update model');
      });
  };

  // Edit action
  const handleEdit = (record) => {
    setSelectedModel(record.id);
    setIsModalOpen(true);
  };

  // Delete action
  const handleDelete = (id) => {
    fetch(`${Url}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          message.success('Model deleted successfully');
          getModels(); // Refresh the data
        } else {
          message.error('Failed to delete model');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        message.error('Failed to delete model');
      });
  };

  return (
    <div className="container">
      <Table bordered caption={'Model'} dataSource={model} columns={columns} rowKey="id" style={{ width: "1200px", margin: '5px auto' }} />
      <Modal title={selectedModel ? 'Edit Model' : 'Add Model'} visible={isModalOpen} onCancel={handleCancel} footer={null}>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
          layout='vertical'
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input the name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Brand"
            name="brand"
            rules={[{ required: true, message: 'Please select the brand!' }]}
          >
            <Select showSearch placeholder="Select a brand" optionFilterProp="label" options={brand} />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">Submit</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Model;
