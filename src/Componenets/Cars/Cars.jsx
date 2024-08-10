import React, { useEffect, useState } from 'react'
import { Button, Flex, Image, message, Table, Modal, Form, Input, Upload, Popconfirm } from "antd";

const Cars = () => {
  const [form] = Form.useForm();
  const CarsUrl = 'https://autoapi.dezinfeksiyatashkent.uz/api/cars';
  const imageURL = "https://autoapi.dezinfeksiyatashkent.uz/api/uploads/images/";
  const [data, setData] = useState();
  const [loader, setLoader] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCars, setCurrentCars] = useState(null);
  const token = localStorage.getItem("access_token");

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  //GET 
  const getData = () => {
    setLoader(true);
    fetch(CarsUrl)
      .then((res) => res.json())
      .then((data) => {
        setData(data.data);
        console.log(data);
      })
      .catch((err) => message.error(err))
      .finally(() => setLoader(false));
  };

  useEffect(() => {
    getData();
  }, []);

  //POST or PUT
  const [postName, setPostName] = useState();
  const [postBrendId, setPostBrendId] = useState();
  const [postImage, setPostImage] = useState();
  const [postModel, setPostModel] = useState();
  const [postColor, setPostColor] = useState();
  const [postCategory, setPostCategory] = useState();

  const handleFormSubmit = () => {
    const formData = new FormData();
    formData.append('title', postName);
    formData.append('brand_id', postBrendId);
    formData.append('name', postModel);
    formData.append('color', postColor);
    formData.append('category', postCategory);
    if (postImage) {
      formData.append('images', postImage);
    }
    const url = isEditMode ? `${CarsUrl}/${currentCars.id}` : CarsUrl;
    const method = isEditMode ? 'PUT' : 'POST';
    fetch(url, {
      method: method,
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        getData();
        setIsModalOpen(false);
        message.success(data.message);
        setPostImage(null);
        setPostName("");
        setPostBrendId("");
        setPostModel("");
        setPostColor("");
        setPostCategory("");
        form.resetFields();
      })
      .catch((err) => console.log(err));
  }

  //Delete
  const deleteData = (id) => {
    fetch(`${CarsUrl}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          getData();
          message.success(data.message);
        } else {
          message.error(data.message);
        }
      })
      .catch((err) => message.error(err));
  };

  const handleAdd = () => {
    setIsEditMode(false);
    setCurrentCars(null);
    setPostName("");
    setPostBrendId("");
    setPostImage(null);
    setPostModel("");
    setPostColor("");
    setPostCategory("");
    setIsModalOpen(true);
    form.resetFields();
  };

  const handleEdit = (Cars) => {
    setIsEditMode(true);
    setCurrentCars(Cars);
    setPostName(Cars.title);
    setPostBrendId(Cars.brand_id);
    setPostModel(Cars.name);
    setPostColor(Cars.color);
    setPostCategory(Cars.name_en);
    setIsModalOpen(true);
    form.setFieldsValue({
      title: Cars.title,
      brand_id: Cars.brand_id,
      name: Cars.name,
      color: Cars.color,
      category: Cars.name_en,
    });
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "index",
      key: "index",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Brand_id",
      dataIndex: "brand_id",
      key: "brand_id",
    },
    {
      title: "Model",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Rangi",
      dataIndex: "color",
      key: "color",
    },
    {
      title: "Kategoriya",
      dataIndex: "name_en",
      key: "name_en",
    },
    {
      title: "Images",
      dataIndex: "image",
      key: "image",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
    },
    {
      title: (
        <Button type="primary" onClick={handleAdd}>
          Add Brand
        </Button>
      ),
      dataIndex: "add-brand",
      key: "add-brand",
    },
  ];

  const dataSource =
    data &&
    data.map((Cars, index) => ({
      index: index + 1,
      key: Cars.id,
      title: Cars.brand.title,
      brand_id: Cars.brand_id,
      name: Cars.model.name,
      color: Cars.color,
      name_en: Cars.category.name_en,
      image: (
        <Image
          width={110}
          height={100}
          src={`${imageURL}${Cars.brand.image_src}`}
          alt={Cars.title}
        />
      ),
      action: (
        <Flex gap="small">
          <Button type="primary" onClick={() => handleEdit(Cars)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            onConfirm={() => deleteData(Cars.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
        </Flex>
      ),
    }));

  return (
    <div>
      <section id="Carss">
        <h1>Cars</h1>
        <Table
          loading={loader ? true : false}
          dataSource={dataSource}
          columns={columns}
          pagination={{ pageSize: 5 }}
        />

        {/* Modal for Add and Edit */}
        <Modal
          title={isEditMode ? "Edit Brand" : "Add Brand"}
          open={isModalOpen}
          onOk={() => setIsModalOpen(false)}
          okText="Submit"
          onCancel={() => setIsModalOpen(false)}
          footer={null}
        >
          <Form
            form={form}
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 18,
            }}
            style={{
              maxWidth: 600,
            }}
            initialValues={{
              remember: true,
            }}
            autoComplete="off"
            layout="vertical"
            onFinish={handleFormSubmit}
          >
            <Form.Item
              label="Name"
              name="title"
              rules={[
                {
                  required: true,
                  message: "Please input the brand name!",
                },
              ]}
            >
              <Input onChange={(e) => setPostName(e.target.value)} />
            </Form.Item>
            <Form.Item
              label="Brand ID"
              name="brand_id"
              rules={[
                {
                  required: true,
                  message: "Please input the brand ID!",
                },
              ]}
            >
              <Input onChange={(e) => setPostBrendId(e.target.value)} />
            </Form.Item>
            <Form.Item
              label="Model"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input the model name!",
                },
              ]}
            >
              <Input onChange={(e) => setPostModel(e.target.value)} />
            </Form.Item>
            <Form.Item
              label="Rangi"
              name="color"
              rules={[
                {
                  required: true,
                  message: "Please input the color!",
                },
              ]}
            >
              <Input onChange={(e) => setPostColor(e.target.value)} />
            </Form.Item>
            <Form.Item
              label="Kategoriya"
              name="category"
              rules={[
                {
                  required: true,
                  message: "Please input the category!",
                },
              ]}
            >
              <Input onChange={(e) => setPostCategory(e.target.value)} />
            </Form.Item>
            <Form.Item
              label="Image"
              name="image"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload
                accept="image/*"
                listType="picture-card"
                onChange={(e) => setPostImage(e.file.originFileObj)}
                customRequest={({ onSuccess }) => {
                  onSuccess("ok");
                }}
              >
                <div>Upload</div>
              </Upload>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                {isEditMode ? "Update" : "Submit"}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </section>
    </div>
  );
};

export default Cars;
