import React from "react";
import { View, Text, Image } from "react-native";
import tw from "tailwind-rn";

const RecieverMessage = ({ message }) => {
  return (
    <View>
      <View
        style={[
          tw("bg-red-400 rounded-lg rounded-tl-none px-5 py-3 mx-3 my-2 ml-14"),
          { alignSelf: "flex-start" },
        ]}
      >
        <Image
          style={tw("h-12 w-12 rounded-full absolute top-0 -left-14")}
          source={{ uri: message.photoURL }}
        />
        <Text style={tw("text-white")}>{message.message}</Text>
      </View>
        {/* <View style={tw("ml-14 text-gray-100 pb-4 font-thin text-xs")}>
          <Text>{new Date(message.timestamp.toDate()).toDateString()}</Text>
        </View> */}
    </View>
  );
};

export default RecieverMessage;
