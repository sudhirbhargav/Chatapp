import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { persistor } from "../../redux/store";

const Dashboard = () => {
  const [currentuser, setcurrentuser] = useState();
  const [conversation, Setconversation] = useState();
  const [message, setmessage] = useState({
    message: [],
    receiver: null,
    conversationId: null,
  });
  const [totalUsers, setTotalUser] = useState();
  const [sendingMessage, setSendingMessage] = useState("");
  const [socket, setSocket] = useState();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  console.info("-------------------------------");
  console.info("totalUsers => ", totalUsers);
  console.info("-------------------------------");

  useEffect(() => {
    if (localStorage.getItem("user")) {
      const local = JSON.parse(localStorage.getItem("user"));
      setcurrentuser(local?.userDetail);
    }
  }, []);

  useEffect(() => {
    const socketConnection = io("http://localhost:8080");
    setSocket(socketConnection);

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket && currentuser) {
      socket.emit("addUser", currentuser._id);
    }
  }, [socket, currentuser]);

  useEffect(() => {
    if (socket) {
      // socket.on("getUsers", (users) => {
      //   console.info("Received users list:", users);
      //   // setTotalUser(users);
      // });

      socket.on("getMessage", (messageData) => {
        console.log("Received message:", messageData);
        setmessage((prev) => ({
          ...prev,
          message: [
            ...prev.message,
            {
              user: messageData?.user,
              message: messageData?.message,
            },
          ],
        }));
      });

      return () => {
        socket.off("getUsers");
        socket.off("getMessage");
      };
    }
  }, [socket]);

  useEffect(() => {
    const fetchConversations = async () => {
      const res = await fetch(
        `http://localhost:7000/api/conversation/${currentuser?._id}`,
        {
          method: "GET",
          headers: {
            token: token,
          },
        }
      );
      const resdata = await res.json();
      Setconversation(resdata);
    };
    if (currentuser) {
      fetchConversations();
    }
  }, [currentuser]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch(`http://localhost:7000/api/user/get`, {
        method: "GET",
        headers: {
          token: token,
        },
      });
      const resdata = await res.json();
      if (resdata.msg == "invalid token or expired token") {
        localStorage.clear();
        window.localStorage.removeItem("persist:root");
        persistor.pause();
        return navigate("/signin");
      }
      console.info("-------------------------------");
      console.info("resdataresdataresdata => ", resdata);
      console.info("-------------------------------");
      setTotalUser(resdata);
    };
    fetchUsers();
  }, []);

  const fetchMessages = async (conversationId, user) => {
    const res = await fetch(
      `http://localhost:7000/api/get/message/${conversationId}?senderId=${currentuser?._id}&&receiverId=${user?.receiverId}`,
      {
        method: "GET",
        headers: {
          token: token,
        },
      }
    );
    const resData = await res.json();
    setmessage({ message: resData, receiver: user, conversationId });
  };

  const sendMessage = async () => {
    socket?.emit("sendMessage", {
      senderId: currentuser?._id,
      receiverId: message?.receiver?.receiverId,
      message: sendingMessage,
      conversationId: message?.conversationId,
    });
    const res = await fetch(`http://localhost:7000/api/create/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        conversationId: message?.conversationId,
        senderId: currentuser?._id,
        message: sendingMessage,
        receiverId: message?.receiver?.receiverId,
      }),
    });
    const resData = await res.json();
    console.info("resData => ", resData);
    setSendingMessage("");
  };

  return (
    <div className="w-screen flex">
      <div className="w-[25%] h-screen bg-white">
        <div className="flex justify-center items-center my-5 px-2">
          <img
            src="https://static.vecteezy.com/system/resources/thumbnails/006/487/917/small_2x/man-avatar-icon-free-vector.jpg"
            alt=""
            className="w-[5rem]"
          />
          <div className="ml-4">
            <p className="text-2xl">{currentuser?.fullName}</p>
            <p>{currentuser?.email}</p>
          </div>
        </div>
        <hr />
        <div>
          <div className="text-xl font-bold py-5 px-2">Messages</div>
          <hr />
          <div>
            {conversation?.map(
              ({
                img = "https://static.vecteezy.com/system/resources/thumbnails/006/487/917/small_2x/man-avatar-icon-free-vector.jpg",
                user,
                conversationId,
              }) => {
                return (
                  <>
                    <div
                      onClick={() => fetchMessages(conversationId, user)}
                      className="flex cursor-pointer items-center py-5 px-2 border-b-gray-300 border-[1px]"
                    >
                      <img src={img} alt="" className="w-[3rem]" />
                      <div className="ml-4">
                        <p className="text-xl">{user?.fullName}</p>
                        <p className="font-thin">{user?.email}</p>
                      </div>
                    </div>
                  </>
                );
              }
            )}
          </div>
        </div>
      </div>
      <div className="w-[50%] h-screen bg-blue-200 flex flex-col items-center">
        {message?.receiver ? (
          <>
            <div className="w-[75%] bg-white h-[80px] rounded-full flex items-center px-8">
              <div className="cursor-pointer">
                <img
                  src="https://static.vecteezy.com/system/resources/thumbnails/006/487/917/small_2x/man-avatar-icon-free-vector.jpg"
                  width={60}
                  height={60}
                />
              </div>
              <div className="ml-6 mr-auto">
                <h3 className="text-lg">{message?.receiver?.fullName}</h3>
              </div>
            </div>

            <div className="h-[100%] border w-full overflow-y-scroll">
              {message?.message?.length > 0 ? (
                message?.message?.map(({ message, user: { id } }) => {
                  console.info("-------------------------------");
                  console.info(
                    "userddddddddddddddddddd => ",
                    id == currentuser?._id
                  );
                  console.info("-------------------------------");
                  return (
                    <>
                      <div
                        key={id}
                        className={`px-4 py-3 mx-2 max-w-[50%] ${
                          id == currentuser?._id
                            ? "ml-auto rounded-b-3xl rounded-tl-3xl"
                            : "rounded-b-3xl rounded-tr-3xl"
                        } bg-white  mt-10`}
                      >
                        {message}
                      </div>
                    </>
                  );
                })
              ) : (
                <p className="text-center text-2xl my-10">No messages</p>
              )}
            </div>
          </>
        ) : (
          <p className="text-center text-2xl my-10">
            No Conversation is Selected
          </p>
        )}
        {message?.receiver && (
          <div className="py-5 border mt-auto border-t-2 w-full gap-3 flex">
            <input
              className="w-[80%] py-3 px-5 rounded-lg border border-black"
              type="text"
              onChange={(e) => setSendingMessage(e.target.value)}
              value={sendingMessage}
              placeholder="Type Your Message"
            />
            <button
              onClick={() => sendMessage()}
              className="py-3 bg-white px-5 rounded-lg border border-black"
            >
              Send
            </button>
          </div>
        )}
      </div>
      <div className="w-[25%] h-screen bg-white">
        <div className="text-xl text-center font-bold py-5 px-2">People</div>
        <div>
          {totalUsers &&
            totalUsers?.map(
              ({
                img = "https://static.vecteezy.com/system/resources/thumbnails/006/487/917/small_2x/man-avatar-icon-free-vector.jpg",
                user,
              }) => {
                if (user?.receiverId !== currentuser?._id) {
                  return (
                    <>
                      <div
                        onClick={() => fetchMessages("new", user)}
                        className="flex cursor-pointer items-center py-5 px-2 border-b-gray-300 border-[1px]"
                      >
                        <img src={img} alt="" className="w-[3rem]" />
                        <div className="ml-4">
                          <p className="text-xl">{user?.fullName}</p>
                          <p className="font-thin">{user?.email}</p>
                        </div>
                      </div>
                    </>
                  );
                }
              }
            )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
