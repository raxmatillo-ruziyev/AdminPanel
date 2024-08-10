import React, { useEffect, useState } from 'react'
import {Button,Flex,Image,message,Table,Modal,Form,Input,Upload,Popconfirm} from "antd";

const Category = () => {
  const [form] = Form.useForm();
  const categoryUrl ='https://autoapi.dezinfeksiyatashkent.uz/api/categories';
  const imageURL ="https://autoapi.dezinfeksiyatashkent.uz/api/uploads/images/";
  const [data, setData] = useState();
  const [loader, setLoader] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const token = localStorage.getItem("access_token");

 const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;}
    return e?.fileList;
  };
  //GET 
  const getData =()=>{
    setLoader(true)
    fetch(categoryUrl)
    .then((res)=>res.json())
    .then((data)=>{
      setData(data.data)

    })
    .catch((err)=>message.error(err))
    .finally(()=> setLoader(false))
  };
  useEffect(()=>{
    getData();
  },[]);
  //POST or PUT
  const [postName,setPostName] = useState();
  const [postNameRu,setPostNameRu] = useState();
  const [postImage,setPostImage] = useState();


  const handleFormSubmit =()=>{
    const formData = new FormData();
    formData.append('name_en',postName);
    formData.append('name_ru',postNameRu);
    if (postImage) {
      formData.append('images',postImage);
      
    }
    const url = isEditMode ? `${categoryUrl}/${currentCategory.id}`:categoryUrl;
    const method = isEditMode ? 'PUT':'POST';
    fetch(url,{
      method:method,
      headers:{
        Authorization : `Bearer ${token}`

      },
      body: formData,
    })
    .then((res)=>res.json())
    .then((data)=>{
      getData();
      setIsModalOpen(false);
      message.success(data.message);
      setPostImage(null);
      setPostName("")
      setPostNameRu("")
      form.resetFields();
      

    })
    .catch((err)=> console.log(err));
  }
  //Delete
  const deleteData = (id)=>{
    fetch(`${categoryUrl}/${id}`,{
      method: 'DELETE',
      headers:{
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res)=>res.json())
    .then((data)=>{
      if (data.success) {
        getData();
        message.success(data.message);
        
      }
      else{
        message.error(data.message);
      }
    })
    .catch((err)=> message.error(err));
  };
  const handleAdd = ()=>{
    setIsEditMode(false);
    setCurrentCategory(null);
    setPostName("");
    setPostNameRu("");
    setPostImage(null);
    setIsModalOpen(true);
    form.resetFields();
  };
  const handleEdit = (category) => {
    setIsEditMode(true);
    setCurrentCategory(category);
    setPostName(category.name_en);
    setIsModalOpen(true);
    form.setFieldsValue({
      name_en: category.name_en,
      name_ru: category.name_ru,
    });
  };
  const columns = [
    {
      title: "Id",
      dataIndex: "index",
      key: "index",
    },
    {
      title: "Name en",
      dataIndex: "name_en",
      key: "name_en",
    },
    {
      title: "Name ru",
      dataIndex: "name_ru",
      key: "name_ru",
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
    data.map((category, index) => ({
      index: index + 1,
      key: category.id,
      name_en: category.name_en,
      name_ru: category.name_ru,
      image: (
        <Image
          width={110}
          height={100}
          src={`${imageURL}${category.image_src}`}
          alt={category.name_en}
        />
      ),
      action: (
        <Flex gap="small">
          <Button type="primary" onClick={() => handleEdit(category)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            onConfirm={() => deleteData(category.id)}
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
    <div >
    <section id="categorys">
      <h1>Category</h1>
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
            name="name_en"
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
            label="Name"
            name="name_ru"
            rules={[
              {
                required: true,
                message: "Please input the brand name!",
              },
            ]}
          >
            <Input onChange={(e) => setPostNameRu(e.target.value)} />
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
              <button
                style={{
                  border: 0,
                  background: "none",
                }}
                type="button"
              >
                <div
                  style={{
                    marginTop: 8,
                  }}
                >
                  Upload
                </div>
              </button>
            </Upload>
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Flex justify="flex-end" gap="small">
              <Button htmlType="button" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Flex>
          </Form.Item>
        </Form>
      </Modal>
    </section>
    </div>
  )
}

export default Category
