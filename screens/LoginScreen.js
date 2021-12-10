import { useNavigation } from "@react-navigation/core";
import React, { useLayoutEffect } from "react";
import {
  View,
  Text,
  Button,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import tw from "tailwind-rn";
import useAuth from "../hooks/useAuth";

const LoginScreen = () => {
  const { signInWithGoogle, loading } = useAuth();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <View style={tw("flex-1")}>
      {/* <Text>{loading ? "Loading..." : "Login to the app" }</Text>
            <Button title="Login" onPress={signInWithGoogle} /> */}

      <ImageBackground
        resizeMode="cover"
        style={tw("flex-1")}
        source={{
          uri: "https://tinder.com/static/tinder.png",
        }}
      >
        <TouchableOpacity
          style={[tw("absolute bottom-40 w-52 bg-white p-4 rounded-2xl"), { marginHorizontal: "25%" }]}
          onPress={signInWithGoogle}
        >
          <Text style={tw("font-semibold text-center")}>{loading ? "Loading..." : "Sign in & get Swiping"}</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;
