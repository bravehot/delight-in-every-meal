import { useState } from "react";
import {
  View,
  Text,
  Platform,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import {
  Button,
  IndexPath,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  ThemedComponentProps,
  withStyles,
} from "@ui-kitten/components";
import { Controller, useForm } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import Toast from "react-native-toast-message";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";

import InputForm from "@/components/InputForm";

import { activityLevelMap } from "@/constant";
import { setUserHealth } from "@/service/home";

import type { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import type { IUserHealthReq } from "@repo/api-interface";

import { Gender } from "@repo/api-interface";

export enum ActivityLevel {
  SEDENTARY = "SEDENTARY", // 久坐（很少运动）： × 1.2
  LIGHTLY_ACTIVE = "LIGHTLY_ACTIVE", // 轻度活动（每周 1-3 次轻量运动）： × 1.375
  MODERATELY_ACTIVE = "MODERATELY_ACTIVE", // 中等活动（每周 3-5 次中等运动）： × 1.55
  VERY_ACTIVE = "VERY_ACTIVE", // 高强度活动（每周 6-7 次高强度运动）： × 1.725
  EXTRA_ACTIVE = "EXTRA_ACTIVE", // 极高强度（运动员或重体力劳动者）： × 1.9
}

interface FormData
  extends Omit<IUserHealthReq, "age" | "gender" | "activityLevel"> {
  age: Date;
  gender: number;
  activityLevel: IndexPath | IndexPath[];
}
interface HealthModalProps extends ThemedComponentProps<"View"> {}

const activityLevels = Object.values(ActivityLevel);

const HealthModal: React.FC<HealthModalProps> = ({ eva }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ mode: "onBlur" });
  const router = useRouter();
  const { mutate: setUserHealthMutate, isPending } = useMutation({
    mutationFn: setUserHealth,
  });

  const [state, setState] = useState({
    isDatePickerVisible: false,
    date: new Date(),
  });
  const showDatePicker = () => {
    setState({ ...state, isDatePickerVisible: true });
  };

  const hideDatePicker = () => {
    setState({ ...state, isDatePickerVisible: false });
  };

  const handleDateChange = (
    _event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    const currentDate = selectedDate || state.date;
    if (Platform.OS === "android") {
      hideDatePicker();
      setState({ ...state, date: currentDate, isDatePickerVisible: false });
    } else {
      setState({ ...state, date: currentDate });
    }
  };

  const handlePress = () => {
    if (Platform.OS === "ios") {
      setState({ ...state, isDatePickerVisible: false });
    } else {
      Keyboard.dismiss();
    }
  };

  const onSubmit = (data: FormData) => {
    const requestData = {
      height: Number(data.height),
      weight: Number(data.weight),
      age: dayjs().diff(dayjs(data.age), "year"),
      gender: data.gender === 0 ? Gender.MALE : Gender.FEMALE,
      activityLevel: activityLevels[Number(data.activityLevel) - 1],
    };
    setUserHealthMutate(requestData, {
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: "提交成功",
          onShow() {
            setTimeout(() => {
              router.replace("/(tabs)/(home)");
            }, 1000);
          },
        });
      },
    });
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress} accessible={false}>
      <SafeAreaView edges={["bottom"]}>
        <View className="w-full p-[20px] pb-0 mx-auto h-full bg-white">
          <View className="w-full h-[95%] m-auto">
            <Text
              className="text-2xl text-center tracking-widest font-medium"
              style={{
                fontFamily: "AlibabaPuHuiTi",
              }}
            >
              请完善您的健康信息
            </Text>
            <Text className="text-sm text-gray-500 leading-6 my-5">
              请提供您的身高、体重、年龄、性别和日常活动，这些信息可确保您的健康数据尽可能准确。
            </Text>

            <View className="flex-1 gap-[20px]">
              <Controller
                control={control}
                name="gender"
                rules={{
                  required: "请选择您的性别",
                }}
                render={({ field: { onChange, value } }) => (
                  <View className="flex">
                    <Text>性别</Text>
                    <View className="flex">
                      <RadioGroup
                        className="flex-row"
                        selectedIndex={value}
                        onChange={onChange}
                      >
                        <Radio>男</Radio>
                        <Radio>女</Radio>
                      </RadioGroup>
                    </View>
                    {errors.gender && (
                      <Text className="text-red-500 text-sm mt-1">
                        {errors.gender.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              <Controller
                control={control}
                name="age"
                rules={{
                  required: "请输入您的出生日期",
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="flex">
                    <Text>生日</Text>
                    <View className="flex">
                      <Pressable
                        className="relative z-50"
                        onPress={(event) => {
                          event.stopPropagation(); // 阻止事件冒泡
                          showDatePicker();
                        }}
                      >
                        <InputForm
                          placeholder="请选择生日"
                          value={
                            value
                              ? dayjs(value).format("YYYY-MM-DD")
                              : dayjs("1990-01-01").format("YYYY-MM-DD")
                          }
                          onChangeText={onChange}
                          editable={false}
                          onBlur={onBlur}
                          onPress={showDatePicker}
                        />
                        {state.isDatePickerVisible && (
                          <DateTimePicker
                            mode="date"
                            style={
                              Platform.OS === "ios" ? styles.datePicker : {}
                            }
                            value={state.date}
                            display={
                              Platform.OS === "ios" ? "inline" : "default"
                            }
                            locale="zh"
                            onChange={(event, selectedDate) => {
                              handleDateChange(event, selectedDate);
                              onChange(selectedDate);
                            }}
                            maximumDate={dayjs().toDate()}
                            textColor={
                              Platform.OS === "ios"
                                ? eva?.theme?.["color-basic-400"]
                                : undefined
                            }
                            accentColor={
                              Platform.OS === "ios"
                                ? eva?.theme?.["color-primary-500"]
                                : undefined
                            }
                            negativeButton={{
                              label: "取消",
                              textColor: eva?.theme?.["color-primary-400"],
                            }}
                            positiveButton={{
                              label: "确定",
                              textColor: eva?.theme?.["color-primary-500"],
                            }}
                          />
                        )}
                      </Pressable>
                    </View>
                    {errors.age && (
                      <Text className="text-red-500 text-sm mt-1">
                        {errors.age.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              <Controller
                control={control}
                name="height"
                rules={{
                  required: "请输入您的身高",
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="flex">
                    <Text className=" text-gray-500">身高</Text>
                    <InputForm
                      value={value?.toString()}
                      onBlur={onBlur}
                      placeholder="请输入身高信息"
                      onChangeText={onChange}
                      keyboardType="numeric"
                    />
                    {errors.height && (
                      <Text className="text-red-500 text-sm mt-1">
                        {errors.height.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              <Controller
                control={control}
                name="weight"
                rules={{
                  required: "请输入您的体重",
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="flex">
                    <Text className=" text-gray-500">体重</Text>
                    <InputForm
                      value={value?.toString()}
                      onBlur={onBlur}
                      placeholder="请输入体重信息"
                      onChangeText={onChange}
                      keyboardType="numeric"
                    />
                    {errors.weight && (
                      <Text className="text-red-500 text-sm mt-1">
                        {errors.weight.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              <Controller
                control={control}
                name="activityLevel"
                rules={{
                  required: "请选择您的活动水平",
                }}
                render={({ field: { onChange, value } }) => (
                  <View className="flex">
                    <Text className="text-gray-500 mb-2">活动水平</Text>
                    <Select
                      size="small"
                      selectedIndex={value}
                      onSelect={(index) => {
                        onChange(index);
                      }}
                      value={
                        value
                          ? activityLevelMap[activityLevels[Number(value) - 1]]
                          : "请选择活动水平"
                      }
                      placeholder="请选择活动水平"
                    >
                      {activityLevels.map((level) => (
                        <SelectItem
                          key={level}
                          title={activityLevelMap[level]}
                        />
                      ))}
                    </Select>

                    {errors.activityLevel && (
                      <Text className="text-red-500 text-sm mt-1">
                        {errors.activityLevel.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              <Button
                className="mt-auto"
                size="small"
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting || isPending}
              >
                {isSubmitting || isPending ? "提交中..." : "提交"}
              </Button>
            </View>
          </View>
        </View>
        <Toast />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  datePicker: {
    position: "absolute",
    top: 30,
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    zIndex: 1000,
  },
});

export default withStyles(HealthModal);
