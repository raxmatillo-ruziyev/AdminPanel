import React, { useEffect, useState } from 'react'
import {Button,Flex,Image,message,Table,Modal,Form,Input,Upload,Popconfirm} from "antd";

const City = () => {
  const [form] = Form.useForm();
  const cityUrl ='https://autoapi.dezinfeksiyatashkent.uz/api/cities';
  const imageURL ="https://autoapi.dezinfeksiyatashkent.uz/api/uploads/images/";
  const [data, setData] = useState();
  const [loader, setLoader] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCity, setCurrentCity] = useState(null);
  const token = localStorage.getItem("access_token");
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;}
    return e?.fileList;
  };

  //GET
  const getData =()=>{
    setLoader(true)
    fetch(cityUrl)
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
  const [postText,setPostText] = useState();
  const [postImage,setPostImage] = useState();


  const handleFormSubmit =()=>{
    const formData = new FormData();
    formData.append('name',postName);
    formData.append('text',postText);
    if (postImage) {
      formData.append('images',postImage);
      
    }
    const url = isEditMode ? `${cityUrl}/${currentCity.id}`:cityUrl;
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
      setPostText("")
      form.resetFields();

    })
    .catch((err)=> console.log(err));
  }

    //Delete
    const deleteData = (id)=>{
      fetch(`${cityUrl}/${id}`,{
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
      setCurrentCity(null);
      setPostName("");
      setPostText("");
      setPostImage(null);
      setIsModalOpen(true);
      form.resetFields();
    };
    const handleEdit = (city) => {
      setIsEditMode(true);
      setCurrentCity(city);
      setPostName(city.name);
      setIsModalOpen(true);
      setPostText(city.text);
      form.setFieldsValue({
        name: city.name,
        text: city.text,
      });
    };
    const columns = [
      {
        title: "Id",
        dataIndex: "index",
        key: "index",
      },
      {
        title: "Name ",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Text",
        dataIndex: "text",
        key: "text",
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
            Add City
          </Button>
        ),
        dataIndex: "add-city",
        key: "add-city",
      },
    ];
    const dataSource =
    data &&
    data.map((city, index) => ({
      index: index + 1,
      key: city.id,
      name: city.name,
      text: city.text,
      image: (
        <Image
          width={110}
          height={100}
          src={`${imageURL}${city.image_src}`}
          alt={city.text}
        />
      ),
      action: (
        <Flex gap="small">
          <Button type="primary" onClick={() => handleEdit(city)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            onConfirm={() => deleteData(city.id)}
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
    <div >
    <section id="city">
      <h1>City</h1>
      <Table
        loading={loader ? true : false}
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 5 }}
      />

      {/* Modal for Add and Edit */}
      <Modal
        title={isEditMode ? "Edit City" : "Add City"}
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
            name="name"
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
            label="Text"
            name="text"
            rules={[
              {
                required: true,
                message: "Please input the brand name!",
              },
            ]}
          >
            <Input onChange={(e) => setPostText(e.target.value)} />
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
    </div>
  )
}

export default City
