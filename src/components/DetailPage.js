import { ProCard } from "@ant-design/pro-components";
import React from "react";
import {
  Space,
  message,
  Divider,
  Tag,
  Descriptions,
  Button,
  Menu,
  Layout,
  Dropdown,
  Breadcrumb,
  Modal,
} from "antd";
import { Content } from "antd/lib/layout/layout";
import {
  TaobaoCircleFilled,
  UserOutlined,
  HomeOutlined,
  CommentOutlined,
  HeartOutlined,
  MailOutlined,
  LineChartOutlined,
} from "@ant-design/icons";

import { HeartFilled } from "@ant-design/icons";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import GoogleApiWrapper from "./GoogleApiWrapper";
import { getItemById } from "../utils";
import { TagOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import {
  addToFavorites,
  removeFromFavorites,
  askForSeller,
  getCurrentUserName,
} from "../utils";
import { Form, Input } from "antd";

const layout = {
  // 表单左边是label，右边是wrapper
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};

// const location = {
//   address: "1600 Amphitheatre Parkway, Mountain View, california.",
//   lat: 37.42216,
//   lng: -122.08427,
// };

function getRandomIndexesFromArray(arr, count) {
  if (
    !Array.isArray(arr) ||
    arr.length === 0 ||
    count <= 0 ||
    count > arr.length
  ) {
    return []; // Return an empty array if the input is invalid
  }

  const shuffledArray = arr.slice(); // Create a copy of the original array to avoid mutation
  const randomIndexes = [];

  // Fisher-Yates (Knuth) shuffle algorithm
  for (
    let i = shuffledArray.length - 1;
    i >= 0 && randomIndexes.length < count;
    i--
  ) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[randomIndex]] = [
      shuffledArray[randomIndex],
      shuffledArray[i],
    ];
    randomIndexes.push(randomIndex);
  }

  return randomIndexes;
}

const items = [
  "magenta",
  "red",
  "volcano",
  "orange",
  "gold",
  "lime",
  "green",
  "cyan",
  "blue",
  "geekblue",
  "purple",
];
const { Header } = Layout;
class DetailPage extends React.Component {
  state = {
    loading: false,
    data: [],
    favorite: false,
    modalVisible: false,
    isAsked: false,
    currentUserName: "",
  };

  handleCancel = () => {
    this.setState({ modalVisible: false });
  };

  handleAskForSeller = () => {
    this.setState({ modalVisible: true });
  };

  handleButtonSendMessage = async (content) => {
    const formData = new FormData();
    formData.append("content", content);
    const currURL = window.location.href;
    const id = currURL.split("/")[4];
    const item = { ...this.state.data };
    try {
      await askForSeller(formData, id);

      // Update local storage
      const storedAsked = JSON.parse(localStorage.getItem("asked")) || [];
      storedAsked.push({ ...item, ask_user_name: this.state.currentUserName });
      localStorage.setItem("asked", JSON.stringify(storedAsked));

      message.success("Message sent successfully");
      this.setState({ isAsked: true, modalVisible: false });
    } catch (error) {
      message.error(error.message);
    }
  };

  handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append("content", values.content);
    const currURL = window.location.href;
    const id = currURL.split("/")[4];
    const item = { ...this.state.data };
    try {
      await askForSeller(formData, id);

      // Update local storage
      const storedAsked = JSON.parse(localStorage.getItem("asked")) || [];
      storedAsked.push({ ...item, ask_user_name: this.state.currentUserName });
      localStorage.setItem("asked", JSON.stringify(storedAsked));

      message.success("Message sent successfully");
      this.setState({ isAsked: true, modalVisible: false });
    } catch (error) {
      message.error(error.message);
    }
  };

  linktoHome = () => {
    window.location.href = "http://localhost:3000/";
  };

  backtoHome = () => {
    return (
      <Menu>
        <Menu.Item>
          <Button
            onClick={this.linktoHome}
            type="primary"
            shape="round"
            style={{ width: 100 }}
          >
            BackHome
          </Button>
        </Menu.Item>
      </Menu>
    );
  };

  loadData = async () => {
    this.setState({
      loading: true,
    });

    try {
      const currURL = window.location.href;
      const id = currURL.split("/")[4];
      const resp = await getItemById(id);
      this.setState({
        data: resp,
      });
    } catch (error) {
      message.error(error.message);
    } finally {
      this.setState({
        loading: false,
      });
    }
  };

  ////////////////////////////////////////////////////RENDER HEAD CONTENT//////////////////////////////////////////////////////
  renderHeaderContent = (user_name) => {
    return (
      <Header className="header_new">
        <Link to={`/`}>
          <div className="header_title">LETGO</div>
        </Link>

        <Link to={`/chatbox/${user_name}`}>
          <div
            style={{
              height: 60,
            }}
          >
            <Button
              type="text"
              style={{
                marginTop: "15px",
                marginLeft: "1200px",
                color: "black",
              }}
              icon={<MailOutlined style={{ fontSize: 20 }} />}
            />
          </div>
        </Link>

        <div>
          <Dropdown trigger="click" overlay={this.backtoHome}>
            <Button icon={<UserOutlined />} shape="circle" />
          </Dropdown>
        </div>
      </Header>
    );
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  componentDidMount = () => {
    this.loadData();
    const currURL = window.location.href;
    const currentUserName = currURL.split("/")[5];
    const currentItemID = currURL.split("/")[4];

    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const storedAsked = JSON.parse(localStorage.getItem("asked")) || [];

    const isFavorite = storedFavorites.some(
      (favItem) =>
        favItem.item_id == currentItemID &&
        favItem.fav_user_name === currentUserName
    );
    const isAsked = storedAsked.some(
      (askedItem) =>
        askedItem.item_id == currentItemID &&
        askedItem.ask_user_name === currentUserName
    );

    this.setState({ favorite: isFavorite });
    this.setState({ isAsked: isAsked });
    this.setState({ currentUserName: currentUserName });
  };

  addToFavorites = async () => {
    // Add the item to favorites and update the state and local storage
    const item = { ...this.state.data };
    try {
      // Call the backend API to add the item to favorites
      await addToFavorites(item.item_id);
      this.setState({ favorite: true });

      // Update local storage
      const storedFavorites =
        JSON.parse(localStorage.getItem("favorites")) || [];
      storedFavorites.push({
        ...item,
        fav_user_name: this.state.currentUserName,
      });
      localStorage.setItem("favorites", JSON.stringify(storedFavorites));
    } catch (error) {
      console.error("Error adding to favorites:", error);
    }
  };

  removeFromFavorites = async () => {
    // Remove the item from favorites and update the state and local storage
    const item = { ...this.state.data };
    console.log("In remove from favorites");
    console.log(item);
    try {
      // Call the backend API to remove the item from favorites
      await removeFromFavorites(item.item_id);
      this.setState({ favorite: false });

      // Update local storage
      const storedFavorites =
        JSON.parse(localStorage.getItem("favorites")) || [];
      const updatedFavorites = storedFavorites.filter(
        (favItem) =>
          favItem.item_id != item.id &&
          favItem.fav_user_name != this.state.currentUserName
      );
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error("Error removing from favorites:", error);
    }
  };

  toggleFavoriteStatus = () => {
    // Toggle the favorite status of the item
    if (this.state.favorite) {
      this.removeFromFavorites();
    } else {
      this.addToFavorites();
    }
  };

  render() {
    const dataSour = { ...this.state.data };
    const {
      item_name,
      item_category,
      item_condition,
      item_description,
      item_price,
      item_image_urls,
      user_name,
      item_posted_day,
      lat,
      lon,
    } = dataSour;

    const location = {
      // this address is fake, actually we use lat and lon to show the location
      address: "1600 Amphitheatre Parkway, Mountain View, california.",
      lat: lat,
      lng: lon,
    };

    const colorSelected = getRandomIndexesFromArray(items, 2);
    const { favorite, isAsked, currentUserName } = this.state;
    const host_name = localStorage.getItem("username");
    let newArray = item_image_urls ? item_image_urls : [];
    return (
      <Layout>
        {this.renderHeaderContent(host_name)}
        <Content style={{ marginTop: "50px" }}>
          <ProCard split="vertical">
            <ProCard headerBordered colSpan="70%">
              <Breadcrumb separator=">">
                <Breadcrumb.Item>
                  <Link to="/">
                    <HomeOutlined />
                    <span> Home </span>
                  </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{item_name}</Breadcrumb.Item>
              </Breadcrumb>
              <Divider />
              <div style={{ width: 900 }}>
                <div
                  style={{
                    border: "none",
                    borderColor: "rgb(211, 211, 211)",
                  }}
                >
                  <AliceCarousel
                    dotsDisabled={true}
                    buttonsDisabled={true}
                    items={newArray.map((url, index) => (
                      <span>
                        <img
                          style={{
                            width: 800,
                            height: 500,
                            marginLeft: "50px",
                            display: "flex",
                            objectFit: "contain",
                          }}
                          key={index}
                          src={url}
                          alt={`Image${index + 1}`}
                          loading={"lazy"}
                        />
                      </span>
                    ))}
                    ref={(el) => (this.Carousel = el)}
                  />
                </div>
                <span></span>
                <nav>
                  {newArray.map((url, index) => (
                    <span
                      key={index}
                      onClick={() => this.Carousel.slideTo(index)}
                    >
                      <img
                        style={{
                          width: 100,
                          height: 50,
                          marginRight: "15px",
                          marginTop: "15px",
                        }}
                        src={url}
                      ></img>
                    </span>
                  ))}
                </nav>
              </div>
            </ProCard>
            <ProCard>
              <div style={{ height: 22 }}></div>

              <Space direction="vertical">
                <div>
                  <h2 style={{ fontSize: 35, fontWeight: "bold" }}>
                    {item_name}
                  </h2>
                  <div>
                    <p style={{ fontSize: 30, fontWeight: "bold" }}>
                      ${item_price}
                    </p>
                  </div>
                  <p style={{ fontSize: 15 }}>
                    Lasted Posted on {item_posted_day}
                  </p>
                  <p style={{ fontSize: 15 }}>Condition: {item_condition}</p>
                  <p style={{ fontSize: 15 }}>Category: {item_category}</p>
                </div>
                <div>
                  <div
                    style={{
                      width: 80,
                      height: 300,
                    }}
                  >
                    <GoogleApiWrapper centerLoc={location} />
                  </div>
                  <div
                    style={{
                      height: 60,
                    }}
                  >
                    {!isAsked && currentUserName != user_name ? (
                      <Button
                        type="primary"
                        shape="round"
                        block
                        icon={<CommentOutlined />}
                        style={{
                          height: 40,
                          fontSize: 20,
                        }}
                        onClick={this.handleAskForSeller}
                      >
                        Ask For Seller
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        shape="round"
                        block
                        icon={<CommentOutlined />}
                        style={{
                          height: 40,
                          fontSize: 20,
                        }}
                        disabled={true}
                      >
                        Asked
                      </Button>
                    )}
                    <Modal
                      destroyOnClose={true}
                      title={"Send A Message"}
                      visible={this.state.modalVisible}
                      footer={null}
                      onCancel={this.handleCancel}
                    >
                      <span style={{ fontStyle: "italic", fontWeight: "bold" }}>
                        Click the button to send a message or write your own
                        message.
                      </span>

                      <div>
                        <Button
                          shape="round"
                          style={{
                            height: 24,
                          }}
                          onClick={() =>
                            this.handleButtonSendMessage(
                              "Is this item still here?"
                            )
                          }
                        >
                          Is this item still here?
                        </Button>
                      </div>
                      <Space />
                      <div>
                        <Button
                          shape="round"
                          style={{
                            height: 24,
                          }}
                          onClick={() =>
                            this.handleButtonSendMessage(
                              "Can I get a discount for this item?"
                            )
                          }
                        >
                          Can I get a discount for this item?
                        </Button>
                      </div>
                      <div>
                        <Button
                          shape="round"
                          style={{
                            height: 24,
                          }}
                          onClick={() =>
                            this.handleButtonSendMessage(
                              "When are you available for this item?"
                            )
                          }
                        >
                          When are you available for this item?
                        </Button>
                      </div>
                      <br />
                      <Form preserve={false} onFinish={this.handleSubmit}>
                        <Form.Item name="content" label="Content">
                          <Input.TextArea size={{ size: "middle" }} />
                        </Form.Item>
                        <Form.Item
                          wrapperCol={{ ...layout.wrapperCol, offset: 10 }}
                        >
                          <Button
                            type="primary"
                            shape="round"
                            htmlType="submit"
                            loading={this.state.loading}
                          >
                            Send
                          </Button>
                        </Form.Item>
                      </Form>
                    </Modal>
                  </div>
                  <div
                    style={{
                      height: 60,
                      fontSize: 20,
                    }}
                  >
                    {favorite ? (
                      <Button
                        shape="round"
                        block
                        icon={<HeartFilled style={{ color: "red" }} />}
                        style={{
                          height: 40,
                          fontSize: 20,
                        }}
                        onClick={this.toggleFavoriteStatus}
                      >
                        Unfavorite
                      </Button>
                    ) : (
                      <Button
                        shape="round"
                        block
                        icon={<HeartOutlined />}
                        style={{
                          height: 40,
                          fontSize: 20,
                        }}
                        onClick={this.toggleFavoriteStatus}
                      >
                        Favorite
                      </Button>
                    )}
                  </div>
                </div>
              </Space>
            </ProCard>
          </ProCard>
          <ProCard split="vertical">
            <ProCard
              headerBordered
              colSpan="70%"
              size="large"
              style={{ fontSize: 30 }}
            >
              <div style={{ fontSize: 25, fontWeight: "bolder" }}>
                Descriptions
              </div>
              <div>
                <Descriptions bordered>
                  <Descriptions.Item
                    span={5}
                    style={{
                      height: 150,
                      fontSize: 20,
                      alignContent: "initial",
                    }}
                  >
                    {item_description}
                  </Descriptions.Item>
                </Descriptions>
              </div>
              <div style={{ fontSize: 25, fontWeight: "bold" }}>Tags</div>
              <Divider style={{ fontSize: 30 }} />
              <Tag
                style={{ fontSize: 15 }}
                color={items[colorSelected[0]]}
                icon={<TagOutlined />}
              >
                {item_category}
              </Tag>
              <Tag
                style={{ fontSize: 15 }}
                color={items[colorSelected[1]]}
                icon={<TagOutlined />}
              >
                {item_condition}
              </Tag>
            </ProCard>
            <ProCard headerBordered>
              <div>
                <div style={{ fontSize: 25, fontWeight: 20, height: 60 }}>
                  Seller
                </div>
                <div style={{ height: 80 }}>
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <div style={{ fontSize: 50, width: 80 }}>
                      <TaobaoCircleFilled />
                    </div>
                    <div>
                      <div style={{ fontSize: 30, width: 80 }}>{user_name}</div>
                      <div>five stars</div>
                    </div>
                  </div>
                </div>
              </div>
              <Space direction="vertical"></Space>
            </ProCard>
          </ProCard>
        </Content>
      </Layout>
    );
  }
}
export default DetailPage;
