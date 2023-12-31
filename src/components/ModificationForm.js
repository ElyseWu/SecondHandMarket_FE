import React, { useEffect } from "react";
import { Form, Button, Input, InputNumber, Select, message } from "antd";
import { useState } from "react";
import { modifyItem, getItemById } from "../utils";

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};

const ModificationForm = ({ item, handleModifySuccess }) => {
  console.log(item);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(item);
  useEffect(() => {
    getItemById(item.item_id)
      .then((data) => {
        setData(data);
      })
      .catch((err) => {
        // avoid annoying error message
        // message.error(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const fileInputRef = React.createRef();

  const handleSubmit = async (values) => {
    const formData = new FormData();
    const { files } = fileInputRef.current;

    if (files.length > 5) {
      message.error("You can at most upload 5 pictures.");
      return;
    }

    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    formData.append("name", values.name);
    formData.append("price", values.price);
    formData.append("description", values.description);
    formData.append("condition", values.condition);
    formData.append("category", values.category);
    setLoading(true);

    try {
      await modifyItem(formData, item.item_id);
      message.success("Modification success");
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
    console.log("Item modified successfully!");
    handleModifySuccess();
  };

  return (
    <Form
      {...layout}
      name="nest-messages"
      onFinish={handleSubmit}
      style={{ maxWidth: 1000, margin: "auto" }}
    >
      <Form.Item
        name="name"
        label="name"
        rules={[{ required: true }]}
        initialValue={data.item_name}
      >
        <Input name="name" />
      </Form.Item>
      <Form.Item
        name="price"
        label="price"
        rules={[{ required: true }]}
        initialValue={data.item_price}
      >
        <InputNumber addonAfter="$" />
      </Form.Item>
      <Form.Item
        name="description"
        label="description"
        rules={[{ required: true }]}
        initialValue={data.item_description}
      >
        <Input.TextArea name="description" />
      </Form.Item>
      <Form.Item
        name="condition"
        label="condition"
        initialValue={data.item_condition}
      >
        <Select>
          <Select.Option value="New With Tags (NWT)">
            New With Tags (NWT)
          </Select.Option>
          <Select.Option value="Excellent Used Condition (EUC)">
            Excellent Used Condition (EUC)
          </Select.Option>
          <Select.Option value="Good Used Condition (GUC)">
            Good Used Condition (GUC)
          </Select.Option>
          <Select.Option value="Fair Used Condition (FUC)">
            Fair Used Condition (FUC)
          </Select.Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="category"
        label="category"
        rules={[{ required: true }]}
        initialValue={data.item_category}
      >
        <Select>
          <Select.Option value="Clothing">Clothing</Select.Option>
          <Select.Option value="Electronics">Electronics</Select.Option>
          <Select.Option value="Jewelry & Watches">
            Jewelry & Watches
          </Select.Option>
          <Select.Option value="Household goods">Household goods</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item name="image" label="image">
        <input
          type="file"
          accept="image/png, image/jpeg"
          ref={fileInputRef}
          multiple={true}
        />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={loading}>
        Submit
      </Button>
    </Form>
  );
};

export default ModificationForm;
