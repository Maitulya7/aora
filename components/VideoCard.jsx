import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { icons } from "../constants";
import { ResizeMode, Video } from "expo-av";
import { likePost, unlikePost, getCurrentUser } from "../lib/appwrite"; // Make sure to import your functions
import { useGlobalContext } from "../context/GlobalProvider";

const VideoCard = ({
  video: {
    title,
    thumbnail,
    video,
    like=[],
    creator: { username, avatar },
  },
  video: { $id: id },
}) => {
  const [play, setPlay] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(like.length);
  const {user} = useGlobalContext();

  console.log(id)
  useEffect(() => {
    const checkIfLiked = async () => {
      setLiked(like.includes(user.$id));
    };

    checkIfLiked();
  }, [like]);

  const handleLikeToggle = async () => {
    try {
      if (liked) {
        await unlikePost(id, user.$id);
        setLiked(false);
        setLikesCount((prev) => prev - 1);
      } else {
        await likePost(id, user.$id);
        setLiked(true);
        setLikesCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error liking/unliking post:", error.message);
    }
  };

  return (
    <View className="flex-col items-center px-4 mb-14">
      <View className="flex-row gap-3 items-start">
        <View className="justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary items-center justify-center p-0.5">
            <Image
              className="w-full h-full rounded-lg"
              resizeMode="cover"
              source={{ uri: avatar }}
            />
          </View>
          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="text-white font-psemibold text-sm"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-gray-100 text-xs font-pregular"
              numberOfLines={1}
            >
              {username}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={handleLikeToggle}
          className={`p-2 h-8 w-8 rounded-md justify-center items-center ${
            liked ? "bg-red-500" : "bg-gray-300"
          }`}
        >
          <Image
            className="w-5 h-5"
            resizeMode="contain"
            source={liked ? icons.heart : icons.heartShallow}
          />
        </TouchableOpacity>
      </View>
      {play ? (
        <Video
          source={{ uri: video }}
          className="w-full h-60 rounded-xl mt-3"
          resizeMode={ResizeMode.COVER}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setPlay(true)}
          className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
      <Text className="text-gray-100 text-xs font-pregular mt-2">
        {likesCount} {likesCount === 1 ? "Like" : "Likes"}
      </Text>
    </View>
  );
};

export default VideoCard;
