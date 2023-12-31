const domain = "http://localhost:8080";

export const login = (credential) => {
  const loginUrl = `${domain}/authenticate`;
  return fetch(loginUrl, {
    method: "POST",
    headers: {},
    body: credential,
  }).then((response) => {
    if (response.status !== 200) {
      throw Error("Fail to log in");
    }
    return response.json();
  });
};

export const register = (credential) => {
  const registerUrl = `${domain}/register`;
  return fetch(registerUrl, {
    method: "POST",
    headers: {},
    body: credential,
  }).then((response) => {
    if (response.status !== 200) {
      throw Error("Fail to register");
    }
  });
};

export const getAllItems = (lat, lon, distance) => {
  const listItemsUrl = new URL(`${domain}/items`);
  listItemsUrl.searchParams.append("lat", lat);
  listItemsUrl.searchParams.append("lon", lon);
  listItemsUrl.searchParams.append("distance", distance);
  return fetch(listItemsUrl).then((response) => {
    if (response.status !== 200) {
      throw Error("Fail to get all items");
    }

    return response.json();
  });
};

export const getItemById = (itemId) => {
  const listItemUrl = `${domain}/item/${itemId}`;

  return fetch(listItemUrl).then((response) => {
    if (response.status !== 200) {
      throw Error("Fail to get item");
    }

    return response.json();
  });
};

export const deleteItem = (itemId) => {
  const authToken = localStorage.getItem("authToken");
  const deleteItemUrl = `${domain}/item/${itemId}`;

  return fetch(deleteItemUrl, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  }).then((response) => {
    if (response.status !== 200) {
      throw Error("Fail to delete item");
    }
  });
};

export const modifyItem = (data, itemId) => {
  const authToken = localStorage.getItem("authToken");
  const modifyItemUrl = `${domain}/item/${itemId}`;

  return fetch(modifyItemUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    body: data,
  }).then((response) => {
    if (response.status !== 200) {
      throw Error("Fail to upload item");
    }
  });
};

export const uploadItem = (data) => {
  const authToken = localStorage.getItem("authToken");
  const uploadItemUrl = `${domain}/item`;

  return fetch(uploadItemUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    body: data,
  }).then((response) => {
    if (response.status !== 200) {
      throw Error("Fail to upload item");
    }
  });
};

export const getMyItems = () => {
  const authToken = localStorage.getItem("authToken");
  const myItemsUrl = `${domain}/items/my`;

  return fetch(myItemsUrl, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  }).then((response) => {
    if (response.status !== 200) {
      throw Error("Fail to get my items");
    }

    return response.json();
  });
};

export const getItemsByCategory = (category, lat, lon, distance) => {
  const listItemsUrl = new URL(`${domain}/items/${category}`);
  listItemsUrl.searchParams.append("lat", lat);
  listItemsUrl.searchParams.append("lon", lon);
  listItemsUrl.searchParams.append("distance", distance);

  return fetch(listItemsUrl).then((response) => {
    if (response.status !== 200) {
      throw Error("Fail to get items by category");
    }

    return response.json();
  });
};

export const searchItemsByKeyword = (keyword, lat, lon, distance) => {
  const searchItemsUrl = new URL(`${domain}/search`);
  searchItemsUrl.searchParams.append("keyword", keyword);
  searchItemsUrl.searchParams.append("lat", lat);
  searchItemsUrl.searchParams.append("lon", lon);
  searchItemsUrl.searchParams.append("distance", distance);

  return fetch(searchItemsUrl).then((response) => {
    if (response.status !== 200) {
      throw Error("Fail to search items by keyword");
    }

    return response.json();
  });
};

export const getMyFavoriteItems = () => {
  const authToken = localStorage.getItem("authToken");
  const myFavoriteItemsUrl = `${domain}/my_favorites`;

  return fetch(myFavoriteItemsUrl, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  }).then((response) => {
    if (response.status !== 200) {
      throw Error("Fail to get my favorite items");
    }

    return response.json();
  });
};

export const getAllChats = () => {
  const authToken = localStorage.getItem("authToken");
  const allChatsUrl = `${domain}/chats`;

  return fetch(allChatsUrl, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  }).then((response) => {
    if (response.status !== 200) {
      throw Error("Fail to get all chats");
    }

    return response.json();
  });
};

export const addToFavorites = (itemId) => {
  const authToken = localStorage.getItem("authToken");
  const addFavoriteItemUrl = `${domain}/favorite/${itemId}`;

  return fetch(addFavoriteItemUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  }).then((response) => {
    if (response.status !== 200) {
      throw Error("Fail to add favorite item");
    }
  });
};

export const removeFromFavorites = (itemId) => {
  const authToken = localStorage.getItem("authToken");
  const deleteFavoriteItemUrl = `${domain}/favorite/${itemId}`;

  return fetch(deleteFavoriteItemUrl, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  }).then((response) => {
    if (response.status !== 200) {
      throw Error("Fail to delete favorite item");
    }
  });
};

export const getAllMessages = (chat_id) => {
  const authToken = localStorage.getItem("authToken");
  const allMessagesUrl = `${domain}/messages/${chat_id}`;

  return fetch(allMessagesUrl, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  }).then((response) => {
    if (response.status !== 200) {
      throw Error("Fail to get all messages");
    }

    return response.json();
  });
};

export const askForSeller = (data, item_id) => {
  const authToken = localStorage.getItem("authToken");
  const askForSellerUrl = `${domain}/ask/${item_id}`;

  return fetch(askForSellerUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    body: data,
  }).then((response) => {
    if (response.status !== 200) {
      throw Error("Fail to chat with seller");
    }
  });
};

export const getCurrentUserName = () => {
  const authToken = localStorage.getItem("authToken");
  const getCurrentUserNameUrl = `${domain}/username`;

  return fetch(getCurrentUserNameUrl, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  }).then((response) => {
    if (response.status !== 200) {
      throw Error("Fail to get current user name");
    }

    return response.json();
  });
};

export const markAsSold = (itemId) => {
  const authToken = localStorage.getItem("authToken");
  const markAsSoldUrl = `${domain}/item/${itemId}/soldOrRelist`;

  return fetch(markAsSoldUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  }).then((response) => {
    if (response.status !== 200) {
      throw Error("Fail to mark as sold");
    }
  });
};

export const reply = (data, chat_id) => {
  const authToken = localStorage.getItem("authToken");
  const replyUrl = `${domain}/reply/${chat_id}`;

  return fetch(replyUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    body: data,
  }).then((response) => {
    if (response.status !== 200) {
      throw Error("Fail to reply");
    }
  });
};
