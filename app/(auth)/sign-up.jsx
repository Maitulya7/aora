import { View, Text, ScrollView, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { Link } from "expo-router";
const SignUp = () => {
  const [form, setForm] = useState({
    username:"",
    email: "",
    password: "",
  });
  const [isSubmitting, setisSubmitting] = useState(false);

  const sumbit = () => {};
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Image
            resizeMode="contain"
            source={images.logo}
            className="w-[115px] h-[35px]"
          />
          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">
            Sing up in to Aora
          </Text>
          <FormField
            title="Username"
            value={form.username}
            handleChnageText={(e) => setForm({ ...form, username: e })}
            otherStyle="mt-10"
          />
          <FormField
            title="Email"
            value={form.email}
            handleChnageText={(e) => setForm({ ...form, email: e })}
            otherStyle="mt-7"
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChnageText={(e) => setForm({ ...form, password: e })}
            otherStyle="mt-7"
          />
          <CustomButton
            title="Sign Up"
            containerStyles="mt-7"
            handlePress={sumbit}
            isLoading={isSubmitting}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Already have an account?
            </Text>
            <Link
              href="/sign-in"
              className="text-lg text-secondary font-psemibold"
            >
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
