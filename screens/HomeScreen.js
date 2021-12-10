import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useAuth from "../hooks/useAuth";
import tw from "tailwind-rn";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import Swiper from "react-native-deck-swiper";
import {
  collection,
  doc,
  DocumentSnapshot,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "@firebase/firestore";
import { db } from "../firebase";
import generateId from "../lib/generateId";

const dummy_data = [
  {
    firstName: "Bob",
    lastName: "David",
    occupation: "Software Engineer",
    photoURL: "https://ukonudavid-ud.netlify.app/images/profilepicture.jpg",
    age: 21,
    id: 123,
  },
  {
    firstName: "David",
    lastName: "Zoid",
    occupation: "Software Engineer",
    photoURL:
      "https://www.forensicrisk.com/wp-content/uploads/JN-1024x1024.jpg",
    age: 40,
    id: 456,
  },
  {
    firstName: "Lady",
    lastName: "Gaga",
    occupation: "Software Engineer",
    photoURL:
      "https://media.istockphoto.com/photos/real-happy-young-woman-studio-portrait-picture-id696198412?k=20&m=696198412&s=612x612&w=0&h=aEeEaQ-z2bzvTm4LFVHfLTvTCRHDUmqyWI0fUK5Tw8Y=",
    age: 50,
    id: 789,
  },
];

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const swipedRef = useRef(null);

  useLayoutEffect(
    () =>
      onSnapshot(doc(db, "users", user.uid), (snapshot) => {
        if (!snapshot.exists()) {
          navigation.navigate("Modal");
        }
      }),
    []
  );

  useEffect(() => {
    let unsub;

    const fetchCards = async () => {
      const passes = await getDocs(
        collection(db, "users", user.uid, "passes ")
      ).then((snapshot) => snapshot.docs.map((doc) => doc.id));

      const swipes = await getDocs(
        collection(db, "users", user.uid, "swipes")
      ).then((snapshot) => snapshot.docs.map((doc) => doc.id));

      const passedUserIds = passes.length > 0 ? passes : ["test"];
      const swipedUserIds = swipes.length > 0 ? swipes : ["test"];
      unsub = onSnapshot(
        query(
          collection(db, "users"),
          where("id", "not-in", [...passedUserIds, ...swipedUserIds])
        ),
        (snapshot) => {
          setProfiles(
            snapshot.docs
              .filter((doc) => doc.id !== user.uid)
              .map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
          );
        }
      );
    };

    fetchCards();

    return unsub;
  }, []);

  // console.log(profiles);

  const swipeLeft = (cardIndex) => {
    if (!profiles[cardIndex]) return;

    const userSwiped = profiles[cardIndex];
    console.log(`You swiped PASS on ${userSwiped.displayName}`);

    setDoc(doc(db, "users", user.uid, "passes ", userSwiped.id), userSwiped);
  };
  const swipeRight = async (cardIndex) => {
    if (!profiles[cardIndex]) return;

    const userSwiped = profiles[cardIndex];
    const loggedInProfile = await (await getDoc(doc(db, "users", user.uid))).data();
    getDoc(doc(db, "users", userSwiped.id, "swipes", user.uid)).then(
      (DocumentSnapshot) => {

        if (DocumentSnapshot.exists()) {
          //user has matched
          //Create a Match
          console.log(`Hooray, You MATCHED with ${userSwiped.displayName}`);

          setDoc(
            doc(db, "users", user.uid, "swipes", userSwiped.id),
            userSwiped
          );
          // create a Match
          setDoc(doc(db, "matches", generateId(user.uid, userSwiped.id)), {
            users: {
              [user.uid]: loggedInProfile,
              [userSwiped.id]: userSwiped,
            },
            usersMatched: [user.uid, userSwiped.id],
            timestamp: serverTimestamp(),
          });

          navigation.navigate("Match", {
            loggedInProfile,
            userSwiped,
          });
        } else {
          //your have swiped as first interaction
          console.log(
            `You swiped on ${userSwiped.displayName} (${userSwiped.job})`
          );

          setDoc(
            doc(db, "users", user.uid, "swipes", userSwiped.id),
            userSwiped
          );
        }
      }
    );

  };

  return (
    <SafeAreaView style={tw("flex-1")}>
      {/* Header */}
      <View style={tw("flex-row items-center justify-between px-5")}>
        <TouchableOpacity onPress={logout}>
          <Image
            style={tw("h-10 w-10 rounded-full")}
            source={{
              uri: user.photoURL,
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
          <Image
            style={tw("h-14 w-14 rounded-full")}
            source={require("../tinder.png")}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
          <Ionicons name="chatbubbles-sharp" size={30} color="#FF5864" />
        </TouchableOpacity>
      </View>
      {/* End Header */}

      {/* Cards */}
      <View style={tw("flex-1 mt-3")}>
        <Swiper
          ref={swipedRef}
          stackSize={5}
          cardIndex={0}
          verticalSwipe={false}
          animateCardOpacity
          containerStyle={{ backgroundColor: "transparent" }}
          onSwipedLeft={(cardIndex) => {
            console.log("Swipe Pass");
            swipeLeft(cardIndex);
          }}
          onSwipedRight={(cardIndex) => {
            console.log("Swipe Match");
            swipeRight(cardIndex);
          }}
          overlayLabels={{
            left: {
              title: "NOPE",
              style: {
                label: {
                  textAlign: "right",
                  color: "red",
                },
              },
            },
            right: {
              title: "Match",
              style: {
                label: {
                  color: "#4DED30",
                },
              },
            },
          }}
          cards={profiles}
          renderCard={(card) =>
            card ? (
              <View
                key={card.id}
                style={tw("bg-white h-3/4 relative rounded-xl")}
              >
                <Image
                  style={tw("h-full w-full rounded-xl ")}
                  source={{
                    uri: card.photoURL,
                  }}
                />
                <View
                  style={[
                    tw(
                      "absolute bottom-0 flex-row justify-between items-center px-6 py-2 rounded-b-xl bg-white w-full h-20"
                    ),
                    styles.cardShadow,
                  ]}
                >
                  <View>
                    <Text style={tw("text-xl font-bold")}>
                      {card.displayName}
                    </Text>
                    <Text>{card.job}</Text>
                  </View>
                  <Text style={tw("text-2xl font-bold")}>{card.age}</Text>
                </View>
              </View>
            ) : (
              <View
                style={[
                  tw(
                    "relative bg-white h-3/4 rounded-xl justify-center items-center"
                  ),
                  styles.cardShadow,
                ]}
              >
                <Text style={tw("font-bold pb-5")}>No More Profiles</Text>
                <Image
                  style={tw("h-20 w-20")}
                  height={100}
                  width={100}
                  source={{ uri: "https://links.papareact.com/6gb" }}
                />
              </View>
            )
          }
        />
      </View>

      <View style={tw("flex flex-row justify-evenly mb-5")}>
        <TouchableOpacity
          onPress={() => swipedRef.current.swipeLeft()}
          style={tw(
            "items-center justify-center rounded-full w-16 h-16 bg-red-200"
          )}
        >
          <Entypo size={24} color="red" name="cross" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => swipedRef.current.swipeRight()}
          style={tw(
            "items-center justify-center rounded-full w-16 h-16 bg-green-200"
          )}
        >
          <Entypo size={24} color="green" name="heart" />
        </TouchableOpacity>
      </View>

      {/* <Text>I am the Home Screen</Text>
      <Button
        onPress={() => navigation.navigate("Chat")}
        title="Go to Chat Screen"
      />
      <Button title="logout" onPress={logout} /> */}
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
});
