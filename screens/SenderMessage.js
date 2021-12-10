import React from "react";
import { View, Text } from "react-native";
import tw from "tailwind-rn";

const SenderMessage = ({ message }) => {
  return (
    <View>
      <View
        style={[
          tw("bg-purple-600 rounded-lg rounded-tr-none px-5 py-3 mx-3 my-2"),
          { alignSelf: "flex-start", marginLeft: "auto" },
        ]}
      >
        <Text style={tw("text-white")}>{message.message}</Text>
      </View>
      {/* <View
        style={[
          tw("text-gray-300/50 font-thin px-3 pb-4 text-xs"),
          { alignSelf: "flex-start", marginLeft: "auto" },
        ]}
      >
        <Text>{new Date(message.timestamp.toDate()).toDateString()}</Text>
      </View> */}
    </View>
  );
};

export default SenderMessage;
