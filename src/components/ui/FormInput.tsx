import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  TextInputProps,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { MeltuneColors, Radius, Spacing, Typography } from '@/theme';

interface FormInputProps extends TextInputProps {
  label: string;
  error?: string;
  helperText?: string;
  isPassword?: boolean;
  icon?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  technicalCode?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  helperText,
  isPassword = false,
  icon,
  containerStyle,
  technicalCode,
  ...inputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Label Row */}
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
      </View>

      {/* Input Box */}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputFocused,
          Boolean(error) && styles.inputError,
        ]}
      >
        {icon && <View style={styles.iconContainer}>{icon}</View>}

        <TextInput
          {...inputProps}
          secureTextEntry={isPassword && !showPassword}
          onFocus={e => {
            setIsFocused(true);
            inputProps.onFocus?.(e);
          }}
          onBlur={e => {
            setIsFocused(false);
            inputProps.onBlur?.(e);
          }}
          placeholderTextColor={MeltuneColors.textMutedLight}
          style={[styles.input, inputProps.style]}
        />

        {isPassword && (
          <Pressable
            onPress={() => setShowPassword(p => !p)}
            style={styles.eyeButton}
            hitSlop={8}
            accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff size={18} color={MeltuneColors.textSecondaryLight} />
            ) : (
              <Eye size={18} color={MeltuneColors.textSecondaryLight} />
            )}
          </Pressable>
        )}
      </View>

      {/* Error or Helper Text */}
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  label: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.semibold,
    color: MeltuneColors.charcoal,
    letterSpacing: Typography.letterSpacing.normal,
  },
  technicalCode: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.micro,
    color: MeltuneColors.bronze,
    letterSpacing: Typography.letterSpacing.technicalLabel,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MeltuneColors.white,
    borderWidth: 1,
    borderColor: MeltuneColors.borderLight,
    borderRadius: Radius.md,
    minHeight: 48,
    paddingHorizontal: Spacing.md,
  },
  inputFocused: {
    borderColor: MeltuneColors.burntOrange,
    borderWidth: 1.5,
  },
  inputError: {
    borderColor: MeltuneColors.statusDanger,
  },
  iconContainer: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.body,
    color: MeltuneColors.charcoal,
    paddingVertical: Spacing.sm,
  },
  eyeButton: {
    padding: Spacing.xs,
  },
  errorText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.micro,
    color: MeltuneColors.statusDanger,
    marginTop: Spacing.xs,
  },
  helperText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.micro,
    color: MeltuneColors.textSecondaryLight,
    marginTop: Spacing.xs,
  },
});
