import { useState, useRef, useEffect } from "react";
import { TextInput, StyleSheet, Animated, TextInputProps } from "react-native";
import { withStyles } from "@ui-kitten/components";

import type { ThemedComponentProps } from "@ui-kitten/components";
import type { KeyboardTypeOptions } from "react-native";

interface InputRadiusProps
  extends ThemedComponentProps<"View">,
    Omit<TextInputProps, "onChange"> {
  value: string | undefined;
  className?: string;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  onChangeText: (value: number | string) => void;
}

const InputForm: React.FC<InputRadiusProps> = ({
  value,
  placeholder,
  keyboardType,
  eva,
  className = "",
  onChangeText,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const borderColorAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(borderColorAnimation, {
      toValue: isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

  const borderColor = borderColorAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [
      "rgb(209, 213, 219)",
      eva?.theme?.["color-primary-500"] || "#FB923C",
    ],
  });

  const handleTextChange = (text: string) => {
    console.log(1111, text);
    onChangeText?.(text);
  };

  return (
    <Animated.View
      style={[{ borderBottomColor: borderColor }]}
      className={`border-b-[1px]`}
    >
      <TextInput
        className={`w-full text-base py-[10px] px-[5px] ${className}`}
        value={value}
        onChangeText={handleTextChange}
        placeholder={placeholder}
        keyboardType={keyboardType}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        accessibilityLabel={placeholder}
      />
    </Animated.View>
  );
};

export default withStyles(InputForm);
